import yaml from 'js-yaml';
import type { Node, Edge } from 'reactflow';

/**
 * Sanitize string values to prevent YAML injection
 * Removes dangerous characters and patterns that could break YAML structure
 */
function sanitizeYamlValue(value: any): any {
  if (typeof value === 'string') {
    // Remove or escape dangerous YAML characters
    return value
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/[`${}]/g, '') // Remove template literal syntax
      .replace(/^\s*[-!&*>|]/g, '') // Remove YAML special characters at start
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeYamlValue);
  }

  if (value && typeof value === 'object') {
    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      // Sanitize keys and values
      const safeKey = sanitizeYamlValue(key);
      sanitized[safeKey] = sanitizeYamlValue(val);
    }
    return sanitized;
  }

  return value;
}

/**
 * Validate that a string is a safe identifier (for names, etc.)
 */
function validateIdentifier(value: string, fieldName: string): string {
  if (!value || typeof value !== 'string') {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  // Allow alphanumeric, hyphens, underscores, dots
  const safePattern = /^[a-zA-Z0-9._-]+$/;
  if (!safePattern.test(value)) {
    throw new Error(`${fieldName} contains invalid characters. Only alphanumeric, hyphens, underscores, and dots allowed.`);
  }

  if (value.length > 255) {
    throw new Error(`${fieldName} is too long (max 255 characters)`);
  }

  return value;
}

interface DeckConfig {
  _format_version: string;
  services?: any[];
  routes?: any[];
  plugins?: any[];
  consumers?: any[];
  upstreams?: any[];
}

/**
 * Client-side YAML generator for Kong decK configurations
 * Generates valid Kong configuration from React Flow nodes and edges
 */
export class YamlGenerator {
  /**
   * Generate decK YAML from flow nodes and edges
   */
  generateYAML(nodes: Node[], edges: Edge[]): string {
    const config: DeckConfig = {
      _format_version: '3.0',
    };

    // Group nodes by type
    const serviceNodes = nodes.filter((n) => n.data.type === 'service');
    const routeNodes = nodes.filter((n) => n.data.type === 'route');
    const pluginNodes = nodes.filter((n) => n.data.type === 'plugin');
    const consumerNodes = nodes.filter((n) => n.data.type === 'consumer');
    const upstreamNodes = nodes.filter((n) => n.data.type === 'upstream');

    // Generate services
    if (serviceNodes.length > 0) {
      config.services = serviceNodes.map((node) =>
        this.generateService(node, node.data.config || {})
      );
    }

    // Generate routes (standalone, will reference services)
    if (routeNodes.length > 0) {
      config.routes = routeNodes.map((node) =>
        this.generateRoute(node, node.data.config || {}, edges)
      );
    }

    // Generate plugins
    if (pluginNodes.length > 0) {
      const allPlugins: any[] = [];
      pluginNodes.forEach((node) => {
        const plugins = this.generatePlugin(node, node.data.config || {}, edges, nodes);
        allPlugins.push(...plugins);
      });
      if (allPlugins.length > 0) {
        config.plugins = allPlugins;
      }
    }

    // Generate consumers
    if (consumerNodes.length > 0) {
      config.consumers = consumerNodes.map((node) =>
        this.generateConsumer(node, node.data.config || {})
      );
    }

    // Generate upstreams
    if (upstreamNodes.length > 0) {
      config.upstreams = upstreamNodes.map((node) =>
        this.generateUpstream(node, node.data.config || {})
      );
    }

    // Sanitize all values before YAML generation to prevent injection
    const sanitizedConfig = sanitizeYamlValue(config);

    return yaml.dump(sanitizedConfig, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      skipInvalid: true,
      flowLevel: -1,
    });
  }

  private generateService(node: Node, data: any): any {
    // Validate and sanitize service name
    const serviceName = data.name || node.id;
    validateIdentifier(serviceName, 'Service name');

    const service: any = {
      name: serviceName,
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
    // Validate and sanitize route name
    const routeName = data.name || node.id;
    validateIdentifier(routeName, 'Route name');

    const route: any = {
      name: routeName,
    };

    // Find connected service
    const serviceEdge = edges.find((e) => e.source === node.id && e.target);
    if (serviceEdge) {
      // Reference service by name
      route.service = { name: serviceEdge.target };
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

  private generatePlugin(node: Node, data: any, edges: Edge[], nodes: Node[]): any[] {
    const pluginName = data.name || 'rate-limiting';
    const pluginEnabled = data.enabled !== undefined ? data.enabled : true;
    const pluginConfig = data.config && Object.keys(data.config).length > 0 ? data.config : undefined;

    // Find all connections from this plugin
    const pluginEdges = edges.filter((e) => e.source === node.id);

    // If no connections, it's a global plugin
    if (pluginEdges.length === 0) {
      return [{
        name: pluginName,
        enabled: pluginEnabled,
        ...(pluginConfig && { config: pluginConfig }),
      }];
    }

    // Create a separate plugin instance for each connection
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

      // Attach to the appropriate entity
      if (targetType === 'service') {
        plugin.service = { name: targetNode.data.config?.name || edge.target };
      } else if (targetType === 'route') {
        plugin.route = { name: targetNode.data.config?.name || edge.target };
      } else if (targetType === 'consumer') {
        plugin.consumer = { username: targetNode.data.config?.username || edge.target };
      }

      pluginInstances.push(plugin);
    }

    return pluginInstances;
  }

  private generateConsumer(_node: Node, data: any): any {
    const consumer: any = {};

    if (data.username) consumer.username = data.username;
    if (data.custom_id) consumer.custom_id = data.custom_id;

    return consumer;
  }

  private generateUpstream(node: Node, data: any): any {
    const upstream: any = {
      name: data.name || node.id,
    };

    if (data.algorithm) upstream.algorithm = data.algorithm;
    if (data.slots) upstream.slots = data.slots;
    if (data.hash_on) upstream.hash_on = data.hash_on;
    if (data.hash_fallback) upstream.hash_fallback = data.hash_fallback;

    // TODO: Add targets based on connections
    // For now, upstreams without targets will be generated
    // Users will need to add targets manually or through future UI

    return upstream;
  }

  /**
   * Validate the generated flow before YAML generation
   * Returns array of validation errors
   */
  validateFlow(nodes: Node[], edges: Edge[]): string[] {
    const errors: string[] = [];

    // Check for services without hosts
    const services = nodes.filter((n) => n.data.type === 'service');
    services.forEach((service) => {
      const host = service.data.config?.host;
      if (!host || host === 'example.com') {
        errors.push(`Service "${service.data.config?.name || service.id}" needs a valid host`);
      }
    });

    // Check for routes without connections to services
    const routes = nodes.filter((n) => n.data.type === 'route');
    routes.forEach((route) => {
      const hasServiceConnection = edges.some((e) => e.source === route.id);
      if (!hasServiceConnection) {
        errors.push(`Route "${route.data.config?.name || route.id}" must be connected to a Service`);
      }
    });

    // Check for routes without paths
    routes.forEach((route) => {
      const paths = route.data.config?.paths;
      if (!paths || paths.length === 0) {
        errors.push(`Route "${route.data.config?.name || route.id}" should have at least one path`);
      }
    });

    return errors;
  }
}

// Export singleton instance
export const yamlGenerator = new YamlGenerator();
