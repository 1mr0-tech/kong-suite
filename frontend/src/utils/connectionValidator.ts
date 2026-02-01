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

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateConnection(
  sourceNode: Node | undefined,
  targetNode: Node | undefined
): ValidationResult {
  if (!sourceNode || !targetNode) {
    return { valid: false, error: 'Invalid nodes' };
  }

  const sourceType = sourceNode.data.type as FlowNodeType;
  const targetType = targetNode.data.type as FlowNodeType;

  // Check if this connection type is allowed
  const allowedTargets = CONNECTION_RULES[sourceType] || [];

  if (!allowedTargets.includes(targetType)) {
    return {
      valid: false,
      error: `Cannot connect ${sourceType} to ${targetType}`,
    };
  }

  return { valid: true };
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
