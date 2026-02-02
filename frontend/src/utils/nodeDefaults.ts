import type { FlowNodeType } from '@kong-suite/shared';

export const NODE_DEFAULTS: Record<FlowNodeType, Record<string, any>> = {
  service: {
    name: '',
    protocol: 'http',
    host: '',
    port: 80,
    path: '',
    retries: 5,
    connect_timeout: 60000,
    write_timeout: 60000,
    read_timeout: 60000,
  },
  route: {
    name: '',
    protocols: ['http', 'https'],
    methods: [],
    hosts: [],
    paths: [],
    strip_path: true,
    preserve_host: false,
  },
  plugin: {
    name: 'rate-limiting',
    enabled: true,
    config: {},
  },
  consumer: {
    username: '',
    custom_id: '',
  },
  upstream: {
    name: '',
    algorithm: 'round-robin',
    slots: 10000,
    healthchecks: {
      active: {
        healthy: {
          interval: 0,
          successes: 0,
        },
        unhealthy: {
          interval: 0,
          http_failures: 0,
          tcp_failures: 0,
          timeouts: 0,
        },
      },
    },
  },
  target: {
    target: '',
    weight: 100,
  },
  certificate: {
    cert: '',
    key: '',
  },
  sni: {
    name: '',
  },
};

// Plugin configurations for common plugins
export const PLUGIN_CONFIGS: Record<string, Record<string, any>> = {
  // Traffic Control
  'rate-limiting': {
    minute: 5,
    hour: 100,
    policy: 'local',
  },
  'response-ratelimiting': {
    limits: {
      video: {
        minute: 10,
      },
    },
  },
  'request-size-limiting': {
    allowed_payload_size: 128,
  },

  // Authentication
  'key-auth': {
    key_names: ['apikey'],
    hide_credentials: false,
  },
  'basic-auth': {
    hide_credentials: false,
  },
  jwt: {
    uri_param_names: ['jwt'],
    claims_to_verify: ['exp'],
  },
  oauth2: {
    scopes: ['email', 'profile'],
    mandatory_scope: false,
    enable_authorization_code: true,
  },
  'hmac-auth': {
    hide_credentials: false,
    clock_skew: 300,
  },
  'ldap-auth': {
    hide_credentials: false,
    ldap_host: 'ldap.example.com',
    ldap_port: 389,
    base_dn: 'dc=example,dc=com',
  },

  // Security
  acl: {
    allow: [],
    deny: [],
  },
  'ip-restriction': {
    allow: [],
    deny: [],
  },
  'bot-detection': {
    allow: [],
    deny: [],
  },
  cors: {
    origins: ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    headers: ['Accept', 'Content-Type', 'Authorization'],
    exposed_headers: [],
    credentials: true,
    max_age: 3600,
  },

  // Transformations
  'request-transformer': {
    add: {
      headers: [],
      querystring: [],
      body: [],
    },
    remove: {
      headers: [],
      querystring: [],
      body: [],
    },
    replace: {
      headers: [],
      querystring: [],
      body: [],
    },
  },
  'response-transformer': {
    add: {
      headers: [],
      json: [],
    },
    remove: {
      headers: [],
      json: [],
    },
    replace: {
      headers: [],
      json: [],
    },
  },
  'correlation-id': {
    header_name: 'X-Correlation-ID',
    generator: 'uuid',
    echo_downstream: false,
  },

  // Logging
  'file-log': {
    path: '/tmp/file.log',
  },
  'http-log': {
    http_endpoint: 'http://localhost:8080/logs',
    method: 'POST',
    timeout: 10000,
    keepalive: 60000,
  },
  'tcp-log': {
    host: '127.0.0.1',
    port: 9999,
    timeout: 10000,
    keepalive: 60000,
  },
  'udp-log': {
    host: '127.0.0.1',
    port: 9999,
    timeout: 10000,
  },
  syslog: {
    facility: 'user',
    severity: 'info',
  },

  // Monitoring & Analytics
  prometheus: {},
  zipkin: {
    http_endpoint: 'http://localhost:9411/api/v2/spans',
    sample_ratio: 0.001,
  },
  datadog: {
    host: 'localhost',
    port: 8125,
  },
  'statsd': {
    host: 'localhost',
    port: 8125,
  },

  // Serverless
  'aws-lambda': {
    aws_region: 'us-east-1',
    function_name: '',
  },
  'azure-functions': {
    functionname: '',
    appname: '',
  },

  // Caching
  'proxy-cache': {
    response_code: [200, 301, 404],
    request_method: ['GET', 'HEAD'],
    content_type: ['text/plain', 'application/json'],
    cache_ttl: 300,
    strategy: 'memory',
  },

  // Session
  'session': {
    storage: 'cookie',
    cookie_secure: true, // ✅ Secure cookies (HTTPS only)
    cookie_httponly: true, // ✅ Prevents XSS attacks
    cookie_samesite: 'Strict', // ✅ CSRF protection
  },

  // Misc
  'request-termination': {
    status_code: 503,
    message: 'Service temporarily unavailable',
  },
  'grpc-gateway': {},
  'grpc-web': {},
  'pre-function': {
    access: [],
  },
  'post-function': {
    access: [],
  },
};

