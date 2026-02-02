import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Server } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function ServiceNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${
        selected ? 'border-blue-500' : 'border-blue-300'
      }`}
    >
      {/* Target handles - for incoming connections from Routes and Plugins */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3" />
      <Handle type="target" position={Position.Right} id="right" className="w-3 h-3" />

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

      {/* Source handle - for outgoing connections to Upstreams */}
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3" />
    </div>
  );
}

export default memo(ServiceNode);
