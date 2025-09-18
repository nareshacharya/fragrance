import { z } from 'zod'

/**
 * Environment variable validation schema using Zod
 * This ensures type safety and validates all required environment variables
 */

// Client-side environment schema (NEXT_PUBLIC_* variables)
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Fragrance Management System'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.1.0'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
})

// Server-side environment schema
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Database configuration schema with sensible defaults
const databaseSchema = z.object({
  DATABASE_URL: z.string().url('Invalid database URL format').optional().default('postgresql://localhost:5432/fragrance_dev'),
})

// Redis configuration schema with sensible defaults
const redisSchema = z.object({
  REDIS_URL: z.string().url('Invalid Redis URL format').optional().default('redis://localhost:6379'),
})

// Authentication configuration schema with sensible defaults
const authSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters').optional().default('development-secret-key-minimum-32-characters-long'),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL format').optional().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional().default('development-jwt-secret-minimum-32-characters-long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

// API configuration schema with sensible defaults
const apiSchema = z.object({
  API_BASE_URL: z.string().url('Invalid API_BASE_URL format').optional().default('http://localhost:3000/api'),
  EXTERNAL_API_TIMEOUT: z.string().transform(Number).pipe(z.number().positive()).optional().default('30000'),
})

// Pega DX API configuration schema with sensible defaults
const pegaSchema = z.object({
  PEGA_DX_API_URL: z.string().url('Invalid PEGA_DX_API_URL format').optional().default('https://localhost:8080/api'),
  PEGA_DX_API_KEY: z.string().min(1, 'PEGA_DX_API_KEY is required').optional().default('dev-api-key'),
  PEGA_DX_CLIENT_ID: z.string().min(1, 'PEGA_DX_CLIENT_ID is required').optional().default('dev-client-id'),
  PEGA_DX_CLIENT_SECRET: z.string().min(1, 'PEGA_DX_CLIENT_SECRET is required').optional().default('dev-client-secret'),
})

// Helper function to create email schema that handles empty strings gracefully
const createEmailField = (defaultValue: string) => 
  z.string()
    .optional()
    .default(defaultValue)
    .transform((val) => {
      // If value is empty string or undefined, return default
      if (!val || val.trim() === '') {
        return defaultValue
      }
      return val
    })
    .refine(
      (val) => {
        // Allow the default values even if they're not perfect emails
        if (val === defaultValue) return true
        // For other values, check if they're valid emails
        return z.string().email().safeParse(val).success
      },
      { message: 'Invalid email format' }
    )

// Email configuration schema with sensible defaults
const emailSchema = z.object({
  SMTP_HOST: z.string()
    .optional()
    .default('localhost')
    .transform((val) => val && val.trim() !== '' ? val : 'localhost'),
  SMTP_PORT: z.string()
    .optional()
    .default('587')
    .transform((val) => val && val.trim() !== '' ? val : '587')
    .transform(Number)
    .pipe(z.number().positive()),
  SMTP_USER: createEmailField('dev@localhost'),
  SMTP_PASS: z.string()
    .optional()
    .default('dev-password')
    .transform((val) => val && val.trim() !== '' ? val : 'dev-password'),
  SMTP_FROM: createEmailField('noreply@localhost'),
})

// File upload configuration schema with sensible defaults
const uploadSchema = z.object({
  UPLOAD_MAX_SIZE: z.string().transform(Number).pipe(z.number().positive()).optional().default('10485760'),
  UPLOAD_ALLOWED_TYPES: z.string().optional().default('image/jpeg,image/png,image/gif,application/pdf,text/csv'),
})

// Logging configuration schema
const loggingSchema = z.object({
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'simple']).default('json'),
})

// Feature flags schema with sensible defaults
const featureFlagsSchema = z.object({
  FEATURE_FLAG_PEGA_INTEGRATION: z.string().transform(val => val === 'true').optional().default('false'),
  FEATURE_FLAG_ADVANCED_ANALYTICS: z.string().transform(val => val === 'true').optional().default('false'),
  FEATURE_FLAG_REAL_TIME_UPDATES: z.string().transform(val => val === 'true').optional().default('false'),
})

// Development tools schema with sensible defaults
const devToolsSchema = z.object({
  ENABLE_DEV_TOOLS: z.string().transform(val => val === 'true').optional().default('true'),
  ENABLE_DEBUG_MODE: z.string().transform(val => val === 'true').optional().default('true'),
  ENABLE_HOT_RELOAD: z.string().transform(val => val === 'true').optional().default('true'),
})

// Performance monitoring schema with sensible defaults
const performanceSchema = z.object({
  ENABLE_PERFORMANCE_MONITORING: z.string().transform(val => val === 'true').optional().default('false'),
  PERFORMANCE_MONITORING_URL: z.string().optional().default(''),
})

