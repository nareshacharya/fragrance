import { z } from 'zod';

/**
 * Feature flags configuration schema
 */
export const featureFlagsConfigSchema = z.object({
  // Feature Flag Management
  management: z.object({
    enabled: z.boolean().default(true),
    enableRuntimeToggles: z.boolean().default(true),
    enableUserTargeting: z.boolean().default(false),
    enableEnvironmentOverrides: z.boolean().default(true),
    enableABTesting: z.boolean().default(false),
    enableGradualRollout: z.boolean().default(false),
    enableFeatureDependencies: z.boolean().default(false),
  }),

  // Feature Flag Storage
  storage: z.object({
    provider: z.enum(['database', 'redis', 'memory', 'file']).default('database'),
    enableCaching: z.boolean().default(true),
    cacheTTL: z.number().default(300), // 5 minutes
    enablePersistence: z.boolean().default(true),
    enableBackup: z.boolean().default(true),
    backupInterval: z.number().default(24 * 60 * 60 * 1000), // 24 hours
  }),

  // Feature Flag Types
  flagTypes: z.object({
    boolean: z.object({
      enabled: z.boolean().default(true),
      defaultValue: z.boolean().default(false),
    }),
    string: z.object({
      enabled: z.boolean().default(true),
      defaultValue: z.string().default(''),
      allowedValues: z.array(z.string()).default([]),
    }),
    number: z.object({
      enabled: z.boolean().default(true),
      defaultValue: z.number().default(0),
      min: z.number().optional(),
      max: z.number().optional(),
    }),
    json: z.object({
      enabled: z.boolean().default(true),
      defaultValue: z.record(z.any()).default({}),
      schema: z.record(z.any()).optional(),
    }),
  }),

  // User Targeting
  userTargeting: z.object({
    enabled: z.boolean().default(false),
    enableUserSegments: z.boolean().default(false),
    enableUserAttributes: z.boolean().default(false),
    enableGeographicTargeting: z.boolean().default(false),
    enableDeviceTargeting: z.boolean().default(false),
    enableBrowserTargeting: z.boolean().default(false),
    enableTimeBasedTargeting: z.boolean().default(false),
    targetingRules: z.array(z.object({
      name: z.string(),
      condition: z.string(),
      percentage: z.number().min(0).max(100).default(100),
      enabled: z.boolean().default(true),
    })).default([]),
  }),

  // A/B Testing
  abTesting: z.object({
    enabled: z.boolean().default(false),
    enableVariantTesting: z.boolean().default(false),
    enableStatisticalSignificance: z.boolean().default(false),
    enableConversionTracking: z.boolean().default(false),
    enableMultiVariateTesting: z.boolean().default(false),
    defaultTestDuration: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days
    minSampleSize: z.number().default(100),
    confidenceLevel: z.number().min(0).max(1).default(0.95),
  }),

  // Gradual Rollout
  gradualRollout: z.object({
    enabled: z.boolean().default(false),
    enablePercentageRollout: z.boolean().default(false),
    enableTimeBasedRollout: z.boolean().default(false),
    enableUserBasedRollout: z.boolean().default(false),
    rolloutStrategies: z.array(z.enum(['percentage', 'time', 'user', 'random'])).default(['percentage']),
    defaultRolloutPercentage: z.number().min(0).max(100).default(10),
    rolloutIncrement: z.number().min(0).max(100).default(10),
    rolloutInterval: z.number().default(24 * 60 * 60 * 1000), // 24 hours
  }),

  // Feature Dependencies
  dependencies: z.object({
    enabled: z.boolean().default(false),
    enableDependencyGraph: z.boolean().default(false),
    enableCircularDependencyDetection: z.boolean().default(true),
    enableDependencyValidation: z.boolean().default(true),
    maxDependencyDepth: z.number().default(10),
  }),

  // Analytics and Monitoring
  analytics: z.object({
    enabled: z.boolean().default(true),
    enableFlagUsageTracking: z.boolean().default(true),
    enablePerformanceTracking: z.boolean().default(true),
    enableErrorTracking: z.boolean().default(true),
    enableUserBehaviorTracking: z.boolean().default(false),
    analyticsRetentionDays: z.number().default(90),
    enableRealTimeAnalytics: z.boolean().default(true),
  }),

  // Default Feature Flags
  defaultFlags: z.record(z.object({
    enabled: z.boolean(),
    description: z.string(),
    type: z.enum(['boolean', 'string', 'number', 'json']).default('boolean'),
    defaultValue: z.any(),
    environments: z.record(z.any()).default({}),
    targeting: z.object({
      enabled: z.boolean().default(false),
      rules: z.array(z.any()).default([]),
    }).default({ enabled: false, rules: [] }),
  })).default({
    'new-dashboard': {
      enabled: false,
      description: 'Enable the new dashboard interface',
      type: 'boolean',
      defaultValue: false,
      environments: {
        development: true,
        staging: false,
        production: false,
      },
    },
    'advanced-search': {
      enabled: true,
      description: 'Enable advanced search functionality',
      type: 'boolean',
      defaultValue: true,
      environments: {},
    },
    'dark-mode': {
      enabled: true,
      description: 'Enable dark mode theme',
      type: 'boolean',
      defaultValue: true,
      environments: {},
    },
    'api-v2': {
      enabled: false,
      description: 'Enable API version 2 endpoints',
      type: 'boolean',
      defaultValue: false,
      environments: {
        development: true,
        staging: false,
        production: false,
      },
    },
    'beta-features': {
      enabled: false,
      description: 'Enable beta features for testing',
      type: 'boolean',
      defaultValue: false,
      environments: {
        development: true,
        staging: true,
        production: false,
      },
    },
  }),

  // Environment-Specific Overrides
  environmentOverrides: z.object({
    enabled: z.boolean().default(true),
    enableDevelopmentOverrides: z.boolean().default(true),
    enableStagingOverrides: z.boolean().default(true),
    enableProductionOverrides: z.boolean().default(false),
    overridePrefix: z.string().default('FEATURE_'),
    enableLocalOverrides: z.boolean().default(true),
    localOverrideFile: z.string().default('.env.local'),
  }),

  // Performance Configuration
  performance: z.object({
    enableCaching: z.boolean().default(true),
    cacheTTL: z.number().default(300), // 5 minutes
    enableLazyLoading: z.boolean().default(true),
    enablePreloading: z.boolean().default(false),
    maxCacheSize: z.number().default(1000),
    enableCompression: z.boolean().default(true),
  }),

  // Security Configuration
  security: z.object({
    enableFlagEncryption: z.boolean().default(false),
    enableAccessControl: z.boolean().default(true),
    enableAuditLogging: z.boolean().default(true),
    enableFlagValidation: z.boolean().default(true),
    enableSensitiveFlagProtection: z.boolean().default(false),
    sensitiveFlagPatterns: z.array(z.string()).default(['password', 'secret', 'key', 'token']),
  }),
});

