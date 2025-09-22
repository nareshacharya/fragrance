/**
 * Main configuration index
 * 
 * This file provides a unified interface for accessing all configuration
 * features, utilities, and types. It serves as the main entry point for
 * the configuration system.
 */

// Import required functions
import { initializeConfig } from './loader';
import { validateAllConfigs } from './validation';
import type { FeatureConfigs } from './features/index';

// Core configuration modules - explicit exports only
// No wildcard exports to avoid duplicates

// Re-export commonly used types and utilities
export type {
  Environment,
  ValidationResult,
  ValidationError,
  ConfigLoadOptions,
  HealthCheckResult,
  FeatureFlag,
  ConfigChangeEvent,
  ConfigChangeListener,
} from './types';

// Re-export feature types from features module
export type {
  FeatureConfigs,
  FeatureName,
} from './features/index';

export {
  // Configuration loading
  loadAllConfigs,
  loadFeatureConfig,
  loadEnvironmentConfig,
  initializeConfig,
  
  // Environment utilities
  getEnvironment,
  isDevelopment,
  isProduction,
  isTest,
  
  // Configuration caching
  clearConfigCache,
  getConfigCacheInfo,
  isConfigCached,
  getCachedConfig,
  
  // Hot reload utilities
  enableHotReload,
  notifyConfigChange,
  addConfigChangeListener,
  removeConfigChangeListener,
  
  // Environment utilities
  getConfigForEnvironment,
  getAvailableEnvironments,
  
  // Configuration debugging
  debugConfig,
  compareConfigs,
  
  // Health check
  healthCheck,
} from './loader';

export {
  // Validation utilities
  validateAllConfigs,
  validateConfigWithDetails,
  validateForEnvironment,
  validateConfigSchema,
  createTestConfig,
  validateTestConfig,
  migrateConfig,
} from './validation';

export {
  // Configuration utilities
  getConfig,
  getConfigValue,
  getEnvConfig,
  getFeatureConfig,
  isFeatureEnabled,
  getFeatureFlag,
  setFeatureFlag,
  getAllFeatureFlags,
  
  // Database utilities
  getDatabaseConfig,
  getDatabaseUrl,
  isDatabaseSSLEnabled,
  
  // API utilities
  getApiConfig,
  getPegaDxConfig,
  getApiBaseUrl,
  getApiTimeout,
  
  // Authentication utilities
  getAuthConfig,
  getJWTConfig,
  getSessionConfig,
  isJWTEnabled,
  getJWTSecret,
  
  // Security utilities
  getSecurityConfig,
  getCORSConfig,
  getSecurityHeaders,
  isCORSEnabled,
  getCORSOrigins,
  
  // File utilities
  getFilesConfig,
  getUploadConfig,
  getStorageConfig,
  getMaxFileSize,
  getAllowedFileTypes,
  isFileUploadEnabled,
  
  // Notification utilities
  getNotificationsConfig,
  getEmailConfig,
  getSMSConfig,
  isEmailEnabled,
  isSMSEnabled,
  getSMTPConfig,
  
  // UI utilities
  getUIConfig,
  getThemeConfig,
  getDesignSystemConfig,
  getDefaultTheme,
  isThemeSwitchingEnabled,
  
  // Monitoring utilities
  getMonitoringConfig,
  getLoggingConfig,
  getPerformanceConfig,
  isLoggingEnabled,
  getLogLevel,
  
  // Development tools utilities
  getDevToolsConfig,
  getHotReloadConfig,
  getDebuggingConfig,
  isHotReloadEnabled,
  isDebuggingEnabled,
  
  // Environment utilities
  getCurrentEnvironment,
  isDevelopmentEnvironment,
  isProductionEnvironment,
  isTestEnvironment,
  
  // Configuration validation
  validateCurrentConfig,
  
  // Configuration debugging
  getConfigSummary,
  
  // Configuration reload
  reloadConfig,
  updateFeatureConfig,
} from './utils';

