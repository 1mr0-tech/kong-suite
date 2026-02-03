import { useState } from 'react';
import { Book, X, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { KONG_ENTITIES, type EntityReference } from '@/data/kong-knowledge';
import { PLUGIN_CATALOG, PLUGIN_CATEGORIES, type PluginInfo } from '@/types/plugin-catalog';
import type { PluginCategory } from '@/types/kong-entities';

interface KnowledgePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'entities' | 'plugins';

export function KnowledgePanel({ isOpen, onClose }: KnowledgePanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>('entities');
    const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<PluginCategory | null>('authentication');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Book className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Kong Knowledge Base</h2>
                            <p className="text-sm text-gray-500">Learn about Kong Gateway entities and plugins</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b px-6">
                    <button
                        onClick={() => setActiveTab('entities')}
                        className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'entities'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Entities ({KONG_ENTITIES.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('plugins')}
                        className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'plugins'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Plugins ({PLUGIN_CATALOG.length})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'entities' ? (
                        <div className="space-y-3">
                            {KONG_ENTITIES.map((entity) => (
                                <EntityCard
                                    key={entity.id}
                                    entity={entity}
                                    isExpanded={expandedEntity === entity.id}
                                    onToggle={() => setExpandedEntity(expandedEntity === entity.id ? null : entity.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(Object.keys(PLUGIN_CATEGORIES) as PluginCategory[]).map((category) => (
                                <CategorySection
                                    key={category}
                                    category={category}
                                    plugins={PLUGIN_CATALOG.filter(p => p.category === category)}
                                    isExpanded={expandedCategory === category}
                                    onToggle={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EntityCard({ entity, isExpanded, onToggle }: { entity: EntityReference; isExpanded: boolean; onToggle: () => void }) {
    const entityColors: Record<string, string> = {
        service: 'bg-blue-100 text-blue-700 border-blue-200',
        route: 'bg-orange-100 text-orange-700 border-orange-200',
        consumer: 'bg-green-100 text-green-700 border-green-200',
        'consumer-group': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        upstream: 'bg-teal-100 text-teal-700 border-teal-200',
        target: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        plugin: 'bg-purple-100 text-purple-700 border-purple-200',
        certificate: 'bg-amber-100 text-amber-700 border-amber-200',
        sni: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    return (
        <div className={`border rounded-lg overflow-hidden ${isExpanded ? 'shadow-md' : ''}`}>
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${entityColors[entity.id] || 'bg-gray-100 text-gray-700'}`}>
                        {entity.name.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">{entity.description}</span>
                </div>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                    <div className="mt-4 grid grid-cols-2 gap-6">
                        {/* Purpose */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Purpose</h4>
                            <p className="text-sm text-gray-700">{entity.purpose}</p>
                        </div>

                        {/* API Endpoint */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">API Endpoint</h4>
                            <code className="text-sm bg-gray-200 px-2 py-1 rounded">{entity.apiEndpoint}</code>
                            <a
                                href={entity.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                            >
                                Docs <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        {/* Key Fields */}
                        <div className="col-span-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Fields</h4>
                            <div className="flex flex-wrap gap-2">
                                {entity.keyFields.map((field) => (
                                    <span
                                        key={field.name}
                                        className={`text-xs px-2 py-1 rounded ${field.required
                                                ? 'bg-red-50 text-red-700 border border-red-200'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                        title={field.description}
                                    >
                                        {field.name}{field.required && '*'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Relationships */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Relationships</h4>
                            <ul className="space-y-1">
                                {entity.relationships.map((rel, i) => (
                                    <li key={i} className="text-xs text-gray-600">
                                        <span className="font-medium text-gray-700">{rel.entity}</span>
                                        <span className="text-gray-400 mx-1">→</span>
                                        {rel.description}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Use Cases */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Use Cases</h4>
                            <ul className="space-y-1">
                                {entity.useCases.map((useCase, i) => (
                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                        <span className="text-gray-400">•</span>
                                        {useCase}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CategorySection({ category, plugins, isExpanded, onToggle }: { category: PluginCategory; plugins: PluginInfo[]; isExpanded: boolean; onToggle: () => void }) {
    const categoryInfo = PLUGIN_CATEGORIES[category];

    return (
        <div className="border rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryInfo.icon}</span>
                    <div className="text-left">
                        <span className="font-medium text-gray-900">{categoryInfo.name}</span>
                        <span className="ml-2 text-xs text-gray-500">({plugins.length} plugins)</span>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                    <p className="text-sm text-gray-500 mt-3 mb-4">{categoryInfo.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {plugins.map((plugin) => (
                            <a
                                key={plugin.name}
                                href={plugin.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:border-indigo-300 hover:shadow-sm transition-all"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-900">{plugin.displayName}</span>
                                        {plugin.tier === 'enterprise' && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                                                Enterprise
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{plugin.description}</p>
                                </div>
                                <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default KnowledgePanel;
