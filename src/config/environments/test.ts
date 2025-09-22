import { type FeatureConfigs } from '../features';

/**
 * Test environment configuration
 * 
 * This configuration is optimized for testing with minimal resources,
 * fast execution, and isolated test data.
 */
const testConfig: Partial<FeatureConfigs> = {
  auth: {
    session: {
      timeout: 60 * 60 * 1000, // 1 hour for tests
      refreshThreshold: 5 * 60 * 1000,
      maxConcurrentSessions: 1,
      secure: false, // Allow HTTP in tests
      httpOnly: true,
      sameSite: 'lax',
    },
    jwt: {
      secret: 'test-jwt-secret-key',
      algorithm: 'HS256',
      expiresIn: '1h',
      refreshExpiresIn: '1d',
      issuer: 'fragrance-app-test',
      audience: 'fragrance-users-test',
    },
    passwordPolicy: {
      minLength: 4, // Minimal requirements for tests
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      historyCount: 1,
    },
    accountSecurity: {
      maxLoginAttempts: 100, // Very lenient for tests
      lockoutDuration: 1000, // 1 second
      requireEmailVerification: false,
      requirePhoneVerification: false,
      twoFactorEnabled: false,
      backupCodesCount: 1,
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting in tests
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
      timeout: 5000, // Short timeout for tests
      retries: 0, // No retries in tests
      retryDelay: 100,
      maxRetryDelay: 1000,
      retryMultiplier: 2,
      enableLogging: false, // Disable logging in tests
      logLevel: 'error',
    },
    httpClient: {
      timeout: 5000,
      keepAlive: false, // Disable keep-alive in tests
      maxSockets: 1,
      maxFreeSockets: 1,
      keepAliveMsecs: 1000,
      userAgent: 'FragranceApp-Test/1.0',
      followRedirects: true,
      maxRedirects: 1,
    },
    caching: {
      enabled: false, // Disable caching in tests
      defaultTTL: 0,
      maxSize: 0,
      strategy: 'lru',
      cacheKeyPrefix: 'test:',
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting in tests
      windowMs: 15 * 60 * 1000,
      maxRequests: 10000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
    },
    errorHandling: {
      includeStackTrace: true, // Include stack traces in tests
      logErrors: false, // Disable error logging in tests
    },
    monitoring: {
      enabled: false, // Disable monitoring in tests
      collectMetrics: false,
      collectTraces: false,
      sampleRate: 0,
      metricsEndpoint: '/metrics',
      healthCheckInterval: 60000,
    },
  },

  database: {
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT || '5432'),
      database: process.env.TEST_DB_NAME || 'fragrance_test',
      username: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'password',
      ssl: false, // Disable SSL in tests
      sslMode: 'disable',
      connectionTimeout: 5000, // Short timeout for tests
      idleTimeout: 5000,
      maxConnections: 1, // Minimal connections for tests
      minConnections: 1,
    },
    pooling: {
      enabled: false, // Disable pooling in tests
      maxPoolSize: 1,
      minPoolSize: 1,
      acquireTimeoutMillis: 5000,
      createTimeoutMillis: 5000,
      destroyTimeoutMillis: 1000,
      idleTimeoutMillis: 10000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      validationQuery: 'SELECT 1',
      validationQueryTimeout: 1000,
    },
    query: {
      timeout: 5000, // Short timeout for tests
      maxQueryLength: 1000, // Shorter queries for tests
      enableQueryLogging: false, // Disable query logging in tests
      logSlowQueries: false,
      slowQueryThreshold: 100,
      enableQueryCache: false, // Disable query cache in tests
      queryCacheSize: 0,
    },
    migrations: {
      enabled: true,
      tableName: 'migrations',
      directory: './migrations',
      runOnStartup: true, // Run migrations on startup in tests
      backupBeforeMigration: false, // Disable backups in tests
      backupDirectory: './backups',
    },
    backup: {
      enabled: false, // Disable backups in tests
      schedule: '0 3 * * *',
      retentionDays: 1,
      compression: false,
      encryption: false,
      backupDirectory: './backups',
      maxBackupSize: 1024 * 1024, // 1MB
    },
    monitoring: {
      enabled: false, // Disable monitoring in tests
      healthCheckInterval: 60000,
      metricsCollection: false,
      slowQueryLogging: false,
      connectionMonitoring: false,
      deadlockDetection: false,
    },
  },

  ui: {
    theme: {
      defaultTheme: 'light', // Default to light theme in tests
      enableThemeSwitching: false, // Disable theme switching in tests
      customThemes: [],
      themePersistence: false, // Disable persistence in tests
    },
    animation: {
      enabled: false, // Disable animations in tests
      duration: {
        fast: 0,
        normal: 0,
        slow: 0,
      },
      easing: {
        linear: 'linear',
        easeIn: 'linear',
        easeOut: 'linear',
        easeInOut: 'linear',
      },
      reduceMotion: true,
    },
    accessibility: {
      enabled: true,
      highContrast: false,
      focusVisible: true,
      skipLinks: true,
      ariaLabels: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      colorContrastRatio: 4.5,
    },
    performance: {
      lazyLoading: false, // Disable lazy loading in tests
      imageOptimization: false,
      codeSplitting: false,
      preloading: false,
      caching: false,
      compression: false,
    },
  },

  ingredients: {
    management: {
      enableCRUD: true,
      enableBulkOperations: true,
      enableSoftDelete: true,
      enableVersioning: false,
      maxIngredientsPerUser: 10, // Small limit for tests
      enableIngredientCategories: true,
      enableIngredientTags: true,
    },
    importExport: {
      enableCSVImport: true,
      enableCSVExport: true,
      enableJSONImport: true,
      enableJSONExport: true,
      maxFileSize: 1024 * 1024, // 1MB for tests
      allowedFileTypes: ['.csv', '.json'],
      csvDelimiter: ',',
      csvEncoding: 'utf-8',
      batchSize: 10, // Small batch size for tests
      enableValidation: true,
      enableProgressTracking: false, // Disable progress tracking in tests
    },
    validation: {
      requiredFields: ['name'],
      optionalFields: ['description', 'notes', 'tags', 'category'],
      fieldLengths: {
        name: { min: 1, max: 50 },
        description: { min: 0, max: 100 },
        notes: { min: 0, max: 100 },
        category: { min: 0, max: 20 },
      },
      enableDuplicateDetection: false, // Disable duplicate detection in tests
      duplicateThreshold: 0.8,
      enableDataCleaning: false, // Disable data cleaning in tests
    },
    search: {
      enableFullTextSearch: true,
      enableFuzzySearch: false, // Disable fuzzy search in tests
      enableAutoComplete: false, // Disable auto-complete in tests
      searchFields: ['name', 'description'],
      maxSearchResults: 10, // Small limit for tests
      enableSearchHistory: false, // Disable search history in tests
      searchHistoryLimit: 5,
      enableSearchSuggestions: false, // Disable search suggestions in tests
    },
    pagination: {
      defaultPageSize: 5, // Small page size for tests
      pageSizeOptions: [5, 10],
      enableInfiniteScroll: false,
      enableVirtualScrolling: false,
      maxPageSize: 20,
    },
    performance: {
      enableCaching: false, // Disable caching in tests
      cacheTTL: 0,
      enableLazyLoading: false,
      enableImageOptimization: false,
      enableDataCompression: false,
    },
  },

  caseManagement: {
    workflow: {
      enableWorkflowEngine: true,
      enableStateTransitions: true,
      enableWorkflowTemplates: true,
      enableCustomWorkflows: false, // Disable custom workflows in tests
      maxWorkflowSteps: 5, // Small limit for tests
      enableParallelProcessing: false,
      enableWorkflowHistory: false, // Disable workflow history in tests
    },
    statusManagement: {
      enableStatusTracking: true,
      predefinedStatuses: [
        { name: 'New', description: 'Newly created case', color: '#3b82f6', isActive: true, isFinal: false },
        { name: 'Resolved', description: 'Case has been resolved', color: '#10b981', isActive: true, isFinal: true },
      ],
      enableCustomStatuses: false, // Disable custom statuses in tests
      maxCustomStatuses: 0,
      enableStatusTransitions: true,
    },
    assignment: {
      enableAutoAssignment: false,
      enableRoundRobin: false,
      enableSkillBasedAssignment: false,
      enableWorkloadBalancing: false,
      maxCasesPerAgent: 10, // Small limit for tests
      enableEscalation: false, // Disable escalation in tests
      escalationTimeout: 1000, // 1 second
    },
    notifications: {
      enableCaseNotifications: false, // Disable notifications in tests
      enableStatusChangeNotifications: false,
      enableAssignmentNotifications: false,
      enableSLAAlerts: false,
      enableEscalationNotifications: false,
      notificationChannels: [],
      enableNotificationTemplates: false,
    },
    performance: {
      enableCaching: false, // Disable caching in tests
      cacheTTL: 0,
      enableLazyLoading: false,
      enablePagination: true,
      defaultPageSize: 5,
      maxPageSize: 10,
    },
  },

  monitoring: {
    logging: {
      enabled: false, // Disable logging in tests
      level: 'error',
      format: 'text',
      enableConsoleLogging: false,
      enableFileLogging: false,
      logDirectory: './logs',
      maxLogFileSize: 1024 * 1024,
      maxLogFiles: 1,
      enableLogRotation: false,
      enableStructuredLogging: false,
    },
    performance: {
      enabled: false, // Disable performance monitoring in tests
      enableMetricsCollection: false,
      enablePerformanceTracking: false,
      enableMemoryMonitoring: false,
      enableCPUMonitoring: false,
      enableNetworkMonitoring: false,
      metricsInterval: 60000,
      enableSlowQueryLogging: false,
      slowQueryThreshold: 1000,
    },
    errorTracking: {
      enabled: false, // Disable error tracking in tests
      enableErrorReporting: false,
      enableStackTraceCapture: false,
      enableErrorAggregation: false,
      enableErrorNotifications: false,
      errorNotificationThreshold: 100,
      enableErrorDashboard: false,
      errorRetentionDays: 1,
    },
    healthChecks: {
      enabled: false, // Disable health checks in tests
      enableDatabaseHealthCheck: false,
      enableAPIConnectivityCheck: false,
      enableExternalServiceCheck: false,
      healthCheckInterval: 60000,
      healthCheckTimeout: 1000,
      enableHealthCheckEndpoint: false,
      healthCheckEndpoint: '/health',
    },
    alerting: {
      enabled: false, // Disable alerting in tests
      enableEmailAlerts: false,
      enableSlackAlerts: false,
      enableWebhookAlerts: false,
      alertThresholds: {
        errorRate: 0.1,
        responseTime: 5000,
        memoryUsage: 0.9,
        cpuUsage: 0.9,
        diskUsage: 0.95,
      },
      enableAlertCooldown: false,
      alertCooldownPeriod: 0,
    },
    analytics: {
      enabled: false, // Disable analytics in tests
      enableUsageAnalytics: false,
      enablePerformanceAnalytics: false,
      enableBusinessAnalytics: false,
      enableUserBehaviorAnalytics: false,
      analyticsRetentionDays: 1,
      enableAnalyticsExport: false,
      enableRealTimeAnalytics: false,
    },
  },

  security: {
    cors: {
      enabled: false, // Disable CORS in tests
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: [],
      credentials: true,
      maxAge: 86400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting in tests
      windowMs: 15 * 60 * 1000,
      maxRequests: 10000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
      enableRedis: false,
    },
    csrf: {
      enabled: false, // Disable CSRF in tests
      secret: 'test-csrf-secret',
      cookieName: '_csrf',
      cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000,
      },
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH'],
      ignorePaths: ['*'],
    },
    securityHeaders: {
      enabled: false, // Disable security headers in tests
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'",
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
      enableDynamicHeaders: false,
    },
    inputValidation: {
      enabled: true,
      enableXSSProtection: true,
      enableSQLInjectionProtection: true,
      enableNoSQLInjectionProtection: true,
      enableCommandInjectionProtection: true,
      maxInputLength: 1000, // Smaller limit for tests
      enableInputSanitization: true,
      allowedFileTypes: ['.txt', '.json'], // Minimal file types for tests
      maxFileSize: 1024 * 1024, // 1MB
    },
    auditLogging: {
      enabled: false, // Disable audit logging in tests
      enableSecurityEvents: false,
      enableAccessLogging: false,
      enableDataChanges: false,
      enableFailedAttempts: false,
      logRetentionDays: 1,
      enableRealTimeAlerts: false,
      alertThresholds: {
        failedLogins: 100,
        suspiciousActivity: 100,
        dataAccess: 1000,
      },
    },
  },

  files: {
    upload: {
      enabled: true,
      maxFileSize: 1024 * 1024, // 1MB for tests
      maxFilesPerRequest: 1, // Single file for tests
      allowedMimeTypes: [
        'text/plain',
        'application/json',
      ],
      allowedExtensions: [
        '.txt', '.json',
      ],
      enableChunkedUpload: false,
      chunkSize: 1024,
      enableResumeUpload: false,
      uploadTimeout: 5000, // 5 seconds
    },
    storage: {
      provider: 'local',
      localPath: './uploads/test',
      enableSubdirectories: false, // Disable subdirectories in tests
      subdirectoryStructure: 'date',
      customSubdirectoryPattern: '{year}/{month}/{day}',
      enableFileVersioning: false,
      maxVersions: 1,
    },
    processing: {
      enableImageProcessing: false, // Disable image processing in tests
      enableImageResize: false,
      enableImageCompression: false,
      enableThumbnailGeneration: false,
      imageFormats: [],
      thumbnailSizes: [],
      enableWatermarking: false,
      watermarkText: '',
      watermarkPosition: 'bottom-right',
    },
    validation: {
      enableVirusScanning: false, // Disable virus scanning in tests
      enableContentValidation: true,
      enableFileIntegrityCheck: false, // Disable integrity check in tests
      enableMetadataValidation: false, // Disable metadata validation in tests
      maxFileNameLength: 50, // Shorter limit for tests
      allowedFileNamePattern: '^[a-zA-Z0-9._-]+$',
      enableDuplicateDetection: false,
      duplicateDetectionMethod: 'hash',
    },
    accessControl: {
      enablePublicAccess: true, // Allow public access in tests
      enablePrivateAccess: true,
      enableSignedUrls: false, // Disable signed URLs in tests
      signedUrlExpiration: 3600,
      enableAccessLogging: false, // Disable access logging in tests
      enableDownloadTracking: false, // Disable download tracking in tests
      enablePermissionBasedAccess: false, // Disable permission-based access in tests
    },
    cleanup: {
      enableAutomaticCleanup: false, // Disable cleanup in tests
      cleanupSchedule: '0 2 * * *',
      orphanedFileRetentionDays: 1,
      temporaryFileRetentionHours: 1,
      enableSoftDelete: false, // Disable soft delete in tests
      softDeleteRetentionDays: 1,
      enableHardDelete: false,
      hardDeleteRetentionDays: 1,
    },
    performance: {
      enableCaching: false, // Disable caching in tests
      cacheTTL: 0,
      enableLazyLoading: false,
      enablePreloading: false,
      enableCompression: false,
      compressionLevel: 1,
      enableStreaming: false,
    },
    security: {
      enableFileEncryption: false, // Disable file encryption in tests
      enableAccessAudit: false, // Disable access audit in tests
      enableMalwareScanning: false,
      enableContentFiltering: false,
      blockedContentTypes: [],
      enableQuarantine: false,
      quarantineLocation: './quarantine',
    },
  },

  notifications: {
    email: {
      enabled: false, // Disable email in tests
      provider: 'smtp',
      smtp: {
        host: 'localhost',
        port: 1025,
        secure: false,
        username: '',
        password: '',
        from: 'test@fragrance-app.com',
        replyTo: 'test@fragrance-app.com',
      },
      enableHTML: false, // Disable HTML in tests
      enableTextFallback: true,
      maxRecipients: 1,
      rateLimit: 1000,
    },
    sms: {
      enabled: false, // Disable SMS in tests
      provider: 'twilio',
      rateLimit: 1000,
      maxLength: 160,
    },
    push: {
      enabled: false, // Disable push notifications in tests
      provider: 'fcm',
      enableBatchSending: false,
      batchSize: 1,
    },
    inApp: {
      enabled: false, // Disable in-app notifications in tests
      enableRealTime: false,
      enablePersistentStorage: false,
      maxNotifications: 1,
      notificationTTL: 1000, // 1 second
      enableNotificationGroups: false,
      enableNotificationActions: false,
    },
    webhooks: {
      enabled: false, // Disable webhooks in tests
      endpoints: [],
      enableRetry: false,
      maxRetries: 0,
      retryDelay: 0,
    },
    templates: {
      enabled: false, // Disable templates in tests
      enableCustomTemplates: false,
      defaultTemplates: {},
      enableTemplateVersioning: false,
      enableTemplateTesting: false,
    },
    scheduling: {
      enabled: false, // Disable scheduling in tests
      enableDelayedNotifications: false,
      enableScheduledNotifications: false,
      enableRecurringNotifications: false,
      maxDelayHours: 0,
      enableTimezoneSupport: false,
      defaultTimezone: 'UTC',
    },
    preferences: {
      enabled: false, // Disable preferences in tests
      enableUserPreferences: false,
      enableChannelPreferences: false,
      enableFrequencyPreferences: false,
      defaultPreferences: {
        email: false,
        sms: false,
        push: false,
        inApp: false,
      },
      enableOptOut: false,
      enableUnsubscribe: false,
    },
    analytics: {
      enabled: false, // Disable analytics in tests
      enableDeliveryTracking: false,
      enableOpenTracking: false,
      enableClickTracking: false,
      enableBounceTracking: false,
      enableUnsubscribeTracking: false,
      analyticsRetentionDays: 1,
      enableAnalyticsExport: false,
      enableRealTimeAnalytics: false,
    },
    performance: {
      enableQueue: false, // Disable queue in tests
      queueProvider: 'memory',
      maxConcurrentJobs: 1,
      jobTimeout: 1000, // 1 second
      enableBatchProcessing: false,
      batchSize: 1,
      enableRetryMechanism: false,
      maxRetries: 0,
      retryDelay: 0,
    },
  },

  featureFlags: {
    management: {
      enabled: false, // Disable feature flags in tests
      enableRuntimeToggles: false,
      enableUserTargeting: false,
      enableEnvironmentOverrides: false,
      enableABTesting: false,
      enableGradualRollout: false,
      enableFeatureDependencies: false,
    },
    storage: {
      provider: 'memory', // Use memory storage in tests
      enableCaching: false,
      cacheTTL: 0,
      enablePersistence: false,
      enableBackup: false,
      backupInterval: 0,
    },
    defaultFlags: {
      'new-dashboard': {
        enabled: false,
        description: 'Enable the new dashboard interface',
        type: 'boolean',
        defaultValue: false,
        environments: {},
      },
      'advanced-search': {
        enabled: false,
        description: 'Enable advanced search functionality',
        type: 'boolean',
        defaultValue: false,
        environments: {},
      },
      'dark-mode': {
        enabled: false,
        description: 'Enable dark mode theme',
        type: 'boolean',
        defaultValue: false,
        environments: {},
      },
      'api-v2': {
        enabled: false,
        description: 'Enable API version 2 endpoints',
        type: 'boolean',
        defaultValue: false,
        environments: {},
      },
      'beta-features': {
        enabled: false,
        description: 'Enable beta features for testing',
        type: 'boolean',
        defaultValue: false,
        environments: {},
      },
    },
    environmentOverrides: {
      enabled: false, // Disable environment overrides in tests
      enableDevelopmentOverrides: false,
      enableStagingOverrides: false,
      enableProductionOverrides: false,
      overridePrefix: 'FEATURE_',
      enableLocalOverrides: false,
      localOverrideFile: '.env.local',
    },
    performance: {
      enableCaching: false, // Disable caching in tests
      cacheTTL: 0,
      enableLazyLoading: false,
      enablePreloading: false,
      maxCacheSize: 0,
      enableCompression: false,
    },
    security: {
      enableFlagEncryption: false, // Disable flag encryption in tests
      enableAccessControl: false,
      enableAuditLogging: false,
      enableFlagValidation: false,
      enableSensitiveFlagProtection: false,
      sensitiveFlagPatterns: [],
    },
  },

  devTools: {
    hotReload: {
      enabled: false, // Disable hot reload in tests
      enableFileWatching: false,
      enableComponentReload: false,
      enableStyleReload: false,
      enableStatePreservation: false,
      watchPatterns: [],
      ignorePatterns: [],
      reloadDelay: 0,
    },
    debugging: {
      enabled: false, // Disable debugging in tests
      enableSourceMaps: false,
      enableReactDevTools: false,
      enableReduxDevTools: false,
      enableNetworkDebugging: false,
      enablePerformanceDebugging: false,
      enableMemoryDebugging: false,
      debugPort: 9229,
      enableRemoteDebugging: false,
    },
    devServer: {
      enabled: false, // Disable dev server in tests
      port: 3000,
      host: 'localhost',
      enableHTTPS: false,
      enableProxy: false,
      proxyTarget: 'http://localhost:8080',
      enableCORS: false,
      enableCompression: false,
      enableHistoryApiFallback: false,
    },
    mockData: {
      enabled: true, // Enable mock data in tests
      enableAPIMocking: true,
      enableDatabaseMocking: true,
      enableFileSystemMocking: true,
      mockDataPath: './src/mocks',
      enableDynamicMocking: true,
      enableMockDelay: false, // Disable mock delay in tests
      mockDelayRange: {
        min: 0,
        max: 0,
      },
    },
    testing: {
      enabled: true,
      enableUnitTests: true,
      enableIntegrationTests: true,
      enableE2ETests: true,
      enableVisualRegressionTests: false, // Disable visual regression tests in tests
      enablePerformanceTests: false, // Disable performance tests in tests
      testCoverageThreshold: 0, // No coverage threshold in tests
      enableTestCoverage: true,
      enableTestParallelization: false, // Disable parallelization in tests
    },
    codeQuality: {
      enabled: false, // Disable code quality tools in tests
      enableESLint: false,
      enablePrettier: false,
      enableTypeScript: false,
      enableImportSorting: false,
      enableUnusedImportDetection: false,
      enableCodeDuplicationDetection: false,
      enableSecurityScanning: false,
    },
    utilities: {
      enabled: false, // Disable utilities in tests
      enableCodeGeneration: false,
      enableComponentScaffolding: false,
      enableAPIClientGeneration: false,
      enableDatabaseMigration: false,
      enableSeedData: false,
      enableBackupRestore: false,
      enableDataExport: false,
    },
    performanceMonitoring: {
      enabled: false, // Disable performance monitoring in tests
      enableBundleAnalysis: false,
      enablePerformanceProfiling: false,
      enableMemoryLeakDetection: false,
      enableSlowComponentDetection: false,
      enableNetworkMonitoring: false,
      performanceThresholds: {
        bundleSize: 0,
        renderTime: 0,
        memoryUsage: 0,
      },
    },
    environment: {
      enableEnvironmentSwitching: false, // Disable environment switching in tests
      enableEnvironmentValidation: false,
      enableEnvironmentComparison: false,
      enableEnvironmentBackup: false,
      environmentFiles: [],
    },
    documentation: {
      enabled: false, // Disable documentation in tests
      enableAutoDocumentation: false,
      enableStorybook: false,
      enableComponentDocumentation: false,
      enableAPIDocumentation: false,
      enableArchitectureDocumentation: false,
      documentationPath: './docs',
    },
    security: {
      enabled: false, // Disable security tools in tests
      enableSecurityScanning: false,
      enableDependencyAudit: false,
      enableVulnerabilityScanning: false,
      enableSecretsDetection: false,
      enableSecurityHeaders: false,
      enableCSRFProtection: false,
    },
    analytics: {
      enabled: false, // Disable analytics in tests
      enableUsageTracking: false,
      enableErrorTracking: false,
      enablePerformanceTracking: false,
      enableFeatureUsageTracking: false,
      analyticsRetentionDays: 1,
      enableRealTimeAnalytics: false,
    },
  },
};

export default testConfig;

