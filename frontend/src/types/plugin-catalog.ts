/**
 * Kong Plugin Catalog
 * Comprehensive list of Kong Gateway plugins organized by category
 * Based on Kong Plugin Hub: https://docs.konghq.com/hub/
 */

import type { PluginCategory } from './kong-entities';

export interface PluginInfo {
    name: string;
    displayName: string;
    category: PluginCategory;
    description: string;
    tier: 'free' | 'plus' | 'enterprise';
    docsUrl: string;
}

export const PLUGIN_CATALOG: PluginInfo[] = [
    // Authentication Plugins
    {
        name: 'basic-auth',
        displayName: 'Basic Authentication',
        category: 'authentication',
        description: 'Add Basic Authentication to a Route or Service',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/basic-auth/',
    },
    {
        name: 'key-auth',
        displayName: 'Key Authentication',
        category: 'authentication',
        description: 'Add API key authentication to a Route or Service',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/key-auth/',
    },
    {
        name: 'oauth2',
        displayName: 'OAuth 2.0',
        category: 'authentication',
        description: 'Add OAuth 2.0 authentication layer',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/oauth2/',
    },
    {
        name: 'jwt',
        displayName: 'JWT',
        category: 'authentication',
        description: 'Verify and authenticate JSON Web Tokens',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/jwt/',
    },
    {
        name: 'hmac-auth',
        displayName: 'HMAC Authentication',
        category: 'authentication',
        description: 'Add HMAC signature authentication',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/hmac-auth/',
    },
    {
        name: 'ldap-auth',
        displayName: 'LDAP Authentication',
        category: 'authentication',
        description: 'Integrate with LDAP/Active Directory',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/ldap-auth/',
    },
    {
        name: 'openid-connect',
        displayName: 'OpenID Connect',
        category: 'authentication',
        description: 'Integrate with OpenID Connect providers',
        tier: 'enterprise',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/openid-connect/',
    },

    // Security Plugins
    {
        name: 'acl',
        displayName: 'ACL',
        category: 'security',
        description: 'Restrict access based on Consumer groups',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/acl/',
    },
    {
        name: 'cors',
        displayName: 'CORS',
        category: 'security',
        description: 'Allow cross-origin requests to your APIs',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/cors/',
    },
    {
        name: 'ip-restriction',
        displayName: 'IP Restriction',
        category: 'security',
        description: 'Allow or deny IPs that can make requests',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/ip-restriction/',
    },
    {
        name: 'bot-detection',
        displayName: 'Bot Detection',
        category: 'security',
        description: 'Detect and block malicious bots',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/bot-detection/',
    },
    {
        name: 'mtls-auth',
        displayName: 'mTLS Authentication',
        category: 'security',
        description: 'Mutual TLS client certificate authentication',
        tier: 'enterprise',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/mtls-auth/',
    },

    // Traffic Control Plugins
    {
        name: 'rate-limiting',
        displayName: 'Rate Limiting',
        category: 'traffic-control',
        description: 'Rate limit requests per consumer/IP/service',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/rate-limiting/',
    },
    {
        name: 'rate-limiting-advanced',
        displayName: 'Rate Limiting Advanced',
        category: 'traffic-control',
        description: 'Advanced rate limiting with sliding window',
        tier: 'enterprise',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/rate-limiting-advanced/',
    },
    {
        name: 'request-size-limiting',
        displayName: 'Request Size Limiting',
        category: 'traffic-control',
        description: 'Block requests with large payloads',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/request-size-limiting/',
    },
    {
        name: 'request-termination',
        displayName: 'Request Termination',
        category: 'traffic-control',
        description: 'Terminate incoming requests with custom response',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/request-termination/',
    },
    {
        name: 'proxy-cache',
        displayName: 'Proxy Cache',
        category: 'traffic-control',
        description: 'Cache and serve commonly requested responses',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/proxy-cache/',
    },
    {
        name: 'canary',
        displayName: 'Canary Release',
        category: 'traffic-control',
        description: 'Slowly roll out changes to a subset of users',
        tier: 'enterprise',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/canary/',
    },

    // Transformations Plugins
    {
        name: 'request-transformer',
        displayName: 'Request Transformer',
        category: 'transformations',
        description: 'Modify request headers, query strings, body',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/request-transformer/',
    },
    {
        name: 'response-transformer',
        displayName: 'Response Transformer',
        category: 'transformations',
        description: 'Modify response headers and body',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/response-transformer/',
    },
    {
        name: 'correlation-id',
        displayName: 'Correlation ID',
        category: 'transformations',
        description: 'Correlate requests and responses with a unique ID',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/correlation-id/',
    },

    // Logging Plugins
    {
        name: 'file-log',
        displayName: 'File Log',
        category: 'logging',
        description: 'Append request and response data to a log file',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/file-log/',
    },
    {
        name: 'http-log',
        displayName: 'HTTP Log',
        category: 'logging',
        description: 'Send request logs to an HTTP server',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/http-log/',
    },
    {
        name: 'tcp-log',
        displayName: 'TCP Log',
        category: 'logging',
        description: 'Send request logs to a TCP server',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/tcp-log/',
    },
    {
        name: 'syslog',
        displayName: 'Syslog',
        category: 'logging',
        description: 'Send request logs to Syslog',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/syslog/',
    },
    {
        name: 'datadog',
        displayName: 'Datadog',
        category: 'logging',
        description: 'Log metrics to Datadog',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/datadog/',
    },

    // Analytics & Monitoring Plugins
    {
        name: 'prometheus',
        displayName: 'Prometheus',
        category: 'analytics-monitoring',
        description: 'Expose metrics on a Prometheus endpoint',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/prometheus/',
    },
    {
        name: 'zipkin',
        displayName: 'Zipkin',
        category: 'analytics-monitoring',
        description: 'Propagate Zipkin distributed tracing spans',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/zipkin/',
    },
    {
        name: 'opentelemetry',
        displayName: 'OpenTelemetry',
        category: 'analytics-monitoring',
        description: 'Export traces to OpenTelemetry compatible backends',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/opentelemetry/',
    },

    // Serverless Plugins
    {
        name: 'serverless-functions',
        displayName: 'Serverless Functions',
        category: 'serverless',
        description: 'Run Lua code before/after proxying',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/serverless-functions/',
    },
    {
        name: 'aws-lambda',
        displayName: 'AWS Lambda',
        category: 'serverless',
        description: 'Invoke an AWS Lambda function',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/aws-lambda/',
    },
    {
        name: 'azure-functions',
        displayName: 'Azure Functions',
        category: 'serverless',
        description: 'Invoke Azure Functions from Kong',
        tier: 'free',
        docsUrl: 'https://docs.konghq.com/hub/kong-inc/azure-functions/',
    },
];

// Helper function to get plugins by category
export function getPluginsByCategory(category: PluginCategory): PluginInfo[] {
    return PLUGIN_CATALOG.filter(plugin => plugin.category === category);
}

// Category display info
export const PLUGIN_CATEGORIES: Record<PluginCategory, { name: string; description: string; icon: string }> = {
    'authentication': {
        name: 'Authentication',
        description: 'Protect your APIs with authentication mechanisms',
        icon: '🔐',
    },
    'security': {
        name: 'Security',
        description: 'Secure your APIs with access control and protection',
        icon: '🛡️',
    },
    'traffic-control': {
        name: 'Traffic Control',
        description: 'Manage traffic with rate limiting, caching, and more',
        icon: '🚦',
    },
    'transformations': {
        name: 'Transformations',
        description: 'Transform requests and responses',
        icon: '🔄',
    },
    'logging': {
        name: 'Logging',
        description: 'Log requests and responses to various destinations',
        icon: '📝',
    },
    'analytics-monitoring': {
        name: 'Analytics & Monitoring',
        description: 'Monitor and analyze API traffic',
        icon: '📊',
    },
    'serverless': {
        name: 'Serverless',
        description: 'Execute serverless functions',
        icon: '⚡',
    },
};