// Default configurations
export {
  defaultFeatureConfigs,
  featureConfigSchemas,
  featureNames,
  getFeatureConfig as getDefaultFeatureConfig,
  getAllFeatureConfigs,
  validateFeatureConfig,
  isFeatureEnabled as isDefaultFeatureEnabled,
  getEnabledFeatures,
  getDisabledFeatures,
} from './features/index';

// Configuration constants
export const CONFIG_VERSION = '1.0.0';
export const CONFIG_SCHEMA_VERSION = '1.0.0';

// Configuration metadata
export const CONFIG_METADATA = {
  version: CONFIG_VERSION,
  schemaVersion: CONFIG_SCHEMA_VERSION,
  features: [
    'auth',
    'api',
    'database',
    'ui',
    'ingredients',
    'caseManagement',
    'monitoring',
    'security',
    'files',
    'notifications',
    'featureFlags',
    'devTools',
  ],
  environments: [
    'development',
    'staging',
    'production',
    'test',
  ],
  supportedFormats: ['json', 'yaml', 'env'],
  lastUpdated: new Date().toISOString(),
} as const;

// Configuration initialization helper
export const createConfig = (options: {
  environment?: string;
  overrides?: Partial<FeatureConfigs>;
  enableHotReload?: boolean;
  enableCaching?: boolean;
  validateOnLoad?: boolean;
} = {}): FeatureConfigs => {
  const {
    environment = process.env.NODE_ENV || 'development',
    overrides = {},
    enableHotReload = environment === 'development',
    enableCaching = true,
    validateOnLoad = true,
  } = options;

  // Set environment if provided
  if (environment && environment !== process.env.NODE_ENV) {
    process.env.NODE_ENV = environment;
  }

  // Initialize configuration
  const config = initializeConfig({
    enableHotReload,
    enableCaching,
    cacheTTL: 300000, // 5 minutes
  });

  // Apply overrides
  const finalConfig = { ...config, ...overrides };

  // Validate if requested
  if (validateOnLoad) {
    try {
      validateAllConfigs(finalConfig);
    } catch (error) {
      console.warn('Configuration validation failed:', error);
    }
  }

  return finalConfig;
};

// Configuration factory
export const ConfigFactory = {
  create: createConfig,
  
  forEnvironment: (environment: string) => createConfig({ environment }),
  
  forDevelopment: () => createConfig({ environment: 'development' }),
  
  forProduction: () => createConfig({ environment: 'production' }),
  
  forTesting: () => createConfig({ environment: 'test' }),
  
  withOverrides: (overrides: Partial<FeatureConfigs>) => createConfig({ overrides }),
  
  withHotReload: () => createConfig({ enableHotReload: true }),
  
  withoutCaching: () => createConfig({ enableCaching: false }),
  
  withValidation: () => createConfig({ validateOnLoad: true }),
  
  withoutValidation: () => createConfig({ validateOnLoad: false }),
};

// Configuration presets
export const ConfigPresets = {
  development: () => createConfig({
    environment: 'development',
    enableHotReload: true,
    enableCaching: true,
    validateOnLoad: true,
  }),
  
  staging: () => createConfig({
    environment: 'staging',
    enableHotReload: false,
    enableCaching: true,
    validateOnLoad: true,
  }),
  
  production: () => createConfig({
    environment: 'production',
    enableHotReload: false,
    enableCaching: true,
    validateOnLoad: true,
  }),
  
  testing: () => createConfig({
    environment: 'test',
    enableHotReload: false,
    enableCaching: false,
    validateOnLoad: true,
  }),
  
  minimal: () => createConfig({
    enableHotReload: false,
    enableCaching: false,
    validateOnLoad: false,
  }),
  
  full: () => createConfig({
    enableHotReload: true,
    enableCaching: true,
    validateOnLoad: true,
  }),
};

// Export default configuration instance
export const config = createConfig();

// Export configuration utilities as default
export default {
  config,
  createConfig,
  ConfigFactory,
  ConfigPresets,
  ...config,
};

