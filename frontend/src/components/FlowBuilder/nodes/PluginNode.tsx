import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Plug } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function PluginNode({ data, selected }: NodeProps) {
  const enabled = data.config?.enabled !== false;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${selected ? 'border-purple-500' : 'border-purple-300'
        } ${!enabled ? 'opacity-60' : ''}`}
    >
      {/* Source handles (for outgoing connections) */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />

      {/* Target handles (for incoming connections) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-purple-500"
        isConnectable={true}
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-purple-100 rounded">
          <Plug className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-xs font-semibold text-purple-700">PLUGIN</div>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.config?.name || 'Unnamed Plugin'}
      </div>

      <div className="flex items-center gap-1 mt-1">
        <div
          className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-xs text-gray-500">{enabled ? 'Enabled' : 'Disabled'}</span>
      </div>
    </div>
  );
}

export default memo(PluginNode);
