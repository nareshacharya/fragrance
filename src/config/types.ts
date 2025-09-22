import { z } from 'zod';
import { 
  type AuthConfig,
  type ApiConfig,
  type DatabaseConfig,
  type UiConfig,
  type IngredientsConfig,
  type CaseManagementConfig,
  type MonitoringConfig,
  type FilesConfig,
  type NotificationsConfig,
  type FeatureFlagsConfig,
  type DevToolsConfig,
  type FeatureConfigs,
  type FeatureName
} from './features';

/**
 * Configuration types and interfaces
 */

// Environment types
export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface EnvironmentConfig {
  name: Environment;
  description: string;
  features: Partial<FeatureConfigs>;
  overrides: Record<string, any>;
}

// Configuration loading types
export interface ConfigLoadOptions {
  enableHotReload?: boolean;
  enableCaching?: boolean;
  cacheTTL?: number;
  validateOnLoad?: boolean;
  environment?: Environment;
}

export interface ConfigCacheInfo {
  size: number;
  keys: string[];
  timestamps: Record<string, number>;
}

// Configuration validation types
export interface ValidationError {
  path: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationOptions {
  strict?: boolean;
  environment?: Environment;
  includeWarnings?: boolean;
}

// Configuration change detection types
export interface ConfigChangeEvent {
  type: 'feature' | 'environment' | 'global';
  featureName?: FeatureName;
  timestamp: number;
  changes: Record<string, any>;
}

export type ConfigChangeListener = (event: ConfigChangeEvent) => void;

// Feature flag types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'json';
  defaultValue: any;
  environments: Record<Environment, boolean>;
  targeting: {
    enabled: boolean;
    rules: TargetingRule[];
  };
}

export interface TargetingRule {
  name: string;
  condition: string;
  percentage: number;
  enabled: boolean;
}

export interface FeatureFlagEvaluation {
  flagName: string;
  enabled: boolean;
  value: any;
  reason: string;
  timestamp: number;
}

// Configuration schema types
export interface ConfigSchema {
  name: string;
  version: string;
  features: Record<FeatureName, z.ZodSchema>;
  environment: z.ZodSchema;
  validation: z.ZodSchema;
}

// Configuration migration types
export interface ConfigMigration {
  fromVersion: string;
  toVersion: string;
  steps: MigrationStep[];
}

export interface MigrationStep {
  name: string;
  description: string;
  transform: (config: any) => any;
  rollback?: (config: any) => any;
}

export interface MigrationResult {
  success: boolean;
  migratedConfig: any;
  warnings: string[];
  errors: string[];
}

// Configuration health check types
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  score: number;
  issues: HealthIssue[];
  recommendations: string[];
  timestamp: number;
}

export interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  suggestion?: string;
}

// Configuration analytics types
export interface ConfigAnalytics {
  usage: Record<string, number>;
  performance: PerformanceMetrics;
  errors: ErrorMetrics;
  changes: ChangeMetrics;
}

