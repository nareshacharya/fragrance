import { z } from 'zod';
import { 
  loadAllConfigs, 
  loadFeatureConfig, 
  validateAllConfigs, 
  validateConfigWithDetails,
  type FeatureConfigs,
  type FeatureName,
  featureConfigSchemas,
  defaultFeatureConfigs
} from './index';

/**
 * Configuration testing utilities
 * 
 * This module provides utilities for testing configuration loading,
 * validation, and feature flag behavior.
 */

// Test configuration types
export interface TestConfigOptions {
  environment?: string;
  overrides?: Partial<FeatureConfigs>;
  enableValidation?: boolean;
  enableHotReload?: boolean;
  enableCaching?: boolean;
}

export interface TestResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  duration: number;
  config?: FeatureConfigs;
}

export interface ConfigTestCase {
  name: string;
  description: string;
  feature: FeatureName;
  config: any;
  expected: any;
  assertions: ConfigTestAssertion[];
}

export interface ConfigTestAssertion {
  type: 'equals' | 'contains' | 'matches' | 'validates' | 'enabled' | 'disabled';
  path: string;
  expected: any;
  message?: string;
}

/**
 * Create test configuration
 */
export const createTestConfig = (options: TestConfigOptions = {}): FeatureConfigs => {
  const {
    environment = 'test',
    overrides = {},
    enableValidation = false,
    enableHotReload = false,
    enableCaching = false,
  } = options;

  // Set test environment
  process.env.NODE_ENV = environment;

  try {
    // Load configuration with test overrides
    const config = loadAllConfigs(overrides);

    // Validate if requested
    if (enableValidation) {
      validateAllConfigs(config);
    }

    return config;
  } catch (error) {
    throw new Error(`Failed to create test configuration: ${error.message}`);
  }
};

/**
 * Test configuration loading
 */
