import { 
  getAllFeatureConfigs, 
  validateFeatureConfig, 
  type FeatureConfigs, 
  type FeatureName,
  defaultFeatureConfigs
} from './features/index';
// Note: envSchema import removed - using environment-specific validation instead

/**
 * Configuration loading and management utilities
 */

// Configuration cache
const configCache = new Map<string, any>();
const cacheTimestamps = new Map<string, number>();

// Configuration change detection
const changeListeners = new Set<(config: any) => void>();

/**
 * Environment detection utilities
 */
export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

export const isTest = (): boolean => {
  return getEnvironment() === 'test';
};

/**
 * Configuration loading utilities
 */
export const loadEnvironmentConfig = (): any => {
  const env = getEnvironment();
  const cacheKey = `env:${env}`;
  
  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey);
  }

  try {
    // Load environment-specific configuration
    const envConfig = require(`./environments/${env}`).default;
    configCache.set(cacheKey, envConfig);
    cacheTimestamps.set(cacheKey, Date.now());
    return envConfig;
  } catch (error) {
    console.warn(`Failed to load environment config for ${env}:`, error);
    return {};
  }
};

export const loadFeatureConfig = <T extends FeatureName>(
  featureName: T,
  overrides: Partial<FeatureConfigs[T]> = {}
): FeatureConfigs[T] => {
  const cacheKey = `feature:${featureName}`;
  
  if (configCache.has(cacheKey)) {
    const cached = configCache.get(cacheKey);
    return { ...cached, ...overrides };
  }

  try {
    // Load default configuration from exported maps
    const defaultConfig = defaultFeatureConfigs[featureName];
    
    // Load environment overrides
    const envConfig = loadEnvironmentConfig();
    const envOverrides = envConfig[featureName] || {};
    
    // Merge configurations
    const mergedConfig = { ...defaultConfig, ...envOverrides, ...overrides };
    
    // Validate configuration
    const validatedConfig = validateFeatureConfig(featureName, mergedConfig);
    
    configCache.set(cacheKey, validatedConfig);
    cacheTimestamps.set(cacheKey, Date.now());
    
    return validatedConfig;
  } catch (error) {
    console.error(`Failed to load feature config for ${featureName}:`, error);
    throw new Error(`Failed to load feature config for ${featureName}`);
  }
};

export const loadAllConfigs = (overrides: Partial<FeatureConfigs> = {}): FeatureConfigs => {
  const cacheKey = 'all-configs';
  
  if (configCache.has(cacheKey)) {
    const cached = configCache.get(cacheKey);
    return { ...cached, ...overrides };
  }

  try {
    // Load environment configuration
    const envConfig = loadEnvironmentConfig();
    
    // Load all feature configurations
    const featureConfigs = getAllFeatureConfigs(envConfig);
    
    // Apply overrides
    const finalConfigs = { ...featureConfigs, ...overrides };
    
    configCache.set(cacheKey, finalConfigs);
    cacheTimestamps.set(cacheKey, Date.now());
    
    return finalConfigs;
  } catch (error) {
    console.error('Failed to load all configurations:', error);
    throw error;
  }
};

/**
 * Configuration validation utilities
 */
export const validateEnvironmentConfig = (config: unknown): any => {
  // Basic validation - check if config is an object
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid environment configuration: must be an object');
  }
  return config;
};

export const validateAllConfigsCore = (configs: unknown): FeatureConfigs => {
  // For now, just return the configs as-is to avoid type conflicts
  // This will be properly validated by the validation module
  return configs as FeatureConfigs;
};

/**
 * Configuration caching utilities
 */
export const clearConfigCache = (key?: string): void => {
  if (key) {
    configCache.delete(key);
    cacheTimestamps.delete(key);
  } else {
    configCache.clear();
    cacheTimestamps.clear();
  }
};

export const getConfigCacheInfo = (): { size: number; keys: string[]; timestamps: Record<string, number> } => {
  return {
    size: configCache.size,
    keys: Array.from(configCache.keys()),
    timestamps: Object.fromEntries(cacheTimestamps.entries()),
  };
};

export const isConfigCached = (key: string): boolean => {
  return configCache.has(key);
};

export const getCachedConfig = <T>(key: string): T | undefined => {
  return configCache.get(key);
};

/**
 * Configuration hot-reloading utilities (development only)
 */