export type FeatureFlagsConfig = z.infer<typeof featureFlagsConfigSchema>;

/**
 * Default feature flags configuration
 */
export const defaultFeatureFlagsConfig: FeatureFlagsConfig = {
  management: {
    enabled: true,
    enableRuntimeToggles: true,
    enableUserTargeting: false,
    enableEnvironmentOverrides: true,
    enableABTesting: false,
    enableGradualRollout: false,
    enableFeatureDependencies: false,
  },
  storage: {
    provider: 'database',
    enableCaching: true,
    cacheTTL: 300,
    enablePersistence: true,
    enableBackup: true,
    backupInterval: 24 * 60 * 60 * 1000,
  },
  flagTypes: {
    boolean: {
      enabled: true,
      defaultValue: false,
    },
    string: {
      enabled: true,
      defaultValue: '',
      allowedValues: [],
    },
    number: {
      enabled: true,
      defaultValue: 0,
    },
    json: {
      enabled: true,
      defaultValue: {},
    },
  },
  userTargeting: {
    enabled: false,
    enableUserSegments: false,
    enableUserAttributes: false,
    enableGeographicTargeting: false,
    enableDeviceTargeting: false,
    enableBrowserTargeting: false,
    enableTimeBasedTargeting: false,
    targetingRules: [],
  },
  abTesting: {
    enabled: false,
    enableVariantTesting: false,
    enableStatisticalSignificance: false,
    enableConversionTracking: false,
    enableMultiVariateTesting: false,
    defaultTestDuration: 7 * 24 * 60 * 60 * 1000,
    minSampleSize: 100,
    confidenceLevel: 0.95,
  },
  gradualRollout: {
    enabled: false,
    enablePercentageRollout: false,
    enableTimeBasedRollout: false,
    enableUserBasedRollout: false,
    rolloutStrategies: ['percentage'],
    defaultRolloutPercentage: 10,
    rolloutIncrement: 10,
    rolloutInterval: 24 * 60 * 60 * 1000,
  },
  dependencies: {
    enabled: false,
    enableDependencyGraph: false,
    enableCircularDependencyDetection: true,
    enableDependencyValidation: true,
    maxDependencyDepth: 10,
  },
  analytics: {
    enabled: true,
    enableFlagUsageTracking: true,
    enablePerformanceTracking: true,
    enableErrorTracking: true,
    enableUserBehaviorTracking: false,
    analyticsRetentionDays: 90,
    enableRealTimeAnalytics: true,
  },
  defaultFlags: {
    'new-dashboard': {
      enabled: false,
      description: 'Enable the new dashboard interface',
      type: 'boolean',
      defaultValue: false,
      environments: {
        development: true,
        staging: false,
        production: false,
      },
    },
    'advanced-search': {
      enabled: true,
      description: 'Enable advanced search functionality',
      type: 'boolean',
      defaultValue: true,
      environments: {},
    },
    'dark-mode': {
      enabled: true,
      description: 'Enable dark mode theme',
      type: 'boolean',
      defaultValue: true,
      environments: {},
    },
    'api-v2': {
      enabled: false,
      description: 'Enable API version 2 endpoints',
      type: 'boolean',
      defaultValue: false,
      environments: {
        development: true,
        staging: false,
        production: false,
      },
    },
    'beta-features': {
      enabled: false,
      description: 'Enable beta features for testing',
      type: 'boolean',
      defaultValue: false,
      environments: {
        development: true,
        staging: true,
        production: false,
      },
    },
  },
  environmentOverrides: {
    enabled: true,
    enableDevelopmentOverrides: true,
    enableStagingOverrides: true,
    enableProductionOverrides: false,
    overridePrefix: 'FEATURE_',
    enableLocalOverrides: true,
    localOverrideFile: '.env.local',
  },
  performance: {
    enableCaching: true,
    cacheTTL: 300,
    enableLazyLoading: true,
    enablePreloading: false,
    maxCacheSize: 1000,
    enableCompression: true,
  },
  security: {
    enableFlagEncryption: false,
    enableAccessControl: true,
    enableAuditLogging: true,
    enableFlagValidation: true,
    enableSensitiveFlagProtection: false,
    sensitiveFlagPatterns: ['password', 'secret', 'key', 'token'],
  },
};