export const testConfigLoading = async (options: TestConfigOptions = {}): Promise<TestResult> => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const config = createTestConfig(options);
    const duration = Date.now() - startTime;

    return {
      success: true,
      errors,
      warnings,
      duration,
      config,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test configuration validation
 */
export const testConfigValidation = async (
  featureName: FeatureName,
  config: any
): Promise<TestResult> => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const result = validateConfigWithDetails(featureName, config);
    
    if (!result.success) {
      errors.push(...result.errors.map(e => `${e.path}: ${e.message}`));
    }
    
    warnings.push(...result.warnings);

    return {
      success: result.success,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test feature flag behavior
 */
export const testFeatureFlag = (
  flagName: string,
  config: FeatureConfigs,
  expectedValue: boolean
): TestResult => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const featureFlags = config.featureFlags;
    const actualValue = featureFlags.defaultFlags[flagName]?.enabled || false;

    if (actualValue !== expectedValue) {
      errors.push(
        `Feature flag '${flagName}' expected ${expectedValue}, got ${actualValue}`
      );
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test environment-specific configuration
 */
export const testEnvironmentConfig = (environment: string): TestResult => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Set environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = environment;

    // Load configuration
    const config = loadAllConfigs();

    // Validate configuration
    const validationResult = validateAllConfigs(config);
    if (!validationResult.success) {
      errors.push(...validationResult.errors.map(e => `${e.path}: ${e.message}`));
    }
    warnings.push(...validationResult.warnings);

    // Restore original environment
    process.env.NODE_ENV = originalEnv;

    return {
      success: errors.length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
      config,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test configuration performance
 */
export const testConfigPerformance = async (
  iterations: number = 100
): Promise<TestResult> => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  const durations: number[] = [];

  try {
    for (let i = 0; i < iterations; i++) {
      const iterStartTime = Date.now();
      loadAllConfigs();
      durations.push(Date.now() - iterStartTime);
    }

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    if (avgDuration > 100) {
      warnings.push(`Average configuration load time is high: ${avgDuration}ms`);
    }

    if (maxDuration > 500) {
      warnings.push(`Maximum configuration load time is high: ${maxDuration}ms`);
    }

    return {
      success: true,
      errors,
      warnings: [
        ...warnings,
        `Performance test completed: avg=${avgDuration}ms, max=${maxDuration}ms, min=${minDuration}ms`,
      ],
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test configuration schema validation
 */
export const testConfigSchema = (featureName: FeatureName, testData: any[]): TestResult => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const schema = featureConfigSchemas[featureName];
    
    for (const data of testData) {
      try {
        schema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(`Schema validation failed for ${featureName}: ${error.errors.map(e => e.message).join(', ')}`);
        } else {
          errors.push(`Unexpected error validating ${featureName}: ${error.message}`);
        }
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test configuration inheritance
 */
export const testConfigInheritance = (): TestResult => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Test default configuration
    const defaultConfig = defaultFeatureConfigs;
    
    // Test environment-specific configuration
    const envConfig = loadAllConfigs();
    
    // Test with overrides
    const overrideConfig = loadAllConfigs({
      auth: {
        session: {
          timeout: 60000, // 1 minute override
        },
      },
    });

    // Verify inheritance works correctly
    if (overrideConfig.auth.session.timeout !== 60000) {
      errors.push('Configuration override not applied correctly');
    }

    // Verify default values are preserved
    if (!envConfig.auth.jwt.secret) {
      errors.push('Default JWT secret not preserved');
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test configuration hot reload (development only)
 */
export const testConfigHotReload = (): TestResult => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    if (process.env.NODE_ENV !== 'development') {
      warnings.push('Hot reload testing is only available in development mode');
      return {
        success: true,
        errors,
        warnings,
        duration: Date.now() - startTime,
      };
    }

    // Test hot reload functionality
    const config1 = loadAllConfigs();
    
    // Simulate configuration change
    const config2 = loadAllConfigs({
      auth: {
        session: {
          timeout: 120000, // 2 minutes
        },
      },
    });

    if (config1.auth.session.timeout === config2.auth.session.timeout) {
      errors.push('Configuration hot reload not working');
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Test configuration caching
 */
export const testConfigCaching = (): TestResult => {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Load configuration multiple times
    const config1 = loadAllConfigs();
    const config2 = loadAllConfigs();
    const config3 = loadAllConfigs();

    // Verify configurations are identical
    if (JSON.stringify(config1) !== JSON.stringify(config2)) {
      errors.push('Configuration caching not working correctly');
    }

    if (JSON.stringify(config2) !== JSON.stringify(config3)) {
      errors.push('Configuration caching not working correctly');
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    errors.push(error.message);
    return {
      success: false,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
};

/**
 * Run comprehensive configuration tests
 */
export const runConfigTests = async (): Promise<{
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    totalDuration: number;
  };
}> => {
  const startTime = Date.now();
  const results: TestResult[] = [];

  // Test configuration loading
  results.push(await testConfigLoading());

  // Test configuration validation
  results.push(await testConfigValidation('auth', defaultFeatureConfigs.auth));

  // Test environment configurations
  results.push(testEnvironmentConfig('development'));
  results.push(testEnvironmentConfig('staging'));
  results.push(testEnvironmentConfig('production'));
  results.push(testEnvironmentConfig('test'));

  // Test feature flags
  const testConfig = createTestConfig();
  results.push(testFeatureFlag('new-dashboard', testConfig, false));
  results.push(testFeatureFlag('advanced-search', testConfig, true));

  // Test performance
  results.push(await testConfigPerformance(10));

  // Test schema validation
  results.push(testConfigSchema('auth', [defaultFeatureConfigs.auth]));

  // Test inheritance
  results.push(testConfigInheritance());

  // Test hot reload (if in development)
  results.push(testConfigHotReload());

  // Test caching
  results.push(testConfigCaching());

  const totalDuration = Date.now() - startTime;
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const warnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  return {
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      warnings,
      totalDuration,
    },
  };
};

/**
 * Mock configuration for testing
 */
export const createMockConfig = (overrides: Partial<FeatureConfigs> = {}): FeatureConfigs => {
  return {
    auth: {
      session: {
        timeout: 30000,
        refreshThreshold: 5000,
        maxConcurrentSessions: 1,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
      },
      jwt: {
        secret: 'mock-jwt-secret',
        algorithm: 'HS256',
        expiresIn: '1h',
        refreshExpiresIn: '1d',
        issuer: 'mock-app',
        audience: 'mock-users',
      },
      passwordPolicy: {
        minLength: 4,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSpecialChars: false,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        historyCount: 1,
      },
      accountSecurity: {
        maxLoginAttempts: 100,
        lockoutDuration: 1000,
        requireEmailVerification: false,
        requirePhoneVerification: false,
        twoFactorEnabled: false,
        backupCodesCount: 1,
      },
      rateLimiting: {
        enabled: false,
        windowMs: 15 * 60 * 1000,
        maxRequests: 10000,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
      },
    },
    api: {
      pegaDx: {
        baseUrl: 'http://localhost:8080',
        apiVersion: 'v1',
        timeout: 5000,
        retries: 0,
        retryDelay: 100,
        maxRetryDelay: 1000,
        retryMultiplier: 2,
        enableLogging: false,
        logLevel: 'error',
      },
      httpClient: {
        timeout: 5000,
        keepAlive: false,
        maxSockets: 1,
        maxFreeSockets: 1,
        keepAliveMsecs: 1000,
        userAgent: 'MockApp/1.0',
        followRedirects: true,
        maxRedirects: 1,
      },
      caching: {
        enabled: false,
        defaultTTL: 0,
        maxSize: 0,
        strategy: 'lru',
        cacheKeyPrefix: 'mock:',
      },
      rateLimiting: {
        enabled: false,
        windowMs: 15 * 60 * 1000,
        maxRequests: 10000,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        keyGenerator: 'ip',
      },
      errorHandling: {
        includeStackTrace: true,
        logErrors: false,
      },
      monitoring: {
        enabled: false,
        collectMetrics: false,
        collectTraces: false,
        sampleRate: 0,
        metricsEndpoint: '/metrics',
        healthCheckInterval: 60000,
      },
    },
    ...overrides,
  } as FeatureConfigs;
};

/**
 * Test configuration utilities
 */
export const ConfigTestUtils = {
  createTestConfig,
  testConfigLoading,
  testConfigValidation,
  testFeatureFlag,
  testEnvironmentConfig,
  testConfigPerformance,
  testConfigSchema,
  testConfigInheritance,
  testConfigHotReload,
  testConfigCaching,
  runConfigTests,
  createMockConfig,
};

export default ConfigTestUtils;

