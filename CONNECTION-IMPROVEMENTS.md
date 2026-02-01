# Connection System Improvements

## What Was Fixed

### 1. **Understanding Kong's Architecture**
Created comprehensive documentation in `KONG-ARCHITECTURE.md` explaining:
- How each Kong entity works
- What can connect to what
- Plugin scope behavior (global, service, route, consumer)
- Real-world examples from Kong configs

### 2. **Fixed Connection Logic**

#### Before (Issues):
- No duplicate connection prevention
- No validation for single-connection rules (Route → Service, Service → Upstream)
- Unclear error messages
- Couldn't delete connections

#### After (Fixed):
✅ **Plugins can connect to multiple targets**
- A plugin can connect to multiple services, routes, and consumers simultaneously
- Example: One rate-limiting plugin can apply to Service A AND Route B

✅ **Proper single-connection enforcement**
- Route can only connect to ONE service
- Service can only connect to ONE upstream
- Clear error messages when trying to add a second connection

✅ **Duplicate connection prevention**
- Can't create the same connection twice
- Shows "This connection already exists" error

✅ **Self-connection prevention**
- Can't connect a node to itself

✅ **Connection deletion**
- Red X button appears on each connection
- Click to delete with confirmation
- Also works with Delete key when edge is selected

### 3. **Improved Error Messages**

Old: `"Cannot connect plugin to service"`
New: `"Plugin cannot connect to Route"` (clearer capitalization and formatting)

New validations:
- "Route can only connect to one Service. Delete the existing connection first."
- "This connection already exists"
- "Cannot connect a node to itself"

## How Connections Work Now

### Plugin Connections (Many-to-Many)
```
Plugin-1 → Service-A (applies to all routes of Service-A)
        → Route-B (applies to specific route)
        → Consumer-X (applies to specific consumer)
```

This is **correct Kong behavior** - plugins can have multiple scopes.

### Route Connections (One-to-One)
```
Route-1 → Service-A ✅
Route-1 → Service-B ❌ (can't connect to second service)
```

Must delete first connection before creating a new one.

### Service Connections (One-to-One to Upstream)
```
Service-1 → Upstream-A ✅
Service-1 → Upstream-B ❌ (can't connect to second upstream)
```

### Visual Connection Deletion
- Hover over any connection
- Red X button appears in the middle
- Click to delete
- Confirmation dialog appears

## Kong Patterns We Now Support

### Pattern 1: Global + Route-Specific Plugins
```
Plugin (CORS) → (no connection = global)
Plugin (Rate-Limit) → Route-A (only on Route-A)
Route-A → Service-1
```

### Pattern 2: Service-Wide + Consumer-Specific
```
Plugin (Auth) → Service-1 (required for all routes)
Plugin (Rate-Limit) → Service-1 (default limit)
Plugin (Rate-Limit) → Consumer-Premium (higher limit for premium user)
Service-1 ← Route-A
Service-1 ← Route-B
```

### Pattern 3: Load Balanced Service
```
Route → Service → Upstream → Target-1
                           → Target-2
                           → Target-3
```

## Testing the Improvements

### Test 1: Multiple Plugin Connections
1. Add Plugin node
2. Add Service node
3. Add Route node
4. Connect Plugin → Service ✅
5. Connect Plugin → Route ✅ (should work now!)
6. Both connections visible

### Test 2: Single Route Connection
1. Add Route node
2. Add Service-1 node
3. Add Service-2 node
4. Connect Route → Service-1 ✅
5. Try connecting Route → Service-2 ❌ (shows error)
6. Delete Route → Service-1 connection (click red X)
7. Now can connect Route → Service-2 ✅

### Test 3: Duplicate Prevention
1. Add Plugin → Service connection ✅
2. Try adding same Plugin → Service again ❌
3. Error: "This connection already exists"

### Test 4: Delete Connections
1. Create any connection
2. Hover over the connection line
3. Red X button appears
4. Click it
5. Confirm deletion
6. Connection removed ✅

## What This Means for YAML Generation

The YAML generator needs to understand connection scopes:

### Plugin with No Connections (Global)
```yaml
plugins:
  - name: cors
    # No service, route, or consumer = global scope
```

### Plugin with Service Connection
```yaml
plugins:
  - name: rate-limiting
    service: my-service
```

### Plugin with Multiple Connections
When a plugin connects to multiple entities, we need to generate **separate plugin instances** in YAML:

```yaml
plugins:
  - name: rate-limiting
    service: api-service
    config:
      minute: 10

  - name: rate-limiting  # Same plugin, different scope
    route: admin-route
    config:
      minute: 100
```

## Next Steps to Discuss

1. **YAML Generation for Multiple Plugin Connections**
   - Should we create separate plugin instances?
   - Or let user configure which scope in the properties panel?

2. **Visual Indicators**
   - Should we show different colors for different connection types?
   - Route→Service in blue, Plugin→Service in purple, etc.?

3. **Connection Labels**
   - Show "applies to", "forwards to", "load balances to" on edges?

4. **Global Plugins**
   - How should we represent plugins with no connections (global scope)?
   - Special visual indicator?

5. **Validation Warnings**
   - Warn if Route has no Service connection?
   - Warn if Upstream has no Targets?
   - Show these in the UI before YAML generation?

## Summary

✅ Plugins can now connect to multiple targets (correct Kong behavior)
✅ Routes limited to one Service (correct Kong behavior)
✅ Services limited to one Upstream (correct Kong behavior)
✅ Duplicate connections prevented
✅ Connections can be deleted with red X button
✅ Better error messages
✅ Comprehensive Kong architecture documentation

## Latest Fixes (Based on Official Kong Documentation)

### Bug Fixes in Connection Validator (2026-02-01)

**Issue**: Connection validation had a logic bug that prevented valid connections
- The validator was checking `targetType === 'service'` which was always true in that code branch
- This caused incorrect validation of existing connections

**Fix**: Updated validation logic to properly check existing edge target types
```typescript
// OLD (buggy):
const existingServiceConnection = edges.find(
  (edge) => edge.source === sourceNode.id && targetType === 'service'
);

// NEW (correct):
const existingConnection = edges.find((edge) => {
  if (edge.source !== sourceNode.id) return false;
  const existingTargetNode = nodes.find((n) => n.id === edge.target);
  return existingTargetNode?.data.type === targetType;
});
```

**Result**: Connections now work properly while maintaining single-connection constraints

### Comprehensive Documentation

Created `KONG-CONNECTION-MODEL.md` based on official Kong Gateway documentation:
- ✅ Exact cardinality rules for all entity relationships
- ✅ Plugin scoping and precedence (12 levels)
- ✅ Multiple plugin instances pattern
- ✅ YAML generation examples
- ✅ Implementation rules for senior developers

### Connection Model Verification

All connection rules verified against official docs at developer.konghq.com:
- Route → Service (1:1 required)
- Service → Upstream (1:0..1 optional)
- Upstream → Targets (1:many, targets as properties)
- Plugin → Service/Route/Consumer (1:0..many, separate instances)
- Consumer (no outgoing connections)

The flow builder now accurately represents Kong's actual connection model!
