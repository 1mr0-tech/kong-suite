import { useCallback } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { X } from 'lucide-react';
import { ServiceForm } from './forms/ServiceForm';
import { RouteForm } from './forms/RouteForm';
import { PluginForm } from './forms/PluginForm';
import { ConsumerForm } from './forms/ConsumerForm';
import { UpstreamForm } from './forms/UpstreamForm';

export function PropertiesPanel() {
  const { selectedNode, updateNode, setSelectedNode, edges, nodes } = useFlowStore();

  const handleClose = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleSave = useCallback(
    (data: any) => {
      if (selectedNode) {
        updateNode(selectedNode.id, data);
      }
    },
    [selectedNode, updateNode]
  );

  if (!selectedNode) {
    return null;
  }

  const nodeType = selectedNode.data.type;
  const nodeConfig = selectedNode.data.config || {};

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold capitalize">{nodeType} Properties</h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close properties panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {nodeType === 'service' && (
          <ServiceForm data={nodeConfig} onSave={handleSave} />
        )}
        {nodeType === 'route' && (
          <RouteForm data={nodeConfig} onSave={handleSave} />
        )}
        {nodeType === 'plugin' && (
          <PluginForm
            data={nodeConfig}
            onSave={handleSave}
            nodeId={selectedNode.id}
            edges={edges}
            nodes={nodes}
          />
        )}
        {nodeType === 'consumer' && (
          <ConsumerForm data={nodeConfig} onSave={handleSave} />
        )}
        {nodeType === 'upstream' && (
          <UpstreamForm data={nodeConfig} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
