import { 
  loadAllConfigs, 
  loadFeatureConfig, 
  getEnvironment, 
  isDevelopment, 
  isProduction, 
  isTest
} from './loader';
import type { FeatureConfigs, FeatureName } from './features';

/**
 * Configuration utilities and helper functions
 */

// Configuration instance
let configInstance: FeatureConfigs | null = null;

/**
 * Initialize configuration instance
 */
export const initializeConfigInstance = (overrides: Partial<FeatureConfigs> = {}): FeatureConfigs => {
  configInstance = loadAllConfigs(overrides);
  return configInstance;
};

/**
 * Get configuration instance
 */
export const getConfig = (): FeatureConfigs => {
  if (!configInstance) {
    configInstance = initializeConfigInstance();
  }
  return configInstance;
};

/**
 * Get feature configuration
 */
export const getFeatureConfig = <T extends FeatureName>(featureName: T): FeatureConfigs[T] => {
  const config = getConfig();
  return config[featureName];
};

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (featureName: FeatureName): boolean => {
  const config = getFeatureConfig(featureName);
  
  if ('enabled' in config && typeof config.enabled === 'boolean') {
    return config.enabled;
  }
  
  return true;
};

/**
 * Get environment-specific configuration value
 */
export const getEnvConfig = <T>(key: string, defaultValue: T): T => {
  const env = getEnvironment();
  const envKey = `${env.toUpperCase()}_${key}`;
  return (process.env[envKey] as T) || defaultValue;
};

/**
 * Get configuration value with fallback
 */
export const getConfigValue = <T>(
  path: string, 
  defaultValue: T, 
  config?: Partial<FeatureConfigs>
): T => {
  const targetConfig = config || getConfig();
  const keys = path.split('.');
  let current: any = targetConfig;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current !== undefined ? current : defaultValue;
};

/**
 * Feature flag utilities
 */
export const getFeatureFlag = (flagName: string, defaultValue: boolean = false): boolean => {
  const featureFlags = getFeatureConfig('featureFlags');
  
  if (featureFlags.defaultFlags[flagName]) {
    return featureFlags.defaultFlags[flagName].enabled;
  }
  
  // Check environment variable override
  const envKey = `FEATURE_${flagName.toUpperCase()}`;
  const envValue = process.env[envKey];
  
  if (envValue !== undefined) {
    return envValue.toLowerCase() === 'true';
  }
  
  return defaultValue;
};

export const setFeatureFlag = (flagName: string, enabled: boolean): void => {
  const featureFlags = getFeatureConfig('featureFlags');
  if (featureFlags.defaultFlags[flagName]) {
    featureFlags.defaultFlags[flagName].enabled = enabled;
  }
};

export const getAllFeatureFlags = (): Record<string, boolean> => {
  const featureFlags = getFeatureConfig('featureFlags');
  const flags: Record<string, boolean> = {};
  
  for (const [flagName, flagConfig] of Object.entries(featureFlags.defaultFlags)) {
    flags[flagName] = (flagConfig as any).enabled;
  }
  
  return flags;
};

/**
 * Database configuration utilities
 */
export const getDatabaseConfig = () => {
  return getFeatureConfig('database');
};

export const getDatabaseUrl = (): string => {
  const dbConfig = getDatabaseConfig();
  const { host, port, database, username, password, ssl } = dbConfig.connection;
  
  const protocol = ssl ? 'postgresql' : 'postgresql';
  const sslParam = ssl ? '?sslmode=require' : '';
  
  return `${protocol}://${username}:${password}@${host}:${port}/${database}${sslParam}`;
};

export const isDatabaseSSLEnabled = (): boolean => {
  const dbConfig = getDatabaseConfig();
  return dbConfig.connection.ssl;
};

/**
 * API configuration utilities
 */
export const getApiConfig = () => {
  return getFeatureConfig('api');
};

export const getPegaDxConfig = () => {
  const apiConfig = getApiConfig();
  return apiConfig.pegaDx;
};

export const getApiBaseUrl = (): string => {
  const pegaConfig = getPegaDxConfig();
  return `${pegaConfig.baseUrl}/api/${pegaConfig.apiVersion}`;
};

export const getApiTimeout = (): number => {
  const pegaConfig = getPegaDxConfig();
  return pegaConfig.timeout;
};

/**
 * Authentication configuration utilities
 */
export const getAuthConfig = () => {
  return getFeatureConfig('auth');
};

export const getJWTConfig = () => {
  const authConfig = getAuthConfig();
  return authConfig.jwt;
};

export const getSessionConfig = () => {
  const authConfig = getAuthConfig();
  return authConfig.session;
};

export const isJWTEnabled = (): boolean => {
  const jwtConfig = getJWTConfig();
  return !!jwtConfig.secret;
};

export const getJWTSecret = (): string => {
  const jwtConfig = getJWTConfig();
  return jwtConfig.secret;
};

/**
 * Security configuration utilities
 */
export const getSecurityConfig = () => {
  return getFeatureConfig('security');
};

export const getCORSConfig = () => {
  const securityConfig = getSecurityConfig();
  return securityConfig.cors;
};

export const getSecurityHeaders = () => {
  const securityConfig = getSecurityConfig();
  return securityConfig.securityHeaders.headers;
};

export const isCORSEnabled = (): boolean => {
  const corsConfig = getCORSConfig();
  return corsConfig.enabled;
};

export const getCORSOrigins = (): string[] => {
  const corsConfig = getCORSConfig();
  if (Array.isArray(corsConfig.origin)) {
    return corsConfig.origin;
  }
  return corsConfig.origin === true ? ['*'] : [corsConfig.origin as string];
};

/**
 * File configuration utilities
 */
export const getFilesConfig = () => {
  return getFeatureConfig('files');
};

