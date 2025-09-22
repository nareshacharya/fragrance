import { z } from 'zod';

/**
 * Security feature configuration schema
 */
export const securityConfigSchema = z.object({
  // CORS Configuration
  cors: z.object({
    enabled: z.boolean().default(true),
    origin: z.union([
      z.string(),
      z.array(z.string()),
      z.boolean()
    ]).default(true),
    methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
    allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization', 'X-Requested-With']),
    exposedHeaders: z.array(z.string()).default([]),
    credentials: z.boolean().default(true),
    maxAge: z.number().default(86400), // 24 hours
    preflightContinue: z.boolean().default(false),
    optionsSuccessStatus: z.number().default(204),
  }),

  // Rate Limiting
  rateLimiting: z.object({
    enabled: z.boolean().default(true),
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.number().default(100),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false),
    keyGenerator: z.enum(['ip', 'user', 'api-key']).default('ip'),
    enableRedis: z.boolean().default(false),
    redisUrl: z.string().optional(),
  }),

  // CSRF Protection
  csrf: z.object({
    enabled: z.boolean().default(true),
    secret: z.string().default('csrf-secret-key'),
    cookieName: z.string().default('_csrf'),
    cookieOptions: z.object({
      httpOnly: z.boolean().default(true),
      secure: z.boolean().default(true),
      sameSite: z.enum(['strict', 'lax', 'none']).default('strict'),
      maxAge: z.number().default(3600000), // 1 hour
    }),
    ignoreMethods: z.array(z.string()).default(['GET', 'HEAD', 'OPTIONS']),
    ignorePaths: z.array(z.string()).default([]),
  }),

  // Security Headers
  securityHeaders: z.object({
    enabled: z.boolean().default(true),
    headers: z.object({
      'X-Content-Type-Options': z.string().default('nosniff'),
      'X-Frame-Options': z.string().default('DENY'),
      'X-XSS-Protection': z.string().default('1; mode=block'),
      'Strict-Transport-Security': z.string().default('max-age=31536000; includeSubDomains'),
      'Content-Security-Policy': z.string().default("default-src 'self'"),
      'Referrer-Policy': z.string().default('strict-origin-when-cross-origin'),
      'Permissions-Policy': z.string().default('geolocation=(), microphone=(), camera=()'),
    }),
    enableDynamicHeaders: z.boolean().default(false),
  }),

  // Input Validation and Sanitization
  inputValidation: z.object({
    enabled: z.boolean().default(true),
    enableXSSProtection: z.boolean().default(true),
    enableSQLInjectionProtection: z.boolean().default(true),
    enableNoSQLInjectionProtection: z.boolean().default(true),
    enableCommandInjectionProtection: z.boolean().default(true),
    maxInputLength: z.number().default(10000),
    enableInputSanitization: z.boolean().default(true),
    allowedFileTypes: z.array(z.string()).default(['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']),
    maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
  }),

  // Session Security
  sessionSecurity: z.object({
    enabled: z.boolean().default(true),
    secure: z.boolean().default(true),
    httpOnly: z.boolean().default(true),
    sameSite: z.enum(['strict', 'lax', 'none']).default('strict'),
    maxAge: z.number().default(24 * 60 * 60 * 1000), // 24 hours
    rolling: z.boolean().default(true),
    regenerateOnLogin: z.boolean().default(true),
    enableSessionFixation: z.boolean().default(true),
  }),

  // Encryption Configuration
  encryption: z.object({
    enabled: z.boolean().default(true),
    algorithm: z.enum(['aes-256-gcm', 'aes-256-cbc', 'aes-128-gcm', 'aes-128-cbc']).default('aes-256-gcm'),
    keyLength: z.number().default(32),
    ivLength: z.number().default(16),
    enableDataEncryption: z.boolean().default(false),
    enableFieldEncryption: z.boolean().default(false),
    encryptionKey: z.string().optional(),
  }),

  // API Security
  apiSecurity: z.object({
    enabled: z.boolean().default(true),
    enableAPIKeyAuth: z.boolean().default(false),
    enableBearerTokenAuth: z.boolean().default(true),
    enableBasicAuth: z.boolean().default(false),
    enableOAuth2: z.boolean().default(false),
    apiKeyHeader: z.string().default('X-API-Key'),
    bearerTokenHeader: z.string().default('Authorization'),
    enableRequestSigning: z.boolean().default(false),
    enableResponseSigning: z.boolean().default(false),
  }),

  // Audit Logging
  auditLogging: z.object({
    enabled: z.boolean().default(true),
    enableSecurityEvents: z.boolean().default(true),
    enableAccessLogging: z.boolean().default(true),
    enableDataChanges: z.boolean().default(false),
    enableFailedAttempts: z.boolean().default(true),
    logRetentionDays: z.number().default(90),
    enableRealTimeAlerts: z.boolean().default(true),
    alertThresholds: z.object({
      failedLogins: z.number().default(5),
      suspiciousActivity: z.number().default(10),
      dataAccess: z.number().default(100),
    }),
  }),

  // Vulnerability Scanning
  vulnerabilityScanning: z.object({
    enabled: z.boolean().default(false),
    enableDependencyScanning: z.boolean().default(false),
    enableCodeScanning: z.boolean().default(false),
    enableContainerScanning: z.boolean().default(false),
    scanSchedule: z.string().default('0 2 * * *'), // Daily at 2 AM
    enableAutomatedFixes: z.boolean().default(false),
    enableSecurityReports: z.boolean().default(true),
  }),

  // Compliance Configuration
  compliance: z.object({
    enabled: z.boolean().default(false),
    standards: z.array(z.enum(['GDPR', 'CCPA', 'HIPAA', 'SOX', 'PCI-DSS'])).default([]),
    enableDataRetention: z.boolean().default(false),
    enableDataAnonymization: z.boolean().default(false),
    enableConsentManagement: z.boolean().default(false),
    enableRightToBeForgotten: z.boolean().default(false),
    dataRetentionPeriod: z.number().default(7 * 365 * 24 * 60 * 60 * 1000), // 7 years
  }),

  // Threat Detection
  threatDetection: z.object({
    enabled: z.boolean().default(false),
    enableAnomalyDetection: z.boolean().default(false),
    enableBehavioralAnalysis: z.boolean().default(false),
    enableGeolocationTracking: z.boolean().default(false),
    enableDeviceFingerprinting: z.boolean().default(false),
    enableIPReputation: z.boolean().default(false),
    threatIntelligenceFeeds: z.array(z.string()).default([]),
  }),
});

