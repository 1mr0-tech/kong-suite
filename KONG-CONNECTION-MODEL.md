# Kong Gateway - Comprehensive Connection Model

## Based on Official Documentation (developer.konghq.com)

### Entity Relationships Summary

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ HTTP Request
     ▼
┌──────────┐       ┌───────────┐
│   Route  ├──────►│  Service  │ (1:1 required)
└──────────┘       └─────┬─────┘
                         │ (optional 1:1)
                         ▼
                   ┌───────────┐
                   │  Upstream │
                   └─────┬─────┘
                         │ (1:many)
                         ▼
                   ┌───────────┐
                   │  Target   │ (backend servers)
                   └───────────┘

┌──────────┐
│  Plugin  │ Can attach to multiple scopes:
└────┬─────┘ - Global (no attachment)
     │       - Service
     │       - Route
     │       - Consumer
     │       - Combinations (Consumer+Route+Service, etc.)
     ▼
(Applies policies at various levels)

┌──────────┐
│ Consumer │ (No outgoing connections)
└──────────┘ (Identified via auth plugins)
```

## Detailed Connection Rules

### 1. Route → Service (Required, Singular)

**Cardinality**: 1 Route → EXACTLY 1 Service

**Kong Fields**:
- `route.service.id` OR `route.service` (references service name)

**Example**:
```yaml
routes:
  - name: my-route
    paths: [/api]
    service: my-service  # ← ONE service reference
```

**Flow Builder Rules**:
- ✅ Route MUST connect to exactly one Service
- ❌ Route cannot connect to multiple Services
- ❌ Route cannot exist without Service connection (in production)
- ✅ Multiple Routes can connect to the same Service

### 2. Service → Upstream (Optional, Singular)

**Cardinality**: 1 Service → 0 or 1 Upstream

**Kong Behavior**:
- Service can point to a direct host:port (no Upstream)
- OR Service can reference an Upstream for load balancing

**Kong Fields**:
```yaml
# Option 1: Direct host (no Upstream)
services:
  - name: direct-service
    host: example.com
    port: 80

# Option 2: Reference Upstream
services:
  - name: lb-service
    host: my-upstream  # References upstream by name
```

**Flow Builder Rules**:
- ✅ Service can optionally connect to ONE Upstream
- ❌ Service cannot connect to multiple Upstreams
- ✅ If connected to Upstream, don't need direct host config (Upstream provides targets)

### 3. Upstream → Target (One-to-Many)

**Cardinality**: 1 Upstream → 1+ Targets

**Kong Behavior**:
- Upstream is a load balancer
- Targets are backend server instances
- Target CANNOT exist without Upstream

**Kong Format**:
```yaml
upstreams:
  - name: my-upstream
    algorithm: round-robin
    targets:
      - target: 192.168.1.1:8000
        weight: 100
      - target: 192.168.1.2:8000
        weight: 100
```

**Flow Builder Rules**:
- Targets are NOT separate nodes in the flow
- Targets are configured as properties/list within Upstream node
- Reason: Targets cannot exist independently, they're always part of an Upstream

### 4. Plugin Attachment (Flexible Scoping)

**Cardinality**: Complex - see below

#### Plugin Scopes

A single plugin configuration can be attached to:
- **Global**: No entity reference (applies to all requests)
- **Service**: `plugin.service` field
- **Route**: `plugin.route` field
- **Consumer**: `plugin.consumer` field
- **Combinations**: `plugin.service` + `plugin.route` + `plugin.consumer`

#### Plugin Precedence (12 levels, highest to lowest)

1. Consumer + Route + Service
2. Consumer Group + Service + Route
3. Consumer + Route
4. Consumer + Service
5. Consumer Group + Route
6. Consumer Group + Service
7. Route + Service
8. Consumer
9. Consumer Group
10. Route
11. Service
12. Global

#### Plugin Instances

**Key Concept**: "A plugin can have multiple instances in the same configuration."

This means:
- You can have multiple rate-limiting plugins with different configs
- Each instance applies to different entity combinations
- Same plugin type, different scopes = separate instances

**Example**:
```yaml
plugins:
  # Global rate limit (all requests)
  - name: rate-limiting
    config:
      minute: 100

  # Service-specific (stricter)
  - name: rate-limiting
    service: api-service
    config:
      minute: 50

  # Route-specific (even stricter)
  - name: rate-limiting
    route: admin-route
    config:
      minute: 10

  # Consumer-specific (premium user, higher limit)
  - name: rate-limiting
    consumer: premium-user
    config:
      minute: 500

  # Consumer + Route (VIP on admin route)
  - name: rate-limiting
    consumer: vip-user
    route: admin-route
    config:
      minute: 1000
