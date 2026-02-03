import { create } from 'zustand';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { FlowNodeType, Flow } from '@/types/flow-types';
import { NODE_DEFAULTS, PLUGIN_CONFIGS } from '../utils/nodeDefaults';
import { validateConnection } from '../utils/connectionValidator';

interface FlowState {
  // Flow data
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;

  // Flow metadata
  flowId: string | null;
  flowName: string;
  flowDescription: string;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (type: FlowNodeType, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, data: Record<string, any>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node | null) => void;

  clearFlow: () => void;
  loadFlow: (flow: Flow) => void;
  setFlowMetadata: (name: string, description: string) => void;
}

let nodeIdCounter = 1;

function generateNodeId(type: FlowNodeType): string {
  return `${type}-${nodeIdCounter++}`;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNode: null,
  flowId: null,
  flowName: 'Untitled Flow',
  flowDescription: '',

  // Handle node changes (drag, select, etc.)
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // Handle edge changes (delete, etc.)
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // Handle new connections
  onConnect: (connection: Connection) => {
    const { nodes, edges } = get();

    if (!connection.source || !connection.target) return;

    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    // Validate connection - pass edges and nodes for proper validation
    const validation = validateConnection(sourceNode, targetNode, edges, nodes);
    if (!validation.valid) {
      // Note: In production, implement proper error notification system
      // For now, silently reject invalid connections (user sees visual feedback)
      if (process.env.NODE_ENV === 'development') {
        alert(validation.error); // Show error to user in development
      }
      return;
    }

    // Add edge with proper handle references
    const newEdge: Edge = {
      id: `${connection.source}-${connection.sourceHandle || 'default'}-${connection.target}-${connection.targetHandle || 'default'}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'smoothstep',
      animated: false,
      label: '', // Will be set by edge component if needed
    };

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating edge:', newEdge);
    }

    set({
      edges: [...edges, newEdge],
    });
  },

  // Add new node
  addNode: (type: FlowNodeType, position: { x: number; y: number }) => {
    const id = generateNodeId(type);
    const defaults = NODE_DEFAULTS[type] || {};

    // Get plugin config defaults if it's a plugin
    if (type === 'plugin' && defaults.name) {
      const pluginConfig = PLUGIN_CONFIGS[defaults.name];
      if (pluginConfig) {
        defaults.config = { ...pluginConfig };
      }
    }

    const newNode: Node = {
      id,
      type,
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`,
        type,
        config: { ...defaults },
      },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  // Update node data
  updateNode: (nodeId: string, data: Record<string, any>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...data } } }
          : node
      ),
    });
  },

  // Delete node
  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
    });
  },

  // Set selected node
  setSelectedNode: (node: Node | null) => {
    set({ selectedNode: node });
  },

  // Clear flow
  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      flowId: null,
      flowName: 'Untitled Flow',
      flowDescription: '',
    });
    nodeIdCounter = 1;
  },

  // Load flow from saved data
  loadFlow: (flow: Flow) => {
    set({
      nodes: flow.nodes,
      edges: flow.edges,
      selectedNode: null,
      flowId: flow.id,
      flowName: flow.name,
      flowDescription: flow.description || '',
    });
  },

  // Set flow metadata
  setFlowMetadata: (name: string, description: string) => {
    set({
      flowName: name,
      flowDescription: description,
    });
  },
}));
