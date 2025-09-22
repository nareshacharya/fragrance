import { z } from 'zod';
import { 
  featureConfigSchemas, 
  type FeatureConfigs, 
  type FeatureName,
  validateFeatureConfig 
} from './features/index';

/**
 * Configuration validation utilities
 */

// Validation error types
export interface ValidationError {
  path: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Enhanced validation with detailed error reporting
 */
export const validateConfigWithDetails = <T extends FeatureName>(
  featureName: T,
  config: unknown
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  
  try {
    const schema = featureConfigSchemas[featureName];
    schema.parse(config);
    
    // Additional custom validations
    const customValidationResult = runCustomValidations(featureName, config);
    errors.push(...customValidationResult.errors);
    warnings.push(...customValidationResult.warnings);
    
    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(zodError => {
        errors.push({
          path: zodError.path.join('.'),
          message: zodError.message,
          code: zodError.code,
          value: (zodError as any).input || config,
        });
      });
    } else {
      errors.push({
        path: 'root',
        message: error.message || 'Unknown validation error',
        code: 'UNKNOWN_ERROR',
        value: config,
      });
    }
    
    return {
      success: false,
      errors,
      warnings,
    };
  }
};

/**
 * Custom validation rules for specific features
 */
const runCustomValidations = (featureName: FeatureName, config: any): { errors: ValidationError[]; warnings: string[] } => {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  
  switch (featureName) {
    case 'auth':
      validateAuthConfig(config, errors, warnings);
      break;
    case 'api':
      validateApiConfig(config, errors, warnings);
      break;
    case 'database':
      validateDatabaseConfig(config, errors, warnings);
      break;
    case 'security':
      validateSecurityConfig(config, errors, warnings);
      break;
    case 'files':
      validateFilesConfig(config, errors, warnings);
      break;
    case 'notifications':
      validateNotificationsConfig(config, errors, warnings);
      break;
  }
  
  return { errors, warnings };
};

/**
 * Auth configuration validation
 */
const validateAuthConfig = (config: any, errors: ValidationError[], warnings: string[]): void => {
  // Check JWT secret strength
  if (config.jwt?.secret && config.jwt.secret.length < 32) {
    errors.push({
      path: 'jwt.secret',
      message: 'JWT secret should be at least 32 characters long',
      code: 'WEAK_SECRET',
      value: config.jwt.secret,
    });
  }
  
  // Check password policy consistency
  if (config.passwordPolicy) {
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = config.passwordPolicy;
    
    if (minLength < 8) {
      warnings.push('Password minimum length is less than 8 characters');
    }
    
    if (!requireUppercase || !requireLowercase || !requireNumbers || !requireSpecialChars) {
      warnings.push('Some password complexity requirements are disabled');
    }
  }
  
  // Check session timeout
  if (config.session?.timeout && config.session.timeout < 300000) { // 5 minutes
    warnings.push('Session timeout is very short (less than 5 minutes)');
  }
};

/**
 * API configuration validation
 */
const validateApiConfig = (config: any, errors: ValidationError[], warnings: string[]): void => {
  // Check timeout values
  if (config.pegaDx?.timeout && config.pegaDx.timeout < 5000) {
    warnings.push('Pega DX timeout is very short (less than 5 seconds)');
  }
  
  if (config.httpClient?.timeout && config.httpClient.timeout < 5000) {
    warnings.push('HTTP client timeout is very short (less than 5 seconds)');
  }
  
  // Check retry configuration
  if (config.pegaDx?.retries && config.pegaDx.retries > 5) {
    warnings.push('High number of retries configured for Pega DX');
  }
  
  // Check rate limiting
  if (config.rateLimiting?.maxRequests && config.rateLimiting.maxRequests > 10000) {
    warnings.push('Very high rate limit configured');
  }
};

/**
 * Database configuration validation
 */
const validateDatabaseConfig = (config: any, errors: ValidationError[], warnings: string[]): void => {
  // Check connection pool settings
  if (config.pooling?.maxPoolSize && config.pooling.maxPoolSize > 100) {
    warnings.push('Very high database connection pool size');
  }
  
  if (config.pooling?.minPoolSize && config.pooling.minPoolSize > config.pooling.maxPoolSize) {
    errors.push({
      path: 'pooling.minPoolSize',
      message: 'Minimum pool size cannot be greater than maximum pool size',
      code: 'INVALID_POOL_SIZE',
      value: config.pooling.minPoolSize,
    });
  }
  
  // Check timeout values
  if (config.connection?.connectionTimeout && config.connection.connectionTimeout < 5000) {
    warnings.push('Database connection timeout is very short');
  }
  
  // Check SSL configuration for production
  if (process.env.NODE_ENV === 'production' && !config.connection?.ssl) {
    warnings.push('SSL is disabled for database connection in production');
  }
};