```

#### Flow Builder Plugin Connection Model

**Option A: Single Plugin Node = Single Plugin Instance**
- One plugin node can connect to multiple entities
- Plugin → Service-A creates edge to Service-A
- Plugin → Route-B creates edge to Route-B
- If both connections exist, generates plugin with `service: A, route: B`

**Option B: Multiple Connections = Multiple Plugin Instances**
- Plugin node connects to Service-A → generates `plugin {service: A}`
- SAME plugin node connects to Route-B → generates `plugin {route: B}`
- Two separate plugin instances in YAML

**Recommended: Option B (Multiple Instances)**

Reasoning:
- Matches Kong's mental model ("multiple instances")
- More flexible (different configs for different scopes)
- Clearer for senior developers
- Aligns with precedence hierarchy

**Implementation**:
```typescript
// In DeckGenerator.ts
private generatePlugin(node: Node, data: any, edges: Edge[], nodes: Node[]): any[] {
  const pluginEdges = edges.filter((e) => e.source === node.id);

  // Global plugin (no connections)
  if (pluginEdges.length === 0) {
    return [{
      name: pluginName,
      enabled: pluginEnabled,
      config: pluginConfig
    }];
  }

  // Create separate instance for each connection
  const instances: any[] = [];
  for (const edge of pluginEdges) {
    const target = nodes.find((n) => n.id === edge.target);
    const plugin: any = {
      name: pluginName,
      enabled: pluginEnabled,
      config: pluginConfig
    };

    if (target.data.type === 'service') {
      plugin.service = target.data.config?.name || edge.target;
    } else if (target.data.type === 'route') {
      plugin.route = target.data.config?.name || edge.target;
    } else if (target.data.type === 'consumer') {
      plugin.consumer = target.data.config?.username || edge.target;
    }

    instances.push(plugin);
  }

  return instances;
}
```

### 5. Consumer (No Outgoing Connections)

**Cardinality**: Consumer → Nothing

**Kong Behavior**:
- Consumers represent API clients
- Consumers are IDENTIFIED via authentication plugins
- Consumers don't "connect" to Services/Routes
- Flow: Request → Route → (Auth Plugin) → Identifies Consumer → Apply consumer-scoped plugins

**Kong Fields**:
```yaml
consumers:
  - username: my-user
    custom_id: user-123
```

**Flow Builder Rules**:
- ✅ Consumer is a standalone node (no outgoing edges)
- ✅ Plugins can connect TO consumers (Plugin → Consumer)
- ❌ Consumers don't connect to Routes or Services

## Connection Validation Matrix

| Source Node | Valid Targets | Cardinality | Notes |
|-------------|---------------|-------------|-------|
| Route | Service | 1:1 (required) | Must connect to exactly one service |
| Service | Upstream | 1:0..1 (optional) | At most one upstream |
| Upstream | - | - | Targets are properties, not connections |
| Plugin | Service, Route, Consumer | 1:0..n | Multiple connections = multiple instances |
| Consumer | - | - | No outgoing connections |

## Implementation Rules for Flow Builder

### Connection Validator

```typescript
export const CONNECTION_RULES: Record<FlowNodeType, FlowNodeType[]> = {
  route: ['service'],           // Can only connect to service
  service: ['upstream'],         // Can only connect to upstream
  plugin: ['service', 'route', 'consumer'], // Can connect to multiple
  upstream: [],                  // No connections (targets are properties)
  consumer: [],                  // No outgoing connections
};