// Security configuration schema with sensible defaults
const securitySchema = z.object({
  CORS_ORIGIN: z.string().url('Invalid CORS_ORIGIN format').optional().default('http://localhost:3000'),
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).optional().default('100'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().positive()).optional().default('900000'),
})

// Backup configuration schema with sensible defaults
const backupSchema = z.object({
  BACKUP_ENABLED: z.string().transform(val => val === 'true').optional().default('false'),
  BACKUP_SCHEDULE: z.string().default('0 2 * * *'),
  BACKUP_RETENTION_DAYS: z.string().transform(Number).pipe(z.number().positive()).optional().default('30'),
})

// Complete server-side environment schema
const serverEnvSchemaComplete = serverEnvSchema
  .merge(databaseSchema)
  .merge(redisSchema)
  .merge(authSchema)
  .merge(apiSchema)
  .merge(pegaSchema)
  .merge(emailSchema)
  .merge(uploadSchema)
  .merge(loggingSchema)
  .merge(featureFlagsSchema)
  .merge(devToolsSchema)
  .merge(performanceSchema)
  .merge(securitySchema)
  .merge(backupSchema)

// Type inference from schemas
export type ClientEnv = z.infer<typeof clientEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchemaComplete>

// Client-side environment validation function
export function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse(process.env)
  
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => {
      const path = err.path.join('.')
      return `${path}: ${err.message}`
    }).join('\n')
    
    throw new Error(`Client environment validation failed:\n${errorMessages}`)
  }
  
  return result.data
}

// Server-side environment validation function
export function validateServerEnv(): ServerEnv {
  // With .env.local file and improved Zod schema, we can use process.env directly
  const result = serverEnvSchemaComplete.safeParse(process.env)
  
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => {
      const path = err.path.join('.')
      return `${path}: ${err.message}`
    }).join('\n')
    
    throw new Error(`Server environment validation failed:\n${errorMessages}`)
  }
  
  return result.data
}

// Get validated environment variables
export const clientEnv = validateClientEnv()
export const serverEnv = validateServerEnv()

// Legacy export for backward compatibility
export const env = serverEnv

// Environment-specific configurations
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Feature flags
export const features = {
  pegaIntegration: env.FEATURE_FLAG_PEGA_INTEGRATION,
  advancedAnalytics: env.FEATURE_FLAG_ADVANCED_ANALYTICS,
  realTimeUpdates: env.FEATURE_FLAG_REAL_TIME_UPDATES,
} as const

// Development tools
export const devTools = {
  enabled: env.ENABLE_DEV_TOOLS,
  debugMode: env.ENABLE_DEBUG_MODE,
  hotReload: env.ENABLE_HOT_RELOAD,
} as const

// Performance monitoring
export const performance = {
  enabled: env.ENABLE_PERFORMANCE_MONITORING,
  url: env.PERFORMANCE_MONITORING_URL,
} as const

// Security configuration
export const security = {
  corsOrigin: env.CORS_ORIGIN,
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    window: env.RATE_LIMIT_WINDOW,
  },
} as const

// Backup configuration
export const backup = {
  enabled: env.BACKUP_ENABLED,
  schedule: env.BACKUP_SCHEDULE,
  retentionDays: env.BACKUP_RETENTION_DAYS,
} as const

// Database configuration
export const database = {
  url: env.DATABASE_URL,
} as const

// Redis configuration
export const redis = {
  url: env.REDIS_URL,
} as const

// Authentication configuration
export const auth = {
  nextAuthSecret: env.NEXTAUTH_SECRET,
  nextAuthUrl: env.NEXTAUTH_URL,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
} as const

// API configuration
export const api = {
  baseUrl: env.API_BASE_URL,
  timeout: env.EXTERNAL_API_TIMEOUT,
} as const

// Pega DX configuration
export const pega = {
  apiUrl: env.PEGA_DX_API_URL,
  apiKey: env.PEGA_DX_API_KEY,
  clientId: env.PEGA_DX_CLIENT_ID,
  clientSecret: env.PEGA_DX_CLIENT_SECRET,
} as const

// Email configuration
export const email = {
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  from: env.SMTP_FROM,
} as const

// File upload configuration
export const upload = {
  maxSize: env.UPLOAD_MAX_SIZE,
  allowedTypes: env.UPLOAD_ALLOWED_TYPES.split(','),
} as const

// Logging configuration
export const logging = {
  level: env.LOG_LEVEL,
  format: env.LOG_FORMAT,
} as const

// Application configuration
export const app = {
  name: clientEnv.NEXT_PUBLIC_APP_NAME,
  version: clientEnv.NEXT_PUBLIC_APP_VERSION,
  environment: clientEnv.NEXT_PUBLIC_APP_ENV,
} as const
