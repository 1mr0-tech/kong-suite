import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Puzzle } from 'lucide-react';
import type { NodeProps } from 'reactflow';

function PluginNode({ data, selected }: NodeProps) {
  const pluginName = data.config?.name || 'unknown';
  const enabled = data.config?.enabled !== false;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px] ${
        selected ? 'border-purple-500' : 'border-purple-300'
      } ${!enabled ? 'opacity-60' : ''}`}
    >
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-purple-500"
        style={{ left: '45%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-purple-500"
        style={{ left: '55%' }}
        isConnectable={true}
      />

      {/* Left handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-purple-500"
        style={{ top: '45%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-purple-500"
        style={{ top: '55%' }}
        isConnectable={true}
      />

      {/* Right handles */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-purple-500"
        style={{ top: '45%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-purple-500"
        style={{ top: '55%' }}
        isConnectable={true}
      />

      {/* Bottom handles */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-purple-500"
        style={{ left: '45%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-purple-500"
        style={{ left: '55%' }}
        isConnectable={true}
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-purple-100 rounded">
          <Puzzle className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-xs font-semibold text-purple-700">PLUGIN</div>
      </div>

      <div className="text-sm font-medium text-gray-900 capitalize">
        {pluginName.replace(/-/g, ' ')}
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className={`text-xs ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
          {enabled ? '● Enabled' : '○ Disabled'}
        </span>
      </div>
    </div>
  );
}

export default memo(PluginNode);