/**
 * Security configuration validation
 */
const validateSecurityConfig = (config: any, errors: ValidationError[], warnings: string[]): void => {
  // Check CORS configuration
  if (config.cors?.origin === true && process.env.NODE_ENV === 'production') {
    warnings.push('CORS is set to allow all origins in production');
  }
  
  // Check security headers
  if (!config.securityHeaders?.enabled && process.env.NODE_ENV === 'production') {
    warnings.push('Security headers are disabled in production');
  }
  
  // Check rate limiting
  if (config.rateLimiting?.maxRequests && config.rateLimiting.maxRequests > 1000) {
    warnings.push('High rate limit configured');
  }
  
  // Check CSRF configuration
  if (!config.csrf?.enabled && process.env.NODE_ENV === 'production') {
    warnings.push('CSRF protection is disabled in production');
  }
};

/**
 * Files configuration validation
 */
const validateFilesConfig = (config: any, errors: ValidationError[], warnings: string[]): void => {
  // Check file size limits
  if (config.upload?.maxFileSize && config.upload.maxFileSize > 100 * 1024 * 1024) { // 100MB
    warnings.push('Very large file size limit configured');
  }
  
  // Check allowed file types
  if (config.upload?.allowedMimeTypes && config.upload.allowedMimeTypes.length === 0) {
    errors.push({
      path: 'upload.allowedMimeTypes',
      message: 'No allowed MIME types configured',
      code: 'NO_ALLOWED_TYPES',
      value: config.upload.allowedMimeTypes,
    });
  }
  
  // Check storage configuration
  if (config.storage?.provider === 'local' && process.env.NODE_ENV === 'production') {
    warnings.push('Using local file storage in production');
  }
};

/**
 * Notifications configuration validation
 */
const validateNotificationsConfig = (config: any, errors: ValidationError[], warnings: string[]): void => {
  // Check email configuration
  if (config.email?.enabled && !config.email.smtp?.host && !config.email.sendgrid?.apiKey) {
    errors.push({
      path: 'email',
      message: 'Email is enabled but no SMTP host or SendGrid API key configured',
      code: 'MISSING_EMAIL_CONFIG',
      value: config.email,
    });
  }
  
  // Check rate limits
  if (config.email?.rateLimit && config.email.rateLimit > 1000) {
    warnings.push('Very high email rate limit configured');
  }
  
  if (config.sms?.rateLimit && config.sms.rateLimit > 100) {
    warnings.push('Very high SMS rate limit configured');
  }
};

/**
 * Validate all configurations
 */
export const validateAllConfigs = (configs: Partial<FeatureConfigs>): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: string[] = [];
  
  // Validate each feature configuration
  for (const [featureName, config] of Object.entries(configs)) {
    const result = validateConfigWithDetails(featureName as FeatureName, config);
    allErrors.push(...result.errors.map(error => ({
      ...error,
      path: `${featureName}.${error.path}`,
    })));
    allWarnings.push(...result.warnings.map(warning => `${featureName}: ${warning}`));
  }
  
  // Cross-feature validation
  const crossValidationResult = validateCrossFeatureDependencies(configs);
  allErrors.push(...crossValidationResult.errors);
  allWarnings.push(...crossValidationResult.warnings);
  
  return {
    success: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

/**
 * Validate dependencies between features
 */
const validateCrossFeatureDependencies = (configs: Partial<FeatureConfigs>): { errors: ValidationError[]; warnings: string[] } => {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  
  // Check if notifications are enabled but no providers configured
  if (configs.notifications?.email?.enabled && !configs.notifications.email.smtp?.host && !configs.notifications.email.sendgrid?.apiKey) {
    warnings.push('Email notifications enabled but no email provider configured');
  }
  
  // Check if file uploads are enabled but no storage configured
  if (configs.files?.upload?.enabled && configs.files.storage?.provider === 'local' && process.env.NODE_ENV === 'production') {
    warnings.push('File uploads enabled with local storage in production');
  }
  
  // Check if monitoring is enabled but no external services configured
  if (configs.monitoring?.externalServices?.enableSentry && !process.env.SENTRY_DSN) {
    warnings.push('Sentry monitoring enabled but no Sentry DSN configured');
  }
  
  return { errors, warnings };
};

/**
 * Configuration schema validation
 */
export const validateConfigSchema = (schema: z.ZodSchema, config: unknown): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  
  try {
    schema.parse(config);
    return { success: true, errors, warnings };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(zodError => {
        errors.push({
          path: zodError.path.join('.'),
          message: zodError.message,
          code: zodError.code,
          value: (zodError as any).input || config,
        });
      });
    }
    
    return { success: false, errors, warnings };
  }
};