export type SecurityConfig = z.infer<typeof securityConfigSchema>;

/**
 * Default security configuration
 */
export const defaultSecurityConfig: SecurityConfig = {
  cors: {
    enabled: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: [],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: 'ip',
    enableRedis: false,
  },
  csrf: {
    enabled: true,
    secret: 'csrf-secret-key',
    cookieName: '_csrf',
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignorePaths: [],
  },
  securityHeaders: {
    enabled: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
    enableDynamicHeaders: false,
  },
  inputValidation: {
    enabled: true,
    enableXSSProtection: true,
    enableSQLInjectionProtection: true,
    enableNoSQLInjectionProtection: true,
    enableCommandInjectionProtection: true,
    maxInputLength: 10000,
    enableInputSanitization: true,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
    maxFileSize: 10 * 1024 * 1024,
  },
  sessionSecurity: {
    enabled: true,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
    rolling: true,
    regenerateOnLogin: true,
    enableSessionFixation: true,
  },
  encryption: {
    enabled: true,
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    enableDataEncryption: false,
    enableFieldEncryption: false,
  },
  apiSecurity: {
    enabled: true,
    enableAPIKeyAuth: false,
    enableBearerTokenAuth: true,
    enableBasicAuth: false,
    enableOAuth2: false,
    apiKeyHeader: 'X-API-Key',
    bearerTokenHeader: 'Authorization',
    enableRequestSigning: false,
    enableResponseSigning: false,
  },
  auditLogging: {
    enabled: true,
    enableSecurityEvents: true,
    enableAccessLogging: true,
    enableDataChanges: false,
    enableFailedAttempts: true,
    logRetentionDays: 90,
    enableRealTimeAlerts: true,
    alertThresholds: {
      failedLogins: 5,
      suspiciousActivity: 10,
      dataAccess: 100,
    },
  },
  vulnerabilityScanning: {
    enabled: false,
    enableDependencyScanning: false,
    enableCodeScanning: false,
    enableContainerScanning: false,
    scanSchedule: '0 2 * * *',
    enableAutomatedFixes: false,
    enableSecurityReports: true,
  },
  compliance: {
    enabled: false,
    standards: [],
    enableDataRetention: false,
    enableDataAnonymization: false,
    enableConsentManagement: false,
    enableRightToBeForgotten: false,
    dataRetentionPeriod: 7 * 365 * 24 * 60 * 60 * 1000,
  },
  threatDetection: {
    enabled: false,
    enableAnomalyDetection: false,
    enableBehavioralAnalysis: false,
    enableGeolocationTracking: false,
    enableDeviceFingerprinting: false,
    enableIPReputation: false,
    threatIntelligenceFeeds: [],
  },
};

