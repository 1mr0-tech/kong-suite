import { Server, Route, Puzzle, User, Network } from 'lucide-react';
import type { FlowNodeType } from '@kong-suite/shared';

const NODE_TYPES: Array<{
  type: FlowNodeType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}> = [
  {
    type: 'service',
    label: 'Service',
    icon: Server,
    color: 'blue',
    description: 'Backend service',
  },
  {
    type: 'route',
    label: 'Route',
    icon: Route,
    color: 'orange',
    description: 'Request routing',
  },
  {
    type: 'plugin',
    label: 'Plugin',
    icon: Puzzle,
    color: 'purple',
    description: 'Add functionality',
  },
  {
    type: 'consumer',
    label: 'Consumer',
    icon: User,
    color: 'green',
    description: 'API consumer',
  },
  {
    type: 'upstream',
    label: 'Upstream',
    icon: Network,
    color: 'teal',
    description: 'Load balancer',
  },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: FlowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Components</h2>
        <p className="text-sm text-gray-500">Drag nodes onto the canvas</p>
      </div>

      <div className="space-y-2">
        {NODE_TYPES.map(({ type, label, icon: Icon, color, description }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className={`
              p-3 rounded-lg border-2 cursor-move
              bg-white hover:bg-gray-50
              border-${color}-200 hover:border-${color}-400
              transition-all
            `}
          >
            <div className="flex items-start gap-2">
              <div className={`p-1.5 bg-${color}-100 rounded mt-0.5`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium text-${color}-700`}>{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">Connection Rules</div>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Route → Service</li>
          <li>• Plugin → Service/Route/Consumer</li>
          <li>• Service → Upstream</li>
        </ul>
      </div>
    </div>
  );
}
