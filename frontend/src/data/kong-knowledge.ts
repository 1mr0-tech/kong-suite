/**
 * Kong Knowledge - Entity Reference Data
 * Educational reference for Kong Gateway entities and their relationships
 */

export interface EntityReference {
    id: string;
    name: string;
    description: string;
    purpose: string;
    keyFields: { name: string; description: string; required: boolean }[];
    relationships: { entity: string; relationship: string; description: string }[];
    useCases: string[];
    docsUrl: string;
    apiEndpoint: string;
}

export const KONG_ENTITIES: EntityReference[] = [
    {
        id: 'service',
        name: 'Service',
        description: 'Gateway Services represent the upstream services in your system that Kong proxies requests to.',
        purpose: 'Services are the backend APIs or applications that receive proxied requests from Kong Gateway.',
        keyFields: [
            { name: 'name', description: 'Unique name for the service', required: true },
            { name: 'protocol', description: 'Protocol used (http, https, grpc, tcp, tls, udp)', required: true },
            { name: 'host', description: 'Hostname or IP of the upstream service', required: true },
            { name: 'port', description: 'Port number of the upstream service', required: true },
            { name: 'path', description: 'Path to append to the upstream URL', required: false },
            { name: 'retries', description: 'Number of retries on failure', required: false },
            { name: 'connect_timeout', description: 'Timeout for establishing connection (ms)', required: false },
            { name: 'read_timeout', description: 'Timeout for reading response (ms)', required: false },
            { name: 'write_timeout', description: 'Timeout for writing request (ms)', required: false },
        ],
        relationships: [
            { entity: 'Route', relationship: 'many-to-one', description: 'Multiple Routes can forward to one Service' },
            { entity: 'Upstream', relationship: 'one-to-one', description: 'Service can optionally point to an Upstream for load balancing' },
            { entity: 'Plugin', relationship: 'one-to-many', description: 'Plugins can be scoped to a Service' },
        ],
        useCases: [
            'Define backend API endpoints',
            'Configure connection timeouts and retries',
            'Set up TLS verification for upstream connections',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/key-concepts/services/',
        apiEndpoint: '/services',
    },
    {
        id: 'route',
        name: 'Route',
        description: 'Routes define rules for matching incoming requests and forwarding them to Services.',
        purpose: 'Routes match client requests based on paths, hosts, methods, headers, and forward them to the appropriate Service.',
        keyFields: [
            { name: 'name', description: 'Unique name for the route', required: false },
            { name: 'protocols', description: 'Protocols to match (http, https, grpc, tcp)', required: true },
            { name: 'hosts', description: 'List of domain names to match', required: false },
            { name: 'paths', description: 'List of URL paths to match', required: false },
            { name: 'methods', description: 'HTTP methods to match (GET, POST, etc.)', required: false },
            { name: 'headers', description: 'Request headers to match', required: false },
            { name: 'strip_path', description: 'Whether to strip matched path from upstream request', required: false },
            { name: 'preserve_host', description: 'Whether to preserve original Host header', required: false },
        ],
        relationships: [
            { entity: 'Service', relationship: 'many-to-one', description: 'Route must be attached to exactly one Service' },
            { entity: 'Plugin', relationship: 'one-to-many', description: 'Plugins can be scoped to a Route' },
        ],
        useCases: [
            'Match incoming requests by path (/api/users)',
            'Match by domain name (api.example.com)',
            'Match by HTTP method (GET, POST)',
            'Apply different policies to different endpoints',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/key-concepts/routes/',
        apiEndpoint: '/routes',
    },
    {
        id: 'consumer',
        name: 'Consumer',
        description: 'Consumers represent clients or users that consume your APIs.',
        purpose: 'Consumers identify API clients for authentication, rate limiting, and access control.',
        keyFields: [
            { name: 'username', description: 'Unique username for the consumer', required: false },
            { name: 'custom_id', description: 'Custom identifier (e.g., from your database)', required: false },
            { name: 'tags', description: 'Tags for organization and filtering', required: false },
        ],
        relationships: [
            { entity: 'Plugin', relationship: 'one-to-many', description: 'Plugins can be scoped to a Consumer for per-user policies' },
            { entity: 'Consumer Group', relationship: 'many-to-many', description: 'Consumers can belong to multiple Consumer Groups' },
        ],
        useCases: [
            'Identify API users for authentication',
            'Apply per-user rate limits',
            'Track API usage by consumer',
            'Grant different access levels to different consumers',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/key-concepts/consumers/',
        apiEndpoint: '/consumers',
    },
    {
        id: 'consumer-group',
        name: 'Consumer Group',
        description: 'Consumer Groups allow you to apply common configurations to groups of Consumers.',
        purpose: 'Group consumers together to apply shared policies like rate limiting or request transformations.',
        keyFields: [
            { name: 'name', description: 'Unique name for the consumer group', required: true },
            { name: 'tags', description: 'Tags for organization', required: false },
        ],
        relationships: [
            { entity: 'Consumer', relationship: 'many-to-many', description: 'A group can contain multiple consumers' },
            { entity: 'Plugin', relationship: 'one-to-many', description: 'Plugins can be scoped to Consumer Groups' },
        ],
        useCases: [
            'Apply rate limits to groups (e.g., free tier vs premium)',
            'Group consumers by organization or team',
            'Apply different API access levels',
            'Manage policies for large numbers of consumers efficiently',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/key-concepts/consumer-groups/',
        apiEndpoint: '/consumer_groups',
    },
    {
        id: 'upstream',
        name: 'Upstream',
        description: 'Upstreams enable load balancing by providing a virtual hostname and collection of Targets.',
        purpose: 'Upstreams distribute traffic across multiple backend instances with health checking and load balancing.',
        keyFields: [
            { name: 'name', description: 'Virtual hostname for the upstream', required: true },
            { name: 'algorithm', description: 'Load balancing algorithm (round-robin, consistent-hashing, least-connections, latency)', required: false },
            { name: 'hash_on', description: 'What to hash on for consistent-hashing (consumer, ip, header, cookie)', required: false },
            { name: 'slots', description: 'Number of slots in the load balancer (10-65536)', required: false },
            { name: 'healthchecks', description: 'Active and passive health check configuration', required: false },
        ],
        relationships: [
            { entity: 'Service', relationship: 'one-to-one', description: 'Service points to an Upstream for load balancing' },
            { entity: 'Target', relationship: 'one-to-many', description: 'Upstream contains multiple Targets (backend instances)' },
        ],
        useCases: [
            'Load balance across multiple backend servers',
            'Health check backend instances',
            'Circuit breaking on failures',
            'Blue-green deployments',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/key-concepts/upstreams/',
        apiEndpoint: '/upstreams',
    },
    {
        id: 'target',
        name: 'Target',
        description: 'Targets are the backend service instances that belong to an Upstream.',
        purpose: 'Targets represent individual backend server instances for load balancing.',
        keyFields: [
            { name: 'target', description: 'Backend address in format host:port', required: true },
            { name: 'weight', description: 'Weight for load balancing (0-65535, default 100)', required: false },
            { name: 'tags', description: 'Tags for organization', required: false },
        ],
        relationships: [
            { entity: 'Upstream', relationship: 'many-to-one', description: 'Target belongs to exactly one Upstream' },
        ],
        useCases: [
            'Add backend server instances',
            'Adjust traffic distribution with weights',
            'Scale horizontally by adding more targets',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/key-concepts/upstreams/',
        apiEndpoint: '/upstreams/{upstream}/targets',
    },
    {
        id: 'plugin',
        name: 'Plugin',
        description: 'Plugins are modules that extend Kong Gateway functionality.',
        purpose: 'Plugins add features like authentication, rate limiting, transformations, logging, and more.',
        keyFields: [
            { name: 'name', description: 'Name of the plugin (e.g., rate-limiting, jwt)', required: true },
            { name: 'enabled', description: 'Whether the plugin is active', required: false },
            { name: 'config', description: 'Plugin-specific configuration', required: false },
            { name: 'protocols', description: 'Protocols the plugin applies to', required: false },
        ],
        relationships: [
            { entity: 'Service', relationship: 'scoped', description: 'Plugin can be scoped to a Service' },
            { entity: 'Route', relationship: 'scoped', description: 'Plugin can be scoped to a Route' },
            { entity: 'Consumer', relationship: 'scoped', description: 'Plugin can be scoped to a Consumer' },
            { entity: 'Consumer Group', relationship: 'scoped', description: 'Plugin can be scoped to a Consumer Group' },
        ],
        useCases: [
            'Add authentication (JWT, API Key, OAuth)',
            'Rate limit requests',
            'Transform requests/responses',
            'Log to external systems',
            'Monitor with Prometheus',
        ],
        docsUrl: 'https://docs.konghq.com/hub/',
        apiEndpoint: '/plugins',
    },
    {
        id: 'certificate',
        name: 'Certificate',
        description: 'Certificates store TLS/SSL certificates for HTTPS connections.',
        purpose: 'Manage SSL/TLS certificates for securing API traffic.',
        keyFields: [
            { name: 'cert', description: 'PEM-encoded public certificate', required: true },
            { name: 'key', description: 'PEM-encoded private key', required: true },
            { name: 'cert_alt', description: 'Alternate certificate (e.g., ECDSA)', required: false },
            { name: 'key_alt', description: 'Alternate private key', required: false },
        ],
        relationships: [
            { entity: 'SNI', relationship: 'one-to-many', description: 'Multiple SNIs can reference one Certificate' },
        ],
        useCases: [
            'Enable HTTPS for your APIs',
            'Configure mTLS',
            'Manage certificate rotation',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/kong-certificate/',
        apiEndpoint: '/certificates',
    },
    {
        id: 'sni',
        name: 'SNI',
        description: 'SNI (Server Name Indication) maps domain names to TLS certificates.',
        purpose: 'Route TLS connections to the correct certificate based on hostname.',
        keyFields: [
            { name: 'name', description: 'SNI hostname to match', required: true },
            { name: 'certificate', description: 'Reference to the Certificate entity', required: true },
        ],
        relationships: [
            { entity: 'Certificate', relationship: 'many-to-one', description: 'SNI references a Certificate' },
        ],
        useCases: [
            'Host multiple domains on single IP',
            'Serve different certificates per domain',
        ],
        docsUrl: 'https://docs.konghq.com/gateway/latest/kong-sni/',
        apiEndpoint: '/snis',
    },
];

// Get entity by ID
export function getEntityById(id: string): EntityReference | undefined {
    return KONG_ENTITIES.find(entity => entity.id === id);
}

// Get all entity names for quick reference
export function getEntityNames(): string[] {
    return KONG_ENTITIES.map(entity => entity.name);
}
