import { Link } from 'react-router-dom';
import { GitBranch, Eye, RefreshCcw, Database } from 'lucide-react';

export function Home() {
  const features = [
    {
      title: 'Flow Builder',
      description: 'Design Kong configurations visually with drag-and-drop',
      icon: GitBranch,
      path: '/flow-builder',
      color: 'blue',
    },
    {
      title: 'Configuration Visualizer',
      description: 'Explore and visualize existing Kong configurations',
      icon: Eye,
      path: '/visualizer',
      color: 'green',
    },
    {
      title: 'Migration Tool',
      description: 'Migrate configurations between Kong instances',
      icon: RefreshCcw,
      path: '/migration',
      color: 'purple',
    },
    {
      title: 'Data Manager',
      description: 'Backup and restore Kong database data',
      icon: Database,
      path: '/data-manager',
      color: 'orange',
    },
  ];

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Kong Suite
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive toolkit for managing Kong API Gateway
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg bg-${feature.color}-100`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Getting Started
          </h2>
          <p className="text-blue-700">
            Select a tool above to begin managing your Kong API Gateway.
            Each tool provides a different way to interact with and manage your Kong configuration.
          </p>
        </div>
      </div>
    </div>
  );
}