export interface PerformanceMetrics {
  loadTime: number;
  validationTime: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export interface ErrorMetrics {
  validationErrors: number;
  loadErrors: number;
  runtimeErrors: number;
  lastError?: string;
}

export interface ChangeMetrics {
  totalChanges: number;
  changesByFeature: Record<FeatureName, number>;
  changesByEnvironment: Record<Environment, number>;
  lastChange?: number;
}

// Configuration export/import types
export interface ConfigExport {
  version: string;
  environment: Environment;
  timestamp: number;
  features: FeatureConfigs;
  metadata: {
    exportedBy: string;
    exportReason: string;
    checksum: string;
  };
}

export interface ConfigImport {
  config: ConfigExport;
  options: {
    overwrite?: boolean;
    validate?: boolean;
    backup?: boolean;
  };
}

export interface ImportResult {
  success: boolean;
  importedFeatures: FeatureName[];
  skippedFeatures: FeatureName[];
  errors: string[];
  warnings: string[];
}

// Configuration template types
export interface ConfigTemplate {
  name: string;
  description: string;
  environment: Environment;
  features: Partial<FeatureConfigs>;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  required: boolean;
  defaultValue?: any;
  validation?: z.ZodSchema;
}

// Configuration comparison types
export interface ConfigComparison {
  added: Record<string, any>;
  removed: Record<string, any>;
  changed: Record<string, { from: any; to: any }>;
  unchanged: Record<string, any>;
}

export interface ComparisonOptions {
  includeUnchanged?: boolean;
  maxDepth?: number;
  ignorePaths?: string[];
}

// Configuration testing types
export interface ConfigTestSuite {
  name: string;
  description: string;
  tests: ConfigTest[];
}

export interface ConfigTest {
  name: string;
  description: string;
  feature: FeatureName;
  config: any;
  expected: any;
  assertions: TestAssertion[];
}

export interface TestAssertion {
  type: 'equals' | 'contains' | 'matches' | 'validates';
  path: string;
  expected: any;
  message?: string;
}

export interface TestResult {
  testName: string;
  success: boolean;
  errors: string[];
  warnings: string[];
  duration: number;
}

// Configuration documentation types
export interface ConfigDocumentation {
  version: string;
  generatedAt: number;
  features: Record<FeatureName, FeatureDocumentation>;
  environment: EnvironmentDocumentation;
  examples: ConfigExample[];
}

export interface FeatureDocumentation {
  name: string;
  description: string;
  schema: any;
  properties: PropertyDocumentation[];
  examples: any[];
  migrationNotes?: string[];
}

export interface PropertyDocumentation {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: any;
  examples: any[];
  validation?: string;
}

export interface EnvironmentDocumentation {
  environments: Record<Environment, EnvironmentInfo>;
  overrides: Record<string, any>;
  examples: Record<Environment, any>;
}

export interface EnvironmentInfo {
  name: string;
  description: string;
  features: Partial<FeatureConfigs>;
  specificSettings: Record<string, any>;
}

export interface ConfigExample {
  name: string;
  description: string;
  environment: Environment;
  config: Partial<FeatureConfigs>;
  useCase: string;
}

// Configuration security types
export interface SecurityConfig {
  encryption: EncryptionConfig;
  access: AccessConfig;
  audit: AuditConfig;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyLength: number;
  fields: string[];
}

export interface AccessConfig {
  enabled: boolean;
  permissions: Record<string, string[]>;
  roles: Record<string, string[]>;
}

export interface AuditConfig {
  enabled: boolean;
  logChanges: boolean;
  logAccess: boolean;
  retentionDays: number;
}

// Configuration performance types
export interface PerformanceConfig {
  caching: CacheConfig;
  optimization: OptimizationConfig;
  monitoring: MonitoringConfig;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'lfu' | 'fifo';
}

export interface OptimizationConfig {
  lazyLoading: boolean;
  compression: boolean;
  minification: boolean;
  bundling: boolean;
}

// Configuration error types
export class ConfigError extends Error {
  constructor(
    message: string,
    public code: string,
    public feature?: FeatureName,
    public path?: string
  ) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: ValidationError[],
    public feature?: FeatureName
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class LoadError extends Error {
  constructor(
    message: string,
    public feature?: FeatureName,
    public environment?: Environment
  ) {
    super(message);
    this.name = 'LoadError';
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ConfigPath<T> = string;

export type ConfigValue<T, P extends ConfigPath<T>> = any;

export type RequiredConfig<T> = {
  [K in keyof T]-?: T[K] extends object ? RequiredConfig<T[K]> : T[K];
};

export type OptionalConfig<T> = {
  [K in keyof T]+?: T[K] extends object ? OptionalConfig<T[K]> : T[K];
};

// Configuration factory types
export interface ConfigFactory<T> {
  create(config: Partial<T>): T;
  validate(config: unknown): T;
  merge(...configs: Partial<T>[]): T;
  clone(config: T): T;
}

// Configuration plugin types
export interface ConfigPlugin {
  name: string;
  version: string;
  features: FeatureName[];
  install(config: FeatureConfigs): FeatureConfigs;
  uninstall(config: FeatureConfigs): FeatureConfigs;
  validate(config: FeatureConfigs): ValidationResult;
}

export interface PluginRegistry {
  plugins: ConfigPlugin[];
  register(plugin: ConfigPlugin): void;
  unregister(pluginName: string): void;
  getPlugin(name: string): ConfigPlugin | undefined;
  getPluginsForFeature(feature: FeatureName): ConfigPlugin[];
}

