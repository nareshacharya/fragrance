import { z } from 'zod';

/**
 * Authentication feature configuration schema
 */
export const authConfigSchema = z.object({
  // Session Management
  session: z.object({
    timeout: z.number().default(30 * 60 * 1000), // 30 minutes
    refreshThreshold: z.number().default(5 * 60 * 1000), // 5 minutes
    maxConcurrentSessions: z.number().default(3),
    secure: z.boolean().default(true),
    httpOnly: z.boolean().default(true),
    sameSite: z.enum(['strict', 'lax', 'none']).default('strict'),
  }),

  // JWT Configuration
  jwt: z.object({
    secret: z.string().min(32),
    algorithm: z.enum(['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512']).default('HS256'),
    expiresIn: z.string().default('1h'),
    refreshExpiresIn: z.string().default('7d'),
    issuer: z.string().default('fragrance-app'),
    audience: z.string().default('fragrance-users'),
  }),

  // OAuth2 Configuration
  oauth2: z.object({
    enabled: z.boolean().default(false),
    providers: z.record(z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      authorizationUrl: z.string().url(),
      tokenUrl: z.string().url(),
      userInfoUrl: z.string().url(),
      scope: z.array(z.string()).default([]),
    })).default({}),
  }),

  // Password Policy
  passwordPolicy: z.object({
    minLength: z.number().min(8).default(8),
    requireUppercase: z.boolean().default(true),
    requireLowercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
    maxAge: z.number().default(90 * 24 * 60 * 60 * 1000), // 90 days
    historyCount: z.number().default(5),
  }),

  // Account Security
  accountSecurity: z.object({
    maxLoginAttempts: z.number().default(5),
    lockoutDuration: z.number().default(15 * 60 * 1000), // 15 minutes
    requireEmailVerification: z.boolean().default(true),
    requirePhoneVerification: z.boolean().default(false),
    twoFactorEnabled: z.boolean().default(false),
    backupCodesCount: z.number().default(10),
  }),

  // Role-Based Access Control
  rbac: z.object({
    enabled: z.boolean().default(true),
    defaultRole: z.string().default('user'),
    roles: z.array(z.object({
      name: z.string(),
      permissions: z.array(z.string()),
      description: z.string().optional(),
    })).default([
      { name: 'admin', permissions: ['*'], description: 'Full system access' },
      { name: 'user', permissions: ['read:own', 'write:own'], description: 'Basic user access' },
      { name: 'viewer', permissions: ['read:own'], description: 'Read-only access' },
    ]),
  }),

  // Security Headers
  securityHeaders: z.object({
    'X-Content-Type-Options': z.string().default('nosniff'),
    'X-Frame-Options': z.string().default('DENY'),
    'X-XSS-Protection': z.string().default('1; mode=block'),
    'Strict-Transport-Security': z.string().default('max-age=31536000; includeSubDomains'),
    'Content-Security-Policy': z.string().default("default-src 'self'"),
  }),

  // Rate Limiting
  rateLimiting: z.object({
    enabled: z.boolean().default(true),
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.number().default(100),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false),
  }),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

/**
 * Default authentication configuration
 */
export const defaultAuthConfig: AuthConfig = {
  session: {
    timeout: 30 * 60 * 1000,
    refreshThreshold: 5 * 60 * 1000,
    maxConcurrentSessions: 3,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    algorithm: 'HS256',
    expiresIn: '1h',
    refreshExpiresIn: '7d',
    issuer: 'fragrance-app',
    audience: 'fragrance-users',
  },
  oauth2: {
    enabled: false,
    providers: {},
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000,
    historyCount: 5,
  },
  accountSecurity: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorEnabled: false,
    backupCodesCount: 10,
  },
  rbac: {
    enabled: true,
    defaultRole: 'user',
    roles: [
      { name: 'admin', permissions: ['*'], description: 'Full system access' },
      { name: 'user', permissions: ['read:own', 'write:own'], description: 'Basic user access' },
      { name: 'viewer', permissions: ['read:own'], description: 'Read-only access' },
    ],
  },
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
};

// Export default configuration
export default defaultAuthConfig;

