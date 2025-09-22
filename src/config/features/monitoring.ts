import { z } from 'zod';

/**
 * Monitoring feature configuration schema
 */
export const monitoringConfigSchema = z.object({
  // Logging Configuration
  logging: z.object({
    enabled: z.boolean().default(true),
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    format: z.enum(['json', 'text', 'pretty']).default('json'),
    enableConsoleLogging: z.boolean().default(true),
    enableFileLogging: z.boolean().default(false),
    logDirectory: z.string().default('./logs'),
    maxLogFileSize: z.number().default(10 * 1024 * 1024), // 10MB
    maxLogFiles: z.number().default(5),
    enableLogRotation: z.boolean().default(true),
    enableStructuredLogging: z.boolean().default(true),
  }),

  // Performance Monitoring
  performance: z.object({
    enabled: z.boolean().default(true),
    enableMetricsCollection: z.boolean().default(true),
    enablePerformanceTracking: z.boolean().default(true),
    enableMemoryMonitoring: z.boolean().default(true),
    enableCPUMonitoring: z.boolean().default(true),
    enableNetworkMonitoring: z.boolean().default(true),
    metricsInterval: z.number().default(60000), // 1 minute
    enableSlowQueryLogging: z.boolean().default(true),
    slowQueryThreshold: z.number().default(1000), // 1 second
  }),

  // Error Tracking
  errorTracking: z.object({
    enabled: z.boolean().default(true),
    enableErrorReporting: z.boolean().default(true),
    enableStackTraceCapture: z.boolean().default(true),
    enableErrorAggregation: z.boolean().default(true),
    enableErrorNotifications: z.boolean().default(true),
    errorNotificationThreshold: z.number().default(10),
    enableErrorDashboard: z.boolean().default(true),
    errorRetentionDays: z.number().default(30),
  }),

  // Health Checks
  healthChecks: z.object({
    enabled: z.boolean().default(true),
    enableDatabaseHealthCheck: z.boolean().default(true),
    enableAPIConnectivityCheck: z.boolean().default(true),
    enableExternalServiceCheck: z.boolean().default(true),
    healthCheckInterval: z.number().default(30000), // 30 seconds
    healthCheckTimeout: z.number().default(5000), // 5 seconds
    enableHealthCheckEndpoint: z.boolean().default(true),
    healthCheckEndpoint: z.string().default('/health'),
  }),

  // Application Metrics
  applicationMetrics: z.object({
    enabled: z.boolean().default(true),
    enableRequestMetrics: z.boolean().default(true),
    enableResponseTimeMetrics: z.boolean().default(true),
    enableThroughputMetrics: z.boolean().default(true),
    enableErrorRateMetrics: z.boolean().default(true),
    enableUserMetrics: z.boolean().default(true),
    enableBusinessMetrics: z.boolean().default(true),
    metricsRetentionDays: z.number().default(90),
  }),

  // Alerting Configuration
  alerting: z.object({
    enabled: z.boolean().default(true),
    enableEmailAlerts: z.boolean().default(true),
    enableSlackAlerts: z.boolean().default(false),
    enableWebhookAlerts: z.boolean().default(false),
    alertThresholds: z.object({
      errorRate: z.number().default(0.05), // 5%
      responseTime: z.number().default(2000), // 2 seconds
      memoryUsage: z.number().default(0.8), // 80%
      cpuUsage: z.number().default(0.8), // 80%
      diskUsage: z.number().default(0.9), // 90%
    }),
    enableAlertCooldown: z.boolean().default(true),
    alertCooldownPeriod: z.number().default(300000), // 5 minutes
  }),

  // Dashboard Configuration
  dashboard: z.object({
    enabled: z.boolean().default(true),
    enableRealTimeDashboard: z.boolean().default(true),
    enableHistoricalDashboard: z.boolean().default(true),
    enableCustomDashboards: z.boolean().default(false),
    dashboardRefreshInterval: z.number().default(30000), // 30 seconds
    enableDashboardSharing: z.boolean().default(false),
    maxCustomDashboards: z.number().default(5),
  }),

  // Analytics Configuration
  analytics: z.object({
    enabled: z.boolean().default(true),
    enableUsageAnalytics: z.boolean().default(true),
    enablePerformanceAnalytics: z.boolean().default(true),
    enableBusinessAnalytics: z.boolean().default(true),
    enableUserBehaviorAnalytics: z.boolean().default(false),
    analyticsRetentionDays: z.number().default(365),
    enableAnalyticsExport: z.boolean().default(true),
    enableRealTimeAnalytics: z.boolean().default(true),
  }),

  // External Monitoring Services
  externalServices: z.object({
    enableSentry: z.boolean().default(false),
    enableDataDog: z.boolean().default(false),
    enableNewRelic: z.boolean().default(false),
    enablePrometheus: z.boolean().default(false),
    enableGrafana: z.boolean().default(false),
    customServiceEndpoints: z.array(z.string()).default([]),
  }),

  // Security Monitoring
  securityMonitoring: z.object({
    enabled: z.boolean().default(true),
    enableSecurityEventLogging: z.boolean().default(true),
    enableIntrusionDetection: z.boolean().default(false),
    enableAnomalyDetection: z.boolean().default(false),
    enableSecurityAlerts: z.boolean().default(true),
    securityEventRetentionDays: z.number().default(90),
  }),
});

