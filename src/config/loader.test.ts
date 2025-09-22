import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  loadAllConfigs,
  loadFeatureConfig,
  loadEnvironmentConfig,
  getEnvironment,
  isDevelopment,
  isProduction,
  isTest,
  clearConfigCache,
  getConfigCacheInfo,
  healthCheck,
  initializeConfig,
} from './loader';
import { createMockConfig } from './testing';

describe('Configuration Loader', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearConfigCache();
    // Reset environment
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    // Clean up after each test
    clearConfigCache();
  });

  describe('loadAllConfigs', () => {
    it('should load all configurations successfully', () => {
      const configs = loadAllConfigs();
      
      expect(configs).toBeDefined();
      expect(configs.auth).toBeDefined();
      expect(configs.api).toBeDefined();
      expect(configs.database).toBeDefined();
      expect(configs.ui).toBeDefined();
      expect(configs.ingredients).toBeDefined();
      expect(configs.caseManagement).toBeDefined();
      expect(configs.monitoring).toBeDefined();
      expect(configs.security).toBeDefined();
      expect(configs.files).toBeDefined();
      expect(configs.notifications).toBeDefined();
      expect(configs.featureFlags).toBeDefined();
      expect(configs.devTools).toBeDefined();
    });

    it('should apply configuration overrides', () => {
      const overrides = {
        auth: {
          session: {
            timeout: 60000, // 1 minute
          },
        },
      };

      const configs = loadAllConfigs(overrides);
      
      expect(configs.auth.session.timeout).toBe(60000);
    });

    it('should cache configurations', () => {
      const configs1 = loadAllConfigs();
      const configs2 = loadAllConfigs();
      
      expect(configs1).toBe(configs2); // Should be the same reference due to caching
    });
  });

  describe('loadFeatureConfig', () => {
    it('should load auth configuration', () => {
      const authConfig = loadFeatureConfig('auth');
      
      expect(authConfig).toBeDefined();
      expect(authConfig.session).toBeDefined();
      expect(authConfig.jwt).toBeDefined();
      expect(authConfig.passwordPolicy).toBeDefined();
    });

    it('should load api configuration', () => {
      const apiConfig = loadFeatureConfig('api');
      
      expect(apiConfig).toBeDefined();
      expect(apiConfig.pegaDx).toBeDefined();
      expect(apiConfig.httpClient).toBeDefined();
      expect(apiConfig.caching).toBeDefined();
    });

    it('should apply feature-specific overrides', () => {
      const overrides = {
        session: {
          timeout: 120000, // 2 minutes
        },
      };

      const authConfig = loadFeatureConfig('auth', overrides);
      
      expect(authConfig.session.timeout).toBe(120000);
    });

    it('should throw error for invalid feature name', () => {
      expect(() => {
        loadFeatureConfig('invalidFeature' as any);
      }).toThrow();
    });
  });

  describe('loadEnvironmentConfig', () => {
    it('should load development environment config', () => {
      process.env.NODE_ENV = 'development';
      const envConfig = loadEnvironmentConfig();
      
      expect(envConfig).toBeDefined();
    });

    it('should load production environment config', () => {
      process.env.NODE_ENV = 'production';
      const envConfig = loadEnvironmentConfig();
      
      expect(envConfig).toBeDefined();
    });

    it('should return empty object for unknown environment', () => {
      process.env.NODE_ENV = 'unknown';
      const envConfig = loadEnvironmentConfig();
      
      expect(envConfig).toEqual({});
    });
  });

  describe('Environment Detection', () => {
    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      
      expect(getEnvironment()).toBe('development');
      expect(isDevelopment()).toBe(true);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(false);
    });

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      
      expect(getEnvironment()).toBe('production');
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(true);
      expect(isTest()).toBe(false);
    });

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      
      expect(getEnvironment()).toBe('test');
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(true);
    });

    it('should default to development environment', () => {
      delete process.env.NODE_ENV;
      
      expect(getEnvironment()).toBe('development');
      expect(isDevelopment()).toBe(true);
    });
  });

  describe('Configuration Caching', () => {
    it('should cache configurations', () => {
      loadAllConfigs();
      const cacheInfo = getConfigCacheInfo();
      
      expect(cacheInfo.size).toBeGreaterThan(0);
      expect(cacheInfo.keys).toContain('all-configs');
    });

    it('should clear cache', () => {
      loadAllConfigs();
      clearConfigCache();
      const cacheInfo = getConfigCacheInfo();
      
      expect(cacheInfo.size).toBe(0);
    });

    it('should clear specific cache entry', () => {
      loadAllConfigs();
      clearConfigCache('all-configs');
      const cacheInfo = getConfigCacheInfo();
      
      expect(cacheInfo.keys).not.toContain('all-configs');
    });
  });

  describe('Health Check', () => {
    it('should pass health check with valid configuration', () => {
      process.env.JWT_SECRET = 'test-secret';
      process.env.DB_NAME = 'test-db';
      process.env.DB_USER = 'test-user';
      process.env.DB_PASSWORD = 'test-password';
      
      const health = healthCheck();
      
      expect(health.status).toBe('healthy');
      expect(health.issues).toHaveLength(0);
    });

    it('should fail health check with missing environment variables', () => {
      delete process.env.JWT_SECRET;
      delete process.env.DB_NAME;
      delete process.env.DB_USER;
      delete process.env.DB_PASSWORD;
      
      const health = healthCheck();
      
      expect(health.status).toBe('unhealthy');
      expect(health.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Initialization', () => {
    it('should initialize configuration successfully', () => {
      const configs = initializeConfig();
      
      expect(configs).toBeDefined();
      expect(configs.auth).toBeDefined();
      expect(configs.api).toBeDefined();
    });

    it('should initialize with options', () => {
      const configs = initializeConfig({
        enableHotReload: false,
        enableCaching: true,
        cacheTTL: 600000, // 10 minutes
      });
      
      expect(configs).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle configuration loading errors gracefully', () => {
      // Mock require to throw error
      const originalRequire = require;
      jest.spyOn(global, 'require').mockImplementation(() => {
        throw new Error('Module not found');
      });

      expect(() => {
        loadFeatureConfig('auth');
      }).toThrow('Failed to load feature config for auth');

      // Restore original require
      (global as any).require = originalRequire;
    });

    it('should handle validation errors', () => {
      const invalidConfig = {
        auth: {
          session: {
            timeout: 'invalid', // Should be number
          },
        },
      };

      expect(() => {
        loadAllConfigs(invalidConfig);
      }).toThrow();
    });
  });

  describe('Performance', () => {
    it('should load configurations quickly', () => {
      const startTime = Date.now();
      loadAllConfigs();
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(1000); // Should load in less than 1 second
    });

    it('should use cached configurations for subsequent loads', () => {
      const startTime1 = Date.now();
      loadAllConfigs();
      const duration1 = Date.now() - startTime1;

      const startTime2 = Date.now();
      loadAllConfigs();
      const duration2 = Date.now() - startTime2;
      
      expect(duration2).toBeLessThan(duration1); // Second load should be faster
    });
  });

  describe('Configuration Validation', () => {
    it('should validate configuration schemas', () => {
      const configs = loadAllConfigs();
      
      // Basic validation - check if required properties exist
      expect(configs.auth.jwt.secret).toBeDefined();
      expect(configs.database.connection.host).toBeDefined();
      expect(configs.api.pegaDx.baseUrl).toBeDefined();
    });

    it('should validate environment-specific configurations', () => {
      process.env.NODE_ENV = 'development';
      const configs = loadAllConfigs();
      
      expect(configs).toBeDefined();
      expect(configs.auth.session.secure).toBe(false); // Should be false in development
    });
  });

  describe('Configuration Overrides', () => {
    it('should apply environment variable overrides', () => {
      process.env.JWT_SECRET = 'custom-jwt-secret';
      process.env.DB_HOST = 'custom-db-host';
      
      const configs = loadAllConfigs();
      
      expect(configs.auth.jwt.secret).toBe('custom-jwt-secret');
      expect(configs.database.connection.host).toBe('custom-db-host');
    });

    it('should apply configuration overrides', () => {
      const overrides = {
        auth: {
          session: {
            timeout: 300000, // 5 minutes
          },
        },
        api: {
          pegaDx: {
            timeout: 60000, // 1 minute
          },
        },
      };

      const configs = loadAllConfigs(overrides);
      
      expect(configs.auth.session.timeout).toBe(300000);
      expect(configs.api.pegaDx.timeout).toBe(60000);
    });
  });

  describe('Configuration Types', () => {
    it('should return properly typed configurations', () => {
      const configs = loadAllConfigs();
      
      // Test type safety
      expect(typeof configs.auth.session.timeout).toBe('number');
      expect(typeof configs.auth.jwt.secret).toBe('string');
      expect(typeof configs.api.pegaDx.enableLogging).toBe('boolean');
      expect(Array.isArray(configs.ingredients.categories.predefinedCategories)).toBe(true);
    });
  });
});