/**
 * Environment-specific validation
 */
export const validateForEnvironment = (configs: Partial<FeatureConfigs>, environment: string): ValidationResult => {
  const result = validateAllConfigs(configs);
  const environmentWarnings: string[] = [];
  const environmentErrors: ValidationError[] = [];
  
  // Environment-specific checks
  if (environment === 'production') {
    // Production-specific validations - treat as errors
    if (configs.auth?.jwt?.secret === 'your-super-secret-jwt-key-change-in-production') {
      environmentErrors.push({
        path: 'auth.jwt.secret',
        message: 'Default JWT secret detected in production environment',
        code: 'DEFAULT_SECRET_IN_PRODUCTION',
        value: 'your-super-secret-jwt-key-change-in-production',
      });
    }
    
    if (configs.auth?.jwt?.secret === 'production-jwt-secret-must-be-changed') {
      environmentErrors.push({
        path: 'auth.jwt.secret',
        message: 'Placeholder JWT secret detected in production environment',
        code: 'PLACEHOLDER_SECRET_IN_PRODUCTION',
        value: 'production-jwt-secret-must-be-changed',
      });
    }
    
    if (configs.database?.connection?.ssl === false) {
      environmentErrors.push({
        path: 'database.connection.ssl',
        message: 'SSL is disabled for database connection in production',
        code: 'SSL_DISABLED_IN_PRODUCTION',
        value: false,
      });
    }
    
    if (configs.security?.cors?.origin === true) {
      environmentErrors.push({
        path: 'security.cors.origin',
        message: 'CORS allows all origins in production environment',
        code: 'CORS_ALL_ORIGINS_IN_PRODUCTION',
        value: true,
      });
    }
    
    // Check for insecure database credentials
    if (configs.database?.connection?.password === 'password') {
      environmentErrors.push({
        path: 'database.connection.password',
        message: 'Default database password detected in production',
        code: 'DEFAULT_DB_PASSWORD_IN_PRODUCTION',
        value: 'password',
      });
    }
    
    if (configs.database?.connection?.password === 'production-password') {
      environmentErrors.push({
        path: 'database.connection.password',
        message: 'Placeholder database password detected in production',
        code: 'PLACEHOLDER_DB_PASSWORD_IN_PRODUCTION',
        value: 'production-password',
      });
    }
  }
  
  return {
    success: result.success && environmentErrors.length === 0,
    errors: [...result.errors, ...environmentErrors],
    warnings: [...result.warnings, ...environmentWarnings],
  };
};

/**
 * Configuration testing utilities
 */
export const createTestConfig = (featureName: FeatureName, overrides: any = {}): any => {
  const defaultConfig = require(`./features/${featureName}`).default;
  return { ...defaultConfig, ...overrides };
};

export const validateTestConfig = (featureName: FeatureName, config: any): ValidationResult => {
  return validateConfigWithDetails(featureName, config);
};

/**
 * Configuration migration utilities
 */
export const migrateConfig = (oldConfig: any, newConfig: any): { migrated: any; warnings: string[] } => {
  const warnings: string[] = [];
  const migrated = { ...newConfig };
  
  // Migration logic for specific fields
  if (oldConfig.auth?.sessionTimeout && !migrated.auth?.session?.timeout) {
    migrated.auth.session.timeout = oldConfig.auth.sessionTimeout;
    warnings.push('Migrated sessionTimeout to auth.session.timeout');
  }
  
  if (oldConfig.api?.timeout && !migrated.api?.pegaDx?.timeout) {
    migrated.api.pegaDx.timeout = oldConfig.api.timeout;
    warnings.push('Migrated api.timeout to api.pegaDx.timeout');
  }
  
  return { migrated, warnings };
};

