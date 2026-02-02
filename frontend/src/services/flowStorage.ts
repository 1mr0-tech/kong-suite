import type { Node, Edge } from 'reactflow';

export interface SavedFlow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'kong-suite-saved-flows';

/**
 * Client-side flow storage using localStorage
 * Provides CRUD operations for flows
 */
export class FlowStorage {
  /**
   * Get all saved flows
   */
  getAllFlows(): SavedFlow[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load flows from localStorage:', error);
      return [];
    }
  }

  /**
   * Get a flow by ID
   */
  getFlow(id: string): SavedFlow | null {
    const flows = this.getAllFlows();
    return flows.find(f => f.id === id) || null;
  }

  /**
   * Save a new flow or update existing
   */
  saveFlow(flow: Omit<SavedFlow, 'id' | 'created_at' | 'updated_at'> | SavedFlow): SavedFlow {
    const flows = this.getAllFlows();
    const now = new Date().toISOString();

    // Check if updating existing flow
    if ('id' in flow) {
      const index = flows.findIndex(f => f.id === flow.id);
      if (index !== -1) {
        flows[index] = {
          ...flow,
          updated_at: now,
        };
        this.saveAllFlows(flows);
        return flows[index];
      }
    }

    // Create new flow
    const newFlow: SavedFlow = {
      ...flow,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };

    flows.push(newFlow);
    this.saveAllFlows(flows);
    return newFlow;
  }

  /**
   * Delete a flow by ID
   */
  deleteFlow(id: string): boolean {
    const flows = this.getAllFlows();
    const filteredFlows = flows.filter(f => f.id !== id);

    if (filteredFlows.length === flows.length) {
      return false; // Flow not found
    }

    this.saveAllFlows(filteredFlows);
    return true;
  }

  /**
   * Update flow name and description
   */
  updateFlowMetadata(id: string, name: string, description: string): boolean {
    const flows = this.getAllFlows();
    const flow = flows.find(f => f.id === id);

    if (!flow) return false;

    flow.name = name;
    flow.description = description;
    flow.updated_at = new Date().toISOString();

    this.saveAllFlows(flows);
    return true;
  }

  /**
   * Clear all saved flows
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { count: number; sizeKB: number } {
    const flows = this.getAllFlows();
    const data = localStorage.getItem(STORAGE_KEY) || '';
    const sizeKB = Math.round((data.length * 2) / 1024); // UTF-16 = 2 bytes per char

    return {
      count: flows.length,
      sizeKB,
    };
  }

  /**
   * Export flows as JSON file
   */
  exportFlows(): void {
    const flows = this.getAllFlows();
    const json = JSON.stringify(flows, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kong-suite-flows-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import flows from JSON file
   */
  async importFlows(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const flows = JSON.parse(e.target?.result as string) as SavedFlow[];

          if (!Array.isArray(flows)) {
            reject(new Error('Invalid file format'));
            return;
          }

          // Validate flows have required fields
          const validFlows = flows.filter(f =>
            f.name && f.nodes && f.edges && Array.isArray(f.nodes) && Array.isArray(f.edges)
          );

          if (validFlows.length === 0) {
            reject(new Error('No valid flows found in file'));
            return;
          }

          // Merge with existing flows (update IDs to avoid conflicts)
          const existingFlows = this.getAllFlows();
          const importedFlows = validFlows.map(f => ({
            ...f,
            id: this.generateId(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          this.saveAllFlows([...existingFlows, ...importedFlows]);
          resolve(importedFlows.length);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Private helper methods

  private saveAllFlows(flows: SavedFlow[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
    } catch (error) {
      console.error('Failed to save flows to localStorage:', error);
      throw new Error('Storage quota exceeded or localStorage unavailable');
    }
  }

  private generateId(): string {
    return `flow_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export singleton instance
export const flowStorage = new FlowStorage();
