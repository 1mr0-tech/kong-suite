import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { User } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function ConsumerNode({ data, selected }: NodeProps) {
  const username = data.config?.username || data.config?.custom_id || 'Unnamed Consumer';

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${
        selected ? 'border-green-500' : 'border-green-300'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-green-100 rounded">
          <User className="w-4 h-4 text-green-600" />
        </div>
        <div className="text-xs font-semibold text-green-700">CONSUMER</div>
      </div>

      <div className="text-sm font-medium text-gray-900">{username}</div>

      {data.config?.custom_id && data.config?.username && (
        <div className="text-xs text-gray-500 mt-1">ID: {data.config.custom_id}</div>
      )}
    </div>
  );
}

export default memo(ConsumerNode);