export const getUploadConfig = () => {
  const filesConfig = getFilesConfig();
  return filesConfig.upload;
};

export const getStorageConfig = () => {
  const filesConfig = getFilesConfig();
  return filesConfig.storage;
};

export const getMaxFileSize = (): number => {
  const uploadConfig = getUploadConfig();
  return uploadConfig.maxFileSize;
};

export const getAllowedFileTypes = (): string[] => {
  const uploadConfig = getUploadConfig();
  return uploadConfig.allowedMimeTypes;
};

export const isFileUploadEnabled = (): boolean => {
  const uploadConfig = getUploadConfig();
  return uploadConfig.enabled;
};

/**
 * Notification configuration utilities
 */
export const getNotificationsConfig = () => {
  return getFeatureConfig('notifications');
};

export const getEmailConfig = () => {
  const notificationsConfig = getNotificationsConfig();
  return notificationsConfig.email;
};

export const getSMSConfig = () => {
  const notificationsConfig = getNotificationsConfig();
  return notificationsConfig.sms;
};

export const isEmailEnabled = (): boolean => {
  const emailConfig = getEmailConfig();
  return emailConfig.enabled;
};

export const isSMSEnabled = (): boolean => {
  const smsConfig = getSMSConfig();
  return smsConfig.enabled;
};

export const getSMTPConfig = () => {
  const emailConfig = getEmailConfig();
  return emailConfig.smtp;
};

/**
 * UI configuration utilities
 */
export const getUIConfig = () => {
  return getFeatureConfig('ui');
};

export const getThemeConfig = () => {
  const uiConfig = getUIConfig();
  return uiConfig.theme;
};

export const getDesignSystemConfig = () => {
  const uiConfig = getUIConfig();
  return uiConfig.designSystem;
};

export const getDefaultTheme = (): string => {
  const themeConfig = getThemeConfig();
  return themeConfig.defaultTheme;
};

export const isThemeSwitchingEnabled = (): boolean => {
  const themeConfig = getThemeConfig();
  return themeConfig.enableThemeSwitching;
};

/**
 * Monitoring configuration utilities
 */
export const getMonitoringConfig = () => {
  return getFeatureConfig('monitoring');
};

export const getLoggingConfig = () => {
  const monitoringConfig = getMonitoringConfig();
  return monitoringConfig.logging;
};

export const getPerformanceConfig = () => {
  const monitoringConfig = getMonitoringConfig();
  return monitoringConfig.performance;
};

export const isLoggingEnabled = (): boolean => {
  const loggingConfig = getLoggingConfig();
  return loggingConfig.enabled;
};

export const getLogLevel = (): string => {
  const loggingConfig = getLoggingConfig();
  return loggingConfig.level;
};

/**
 * Development tools configuration utilities
 */
export const getDevToolsConfig = () => {
  return getFeatureConfig('devTools');
};

export const getHotReloadConfig = () => {
  const devToolsConfig = getDevToolsConfig();
  return devToolsConfig.hotReload;
};

export const getDebuggingConfig = () => {
  const devToolsConfig = getDevToolsConfig();
  return devToolsConfig.debugging;
};

export const isHotReloadEnabled = (): boolean => {
  const hotReloadConfig = getHotReloadConfig();
  return hotReloadConfig.enabled && isDevelopment();
};

export const isDebuggingEnabled = (): boolean => {
  const debuggingConfig = getDebuggingConfig();
  return debuggingConfig.enabled && isDevelopment();
};

/**
 * Environment utilities
 */
export const getCurrentEnvironment = (): string => {
  return getEnvironment();
};

export const isDevelopmentEnvironment = (): boolean => {
  return isDevelopment();
};

export const isProductionEnvironment = (): boolean => {
  return isProduction();
};

export const isTestEnvironment = (): boolean => {
  return isTest();
};

/**
 * Configuration validation utilities
 */
export const validateCurrentConfig = (): boolean => {
  try {
    const config = getConfig();
    // Basic validation - check if all required configs are present
    return !!(
      config.auth?.jwt?.secret &&
      config.database?.connection?.host &&
      config.api?.pegaDx?.baseUrl
    );
  } catch (error) {
    console.error('Configuration validation failed:', error);
    return false;
  }
};

/**
 * Configuration debugging utilities
 */
export const debugConfig = (featureName?: FeatureName): void => {
  if (!isDevelopment()) {
    console.warn('Configuration debugging is only available in development mode');
    return;
  }
  
  if (featureName) {
    const config = getFeatureConfig(featureName);
    console.log(`Configuration for ${featureName}:`, config);
  } else {
    const config = getConfig();
    console.log('Full configuration:', config);
  }
};

export const getConfigSummary = (): Record<string, any> => {
  const config = getConfig();
  const summary: Record<string, any> = {};
  
  for (const [featureName, featureConfig] of Object.entries(config)) {
    summary[featureName] = {
      enabled: 'enabled' in featureConfig ? (featureConfig as any).enabled : true,
      keys: Object.keys(featureConfig as object).length,
    };
  }
  
  return summary;
};

/**
 * Configuration reload utilities
 */
export const reloadConfig = (overrides: Partial<FeatureConfigs> = {}): FeatureConfigs => {
  configInstance = loadAllConfigs(overrides);
  return configInstance;
};

export const updateFeatureConfig = <T extends FeatureName>(
  featureName: T, 
  updates: Partial<FeatureConfigs[T]>
): FeatureConfigs[T] => {
  const currentConfig = getConfig();
  const updatedFeatureConfig = { ...currentConfig[featureName], ...updates };
  
  configInstance = {
    ...currentConfig,
    [featureName]: updatedFeatureConfig,
  };
  
  return updatedFeatureConfig;
};

