import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { AVAILABLE_PLUGINS, PLUGIN_CONFIGS } from '@/utils/nodeDefaults';
import { Globe, Server, Route as RouteIcon, User, Info } from 'lucide-react';

const pluginSchema = z.object({
  name: z.string().min(1, 'Plugin name is required'),
  enabled: z.boolean(),
  config: z.record(z.any()).optional(),
});

type PluginFormData = z.infer<typeof pluginSchema>;

interface PluginFormProps {
  data: any;
  onSave: (data: PluginFormData) => void;
  nodeId?: string;
  edges?: any[];
  nodes?: any[];
}

export function PluginForm({ data, onSave, nodeId, edges = [], nodes = [] }: PluginFormProps) {
  const [selectedPlugin, setSelectedPlugin] = useState(data.name || 'rate-limiting');
  const [configJson, setConfigJson] = useState(
    JSON.stringify(data.config || PLUGIN_CONFIGS[selectedPlugin] || {}, null, 2)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<PluginFormData>({
    resolver: zodResolver(pluginSchema),
    defaultValues: data,
  });

  const handlePluginChange = (pluginName: string) => {
    setSelectedPlugin(pluginName);
    setValue('name', pluginName);
    const defaultConfig = PLUGIN_CONFIGS[pluginName] || {};
    setConfigJson(JSON.stringify(defaultConfig, null, 2));
    setValue('config', defaultConfig);
  };

  const handleConfigChange = (value: string) => {
    setConfigJson(value);
    try {
      const parsed = JSON.parse(value);
      setValue('config', parsed);
    } catch (e) {
      // Invalid JSON, don't update
    }
  };

  const onSubmit = (formData: PluginFormData) => {
    onSave(formData);
  };

  // Group plugins by category
  const pluginsByCategory = AVAILABLE_PLUGINS.reduce((acc, plugin) => {
    const category = plugin.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(plugin);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PLUGINS>);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" onKeyDown={handleKeyDown}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plugin Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register('name')}
          onChange={(e) => handlePluginChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {Object.entries(pluginsByCategory).map(([category, plugins]) => (
            <optgroup key={category} label={category}>
              {plugins.map((plugin) => (
                <option key={plugin.value} value={plugin.value}>
                  {plugin.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('enabled')}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Enabled</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plugin Configuration
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Edit the JSON configuration for this plugin
        </p>
        <textarea
          value={configJson}
          onChange={(e) => handleConfigChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          rows={15}
          placeholder="{}"
        />
        {(() => {
          try {
            JSON.parse(configJson);
            return null;
          } catch (e) {
            return (
              <p className="text-red-500 text-sm mt-1">Invalid JSON format</p>
            );
          }
        })()}
      </div>

      {/* Plugin Scope Information */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">Plugin Scope</h4>
            <p className="text-xs text-purple-700 mb-3">
              This plugin can be applied at different levels in your Kong Gateway
            </p>
          </div>
        </div>

        {/* Available Scopes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Global</span>
            <span className="text-gray-500">- Applies to all requests</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Server className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-700">Service</span>
            <span className="text-gray-500">- Applies to all routes of a service</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <RouteIcon className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-700">Route</span>
            <span className="text-gray-500">- Applies to a specific route</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-700">Consumer</span>
            <span className="text-gray-500">- Applies to a specific consumer</span>
          </div>
        </div>

        {/* Current Connections */}
        {nodeId && (
          <div className="pt-3 border-t border-purple-200">
            <p className="text-xs font-medium text-purple-900 mb-2">Current Connections:</p>
            {(() => {
              const pluginEdges = edges.filter((e: any) => e.source === nodeId);

              if (pluginEdges.length === 0) {
                return (
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-100 rounded px-2 py-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="font-medium">Global scope</span>
                    <span className="text-purple-600">- No connections (applies to all requests)</span>
                  </div>
                );
              }

              return (
                <div className="space-y-1.5">
                  {pluginEdges.map((edge: any) => {
                    const targetNode = nodes.find((n: any) => n.id === edge.target);
                    if (!targetNode) return null;

                    const type = targetNode.data.type;
                    const name = targetNode.data.config?.name || targetNode.data.config?.username || targetNode.id;

                    const iconMap: Record<string, any> = {
                      service: <Server className="w-3.5 h-3.5 text-blue-500" />,
                      route: <RouteIcon className="w-3.5 h-3.5 text-orange-500" />,
                      consumer: <User className="w-3.5 h-3.5 text-green-500" />,
                    };

                    return (
                      <div key={edge.id} className="flex items-center gap-2 text-xs bg-white rounded px-2 py-1.5 border border-purple-100">
                        {iconMap[type]}
                        <span className="font-medium text-gray-700 capitalize">{type}:</span>
                        <span className="text-gray-600">{name}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Precedence Info */}
        <div className="pt-3 border-t border-purple-200">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-purple-900 hover:text-purple-700">
              Understanding Plugin Precedence
            </summary>
            <div className="mt-2 space-y-1 text-purple-700 pl-2">
              <p className="text-xs">When multiple plugin instances exist, Kong applies them in order of specificity:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-xs mt-1.5">
                <li><strong>Consumer + Route + Service</strong> (highest priority)</li>
                <li><strong>Consumer + Route</strong></li>
                <li><strong>Consumer + Service</strong></li>
                <li><strong>Route</strong></li>
                <li><strong>Service</strong></li>
                <li><strong>Global</strong> (lowest priority)</li>
              </ol>
              <p className="text-xs mt-2 text-purple-600">
                💡 More specific scopes override less specific ones.
              </p>
            </div>
          </details>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={!isDirty}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isDirty ? 'Save Changes' : 'No Changes'}
        </button>
      </div>
    </form>
  );
}
