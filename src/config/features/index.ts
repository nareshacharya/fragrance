/**
 * Feature configuration modules index
 * 
 * This file exports all feature configuration modules and provides
 * a unified interface for accessing feature-specific settings.
 */

// Import feature configuration modules
import { authConfigSchema, defaultAuthConfig, type AuthConfig } from './auth';
import { apiConfigSchema, defaultApiConfig, type ApiConfig } from './api';
import { databaseConfigSchema, defaultDatabaseConfig, type DatabaseConfig } from './database';
import { uiConfigSchema, defaultUiConfig, type UiConfig } from './ui';
import { ingredientsConfigSchema, defaultIngredientsConfig, type IngredientsConfig } from './ingredients';
import { caseManagementConfigSchema, defaultCaseManagementConfig, type CaseManagementConfig } from './case-management';
import { monitoringConfigSchema, defaultMonitoringConfig, type MonitoringConfig } from './monitoring';
import { securityConfigSchema, defaultSecurityConfig, type SecurityConfig } from './security';
import { filesConfigSchema, defaultFilesConfig, type FilesConfig } from './files';
import { notificationsConfigSchema, defaultNotificationsConfig, type NotificationsConfig } from './notifications';
import { featureFlagsConfigSchema, defaultFeatureFlagsConfig, type FeatureFlagsConfig } from './feature-flags';
import { devToolsConfigSchema, defaultDevToolsConfig, type DevToolsConfig } from './dev-tools';

// Re-export individual modules
export { authConfigSchema, defaultAuthConfig, type AuthConfig } from './auth';
export { apiConfigSchema, defaultApiConfig, type ApiConfig } from './api';
export { databaseConfigSchema, defaultDatabaseConfig, type DatabaseConfig } from './database';
export { uiConfigSchema, defaultUiConfig, type UiConfig } from './ui';
export { ingredientsConfigSchema, defaultIngredientsConfig, type IngredientsConfig } from './ingredients';
export { caseManagementConfigSchema, defaultCaseManagementConfig, type CaseManagementConfig } from './case-management';
export { monitoringConfigSchema, defaultMonitoringConfig, type MonitoringConfig } from './monitoring';
export { securityConfigSchema, defaultSecurityConfig, type SecurityConfig } from './security';
export { filesConfigSchema, defaultFilesConfig, type FilesConfig } from './files';
export { notificationsConfigSchema, defaultNotificationsConfig, type NotificationsConfig } from './notifications';
export { featureFlagsConfigSchema, defaultFeatureFlagsConfig, type FeatureFlagsConfig } from './feature-flags';
export { devToolsConfigSchema, defaultDevToolsConfig, type DevToolsConfig } from './dev-tools';

// Feature configuration schemas
export const featureConfigSchemas = {
  auth: authConfigSchema,
  api: apiConfigSchema,
  database: databaseConfigSchema,
  ui: uiConfigSchema,
  ingredients: ingredientsConfigSchema,
  caseManagement: caseManagementConfigSchema,
  monitoring: monitoringConfigSchema,
  security: securityConfigSchema,
  files: filesConfigSchema,
  notifications: notificationsConfigSchema,
  featureFlags: featureFlagsConfigSchema,
  devTools: devToolsConfigSchema,
} as const;

// Default feature configurations
export const defaultFeatureConfigs = {
  auth: defaultAuthConfig,
  api: defaultApiConfig,
  database: defaultDatabaseConfig,
  ui: defaultUiConfig,
  ingredients: defaultIngredientsConfig,
  caseManagement: defaultCaseManagementConfig,
  monitoring: defaultMonitoringConfig,
  security: defaultSecurityConfig,
  files: defaultFilesConfig,
  notifications: defaultNotificationsConfig,
  featureFlags: defaultFeatureFlagsConfig,
  devTools: defaultDevToolsConfig,
} as const;

// Feature configuration types
export type FeatureConfigs = {
  auth: AuthConfig;
  api: ApiConfig;
  database: DatabaseConfig;
  ui: UiConfig;
  ingredients: IngredientsConfig;
  caseManagement: CaseManagementConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
  files: FilesConfig;
  notifications: NotificationsConfig;
  featureFlags: FeatureFlagsConfig;
  devTools: DevToolsConfig;
};

// Feature names
export const featureNames = [
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
] as const;

export type FeatureName = typeof featureNames[number];

// Feature configuration utilities
export const getFeatureConfig = <T extends FeatureName>(
  featureName: T,
  configs: Partial<FeatureConfigs>
): FeatureConfigs[T] => {
  return (configs[featureName] as FeatureConfigs[T]) || defaultFeatureConfigs[featureName];
};

export const getAllFeatureConfigs = (configs: Partial<FeatureConfigs> = {}): FeatureConfigs => {
  return {
    auth: getFeatureConfig('auth', configs),
    api: getFeatureConfig('api', configs),
    database: getFeatureConfig('database', configs),
    ui: getFeatureConfig('ui', configs),
    ingredients: getFeatureConfig('ingredients', configs),
    caseManagement: getFeatureConfig('caseManagement', configs),
    monitoring: getFeatureConfig('monitoring', configs),
    security: getFeatureConfig('security', configs),
    files: getFeatureConfig('files', configs),
    notifications: getFeatureConfig('notifications', configs),
    featureFlags: getFeatureConfig('featureFlags', configs),
    devTools: getFeatureConfig('devTools', configs),
  };
};

export const validateFeatureConfig = <T extends FeatureName>(
  featureName: T,
  config: unknown
): FeatureConfigs[T] => {
  const schema = featureConfigSchemas[featureName];
  return schema.parse(config) as FeatureConfigs[T];
};

export const isFeatureEnabled = (featureName: FeatureName, configs: Partial<FeatureConfigs>): boolean => {
  const config = getFeatureConfig(featureName, configs);
  
  // Check if the feature has an 'enabled' property
  if ('enabled' in config && typeof config.enabled === 'boolean') {
    return config.enabled;
  }
  
  // Default to enabled if no explicit enabled flag
  return true;
};

export const getEnabledFeatures = (configs: Partial<FeatureConfigs>): FeatureName[] => {
  return featureNames.filter(featureName => isFeatureEnabled(featureName, configs));
};

export const getDisabledFeatures = (configs: Partial<FeatureConfigs>): FeatureName[] => {
  return featureNames.filter(featureName => !isFeatureEnabled(featureName, configs));
};

