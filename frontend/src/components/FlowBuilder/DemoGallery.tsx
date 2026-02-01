import { useState, useMemo } from 'react';
import { X, Search, BookOpen, Zap, Shield, BarChart3, Lightbulb, CheckCircle2 } from 'lucide-react';
import { DemoService } from '@/services/demoService';
import type { DemoFlow, DemoCategory, DemoDifficulty } from '@/types/demo';
import { useFlowStore } from '@/stores/flowStore';

interface DemoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoGallery({ isOpen, onClose }: DemoGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DemoCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DemoDifficulty | 'all'>('all');
  const [selectedDemo, setSelectedDemo] = useState<DemoFlow | null>(null);

  const { loadFlow, clearFlow } = useFlowStore();

  // Filter demos based on current criteria
  const filteredDemos = useMemo(() => {
    return DemoService.filterDemos({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
      searchQuery,
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handleLoadDemo = (demo: DemoFlow) => {
    clearFlow();
    loadFlow({
      id: demo.id,
      name: demo.name,
      description: demo.description,
      nodes: demo.flow.nodes,
      edges: demo.flow.edges,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    onClose();
  };

  const getCategoryIcon = (category: DemoCategory) => {
    const icons: Record<DemoCategory, any> = {
      'getting-started': BookOpen,
      'security': Shield,
      'traffic-management': BarChart3,
      'logging': Lightbulb,
      'advanced': Zap,
    };
    return icons[category];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Demo Flow Gallery</h2>
              <p className="text-purple-100 mt-1">
                Learn Kong Gateway patterns through real-world examples
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search demos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="all">All Categories</option>
              {DemoService.getAllCategories().map((category) => (
                <option key={category} value={category} className="text-gray-900">
                  {DemoService.getCategoryLabel(category)}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="all">All Levels</option>
              {DemoService.getAllDifficulties().map((difficulty) => (
                <option key={difficulty} value={difficulty} className="text-gray-900">
                  {DemoService.getDifficultyInfo(difficulty).label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Demo List */}
          <div className={`${selectedDemo ? 'w-1/3' : 'w-full'} overflow-y-auto p-6 border-r border-gray-200 transition-all`}>
            {filteredDemos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">No demos found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDemos.map((demo) => {
                  const CategoryIcon = getCategoryIcon(demo.category);
                  const difficultyInfo = DemoService.getDifficultyInfo(demo.difficulty);

                  return (
                    <div
                      key={demo.id}
                      onClick={() => setSelectedDemo(demo)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDemo?.id === demo.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                          <CategoryIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{demo.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{demo.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyInfo.bgColor} ${difficultyInfo.color} font-medium`}>
                              {difficultyInfo.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {DemoService.getCategoryLabel(demo.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Demo Details */}
          {selectedDemo && (
            <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-2xl">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDemo.name}</h2>
                      <p className="text-gray-600">{selectedDemo.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDemo(null)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const difficultyInfo = DemoService.getDifficultyInfo(selectedDemo.difficulty);
                      return (
                        <span className={`text-sm px-3 py-1 rounded-full ${difficultyInfo.bgColor} ${difficultyInfo.color} font-medium`}>
                          {difficultyInfo.label}
                        </span>
                      );
                    })()}
                    <span className="text-sm text-gray-600">
                      {DemoService.getCategoryLabel(selectedDemo.category)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLoadDemo(selectedDemo)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Load This Demo
                  </button>
                </div>

                {/* Learning Objectives */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    What You'll Learn
                  </h3>
                  <ul className="space-y-2">
                    {selectedDemo.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedDemo.explanation.overview}</p>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
                  <div className="space-y-4">
                    {selectedDemo.explanation.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                          <p className="text-gray-700 text-sm mb-2">{step.description}</p>
                          {step.tip && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                              <p className="text-sm text-blue-900">
                                <strong className="font-semibold">💡 Tip:</strong> {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Takeaways */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {selectedDemo.explanation.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Test Instructions */}
                {selectedDemo.testInstructions && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Testing Instructions</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                      {selectedDemo.testInstructions}
                    </pre>
                  </div>
                )}

                {/* Common Mistakes */}
                {selectedDemo.commonMistakes && selectedDemo.commonMistakes.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mistakes to Avoid</h3>
                    <div className="space-y-4">
                      {selectedDemo.commonMistakes.map((mistake, index) => (
                        <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                          <h4 className="font-semibold text-red-900 mb-1">❌ {mistake.mistake}</h4>
                          <p className="text-sm text-red-800 mb-2">
                            <strong>Fix:</strong> {mistake.fix}
                          </p>
                          {mistake.explanation && (
                            <p className="text-sm text-red-700">{mistake.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
