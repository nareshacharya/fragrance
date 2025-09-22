import { z } from 'zod';

/**
 * API feature configuration schema
 */
export const apiConfigSchema = z.object({
  // Pega DX Integration
  pegaDx: z.object({
    baseUrl: z.string().url(),
    apiVersion: z.string().default('v1'),
    timeout: z.number().default(30000),
    retries: z.number().default(3),
    retryDelay: z.number().default(1000),
    maxRetryDelay: z.number().default(10000),
    retryMultiplier: z.number().default(2),
    enableLogging: z.boolean().default(true),
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  }),

  // HTTP Client Configuration
  httpClient: z.object({
    timeout: z.number().default(30000),
    keepAlive: z.boolean().default(true),
    maxSockets: z.number().default(10),
    maxFreeSockets: z.number().default(5),
    keepAliveMsecs: z.number().default(1000),
    userAgent: z.string().default('FragranceApp/1.0'),
    followRedirects: z.boolean().default(true),
    maxRedirects: z.number().default(5),
  }),

  // Request/Response Configuration
  request: z.object({
    compression: z.boolean().default(true),
    gzipThreshold: z.number().default(1024),
    maxBodySize: z.number().default(10 * 1024 * 1024), // 10MB
    maxHeaderSize: z.number().default(8192),
    validateSSL: z.boolean().default(true),
  }),

  // Caching Configuration
  caching: z.object({
    enabled: z.boolean().default(true),
    defaultTTL: z.number().default(300), // 5 minutes
    maxSize: z.number().default(1000),
    strategy: z.enum(['lru', 'lfu', 'fifo']).default('lru'),
    cacheKeyPrefix: z.string().default('api:'),
  }),

  // Rate Limiting
  rateLimiting: z.object({
    enabled: z.boolean().default(true),
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.number().default(1000),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false),
    keyGenerator: z.enum(['ip', 'user', 'api-key']).default('ip'),
  }),

  // API Versioning
  versioning: z.object({
    enabled: z.boolean().default(true),
    defaultVersion: z.string().default('v1'),
    supportedVersions: z.array(z.string()).default(['v1']),
    versionHeader: z.string().default('X-API-Version'),
    versionParam: z.string().default('version'),
  }),

  // Endpoint Configuration
  endpoints: z.object({
    health: z.string().default('/health'),
    metrics: z.string().default('/metrics'),
    docs: z.string().default('/docs'),
    status: z.string().default('/status'),
  }),

  // Error Handling
  errorHandling: z.object({
    includeStackTrace: z.boolean().default(false),
    logErrors: z.boolean().default(true),
    errorCodes: z.record(z.object({
      message: z.string(),
      statusCode: z.number(),
      retryable: z.boolean().default(false),
    })).default({
      'VALIDATION_ERROR': { message: 'Validation failed', statusCode: 400, retryable: false },
      'AUTHENTICATION_ERROR': { message: 'Authentication required', statusCode: 401, retryable: false },
      'AUTHORIZATION_ERROR': { message: 'Insufficient permissions', statusCode: 403, retryable: false },
      'NOT_FOUND': { message: 'Resource not found', statusCode: 404, retryable: false },
      'RATE_LIMIT_EXCEEDED': { message: 'Rate limit exceeded', statusCode: 429, retryable: true },
      'INTERNAL_ERROR': { message: 'Internal server error', statusCode: 500, retryable: true },
      'SERVICE_UNAVAILABLE': { message: 'Service temporarily unavailable', statusCode: 503, retryable: true },
    }),
  }),

  // Monitoring and Analytics
  monitoring: z.object({
    enabled: z.boolean().default(true),
    collectMetrics: z.boolean().default(true),
    collectTraces: z.boolean().default(false),
    sampleRate: z.number().min(0).max(1).default(0.1),
    metricsEndpoint: z.string().default('/metrics'),
    healthCheckInterval: z.number().default(30000),
  }),
});

export type ApiConfig = z.infer<typeof apiConfigSchema>;

/**
 * Default API configuration
 */
export const defaultApiConfig: ApiConfig = {
  pegaDx: {
    baseUrl: process.env.PEGA_DX_BASE_URL || 'https://api.pega.com',
    apiVersion: 'v1',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    retryMultiplier: 2,
    enableLogging: true,
    logLevel: 'info',
  },
  httpClient: {
    timeout: 30000,
    keepAlive: true,
    maxSockets: 10,
    maxFreeSockets: 5,
    keepAliveMsecs: 1000,
    userAgent: 'FragranceApp/1.0',
    followRedirects: true,
    maxRedirects: 5,
  },
  request: {
    compression: true,
    gzipThreshold: 1024,
    maxBodySize: 10 * 1024 * 1024,
    maxHeaderSize: 8192,
    validateSSL: true,
  },
  caching: {
    enabled: true,
    defaultTTL: 300,
    maxSize: 1000,
    strategy: 'lru',
    cacheKeyPrefix: 'api:',
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: 'ip',
  },
  versioning: {
    enabled: true,
    defaultVersion: 'v1',
    supportedVersions: ['v1'],
    versionHeader: 'X-API-Version',
    versionParam: 'version',
  },
  endpoints: {
    health: '/health',
    metrics: '/metrics',
    docs: '/docs',
    status: '/status',
  },
  errorHandling: {
    includeStackTrace: false,
    logErrors: true,
    errorCodes: {
      'VALIDATION_ERROR': { message: 'Validation failed', statusCode: 400, retryable: false },
      'AUTHENTICATION_ERROR': { message: 'Authentication required', statusCode: 401, retryable: false },
      'AUTHORIZATION_ERROR': { message: 'Insufficient permissions', statusCode: 403, retryable: false },
      'NOT_FOUND': { message: 'Resource not found', statusCode: 404, retryable: false },
      'RATE_LIMIT_EXCEEDED': { message: 'Rate limit exceeded', statusCode: 429, retryable: true },
      'INTERNAL_ERROR': { message: 'Internal server error', statusCode: 500, retryable: true },
      'SERVICE_UNAVAILABLE': { message: 'Service temporarily unavailable', statusCode: 503, retryable: true },
    },
  },
  monitoring: {
    enabled: true,
    collectMetrics: true,
    collectTraces: false,
    sampleRate: 0.1,
    metricsEndpoint: '/metrics',
    healthCheckInterval: 30000,
  },
};

// Export default configuration
export default defaultApiConfig;

