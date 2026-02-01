# Kong API Gateway - Architecture & Relationships

## Core Entities and Their Connections

### 1. **Service** (Backend API)
- Represents a backend API or microservice
- **Connections**:
  - Can connect to ONE Upstream (for load balancing) - *optional*
  - Can have MULTIPLE Routes pointing to it - *required*
  - Can have MULTIPLE Plugins attached - *optional*

### 2. **Route** (Entry Point)
- Defines how requests reach the Service
- **Connections**:
  - Must connect to EXACTLY ONE Service - *required*
  - Can have MULTIPLE Plugins attached - *optional*
- **Configuration**: paths, methods, hosts, protocols

### 3. **Plugin** (Functionality Extension)
- Adds features like authentication, rate limiting, logging, etc.
- **Connections** - Can be attached at multiple scopes:
  - **Global**: No connection (applies to all requests)
  - **Service**: Applies to ALL routes of that service
  - **Route**: Applies to that specific route only
  - **Consumer**: Applies to that consumer
  - **Combined**: Service + Consumer, Route + Consumer, etc.

- **Important**: A SINGLE plugin instance can have MULTIPLE connections
  - Example: One rate-limiting plugin can be on Service A AND Route B
  - Example: One key-auth plugin can be on Consumer X AND Service Y

### 4. **Consumer** (API Client)
- Represents an API user/client
- **Connections**:
  - No outgoing connections
  - Can have MULTIPLE Plugins attached to it - *optional*
  - Can have credentials (key-auth, JWT, etc.)

### 5. **Upstream** (Load Balancer)
- Represents a virtual hostname for load balancing
- **Connections**:
  - Can have MULTIPLE Targets (backend servers) - *required*
  - Can be referenced by MULTIPLE Services - *incoming*

### 6. **Target** (Backend Server)
- Individual backend server in an Upstream
- **Connections**: No outgoing connections

## Connection Rules Summary

```
Route → Service (1:1 required)
Plugin → Service (many:many optional)
Plugin → Route (many:many optional)
Plugin → Consumer (many:many optional)
Plugin → Service + Consumer (combined scope)
Plugin → Route + Consumer (combined scope)
Service → Upstream (many:1 optional)
Upstream → Target (1:many required)
```

## Plugin Scope Precedence

When a plugin is attached at multiple levels, Kong applies them in this order:
1. **Consumer-specific** (highest priority)
2. **Route-specific**
3. **Service-specific**
4. **Global** (lowest priority)

## Common Patterns

### Pattern 1: Simple API
```
Route → Service
```

### Pattern 2: Rate-Limited API
```
Route → Service
Rate-Limiting Plugin → Route
```

### Pattern 3: Authenticated API
```
Route → Service
Key-Auth Plugin → Service (applies to all routes)
Consumer (API user)
```

### Pattern 4: Load-Balanced API
```
Route → Service → Upstream → Target 1
                           → Target 2
                           → Target 3
```

### Pattern 5: Per-Consumer Rate Limiting
```
Route → Service
Rate-Limiting Plugin → Service
Rate-Limiting Plugin → Consumer (different rate for specific consumer)
```

## What Our Flow Builder Should Support

### Multiple Connections from Same Node
- ✅ Plugin can connect to multiple Services
- ✅ Plugin can connect to multiple Routes
- ✅ Plugin can connect to multiple Consumers
- ✅ Plugin can connect to Service AND Route simultaneously
- ✅ Service can have multiple Routes connecting to it (incoming)
- ✅ Upstream can have multiple Targets

### Single Connections
- ❌ Route can only connect to ONE Service
- ❌ Service can only connect to ONE Upstream (optional)

### Validation Rules
1. Route MUST connect to a Service
2. Plugin can connect to anything (service, route, consumer) or nothing (global)
3. Service MAY connect to an Upstream
4. Upstream SHOULD have at least one Target
5. No circular dependencies
6. No duplicate connections (same source → same target)

## Examples from Real Kong Configs

### Example 1: Multi-Route Service with Different Plugins
```yaml
services:
  - name: user-api

routes:
  - name: public-users
    service: user-api
    paths: [/users]

  - name: admin-users
    service: user-api
    paths: [/admin/users]

plugins:
  # Global CORS
  - name: cors

  # Rate limit on public route only
  - name: rate-limiting
    route: public-users

  # Auth on admin route only
  - name: key-auth
    route: admin-users
```

### Example 2: Consumer-Specific Plugin
```yaml
consumers:
  - username: premium-user
  - username: free-user

plugins:
  # Default rate limit for all
  - name: rate-limiting
    service: api-service
    config:
      minute: 10

  # Higher limit for premium user
  - name: rate-limiting
    service: api-service
    consumer: premium-user
    config:
      minute: 1000
```

## Implications for Our Flow Builder

1. **Allow multiple outgoing edges from Plugin nodes**
2. **Show connection scope in YAML generation** (global vs service vs route)
3. **Validate that Routes have exactly one Service connection**
4. **Allow plugins with no connections (global scope)**
5. **Prevent duplicate edges** (same source → same target)
6. **Allow edge deletion** so users can modify connections
7. **Show visual indicators** for connection types/scopes
