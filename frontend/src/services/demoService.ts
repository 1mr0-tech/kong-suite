import type { DemoFlow, DemoCategory, DemoDifficulty, DemoGalleryFilter } from '@/types/demo';

// Import all demo flows
import simpleApiGateway from '@/data/demos/01-simple-api-gateway.json';
import apiWithRateLimiting from '@/data/demos/02-api-with-rate-limiting.json';
import securedApiKeyAuth from '@/data/demos/03-secured-api-key-auth.json';
import multiTierRateLimiting from '@/data/demos/04-multi-tier-rate-limiting.json';
import loadBalancedService from '@/data/demos/05-load-balanced-service.json';
import microservicesArchitecture from '@/data/demos/06-microservices-architecture.json';
import advancedTrafficManagement from '@/data/demos/07-advanced-traffic-management.json';
import comprehensiveAuthentication from '@/data/demos/08-comprehensive-authentication.json';

// All available demos
const ALL_DEMOS: DemoFlow[] = [
  simpleApiGateway,
  apiWithRateLimiting,
  securedApiKeyAuth,
  multiTierRateLimiting,
  loadBalancedService,
  microservicesArchitecture,
  advancedTrafficManagement,
  comprehensiveAuthentication,
] as DemoFlow[];

export class DemoService {
  /**
   * Get all available demos
   */
  static getAllDemos(): DemoFlow[] {
    return ALL_DEMOS;
  }

  /**
   * Get a specific demo by ID
   */
  static getDemoById(id: string): DemoFlow | undefined {
    return ALL_DEMOS.find((demo) => demo.id === id);
  }

  /**
   * Get demos by category
   */
  static getDemosByCategory(category: DemoCategory): DemoFlow[] {
    return ALL_DEMOS.filter((demo) => demo.category === category);
  }

  /**
   * Get demos by difficulty
   */
  static getDemosByDifficulty(difficulty: DemoDifficulty): DemoFlow[] {
    return ALL_DEMOS.filter((demo) => demo.difficulty === difficulty);
  }

  /**
   * Filter demos based on multiple criteria
   */
  static filterDemos(filter: DemoGalleryFilter): DemoFlow[] {
    let filtered = ALL_DEMOS;

    if (filter.category) {
      filtered = filtered.filter((demo) => demo.category === filter.category);
    }

    if (filter.difficulty) {
      filtered = filtered.filter((demo) => demo.difficulty === filter.difficulty);
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (demo) =>
          demo.name.toLowerCase().includes(query) ||
          demo.description.toLowerCase().includes(query) ||
          demo.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  /**
   * Get related demos for a given demo
   */
  static getRelatedDemos(demoId: string): DemoFlow[] {
    const demo = this.getDemoById(demoId);
    if (!demo || !demo.relatedDemos) {
      return [];
    }

    return demo.relatedDemos
      .map((id) => this.getDemoById(id))
      .filter((d) => d !== undefined) as DemoFlow[];
  }

  /**
   * Get all unique categories
   */
  static getAllCategories(): DemoCategory[] {
    const categories = new Set<DemoCategory>();
    ALL_DEMOS.forEach((demo) => categories.add(demo.category));
    return Array.from(categories);
  }

  /**
   * Get all unique difficulties
   */
  static getAllDifficulties(): DemoDifficulty[] {
    return ['beginner', 'intermediate', 'advanced'];
  }

  /**
   * Get category display name
   */
  static getCategoryLabel(category: DemoCategory): string {
    const labels: Record<DemoCategory, string> = {
      'getting-started': 'Getting Started',
      'security': 'Security',
      'traffic-management': 'Traffic Management',
      'logging': 'Logging & Monitoring',
      'advanced': 'Advanced Patterns',
    };
    return labels[category];
  }

  /**
   * Get difficulty display name and color
   */
  static getDifficultyInfo(difficulty: DemoDifficulty): {
    label: string;
    color: string;
    bgColor: string;
  } {
    const info: Record<
      DemoDifficulty,
      { label: string; color: string; bgColor: string }
    > = {
      beginner: {
        label: 'Beginner',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
      },
      intermediate: {
        label: 'Intermediate',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
      },
      advanced: {
        label: 'Advanced',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
      },
    };
    return info[difficulty];
  }
}
