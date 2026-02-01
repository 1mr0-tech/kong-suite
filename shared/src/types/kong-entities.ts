/**
 * Kong Entity Types
 * Based on Kong Admin API schema
 */

export interface KongService {
  id?: string;
  name: string;
  protocol: 'http' | 'https' | 'grpc' | 'grpcs' | 'tcp' | 'tls' | 'udp';
  host: string;
  port: number;
  path?: string;
  retries?: number;
  connect_timeout?: number;
  write_timeout?: number;
  read_timeout?: number;
  tags?: string[];
  client_certificate?: { id: string };
  tls_verify?: boolean;
  tls_verify_depth?: number;
  ca_certificates?: string[];
  enabled?: boolean;
  created_at?: number;
  updated_at?: number;
}

export interface KongRoute {
  id?: string;
  name?: string;
  protocols: Array<'http' | 'https' | 'grpc' | 'grpcs' | 'tcp' | 'tls' | 'udp'>;
  methods?: string[];
  hosts?: string[];
  paths?: string[];
  headers?: Record<string, string[]>;
  https_redirect_status_code?: 426 | 301 | 302 | 307 | 308;
  regex_priority?: number;
  strip_path?: boolean;
  path_handling?: 'v0' | 'v1';
  preserve_host?: boolean;
  request_buffering?: boolean;
  response_buffering?: boolean;
  tags?: string[];
  service?: { id: string };
  snis?: string[];
  sources?: Array<{ ip?: string; port?: number }>;
  destinations?: Array<{ ip?: string; port?: number }>;
  created_at?: number;
  updated_at?: number;
}

export interface KongPlugin {
  id?: string;
  name: string;
  enabled?: boolean;
  config?: Record<string, any>;
  protocols?: Array<'http' | 'https' | 'grpc' | 'grpcs' | 'tcp' | 'tls' | 'udp'>;
  tags?: string[];
  consumer?: { id: string };
  service?: { id: string };
  route?: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongConsumer {
  id?: string;
  username?: string;
  custom_id?: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface KongUpstream {
  id?: string;
  name: string;
  algorithm?: 'round-robin' | 'consistent-hashing' | 'least-connections' | 'latency';
  hash_on?: 'none' | 'consumer' | 'ip' | 'header' | 'cookie' | 'path' | 'query_arg';
  hash_fallback?: 'none' | 'consumer' | 'ip' | 'header' | 'cookie' | 'path' | 'query_arg';
  hash_on_header?: string;
  hash_fallback_header?: string;
  hash_on_cookie?: string;
  hash_on_cookie_path?: string;
  hash_on_query_arg?: string;
  hash_fallback_query_arg?: string;
  slots?: number;
  healthchecks?: {
    active?: {
      type?: 'http' | 'https' | 'tcp' | 'grpc' | 'grpcs';
      timeout?: number;
      concurrency?: number;
      http_path?: string;
      https_verify_certificate?: boolean;
      https_sni?: string;
      healthy?: {
        interval?: number;
        successes?: number;
        http_statuses?: number[];
      };
      unhealthy?: {
        interval?: number;
        http_failures?: number;
        tcp_failures?: number;
        timeouts?: number;
        http_statuses?: number[];
      };
    };
    passive?: {
      type?: 'http' | 'https' | 'tcp' | 'grpc' | 'grpcs';
      healthy?: {
        successes?: number;
        http_statuses?: number[];
      };
      unhealthy?: {
        http_failures?: number;
        tcp_failures?: number;
        timeouts?: number;
        http_statuses?: number[];
      };
    };
  };
  tags?: string[];
  host_header?: string;
  client_certificate?: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongTarget {
  id?: string;
  target: string;
  weight?: number;
  tags?: string[];
  upstream: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongCertificate {
  id?: string;
  cert: string;
  key: string;
  cert_alt?: string;
  key_alt?: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface KongSNI {
  id?: string;
  name: string;
  tags?: string[];
  certificate: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongCA {
  id?: string;
  cert: string;
  cert_digest?: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

// API Response types
export interface KongListResponse<T> {
  data: T[];
  next?: string;
  offset?: string;
}

export interface KongErrorResponse {
  message: string;
  name?: string;
  code?: number;
  fields?: Record<string, string>;
}

// Kong Info/Status types
export interface KongInfo {
  version: string;
  hostname: string;
  node_id: string;
  tagline: string;
  configuration?: {
    database: string;
    [key: string]: any;
  };
}

export interface KongStatus {
  database: {
    reachable: boolean;
  };
  server: {
    total_requests: number;
    connections_active: number;
    connections_accepted: number;
    connections_handled: number;
    connections_reading: number;
    connections_writing: number;
    connections_waiting: number;
  };
}

// Plugin categories
export type PluginCategory =
  | 'authentication'
  | 'security'
  | 'traffic-control'
  | 'serverless'
  | 'analytics-monitoring'
  | 'transformations'
  | 'logging';

export interface PluginSchema {
  name: string;
  category: PluginCategory;
  description: string;
  fields: Record<string, any>;
}