// Entities that can have only ONE outgoing connection
export const SINGLE_CONNECTION_ENTITIES: Record<string, string> = {
  route: 'service',    // Route → Service (singular)
  service: 'upstream', // Service → Upstream (singular)
};
```

### Validation Logic

```typescript
export function validateConnection(
  sourceNode: Node,
  targetNode: Node,
  edges: Edge[],
  nodes: Node[]
): ValidationResult {
  // 1. Prevent self-connection
  if (sourceNode.id === targetNode.id) {
    return { valid: false, error: 'Cannot connect a node to itself' };
  }

  const sourceType = sourceNode.data.type;
  const targetType = targetNode.data.type;

  // 2. Check if connection type is allowed
  const allowedTargets = CONNECTION_RULES[sourceType] || [];
  if (!allowedTargets.includes(targetType)) {
    return {
      valid: false,
      error: `${sourceType} cannot connect to ${targetType}`
    };
  }

  // 3. Check duplicate connection
  if (edges.some(e => e.source === sourceNode.id && e.target === targetNode.id)) {
    return { valid: false, error: 'This connection already exists' };
  }

  // 4. Check single-connection constraint
  if (SINGLE_CONNECTION_ENTITIES[sourceType] === targetType) {
    const existingConnection = edges.find(e => {
      const existingTarget = nodes.find(n => n.id === e.target);
      return e.source === sourceNode.id && existingTarget?.data.type === targetType;
    });

    if (existingConnection) {
      return {
        valid: false,
        error: `${sourceType} can only connect to one ${targetType}. Delete existing connection first.`
      };
    }
  }

  return { valid: true };
}
```

## YAML Generation Rules

### Service
```yaml
services:
  - name: example-service
    protocol: http
    host: example.com  # OR reference upstream name
    port: 80
    path: /api
```

### Route
```yaml
routes:
  - name: example-route
    paths: [/api/v1]
    methods: [GET, POST]
    service: example-service  # ← Reference to connected service
```

### Upstream
```yaml
upstreams:
  - name: example-upstream
    algorithm: round-robin
    targets:
      - target: 192.168.1.1:8000
        weight: 100
      - target: 192.168.1.2:8000
        weight: 100
```

### Plugins (Multiple Instances)
```yaml
plugins:
  # Instance 1: Global
  - name: cors
    enabled: true
    config:
      origins: ['*']

  # Instance 2: Service-scoped
  - name: rate-limiting
    service: api-service
    config:
      minute: 50

  # Instance 3: Route-scoped (DIFFERENT instance, same plugin type)
  - name: rate-limiting
    route: admin-route
    config:
      minute: 10
```

### Consumer
```yaml
consumers:
  - username: john-doe
    custom_id: user-123
```

## Summary for Senior Developers

1. **Route → Service**: 1:1 required. One route, one service.

2. **Service → Upstream**: 1:0..1 optional. Service either has direct host OR references upstream.

3. **Upstream → Targets**: Targets are configuration within Upstream, not separate graph nodes.

4. **Plugins**: Create separate plugin instances for each scope. Same plugin type can have multiple instances with different entity attachments.

5. **Consumers**: Standalone entities. No outgoing connections. Identified via auth plugins, referenced by consumer-scoped plugins.

6. **Plugin Precedence**: More specific = higher precedence. Consumer+Route+Service > Consumer+Route > Route > Service > Global.

7. **decK YAML**: Each entity is a separate object in the YAML. Relationships use name references (service name, route name, etc.).