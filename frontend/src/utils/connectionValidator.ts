import type { FlowNodeType } from '@/types/flow-types';
import type { Edge, Node } from 'reactflow';

// Kong entity relationship descriptions (for UI hints, not for blocking connections)
// In the visual builder, we allow ALL connections for flexibility
// The actual Kong rules are:
// - Route → Service (required relationship)
// - Service → Upstream (optional, for load balancing)  
// - Plugin → Service/Route/Consumer (scoping a plugin)
// - Upstream → Target (backend instances)

export const KONG_RELATIONSHIPS: Record<FlowNodeType, { targets: FlowNodeType[]; description: string }> = {
  route: {
    targets: ['service'],
    description: 'Routes match incoming requests and forward them to a Service'
  },
  service: {
    targets: ['upstream'],
    description: 'Services represent upstream APIs. Can optionally point to an Upstream for load balancing'
  },
  plugin: {
    targets: ['service', 'route', 'consumer'],
    description: 'Plugins can be scoped to Services, Routes, or Consumers'
  },
  upstream: {
    targets: ['target'],
    description: 'Upstreams contain Targets for load balancing'
  },
  consumer: {
    targets: [],
    description: 'Consumers represent API users/applications'
  },
  target: {
    targets: [],
    description: 'Targets are backend service instances within an Upstream'
  },
  certificate: {
    targets: [],
    description: 'Certificates for TLS/SSL'
  },
  sni: {
    targets: ['certificate'],
    description: 'SNI entities connect to Certificates'
  },
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

export function validateConnection(
  sourceNode: Node | undefined,
  targetNode: Node | undefined,
  edges: Edge[] = [],
  _nodes: Node[] = []
): ValidationResult {
  if (!sourceNode || !targetNode) {
    return { valid: false, error: 'Invalid nodes' };
  }

  // Prevent self-connection
  if (sourceNode.id === targetNode.id) {
    return { valid: false, error: 'Cannot connect a node to itself' };
  }

  // Check for duplicate connection
  if (connectionExists(edges, sourceNode.id, targetNode.id)) {
    return {
      valid: false,
      error: 'This connection already exists',
    };
  }

  // All other connections are ALLOWED in the visual builder
  // We provide warnings for non-standard Kong patterns but don't block
  const sourceType = sourceNode.data.type as FlowNodeType;
  const targetType = targetNode.data.type as FlowNodeType;

  const relationship = KONG_RELATIONSHIPS[sourceType];
  if (relationship && !relationship.targets.includes(targetType) && relationship.targets.length > 0) {
    // Non-standard connection - allow but could show a warning
    console.log(`Note: ${sourceType} → ${targetType} is not a standard Kong relationship`);
  }

  return { valid: true };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getConnectionLabel(sourceType: FlowNodeType, targetType: FlowNodeType): string {
  const labels: Record<string, string> = {
    'route-service': 'forwards to',
    'plugin-service': 'applies to',
    'plugin-route': 'applies to',
    'plugin-consumer': 'applies to',
    'service-upstream': 'load balances via',
    'upstream-target': 'includes',
    'sni-certificate': 'uses',
  };

  return labels[`${sourceType}-${targetType}`] || 'connects to';
}

// Helper to get recommended target types for a source type (for UI hints)
export function getRecommendedTargets(sourceType: FlowNodeType): FlowNodeType[] {
  return KONG_RELATIONSHIPS[sourceType]?.targets || [];
}

// Helper to check if a connection already exists
export function connectionExists(
  edges: Edge[],
  source: string,
  target: string
): boolean {
  return edges.some((edge) => edge.source === source && edge.target === target);
}

// Get relationship description for UI
export function getRelationshipDescription(sourceType: FlowNodeType): string {
  return KONG_RELATIONSHIPS[sourceType]?.description || '';
}