export const AVAILABLE_PLUGINS = [
  // Traffic Control
  { value: 'rate-limiting', label: 'Rate Limiting', category: 'Traffic Control' },
  { value: 'response-ratelimiting', label: 'Response Rate Limiting', category: 'Traffic Control' },
  { value: 'request-size-limiting', label: 'Request Size Limiting', category: 'Traffic Control' },

  // Authentication
  { value: 'key-auth', label: 'Key Authentication', category: 'Authentication' },
  { value: 'basic-auth', label: 'Basic Authentication', category: 'Authentication' },
  { value: 'jwt', label: 'JWT', category: 'Authentication' },
  { value: 'oauth2', label: 'OAuth 2.0', category: 'Authentication' },
  { value: 'hmac-auth', label: 'HMAC Authentication', category: 'Authentication' },
  { value: 'ldap-auth', label: 'LDAP Authentication', category: 'Authentication' },

  // Security
  { value: 'acl', label: 'ACL', category: 'Security' },
  { value: 'cors', label: 'CORS', category: 'Security' },
  { value: 'ip-restriction', label: 'IP Restriction', category: 'Security' },
  { value: 'bot-detection', label: 'Bot Detection', category: 'Security' },

  // Transformations
  { value: 'request-transformer', label: 'Request Transformer', category: 'Transformations' },
  { value: 'response-transformer', label: 'Response Transformer', category: 'Transformations' },
  { value: 'correlation-id', label: 'Correlation ID', category: 'Transformations' },

  // Logging
  { value: 'file-log', label: 'File Log', category: 'Logging' },
  { value: 'http-log', label: 'HTTP Log', category: 'Logging' },
  { value: 'tcp-log', label: 'TCP Log', category: 'Logging' },
  { value: 'udp-log', label: 'UDP Log', category: 'Logging' },
  { value: 'syslog', label: 'Syslog', category: 'Logging' },

  // Monitoring & Analytics
  { value: 'prometheus', label: 'Prometheus', category: 'Analytics' },
  { value: 'zipkin', label: 'Zipkin', category: 'Analytics' },
  { value: 'datadog', label: 'Datadog', category: 'Analytics' },
  { value: 'statsd', label: 'StatsD', category: 'Analytics' },

  // Serverless
  { value: 'aws-lambda', label: 'AWS Lambda', category: 'Serverless' },
  { value: 'azure-functions', label: 'Azure Functions', category: 'Serverless' },

  // Caching
  { value: 'proxy-cache', label: 'Proxy Cache', category: 'Caching' },

  // Session
  { value: 'session', label: 'Session', category: 'Session' },

  // Misc
  { value: 'request-termination', label: 'Request Termination', category: 'Misc' },
  { value: 'grpc-gateway', label: 'gRPC Gateway', category: 'Misc' },
  { value: 'grpc-web', label: 'gRPC Web', category: 'Misc' },
  { value: 'pre-function', label: 'Pre-function', category: 'Serverless' },
  { value: 'post-function', label: 'Post-function', category: 'Serverless' },
];
