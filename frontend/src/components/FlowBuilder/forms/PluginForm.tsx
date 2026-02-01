import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { AVAILABLE_PLUGINS, PLUGIN_CONFIGS } from '@/utils/nodeDefaults';

const pluginSchema = z.object({
  name: z.string().min(1, 'Plugin name is required'),
  enabled: z.boolean(),
  config: z.record(z.any()).optional(),
});

type PluginFormData = z.infer<typeof pluginSchema>;

interface PluginFormProps {
  data: any;
  onSave: (data: PluginFormData) => void;
}

export function PluginForm({ data, onSave }: PluginFormProps) {
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

  const handleBlur = () => {
    if (isDirty) {
      handleSubmit(onSave)();
    }
  };

  const handlePluginChange = (pluginName: string) => {
    setSelectedPlugin(pluginName);
    setValue('name', pluginName);
    const defaultConfig = PLUGIN_CONFIGS[pluginName] || {};
    setConfigJson(JSON.stringify(defaultConfig, null, 2));
    setValue('config', defaultConfig);
    handleBlur();
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

  const handleConfigBlur = () => {
    try {
      JSON.parse(configJson);
      handleBlur();
    } catch (e) {
      // Don't save invalid JSON
    }
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
    <form className="space-y-4" onKeyDown={handleKeyDown}>
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
            onChange={(e) => {
              register('enabled').onChange(e);
              handleBlur();
            }}
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
          onBlur={handleConfigBlur}
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

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Plugin Info</h4>
        <p className="text-xs text-blue-700">
          Selected: <strong>{selectedPlugin}</strong>
        </p>
        <p className="text-xs text-blue-700 mt-1">
          This plugin can be connected to Services, Routes, or Consumers depending on its scope.
        </p>
      </div>

      <div className="text-sm text-gray-500 italic">
        Changes are saved when you click outside the field
      </div>
    </form>
  );
}
