import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function UpstreamNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${selected ? 'border-teal-500' : 'border-teal-300'
        }`}
    >
      {/* Source handles (for outgoing connections) */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />

      {/* Target handles (for incoming connections) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-teal-500"
        isConnectable={true}
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-teal-100 rounded">
          <Database className="w-4 h-4 text-teal-600" />
        </div>
        <div className="text-xs font-semibold text-teal-700">UPSTREAM</div>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.config?.name || 'Unnamed Upstream'}
      </div>

      {data.config?.algorithm && (
        <div className="text-xs text-gray-500 mt-1">
          Algorithm: {data.config.algorithm}
        </div>
      )}
    </div>
  );
}

export default memo(UpstreamNode);
