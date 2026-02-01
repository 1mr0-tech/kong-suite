import type { FlowNodeType } from '@kong-suite/shared';
import type { Edge, Node } from 'reactflow';

// Connection rules based on Kong entity relationships
export const CONNECTION_RULES: Record<FlowNodeType, FlowNodeType[]> = {
  route: ['service'], // Route can connect to Service
  plugin: ['service', 'route', 'consumer'], // Plugin can connect to Service, Route, or Consumer
  service: ['upstream'], // Service can connect to Upstream
  upstream: ['target'], // Upstream can connect to Target
  consumer: [], // Consumer has no outgoing connections
  target: [], // Target has no outgoing connections
  certificate: [], // Certificate has no outgoing connections (SNI connects to it)
  sni: ['certificate'], // SNI connects to Certificate
};

// Entities that can have only ONE outgoing connection to specific target types
export const SINGLE_CONNECTION_ENTITIES: Record<string, string> = {
  route: 'service',    // Route can only connect to ONE service
  service: 'upstream', // Service can only connect to ONE upstream
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateConnection(
  sourceNode: Node | undefined,
  targetNode: Node | undefined,
  edges: Edge[] = [],
  nodes: Node[] = []
): ValidationResult {
  console.log('=== Connection Validation ===');
  console.log('Source node:', sourceNode);
  console.log('Target node:', targetNode);

  if (!sourceNode || !targetNode) {
    console.log('❌ Invalid nodes');
    return { valid: false, error: 'Invalid nodes' };
  }

  // Prevent self-connection
  if (sourceNode.id === targetNode.id) {
    console.log('❌ Self-connection');
    return { valid: false, error: 'Cannot connect a node to itself' };
  }

  const sourceType = sourceNode.data.type as FlowNodeType;
  const targetType = targetNode.data.type as FlowNodeType;

  console.log('Source type:', sourceType);
  console.log('Target type:', targetType);

  // Check if this connection type is allowed
  const allowedTargets = CONNECTION_RULES[sourceType] || [];
  console.log('Allowed targets for', sourceType, ':', allowedTargets);

  if (!allowedTargets.includes(targetType)) {
    console.log(`❌ ${sourceType} cannot connect to ${targetType}`);
    console.log('Allowed targets:', allowedTargets);
    return {
      valid: false,
      error: `${capitalizeFirst(sourceType)} cannot connect to ${capitalizeFirst(targetType)}`,
    };
  }

  console.log('✅ Connection type is allowed');

  // Check for duplicate connection
  if (connectionExists(edges, sourceNode.id, targetNode.id)) {
    console.log('❌ Duplicate connection');
    return {
      valid: false,
      error: 'This connection already exists',
    };
  }

  console.log('✅ Not a duplicate');

  // Check single-connection constraint (e.g., Route → Service, Service → Upstream)
  const singleConnectionTarget = SINGLE_CONNECTION_ENTITIES[sourceType];
  if (singleConnectionTarget === targetType) {
    console.log('Checking single-connection constraint for', sourceType, '→', targetType);

    // Find if there's already a connection from source to the same target type
    const existingConnection = edges.find((edge) => {
      if (edge.source !== sourceNode.id) return false;

      // Find the actual target node to check its type
      const existingTargetNode = nodes.find((n) => n.id === edge.target);
      return existingTargetNode?.data.type === targetType;
    });

    if (existingConnection) {
      console.log('❌ Single connection constraint violated');
      return {
        valid: false,
        error: `${capitalizeFirst(sourceType)} can only connect to one ${capitalizeFirst(targetType)}. Delete the existing connection first.`,
      };
    }
  }

  console.log('✅ Connection is valid!');
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
    'service-upstream': 'load balances to',
    'upstream-target': 'includes',
    'sni-certificate': 'uses',
  };

  return labels[`${sourceType}-${targetType}`] || 'connects to';
}

// Helper to get allowed target types for a source type
export function getAllowedTargets(sourceType: FlowNodeType): FlowNodeType[] {
  return CONNECTION_RULES[sourceType] || [];
}

// Helper to check if a connection already exists
export function connectionExists(
  edges: Edge[],
  source: string,
  target: string
): boolean {
  return edges.some((edge) => edge.source === source && edge.target === target);
}
