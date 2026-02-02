import { FileDown, Trash2, Save, FolderOpen, Code2, BookOpen } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { useState } from 'react';
import { yamlGenerator } from '@/services/yamlGenerator';
import { flowStorage } from '@/services/flowStorage';

interface ToolbarProps {
  onShowCode: () => void;
  onShowDemos: () => void;
}

export function Toolbar({ onShowCode, onShowDemos }: ToolbarProps) {
  const { nodes, edges, clearFlow, loadFlow } = useFlowStore();
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
      // Validate flow before generation
      const validationErrors = yamlGenerator.validateFlow(nodes, edges);
      if (validationErrors.length > 0) {
        alert('Validation errors:\n\n' + validationErrors.join('\n'));
        return;
      }

      // Generate YAML client-side (no backend needed!)
      const yamlContent = yamlGenerator.generateYAML(nodes, edges);

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
    } catch (error: any) {
      alert('Failed to generate YAML: ' + (error.message || 'Unknown error'));
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Export error:', error);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    if (nodes.length === 0) {
      alert('No nodes to save. Add some nodes to your flow first.');
      return;
    }

    const flowName = prompt('Enter a name for this flow:', 'My Kong Flow');
    if (!flowName) return; // User cancelled

    const flowDescription = prompt('Enter a description (optional):', '') || '';

    try {
      const savedFlow = flowStorage.saveFlow({
        name: flowName,
        description: flowDescription,
        nodes,
        edges,
      });

      alert(`Flow "${savedFlow.name}" saved successfully!`);
    } catch (error: any) {
      alert('Failed to save flow: ' + (error.message || 'Unknown error'));
      if (import.meta.env.DEV) {
        console.error('Save error:', error);
      }
    }
  };

  const handleLoad = () => {
    try {
      const flows = flowStorage.getAllFlows();

      if (flows.length === 0) {
        alert('No saved flows found. Save a flow first.');
        return;
      }

      // Create a simple selection dialog
      const flowList = flows
        .map((f, idx) => `${idx + 1}. ${f.name} (${f.nodes.length} nodes, updated: ${new Date(f.updated_at).toLocaleDateString()})`)
        .join('\n');

      const selection = prompt(
        `Select a flow to load:\n\n${flowList}\n\nEnter the number (1-${flows.length}):`,
        '1'
      );

      if (!selection) return; // User cancelled

      const flowIndex = parseInt(selection) - 1;
      if (isNaN(flowIndex) || flowIndex < 0 || flowIndex >= flows.length) {
        alert('Invalid selection');
        return;
      }

      const selectedFlow = flows[flowIndex];

      // Confirm before loading (will clear current flow)
      if (nodes.length > 0) {
        const confirm = window.confirm(
          `Loading "${selectedFlow.name}" will replace your current flow. Continue?`
        );
        if (!confirm) return;
      }

      // Load the flow using flowStore
      loadFlow(selectedFlow);
      alert(`Flow "${selectedFlow.name}" loaded successfully!`);

    } catch (error: any) {
      alert('Failed to load flow: ' + (error.message || 'Unknown error'));
      if (import.meta.env.DEV) {
        console.error('Load error:', error);
      }
    }
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
        onClick={onShowDemos}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors"
        title="Browse demo flows"
      >
        <BookOpen size={16} />
        Demo Flows
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
