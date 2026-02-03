import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { FlowCanvas } from '@/components/FlowBuilder/FlowCanvas';
import { Sidebar } from '@/components/FlowBuilder/Sidebar';
import { PropertiesPanel } from '@/components/FlowBuilder/PropertiesPanel';
import { Toolbar } from '@/components/FlowBuilder/Toolbar';
import { CodePreview } from '@/components/FlowBuilder/CodePreview';
import { DemoGallery } from '@/components/FlowBuilder/DemoGallery';
import { KnowledgePanel } from '@/components/FlowBuilder/KnowledgePanel';

export function FlowBuilder() {
  const [showCode, setShowCode] = useState(false);
  const [showDemos, setShowDemos] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <ReactFlowProvider>
        <Toolbar
          onShowCode={() => setShowCode(true)}
          onShowDemos={() => setShowDemos(true)}
          onShowKnowledge={() => setShowKnowledge(true)}
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1">
            <FlowCanvas />
          </div>
          <PropertiesPanel />
        </div>
        <CodePreview isOpen={showCode} onClose={() => setShowCode(false)} />
        <DemoGallery isOpen={showDemos} onClose={() => setShowDemos(false)} />
        <KnowledgePanel isOpen={showKnowledge} onClose={() => setShowKnowledge(false)} />
      </ReactFlowProvider>
    </div>
  );
}
