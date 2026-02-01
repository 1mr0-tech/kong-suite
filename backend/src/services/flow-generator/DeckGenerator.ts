import yaml from 'js-yaml';
import type { Node, Edge } from 'reactflow';

interface DeckConfig {
  _format_version: string;
  services?: any[];
  routes?: any[];
  plugins?: any[];
  consumers?: any[];
  upstreams?: any[];
}

export class DeckGenerator {
  /**
   * Generate decK YAML from flow nodes and edges
   */
  generateYAML(nodes: Node[], edges: Edge[]): string {
    const config: DeckConfig = {
      _format_version: '3.0',
    };

    const services: any[] = [];
    const routes: any[] = [];
    const plugins: any[] = [];
    const consumers: any[] = [];
    const upstreams: any[] = [];

    // Process each node
    for (const node of nodes) {
      const nodeData = node.data.config || {};
      const nodeType = node.data.type;

      switch (nodeType) {
        case 'service':
          services.push(this.generateService(node, nodeData));
          break;
        case 'route':
          routes.push(this.generateRoute(node, nodeData, edges));
          break;
        case 'plugin':
          // generatePlugin now returns an array of plugin instances
          const pluginInstances = this.generatePlugin(node, nodeData, edges, nodes);
          plugins.push(...pluginInstances);
          break;
        case 'consumer':
          consumers.push(this.generateConsumer(node, nodeData));
          break;
        case 'upstream':
          upstreams.push(this.generateUpstream(node, nodeData));
          break;
      }
    }

    // Only add arrays that have content
    if (services.length > 0) config.services = services;
    if (routes.length > 0) config.routes = routes;
    if (plugins.length > 0) config.plugins = plugins;
    if (consumers.length > 0) config.consumers = consumers;
    if (upstreams.length > 0) config.upstreams = upstreams;

    return yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });
  }

  private generateService(node: Node, data: any): any {
    const service: any = {
      name: data.name || node.id,
      protocol: data.protocol || 'http',
      host: data.host || 'example.com',
      port: data.port || 80,
    };

    // Optional fields
    if (data.path) service.path = data.path;
    if (data.retries !== undefined) service.retries = data.retries;
    if (data.connect_timeout !== undefined) service.connect_timeout = data.connect_timeout;
    if (data.write_timeout !== undefined) service.write_timeout = data.write_timeout;
    if (data.read_timeout !== undefined) service.read_timeout = data.read_timeout;

    return service;
  }

  private generateRoute(node: Node, data: any, edges: Edge[]): any {
    const route: any = {
      name: data.name || node.id,
    };

    // Find connected service
    const serviceEdge = edges.find((e) => e.source === node.id && e.target);
    if (serviceEdge) {
      // Reference service by name (will be the target node id if name not set)
      route.service = serviceEdge.target;
    }

    // Add route configuration
    if (data.protocols && data.protocols.length > 0) {
      route.protocols = data.protocols;
    }
    if (data.methods && data.methods.length > 0) {
      route.methods = data.methods;
    }
    if (data.paths && data.paths.length > 0) {
      route.paths = data.paths.filter((p: string) => p.trim() !== '');
    }
    if (data.hosts && data.hosts.length > 0) {
      route.hosts = data.hosts;
    }
    if (data.strip_path !== undefined) route.strip_path = data.strip_path;
    if (data.preserve_host !== undefined) route.preserve_host = data.preserve_host;

    return route;
  }

  /**
   * Generate plugin configurations
   *
   * Kong supports multiple plugin instances of the same type.
   * Each connection from a plugin node creates a separate plugin instance.
   *
   * Examples:
   * - Plugin with no connections → Global plugin
   * - Plugin → Service-A → Plugin instance attached to Service-A
   * - Plugin → Route-B → Plugin instance attached to Route-B
   * - Plugin → Service-A AND Route-B → Two separate plugin instances
   */
  private generatePlugin(node: Node, data: any, edges: Edge[], nodes: Node[]): any[] {
    const pluginName = data.name || 'rate-limiting';
    const pluginEnabled = data.enabled !== undefined ? data.enabled : true;
    const pluginConfig = data.config && Object.keys(data.config).length > 0 ? data.config : undefined;

    // Find all connections from this plugin
    const pluginEdges = edges.filter((e) => e.source === node.id);

    // If no connections, it's a global plugin (applies to all requests)
    if (pluginEdges.length === 0) {
      return [{
        name: pluginName,
        enabled: pluginEnabled,
        ...(pluginConfig && { config: pluginConfig }),
      }];
    }

    // Create a separate plugin instance for each connection
    // This matches Kong's "multiple instances" pattern
    const pluginInstances: any[] = [];

    for (const edge of pluginEdges) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!targetNode) continue;

      const targetType = targetNode.data.type;
      const plugin: any = {
        name: pluginName,
        enabled: pluginEnabled,
        ...(pluginConfig && { config: pluginConfig }),
      };

      // Attach to the appropriate entity using Kong's field names
      if (targetType === 'service') {
        plugin.service = targetNode.data.config?.name || edge.target;
      } else if (targetType === 'route') {
        plugin.route = targetNode.data.config?.name || edge.target;
      } else if (targetType === 'consumer') {
        plugin.consumer = targetNode.data.config?.username || edge.target;
      }

      pluginInstances.push(plugin);
    }

    return pluginInstances;
  }

  private generateConsumer(node: Node, data: any): any {
    const consumer: any = {};

    if (data.username) consumer.username = data.username;
    if (data.custom_id) consumer.custom_id = data.custom_id;

    // Ensure at least one identifier
    if (!consumer.username && !consumer.custom_id) {
      consumer.username = node.id;
    }

    return consumer;
  }

  private generateUpstream(node: Node, data: any): any {
    const upstream: any = {
      name: data.name || node.id,
    };

    if (data.algorithm) upstream.algorithm = data.algorithm;
    if (data.slots !== undefined) upstream.slots = data.slots;
    if (data.hash_on) upstream.hash_on = data.hash_on;
    if (data.hash_fallback) upstream.hash_fallback = data.hash_fallback;

    return upstream;
  }

  /**
   * Validate flow before generating YAML
   */
  validateFlow(nodes: Node[], edges: Edge[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if flow is empty
    if (nodes.length === 0) {
      errors.push('Flow is empty. Add at least one node.');
      return { valid: false, errors };
    }

    // Validate routes have services
    const routeNodes = nodes.filter((n) => n.data.type === 'route');
    for (const route of routeNodes) {
      const hasService = edges.some((e) => e.source === route.id);
      if (!hasService) {
        errors.push(`Route "${route.data.config?.name || route.id}" must be connected to a Service`);
      }
    }

    // Validate services have required fields
    const serviceNodes = nodes.filter((n) => n.data.type === 'service');
    for (const service of serviceNodes) {
      const config = service.data.config || {};
      if (!config.name) {
        errors.push(`Service "${service.id}" is missing a name`);
      }
      if (!config.host) {
        errors.push(`Service "${config.name || service.id}" is missing a host`);
      }
    }

    // Validate consumers have username or custom_id
    const consumerNodes = nodes.filter((n) => n.data.type === 'consumer');
    for (const consumer of consumerNodes) {
      const config = consumer.data.config || {};
      if (!config.username && !config.custom_id) {
        errors.push(`Consumer "${consumer.id}" must have either username or custom_id`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