export type MonitoringConfig = z.infer<typeof monitoringConfigSchema>;

/**
 * Default monitoring configuration
 */
export const defaultMonitoringConfig: MonitoringConfig = {
  logging: {
    enabled: true,
    level: 'info',
    format: 'json',
    enableConsoleLogging: true,
    enableFileLogging: false,
    logDirectory: './logs',
    maxLogFileSize: 10 * 1024 * 1024,
    maxLogFiles: 5,
    enableLogRotation: true,
    enableStructuredLogging: true,
  },
  performance: {
    enabled: true,
    enableMetricsCollection: true,
    enablePerformanceTracking: true,
    enableMemoryMonitoring: true,
    enableCPUMonitoring: true,
    enableNetworkMonitoring: true,
    metricsInterval: 60000,
    enableSlowQueryLogging: true,
    slowQueryThreshold: 1000,
  },
  errorTracking: {
    enabled: true,
    enableErrorReporting: true,
    enableStackTraceCapture: true,
    enableErrorAggregation: true,
    enableErrorNotifications: true,
    errorNotificationThreshold: 10,
    enableErrorDashboard: true,
    errorRetentionDays: 30,
  },
  healthChecks: {
    enabled: true,
    enableDatabaseHealthCheck: true,
    enableAPIConnectivityCheck: true,
    enableExternalServiceCheck: true,
    healthCheckInterval: 30000,
    healthCheckTimeout: 5000,
    enableHealthCheckEndpoint: true,
    healthCheckEndpoint: '/health',
  },
  applicationMetrics: {
    enabled: true,
    enableRequestMetrics: true,
    enableResponseTimeMetrics: true,
    enableThroughputMetrics: true,
    enableErrorRateMetrics: true,
    enableUserMetrics: true,
    enableBusinessMetrics: true,
    metricsRetentionDays: 90,
  },
  alerting: {
    enabled: true,
    enableEmailAlerts: true,
    enableSlackAlerts: false,
    enableWebhookAlerts: false,
    alertThresholds: {
      errorRate: 0.05,
      responseTime: 2000,
      memoryUsage: 0.8,
      cpuUsage: 0.8,
      diskUsage: 0.9,
    },
    enableAlertCooldown: true,
    alertCooldownPeriod: 300000,
  },
  dashboard: {
    enabled: true,
    enableRealTimeDashboard: true,
    enableHistoricalDashboard: true,
    enableCustomDashboards: false,
    dashboardRefreshInterval: 30000,
    enableDashboardSharing: false,
    maxCustomDashboards: 5,
  },
  analytics: {
    enabled: true,
    enableUsageAnalytics: true,
    enablePerformanceAnalytics: true,
    enableBusinessAnalytics: true,
    enableUserBehaviorAnalytics: false,
    analyticsRetentionDays: 365,
    enableAnalyticsExport: true,
    enableRealTimeAnalytics: true,
  },
  externalServices: {
    enableSentry: false,
    enableDataDog: false,
    enableNewRelic: false,
    enablePrometheus: false,
    enableGrafana: false,
    customServiceEndpoints: [],
  },
  securityMonitoring: {
    enabled: true,
    enableSecurityEventLogging: true,
    enableIntrusionDetection: false,
    enableAnomalyDetection: false,
    enableSecurityAlerts: true,
    securityEventRetentionDays: 90,
  },
};

