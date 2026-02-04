import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Server } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function ServiceNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${selected ? 'border-blue-500' : 'border-blue-300'
        }`}
    >
      {/* Target handles (for incoming connections) - rendered first */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-blue-100 rounded">
          <Server className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-xs font-semibold text-blue-700">SERVICE</div>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.config?.name || 'Unnamed Service'}
      </div>

      {data.config?.host && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          {data.config.protocol}://{data.config.host}:{data.config.port}
        </div>
      )}

      {/* Source handles (for outgoing connections) - rendered last so they're on top */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-blue-500"
        isConnectable={true}
      />
    </div>
  );
}

export default memo(ServiceNode);
