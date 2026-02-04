import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Route } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function RouteNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${selected ? 'border-orange-500' : 'border-orange-300'
        }`}
    >
      {/* Target handles (for incoming connections) - rendered first so source handles are on top */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-orange-100 rounded">
          <Route className="w-4 h-4 text-orange-600" />
        </div>
        <div className="text-xs font-semibold text-orange-700">ROUTE</div>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.config?.name || 'Unnamed Route'}
      </div>

      {data.config?.paths && data.config.paths.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          {data.config.paths.join(', ')}
        </div>
      )}

      {/* Source handles (for outgoing connections) - rendered last so they're on top */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-orange-500"
        isConnectable={true}
      />
    </div>
  );
}

export default memo(RouteNode);
