import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  validateConfigWithDetails,
  validateAllConfigs,
  validateForEnvironment,
  validateConfigSchema,
  createTestConfig,
  validateTestConfig,
  migrateConfig,
} from './validation';
import { authConfigSchema, defaultAuthConfig } from './features/auth';
import { apiConfigSchema, defaultApiConfig } from './features/api';
import { createMockConfig } from './testing';

describe('Configuration Validation', () => {
  beforeEach(() => {
    // Reset environment
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    // Clean up after each test
  });

  describe('validateConfigWithDetails', () => {
    it('should validate valid auth configuration', () => {
      const result = validateConfigWithDetails('auth', defaultAuthConfig);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid api configuration', () => {
      const result = validateConfigWithDetails('api', defaultApiConfig);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect validation errors', () => {
      const invalidConfig = {
        session: {
          timeout: 'invalid', // Should be number
        },
        jwt: {
          secret: 'short', // Should be at least 32 characters
        },
      };

      const result = validateConfigWithDetails('auth', invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect custom validation warnings', () => {
      const configWithWarnings = {
        ...defaultAuthConfig,
        passwordPolicy: {
          ...defaultAuthConfig.passwordPolicy,
          minLength: 4, // Less than 8
        },
        session: {
          ...defaultAuthConfig.session,
          timeout: 60000, // Less than 5 minutes
        },
      };

      const result = validateConfigWithDetails('auth', configWithWarnings);
      
      expect(result.success).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should validate JWT secret strength', () => {
      const weakSecretConfig = {
        ...defaultAuthConfig,
        jwt: {
          ...defaultAuthConfig.jwt,
          secret: 'weak', // Less than 32 characters
        },
      };

      const result = validateConfigWithDetails('auth', weakSecretConfig);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.code === 'WEAK_SECRET')).toBe(true);
    });

    it('should validate password policy consistency', () => {
      const inconsistentPolicyConfig = {
        ...defaultAuthConfig,
        passwordPolicy: {
          ...defaultAuthConfig.passwordPolicy,
          minLength: 4,
          requireUppercase: false,
          requireLowercase: false,
          requireNumbers: false,
          requireSpecialChars: false,
        },
      };

      const result = validateConfigWithDetails('auth', inconsistentPolicyConfig);
      
      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.includes('password complexity'))).toBe(true);
    });

    it('should validate API timeout values', () => {
      const shortTimeoutConfig = {
        ...defaultApiConfig,
        pegaDx: {
          ...defaultApiConfig.pegaDx,
          timeout: 1000, // Less than 5 seconds
        },
        httpClient: {
          ...defaultApiConfig.httpClient,
          timeout: 1000, // Less than 5 seconds
        },
      };

      const result = validateConfigWithDetails('api', shortTimeoutConfig);
      
      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.includes('timeout is very short'))).toBe(true);
    });

    it('should validate database configuration', () => {
      const invalidDbConfig = {
        connection: {
          host: 'localhost',
          port: 'invalid', // Should be number
          database: '',
          username: '',
          password: '',
        },
        pooling: {
          maxPoolSize: 5,
          minPoolSize: 10, // Greater than maxPoolSize
        },
      };

      const result = validateConfigWithDetails('database', invalidDbConfig);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate security configuration', () => {
      const insecureConfig = {
        cors: {
          origin: true, // Allow all origins
        },
        securityHeaders: {
          enabled: false,
        },
        csrf: {
          enabled: false,
        },
      };

      process.env.NODE_ENV = 'production';
      const result = validateConfigWithDetails('security', insecureConfig);
      
      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.includes('production'))).toBe(true);
    });
  });

  describe('validateAllConfigs', () => {
    it('should validate all feature configurations', () => {
      const configs = createMockConfig();
      const result = validateAllConfigs(configs);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect cross-feature validation issues', () => {
      const configs = {
        notifications: {
          email: {
            enabled: true,
            smtp: {
              host: '',
              port: 587,
              secure: false,
              username: '',
              password: '',
              from: '',
            },
          },
        },
      };

      const result = validateAllConfigs(configs);
      
      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.includes('email provider'))).toBe(true);
    });

    it('should validate feature dependencies', () => {
      const configs = {
        files: {
          upload: {
            enabled: true,
          },
          storage: {
            provider: 'local',
          },
        },
      };

      process.env.NODE_ENV = 'production';
      const result = validateAllConfigs(configs);
      
      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.includes('local storage in production'))).toBe(true);
    });
  });

  describe('validateForEnvironment', () => {
    it('should validate for development environment', () => {
      const configs = createMockConfig();
      const result = validateForEnvironment(configs, 'development');
      
      expect(result.success).toBe(true);
    });

    it('should validate for production environment', () => {
      const configs = createMockConfig();
      const result = validateForEnvironment(configs, 'production');
      
      expect(result.success).toBe(true);
    });

    it('should detect production-specific issues', () => {
      const configs = {
        auth: {
          jwt: {
            secret: 'your-super-secret-jwt-key-change-in-production',
          },
        },
        database: {
          connection: {
            ssl: false,
          },
        },
        security: {
          cors: {
            origin: true,
          },
        },
      };

      const result = validateForEnvironment(configs, 'production');
      
      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.includes('default JWT secret'))).toBe(true);
      expect(result.warnings.some(w => w.includes('SSL disabled'))).toBe(true);
      expect(result.warnings.some(w => w.includes('all origins'))).toBe(true);
    });
  });

  describe('validateConfigSchema', () => {
    it('should validate auth schema', () => {
      const result = validateConfigSchema(authConfigSchema, defaultAuthConfig);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate api schema', () => {
      const result = validateConfigSchema(apiConfigSchema, defaultApiConfig);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect schema validation errors', () => {
      const invalidConfig = {
        session: {
          timeout: 'invalid', // Should be number
        },
        jwt: {
          secret: 123, // Should be string
        },
      };

      const result = validateConfigSchema(authConfigSchema, invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('createTestConfig', () => {
    it('should create test configuration', () => {
      const config = createTestConfig('auth', {
        session: {
          timeout: 60000,
        },
      });
      
      expect(config).toBeDefined();
      expect(config.session.timeout).toBe(60000);
    });

    it('should create test configuration with default values', () => {
      const config = createTestConfig('auth');
      
      expect(config).toBeDefined();
      expect(config.session).toBeDefined();
      expect(config.jwt).toBeDefined();
    });
  });

  describe('validateTestConfig', () => {
    it('should validate test configuration', () => {
      const config = createTestConfig('auth');
      const result = validateTestConfig('auth', config);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect test configuration errors', () => {
      const invalidConfig = {
        session: {
          timeout: 'invalid',
        },
      };

      const result = validateTestConfig('auth', invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('migrateConfig', () => {
    it('should migrate old configuration format', () => {
      const oldConfig = {
        sessionTimeout: 300000, // Old format
        apiTimeout: 30000, // Old format
      };

      const newConfig = {
        auth: {
          session: {
            timeout: 300000,
          },
        },
        api: {
          pegaDx: {
            timeout: 30000,
          },
        },
      };

      const result = migrateConfig(oldConfig, newConfig);
      
      expect(result.migrated.auth.session.timeout).toBe(300000);
      expect(result.migrated.api.pegaDx.timeout).toBe(30000);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should handle configuration without migration needed', () => {
      const config = {
        auth: {
          session: {
            timeout: 300000,
          },
        },
      };

      const result = migrateConfig(config, config);
      
      expect(result.migrated).toEqual(config);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', () => {
      const result = validateConfigWithDetails('auth', null);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle unknown feature names', () => {
      expect(() => {
        validateConfigWithDetails('unknownFeature' as any, {});
      }).toThrow();
    });

    it('should handle invalid configuration data', () => {
      const result = validateConfigWithDetails('auth', 'invalid');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should validate configurations quickly', () => {
      const startTime = Date.now();
      validateConfigWithDetails('auth', defaultAuthConfig);
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(100); // Should validate in less than 100ms
    });

    it('should validate large configurations efficiently', () => {
      const largeConfig = createMockConfig();
      
      const startTime = Date.now();
      validateAllConfigs(largeConfig);
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(500); // Should validate in less than 500ms
    });
  });

  describe('Validation Coverage', () => {
    it('should validate all feature configurations', () => {
      const features = [
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
      ];

      for (const feature of features) {
        const config = createMockConfig();
        const result = validateConfigWithDetails(feature as any, config[feature as keyof typeof config]);
        
        expect(result.success).toBe(true);
      }
    });

    it('should validate all environment configurations', () => {
      const environments = ['development', 'staging', 'production', 'test'];
      
      for (const environment of environments) {
        const configs = createMockConfig();
        const result = validateForEnvironment(configs, environment as any);
        
        expect(result.success).toBe(true);
      }
    });
  });
});

