import { FileDown, Trash2, Save, FolderOpen, Code2 } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { useState } from 'react';
import axios from 'axios';

interface ToolbarProps {
  onShowCode: () => void;
}

export function Toolbar({ onShowCode }: ToolbarProps) {
  const { nodes, edges, clearFlow } = useFlowStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleClear = () => {
    if (nodes.length === 0) return;

    if (window.confirm('Are you sure you want to clear the entire flow? This cannot be undone.')) {
      clearFlow();
    }
  };

  const handleExportYAML = async () => {
    if (nodes.length === 0) {
      alert('No nodes to export. Add some nodes to your flow first.');
      return;
    }

    setIsExporting(true);

    try {
      const response = await axios.post('http://localhost:3001/api/flows/generate', {
        nodes,
        edges,
      });

      if (response.data.success) {
        const yamlContent = response.data.data.output.content;

        // Create a download
        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kong-config.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        alert('Validation errors:\n' + error.response.data.errors.join('\n'));
      } else {
        alert('Failed to generate YAML. Please check your flow configuration.');
      }
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save to backend
    alert('Save functionality coming soon!');
  };

  const handleLoad = () => {
    // TODO: Implement load from backend
    alert('Load functionality coming soon!');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      <button
        onClick={handleClear}
        disabled={nodes.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Clear flow"
      >
        <Trash2 size={16} />
        Clear
      </button>

      <div className="w-px h-6 bg-gray-300" />

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Save flow"
      >
        <Save size={16} />
        Save
      </button>

      <button
        onClick={handleLoad}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Load flow"
      >
        <FolderOpen size={16} />
        Load
      </button>

      <div className="w-px h-6 bg-gray-300" />

      <button
        onClick={onShowCode}
        disabled={nodes.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="View generated YAML code"
      >
        <Code2 size={16} />
        View YAML
      </button>

      <button
        onClick={handleExportYAML}
        disabled={nodes.length === 0 || isExporting}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Download YAML file"
      >
        <FileDown size={16} />
        {isExporting ? 'Downloading...' : 'Download YAML'}
      </button>

      <div className="flex-1" />

      <div className="text-sm text-gray-500">
        {nodes.length} nodes • {edges.length} connections
      </div>
    </div>
  );
}
