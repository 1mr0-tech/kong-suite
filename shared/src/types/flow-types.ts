/**
 * Flow Builder Types
 * Types for the visual flow builder
 */

import type { Node, Edge } from 'reactflow';

// Flow node types
export type FlowNodeType =
  | 'service'
  | 'route'
  | 'plugin'
  | 'consumer'
  | 'upstream'
  | 'target'
  | 'certificate'
  | 'sni';

// Flow node data
export interface FlowNodeData {
  label: string;
  type: FlowNodeType;
  config: Record<string, any>;
  valid?: boolean;
  errors?: string[];
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

// Flow structure
export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  created_at: string;
  updated_at: string;
}

// Flow validation result
export interface FlowValidationResult {
  valid: boolean;
  errors: FlowValidationError[];
  warnings: FlowValidationWarning[];
}

export interface FlowValidationError {
  nodeId?: string;
  edgeId?: string;
  message: string;
  field?: string;
}

export interface FlowValidationWarning {
  nodeId?: string;
  message: string;
}

// Generated output formats
export type OutputFormat = 'admin-api' | 'deck-yaml' | 'deck-json';

export interface GeneratedOutput {
  format: OutputFormat;
  content: string;
  commands?: string[];
}

// Flow explanation
export interface FlowExplanation {
  summary: string;
  steps: FlowExplanationStep[];
}

export interface FlowExplanationStep {
  nodeId: string;
  title: string;
  description: string;
}

// Connection rules
export interface ConnectionRule {
  source: FlowNodeType;
  target: FlowNodeType;
  allowed: boolean;
  label?: string;
}

export const CONNECTION_RULES: ConnectionRule[] = [
  { source: 'route', target: 'service', allowed: true, label: 'forwards to' },
  { source: 'plugin', target: 'service', allowed: true, label: 'applies to' },
  { source: 'plugin', target: 'route', allowed: true, label: 'applies to' },
  { source: 'plugin', target: 'consumer', allowed: true, label: 'applies to' },
  { source: 'service', target: 'upstream', allowed: true, label: 'load balances to' },
  { source: 'upstream', target: 'target', allowed: true, label: 'includes' },
  { source: 'route', target: 'sni', allowed: true, label: 'uses' },
  { source: 'sni', target: 'certificate', allowed: true, label: 'uses' },
];
