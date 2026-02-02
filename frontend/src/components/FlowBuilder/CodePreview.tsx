import { useState, useEffect } from 'react';
import { X, Copy, Download, Check, RefreshCw } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { yamlGenerator } from '@/services/yamlGenerator';

interface CodePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodePreview({ isOpen, onClose }: CodePreviewProps) {
  const { nodes, edges } = useFlowStore();
  const [yaml, setYaml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateYAML();
    }
  }, [isOpen]); // Only regenerate when modal opens, not on every node/edge change

  const generateYAML = async () => {
    if (nodes.length === 0) {
      setYaml('# No nodes in flow\n# Add some nodes to generate configuration');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setYaml('');

    try {
      // Validate flow before generation
      const validationErrors = yamlGenerator.validateFlow(nodes, edges);
      if (validationErrors.length > 0) {
        setError('Validation errors:\n' + validationErrors.join('\n'));
        setYaml('# Fix the validation errors above to generate configuration');
        return;
      }

      // Generate YAML client-side (no backend needed!)
      const generatedYaml = yamlGenerator.generateYAML(nodes, edges);
      setYaml(generatedYaml);
      setError(null);
    } catch (err: any) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Generation error:', err);
      }

      setError('Error generating YAML: ' + (err.message || 'Unknown error'));
      setYaml('# Error occurred during generation\n# Check the error message above');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Failed to copy:', err);
      }
      // Optionally show user-friendly error message
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kong-config.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Generated decK Configuration</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Generating YAML...</div>
            </div>
          )}

          {error && (
            <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium mb-1">Generation Failed</p>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="p-4 border-b border-gray-200 flex gap-2">
                <button
                  onClick={generateYAML}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                  title="Refresh to get latest changes"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleCopy}
                  disabled={!yaml || loading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!yaml || loading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre">{yaml}</pre>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3 overflow-y-auto max-h-96">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">How to Use This Configuration</h3>
            <p className="text-sm text-gray-600 mb-3">
              This decK YAML file contains your Kong configuration. Follow these steps to deploy it:
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-900 mb-1">Step 1: Install decK</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>macOS:</strong>{' '}
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">brew install kong/deck/deck</code>
                </p>
                <p>
                  <strong>Linux:</strong>{' '}
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                    curl -sL https://github.com/kong/deck/releases/latest/download/deck_linux_amd64.tar.gz | tar xz
                  </code>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Or download from: <a href="https://github.com/Kong/deck/releases" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/Kong/deck/releases</a>
                </p>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-900 mb-1">Step 2: Save the YAML File</p>
              <p className="text-xs text-gray-600">
                Click the <strong>Download</strong> button above to save as <code className="px-1 py-0.5 bg-gray-100 rounded">kong-config.yaml</code>
              </p>
            </div>

            <div className="bg-white rounded p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-900 mb-1">Step 3: Preview Changes (Optional but Recommended)</p>
              <p className="text-xs text-gray-600 mb-1">
                See what will change before applying:
              </p>
              <code className="block px-2 py-1.5 bg-gray-100 rounded text-xs">
                deck gateway diff kong-config.yaml --kong-addr {import.meta.env.VITE_KONG_ADMIN_URL || 'http://localhost:8001'}
              </code>
            </div>

            <div className="bg-white rounded p-3 border border-green-100 border-2">
              <p className="text-xs font-semibold text-green-900 mb-1">Step 4: Deploy to Kong</p>
              <p className="text-xs text-gray-600 mb-1">
                Apply your configuration to Kong:
              </p>
              <code className="block px-2 py-1.5 bg-green-50 rounded text-xs">
                deck gateway sync kong-config.yaml --kong-addr {import.meta.env.VITE_KONG_ADMIN_URL || 'http://localhost:8001'}
              </code>
              <p className="text-xs text-gray-500 mt-2">
                Replace the <code className="px-1 py-0.5 bg-gray-100 rounded">--kong-addr</code> value with your Kong Admin API URL
              </p>
            </div>

            <div className="bg-blue-50 rounded p-2 border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>💡 Tip:</strong> Use <code className="px-1 py-0.5 bg-white rounded">deck gateway validate kong-config.yaml</code> to check for errors before deploying
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
