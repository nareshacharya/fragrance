import { z } from 'zod';

/**
 * Development tools feature configuration schema
 */
export const devToolsConfigSchema = z.object({
  // Hot Reload Configuration
  hotReload: z.object({
    enabled: z.boolean().default(true),
    enableFileWatching: z.boolean().default(true),
    enableComponentReload: z.boolean().default(true),
    enableStyleReload: z.boolean().default(true),
    enableStatePreservation: z.boolean().default(true),
    watchPatterns: z.array(z.string()).default([
      'src/**/*.{ts,tsx,js,jsx}',
      'src/**/*.{css,scss,sass}',
      'public/**/*',
    ]),
    ignorePatterns: z.array(z.string()).default([
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
    ]),
    reloadDelay: z.number().default(300),
  }),

  // Debugging Configuration
  debugging: z.object({
    enabled: z.boolean().default(true),
    enableSourceMaps: z.boolean().default(true),
    enableReactDevTools: z.boolean().default(true),
    enableReduxDevTools: z.boolean().default(true),
    enableNetworkDebugging: z.boolean().default(true),
    enablePerformanceDebugging: z.boolean().default(true),
    enableMemoryDebugging: z.boolean().default(false),
    debugPort: z.number().default(9229),
    enableRemoteDebugging: z.boolean().default(false),
  }),

  // Development Server Configuration
  devServer: z.object({
    enabled: z.boolean().default(true),
    port: z.number().default(3000),
    host: z.string().default('localhost'),
    enableHTTPS: z.boolean().default(false),
    enableProxy: z.boolean().default(false),
    proxyTarget: z.string().default('http://localhost:8080'),
    enableCORS: z.boolean().default(true),
    enableCompression: z.boolean().default(true),
    enableHistoryApiFallback: z.boolean().default(true),
  }),

  // Mock Data Configuration
  mockData: z.object({
    enabled: z.boolean().default(true),
    enableAPIMocking: z.boolean().default(true),
    enableDatabaseMocking: z.boolean().default(false),
    enableFileSystemMocking: z.boolean().default(false),
    mockDataPath: z.string().default('./src/mocks'),
    enableDynamicMocking: z.boolean().default(true),
    enableMockDelay: z.boolean().default(true),
    mockDelayRange: z.object({
      min: z.number().default(100),
      max: z.number().default(1000),
    }),
  }),

  // Testing Configuration
  testing: z.object({
    enabled: z.boolean().default(true),
    enableUnitTests: z.boolean().default(true),
    enableIntegrationTests: z.boolean().default(true),
    enableE2ETests: z.boolean().default(true),
    enableVisualRegressionTests: z.boolean().default(false),
    enablePerformanceTests: z.boolean().default(false),
    testCoverageThreshold: z.number().default(80),
    enableTestCoverage: z.boolean().default(true),
    enableTestParallelization: z.boolean().default(true),
  }),

  // Code Quality Tools
  codeQuality: z.object({
    enabled: z.boolean().default(true),
    enableESLint: z.boolean().default(true),
    enablePrettier: z.boolean().default(true),
    enableTypeScript: z.boolean().default(true),
    enableImportSorting: z.boolean().default(true),
    enableUnusedImportDetection: z.boolean().default(true),
    enableCodeDuplicationDetection: z.boolean().default(false),
    enableSecurityScanning: z.boolean().default(false),
  }),

  // Development Utilities
  utilities: z.object({
    enabled: z.boolean().default(true),
    enableCodeGeneration: z.boolean().default(true),
    enableComponentScaffolding: z.boolean().default(true),
    enableAPIClientGeneration: z.boolean().default(true),
    enableDatabaseMigration: z.boolean().default(false),
    enableSeedData: z.boolean().default(false),
    enableBackupRestore: z.boolean().default(false),
    enableDataExport: z.boolean().default(true),
  }),

  // Performance Monitoring
  performanceMonitoring: z.object({
    enabled: z.boolean().default(true),
    enableBundleAnalysis: z.boolean().default(true),
    enablePerformanceProfiling: z.boolean().default(true),
    enableMemoryLeakDetection: z.boolean().default(false),
    enableSlowComponentDetection: z.boolean().default(true),
    enableNetworkMonitoring: z.boolean().default(true),
    performanceThresholds: z.object({
      bundleSize: z.number().default(1024 * 1024), // 1MB
      renderTime: z.number().default(100), // 100ms
      memoryUsage: z.number().default(100 * 1024 * 1024), // 100MB
    }),
  }),

  // Development Environment
  environment: z.object({
    enableEnvironmentSwitching: z.boolean().default(true),
    enableEnvironmentValidation: z.boolean().default(true),
    enableEnvironmentComparison: z.boolean().default(true),
    enableEnvironmentBackup: z.boolean().default(false),
    environmentFiles: z.array(z.string()).default([
      '.env.development',
      '.env.staging',
      '.env.production',
      '.env.local',
    ]),
  }),

  // Development Documentation
  documentation: z.object({
    enabled: z.boolean().default(true),
    enableAutoDocumentation: z.boolean().default(true),
    enableStorybook: z.boolean().default(true),
    enableComponentDocumentation: z.boolean().default(true),
    enableAPIDocumentation: z.boolean().default(true),
    enableArchitectureDocumentation: z.boolean().default(false),
    documentationPath: z.string().default('./docs'),
  }),

  // Development Security
  security: z.object({
    enabled: z.boolean().default(true),
    enableSecurityScanning: z.boolean().default(false),
    enableDependencyAudit: z.boolean().default(true),
    enableVulnerabilityScanning: z.boolean().default(false),
    enableSecretsDetection: z.boolean().default(true),
    enableSecurityHeaders: z.boolean().default(true),
    enableCSRFProtection: z.boolean().default(true),
  }),

  // Development Analytics
  analytics: z.object({
    enabled: z.boolean().default(true),
    enableUsageTracking: z.boolean().default(true),
    enableErrorTracking: z.boolean().default(true),
    enablePerformanceTracking: z.boolean().default(true),
    enableFeatureUsageTracking: z.boolean().default(true),
    analyticsRetentionDays: z.number().default(30),
    enableRealTimeAnalytics: z.boolean().default(true),
  }),
});

