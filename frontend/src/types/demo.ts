import type { Node, Edge } from 'reactflow';

export type DemoDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type DemoCategory =
  | 'getting-started'
  | 'security'
  | 'traffic-management'
  | 'logging'
  | 'advanced';

export interface DemoFlow {
  id: string;
  name: string;
  description: string;
  difficulty: DemoDifficulty;
  category: DemoCategory;
  tags: string[];

  // Learning objectives
  learningObjectives: string[];

  // The actual flow
  flow: {
    nodes: Node[];
    edges: Edge[];
  };

  // Educational content
  explanation: {
    overview: string;
    steps: DemoStep[];
    keyTakeaways: string[];
  };

  // Testing
  testInstructions?: string;
  expectedOutput?: string;

  // Common mistakes to avoid
  commonMistakes?: CommonMistake[];

  // Related demos
  relatedDemos?: string[];
}

export interface DemoStep {
  title: string;
  description: string;
  nodeId?: string; // Highlight this node
  edgeId?: string; // Highlight this edge
  tip?: string;
}

export interface CommonMistake {
  mistake: string;
  fix: string;
  explanation?: string;
}

export interface DemoGalleryFilter {
  category?: DemoCategory;
  difficulty?: DemoDifficulty;
  searchQuery?: string;
}