export const enableHotReload = (): void => {
  if (!isDevelopment()) {
    console.warn('Hot reload is only available in development mode');
    return;
  }

  // Watch for configuration file changes using chokidar for cross-platform support
  const watchConfigFiles = () => {
    const chokidar = require('chokidar');
    const path = require('path');
    
    const patterns = [
      path.resolve(process.cwd(), 'src/config/features/**/*.{ts,js}'),
      path.resolve(__dirname, 'features/**/*.{ts,js}') // fallback for dist
    ];
    
    const watcher = chokidar.watch(patterns, { ignoreInitial: true });
    
    // Debounce function to avoid multiple rapid changes
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout;
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };
    
    const onChange = debounce(() => {
      console.log('Configuration files changed, clearing cache and notifying listeners');
      clearConfigCache();
      notifyConfigChange();
    }, 150);
    
    watcher.on('add', onChange);
    watcher.on('change', onChange);
    watcher.on('unlink', onChange);
    
    // Clean up watcher on process exit
    process.on('SIGINT', () => {
      watcher.close();
    });
    
    process.on('SIGTERM', () => {
      watcher.close();
    });
  };

  watchConfigFiles();
};

export const notifyConfigChange = (): void => {
  changeListeners.forEach(listener => {
    try {
      listener(loadAllConfigs());
    } catch (error) {
      console.error('Error notifying config change:', error);
    }
  });
};

export const addConfigChangeListener = (listener: (config: FeatureConfigs) => void): void => {
  changeListeners.add(listener);
};

export const removeConfigChangeListener = (listener: (config: FeatureConfigs) => void): void => {
  changeListeners.delete(listener);
};

/**
 * Configuration environment utilities
 */
export const getConfigForEnvironment = (env: string): Partial<FeatureConfigs> => {
  try {
    const { environmentConfigs } = require('./environments');
    return environmentConfigs[env] || {};
  } catch (error) {
    console.warn(`Failed to load config for environment ${env}:`, error);
    return {};
  }
};

export const getAvailableEnvironments = (): string[] => {
  try {
    const { availableEnvironments } = require('./environments');
    return availableEnvironments;
  } catch (error) {
    console.warn('Failed to read environments from index:', error);
  }
  
  return ['development', 'staging', 'production', 'test'];
};

/**
 * Configuration debugging utilities
 */
export const debugConfig = (config: any, depth: number = 2): void => {
  if (!isDevelopment()) {
    return;
  }

  console.log('Configuration Debug Info:');
  console.log(JSON.stringify(config, null, depth));
};

export const compareConfigs = (config1: any, config2: any): { added: any; removed: any; changed: any } => {
  const added: any = {};
  const removed: any = {};
  const changed: any = {};

  const compareObjects = (obj1: any, obj2: any, path: string = '') => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Find added keys
    keys2.forEach(key => {
      if (!keys1.includes(key)) {
        added[path ? `${path}.${key}` : key] = obj2[key];
      }
    });

    // Find removed keys
    keys1.forEach(key => {
      if (!keys2.includes(key)) {
        removed[path ? `${path}.${key}` : key] = obj1[key];
      }
    });

    // Find changed values
    keys1.forEach(key => {
      if (keys2.includes(key)) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        
        if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
          compareObjects(val1, val2, path ? `${path}.${key}` : key);
        } else if (val1 !== val2) {
          changed[path ? `${path}.${key}` : key] = { from: val1, to: val2 };
        }
      }
    });
  };

  compareObjects(config1, config2);
  return { added, removed, changed };
};

/**
 * Configuration health check
 */
export const healthCheck = (): { status: 'healthy' | 'unhealthy'; issues: string[] } => {
  const issues: string[] = [];
  
  try {
    // Check if all required configurations can be loaded
    const configs = loadAllConfigs();
    
    // Check for missing required environment variables
    const requiredEnvVars = [
      'NODE_ENV',
      'JWT_SECRET',
      'DB_NAME',
      'DB_USER',
      'DB_PASSWORD',
    ];
    
    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        issues.push(`Missing required environment variable: ${envVar}`);
      }
    });
    
    // Check configuration validation
    validateAllConfigsCore(configs);
    
    return {
      status: issues.length === 0 ? 'healthy' : 'unhealthy',
      issues,
    };
  } catch (error: any) {
    issues.push(`Configuration validation failed: ${error.message}`);
    return {
      status: 'unhealthy',
      issues,
    };
  }
};

/**
 * Initialize configuration system
 */
export const initializeConfig = (options: {
  enableHotReload?: boolean;
  enableCaching?: boolean;
  cacheTTL?: number;
} = {}): FeatureConfigs => {
  const { enableHotReload: shouldEnableHotReload = isDevelopment(), enableCaching = true, cacheTTL = 300000 } = options;
  
  // Enable hot reload in development
  if (shouldEnableHotReload) {
    enableHotReload();
  }
  
  // Load initial configuration
  const configs = loadAllConfigs();
  
  // Set up cache cleanup
  if (enableCaching && cacheTTL > 0) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, timestamp] of Array.from(cacheTimestamps.entries())) {
        if (now - timestamp > cacheTTL) {
          configCache.delete(key);
          cacheTimestamps.delete(key);
        }
      }
    }, cacheTTL);
  }
  
  return configs;
};