export type DevToolsConfig = z.infer<typeof devToolsConfigSchema>;

/**
 * Default development tools configuration
 */
export const defaultDevToolsConfig: DevToolsConfig = {
  hotReload: {
    enabled: true,
    enableFileWatching: true,
    enableComponentReload: true,
    enableStyleReload: true,
    enableStatePreservation: true,
    watchPatterns: [
      'src/**/*.{ts,tsx,js,jsx}',
      'src/**/*.{css,scss,sass}',
      'public/**/*',
    ],
    ignorePatterns: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
    ],
    reloadDelay: 300,
  },
  debugging: {
    enabled: true,
    enableSourceMaps: true,
    enableReactDevTools: true,
    enableReduxDevTools: true,
    enableNetworkDebugging: true,
    enablePerformanceDebugging: true,
    enableMemoryDebugging: false,
    debugPort: 9229,
    enableRemoteDebugging: false,
  },
  devServer: {
    enabled: true,
    port: 3000,
    host: 'localhost',
    enableHTTPS: false,
    enableProxy: false,
    proxyTarget: 'http://localhost:8080',
    enableCORS: true,
    enableCompression: true,
    enableHistoryApiFallback: true,
  },
  mockData: {
    enabled: true,
    enableAPIMocking: true,
    enableDatabaseMocking: false,
    enableFileSystemMocking: false,
    mockDataPath: './src/mocks',
    enableDynamicMocking: true,
    enableMockDelay: true,
    mockDelayRange: {
      min: 100,
      max: 1000,
    },
  },
  testing: {
    enabled: true,
    enableUnitTests: true,
    enableIntegrationTests: true,
    enableE2ETests: true,
    enableVisualRegressionTests: false,
    enablePerformanceTests: false,
    testCoverageThreshold: 80,
    enableTestCoverage: true,
    enableTestParallelization: true,
  },
  codeQuality: {
    enabled: true,
    enableESLint: true,
    enablePrettier: true,
    enableTypeScript: true,
    enableImportSorting: true,
    enableUnusedImportDetection: true,
    enableCodeDuplicationDetection: false,
    enableSecurityScanning: false,
  },
  utilities: {
    enabled: true,
    enableCodeGeneration: true,
    enableComponentScaffolding: true,
    enableAPIClientGeneration: true,
    enableDatabaseMigration: false,
    enableSeedData: false,
    enableBackupRestore: false,
    enableDataExport: true,
  },
  performanceMonitoring: {
    enabled: true,
    enableBundleAnalysis: true,
    enablePerformanceProfiling: true,
    enableMemoryLeakDetection: false,
    enableSlowComponentDetection: true,
    enableNetworkMonitoring: true,
    performanceThresholds: {
      bundleSize: 1024 * 1024,
      renderTime: 100,
      memoryUsage: 100 * 1024 * 1024,
    },
  },
  environment: {
    enableEnvironmentSwitching: true,
    enableEnvironmentValidation: true,
    enableEnvironmentComparison: true,
    enableEnvironmentBackup: false,
    environmentFiles: [
      '.env.development',
      '.env.staging',
      '.env.production',
      '.env.local',
    ],
  },
  documentation: {
    enabled: true,
    enableAutoDocumentation: true,
    enableStorybook: true,
    enableComponentDocumentation: true,
    enableAPIDocumentation: true,
    enableArchitectureDocumentation: false,
    documentationPath: './docs',
  },
  security: {
    enabled: true,
    enableSecurityScanning: false,
    enableDependencyAudit: true,
    enableVulnerabilityScanning: false,
    enableSecretsDetection: true,
    enableSecurityHeaders: true,
    enableCSRFProtection: true,
  },
  analytics: {
    enabled: true,
    enableUsageTracking: true,
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    enableFeatureUsageTracking: true,
    analyticsRetentionDays: 30,
    enableRealTimeAnalytics: true,
  },
};

