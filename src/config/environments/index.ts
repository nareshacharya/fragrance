/**
 * Environment configuration index
 * 
 * This file exports environment-specific configurations and provides
 * environment detection utilities.
 */

import developmentConfig from './development';
import stagingConfig from './staging';
import productionConfig from './production';
import testConfig from './test';

// Environment configurations
export const environmentConfigs = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
  test: testConfig,
} as const;

// Environment types
export type Environment = keyof typeof environmentConfigs;

// Available environments
export const availableEnvironments: Environment[] = [
  'development',
  'staging',
  'production',
  'test',
];

/**
 * Get environment configuration
 */
export const getEnvironmentConfig = (environment: Environment) => {
  return environmentConfigs[environment];
};

/**
 * Get current environment configuration
 */
export const getCurrentEnvironmentConfig = () => {
  const environment = getCurrentEnvironment();
  return getEnvironmentConfig(environment);
};

/**
 * Get current environment
 */
export const getCurrentEnvironment = (): Environment => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env in environmentConfigs) {
    return env as Environment;
  }
  
  // Default to development if environment is not recognized
  console.warn(`Unknown environment: ${env}. Defaulting to development.`);
  return 'development';
};

/**
 * Check if environment is development
 */
export const isDevelopment = (): boolean => {
  return getCurrentEnvironment() === 'development';
};

/**
 * Check if environment is staging
 */
export const isStaging = (): boolean => {
  return getCurrentEnvironment() === 'staging';
};

/**
 * Check if environment is production
 */
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === 'production';
};

/**
 * Check if environment is test
 */
export const isTest = (): boolean => {
  return getCurrentEnvironment() === 'test';
};

/**
 * Get environment-specific configuration value
 */
export const getEnvValue = <T>(key: string, defaultValue: T): T => {
  const environment = getCurrentEnvironment();
  const envKey = `${environment.toUpperCase()}_${key}`;
  return (process.env[envKey] as T) || defaultValue;
};

/**
 * Validate environment configuration
 */
export const validateEnvironmentConfig = (environment: Environment): boolean => {
  try {
    const config = getEnvironmentConfig(environment);
    
    // Basic validation - check if config exists and has required properties
    if (!config || typeof config !== 'object') {
      return false;
    }
    
    // Check for required environment variables
    const requiredEnvVars = [
      'NODE_ENV',
      'JWT_SECRET',
      'DB_NAME',
      'DB_USER',
      'DB_PASSWORD',
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`Missing required environment variable: ${envVar}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Environment validation failed for ${environment}:`, error);
    return false;
  }
};

/**
 * Get environment-specific feature overrides
 */
export const getEnvironmentFeatureOverrides = (environment: Environment) => {
  const config = getEnvironmentConfig(environment);
  return config || {};
};

/**
 * Compare environment configurations
 */
export const compareEnvironmentConfigs = (env1: Environment, env2: Environment) => {
  const config1 = getEnvironmentConfig(env1);
  const config2 = getEnvironmentConfig(env2);
  
  const differences: Record<string, any> = {};
  
  // Simple comparison - in a real implementation, you'd want more sophisticated comparison
  for (const key in config1) {
    if (config1[key] !== config2[key]) {
      differences[key] = {
        [env1]: config1[key],
        [env2]: config2[key],
      };
    }
  }
  
  return differences;
};

/**
 * Get environment-specific settings
 */
export const getEnvironmentSettings = (environment: Environment) => {
  const config = getEnvironmentConfig(environment);
  
  return {
    environment,
    config,
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
    isTest: environment === 'test',
    features: Object.keys(config || {}),
    hasDatabase: !!(config?.database),
    hasAuth: !!(config?.auth),
    hasAPI: !!(config?.api),
    hasUI: !!(config?.ui),
    hasMonitoring: !!(config?.monitoring),
    hasSecurity: !!(config?.security),
    hasFiles: !!(config?.files),
    hasNotifications: !!(config?.notifications),
    hasFeatureFlags: !!(config?.featureFlags),
    hasDevTools: !!(config?.devTools),
  };
};

/**
 * Environment configuration metadata
 */
export const environmentMetadata = {
  development: {
    name: 'Development',
    description: 'Local development environment with debugging features',
    features: ['hot-reload', 'debugging', 'mock-data', 'testing'],
    security: 'relaxed',
    performance: 'optimized-for-development',
    monitoring: 'verbose',
  },
  staging: {
    name: 'Staging',
    description: 'Pre-production environment for testing',
    features: ['testing', 'monitoring', 'alerting'],
    security: 'moderate',
    performance: 'balanced',
    monitoring: 'standard',
  },
  production: {
    name: 'Production',
    description: 'Live production environment',
    features: ['monitoring', 'alerting', 'backup', 'security'],
    security: 'strict',
    performance: 'optimized',
    monitoring: 'minimal',
  },
  test: {
    name: 'Test',
    description: 'Automated testing environment',
    features: ['testing', 'mock-data', 'isolation'],
    security: 'minimal',
    performance: 'fast',
    monitoring: 'disabled',
  },
} as const;

/**
 * Get environment metadata
 */
export const getEnvironmentMetadata = (environment: Environment) => {
  return environmentMetadata[environment];
};

/**
 * List all environment configurations
 */
export const listEnvironmentConfigs = () => {
  return availableEnvironments.map(environment => ({
    environment,
    metadata: getEnvironmentMetadata(environment),
    settings: getEnvironmentSettings(environment),
    isValid: validateEnvironmentConfig(environment),
  }));
};

// Export individual configurations
export { default as developmentConfig } from './development';
export { default as stagingConfig } from './staging';
export { default as productionConfig } from './production';
export { default as testConfig } from './test';

// Export default configuration for current environment
export default getCurrentEnvironmentConfig();

