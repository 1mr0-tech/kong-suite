import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { User } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function ConsumerNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${selected ? 'border-green-500' : 'border-green-300'
        }`}
    >
      {/* Target handles (for incoming connections) - rendered first */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-green-100 rounded">
          <User className="w-4 h-4 text-green-600" />
        </div>
        <div className="text-xs font-semibold text-green-700">CONSUMER</div>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.config?.username || 'Unnamed Consumer'}
      </div>

      {data.config?.custom_id && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          ID: {data.config.custom_id}
        </div>
      )}

      {/* Source handles (for outgoing connections) - rendered last so they're on top */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-green-500"
        isConnectable={true}
      />
    </div>
  );
}

export default memo(ConsumerNode);
