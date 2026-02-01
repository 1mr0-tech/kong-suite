import { KongAdminApiClient, AdminApiConfig } from './AdminApiClient';

/**
 * Manages multiple Kong Admin API client instances
 */
export class KongClientManager {
  private clients: Map<string, KongAdminApiClient> = new Map();

  /**
   * Get or create a client for the given configuration
   */
  getClient(config: AdminApiConfig): KongAdminApiClient {
    const key = this.getClientKey(config);

    let client = this.clients.get(key);
    if (!client) {
      client = new KongAdminApiClient(config);
      this.clients.set(key, client);
    }

    return client;
  }

  /**
   * Create a temporary client (not cached)
   */
  createClient(config: AdminApiConfig): KongAdminApiClient {
    return new KongAdminApiClient(config);
  }

  /**
   * Remove a client from cache
   */
  removeClient(config: AdminApiConfig): void {
    const key = this.getClientKey(config);
    this.clients.delete(key);
  }

  /**
   * Clear all cached clients
   */
  clearAll(): void {
    this.clients.clear();
  }

  private getClientKey(config: AdminApiConfig): string {
    return `${config.url}:${config.workspace || 'default'}`;
  }
}

// Singleton instance
export const kongClientManager = new KongClientManager();
