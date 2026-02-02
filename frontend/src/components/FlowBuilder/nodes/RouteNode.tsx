import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Route } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function RouteNode({ data, selected }: NodeProps) {
  const paths = data.config?.paths || [];

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${
        selected ? 'border-orange-500' : 'border-orange-300'
      }`}
    >
      {/* Target handle - for incoming connections from Plugins */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-orange-100 rounded">
          <Route className="w-4 h-4 text-orange-600" />
        </div>
        <div className="text-xs font-semibold text-orange-700">ROUTE</div>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.config?.name || 'Unnamed Route'}
      </div>

      {paths.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          {paths.join(', ')}
        </div>
      )}

      {/* Source handles - for outgoing connections to Services */}
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3" />
      <Handle type="source" position={Position.Left} id="left" className="w-3 h-3" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3" />
    </div>
  );
}

export default memo(RouteNode);
