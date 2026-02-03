import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ConnectionMode,
  type EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { FlowNodeType } from '@/types/flow-types';

import { useFlowStore } from '@/stores/flowStore';
import { nodeTypes } from './nodes';
import { DeletableEdge } from './DeletableEdge';

const edgeTypes: EdgeTypes = {
  smoothstep: DeletableEdge,
};

export function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    addNode,
  } = useFlowStore();

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as FlowNodeType;

      if (!type || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [project, addNode]
  );

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { strokeWidth: 2, stroke: '#b1b1b7' },
        }}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-50"
      >
      <Background />
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          const colors: Record<string, string> = {
            service: '#3b82f6',
            route: '#f97316',
            plugin: '#a855f7',
            consumer: '#22c55e',
            upstream: '#14b8a6',
          };
          return colors[node.type || ''] || '#gray';
        }}
        className="bg-white"
      />
      <Panel position="top-left" className="bg-white px-4 py-2 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-700">
          {nodes.length} nodes, {edges.length} connections
        </div>
      </Panel>
      </ReactFlow>
    </div>
  );
}
