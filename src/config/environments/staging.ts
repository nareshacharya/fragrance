import { type FeatureConfigs } from '../features';

/**
 * Staging environment configuration
 * 
 * This configuration is optimized for staging with production-like settings
 * but with additional debugging and monitoring features enabled.
 */
const stagingConfig: Partial<FeatureConfigs> = {
  auth: {
    session: {
      timeout: 8 * 60 * 60 * 1000, // 8 hours for staging
      refreshThreshold: 5 * 60 * 1000,
      maxConcurrentSessions: 5,
      secure: true, // Enable HTTPS in staging
      httpOnly: true,
      sameSite: 'strict',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'staging-jwt-secret-key-change-in-production',
      algorithm: 'HS256',
      expiresIn: '8h',
      refreshExpiresIn: '7d',
      issuer: 'fragrance-app-staging',
      audience: 'fragrance-users-staging',
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      historyCount: 5,
    },
    accountSecurity: {
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      requireEmailVerification: true,
      requirePhoneVerification: false,
      twoFactorEnabled: false,
      backupCodesCount: 10,
    },
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      maxRequests: 200, // Higher limit for staging
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },
  },

  api: {
    pegaDx: {
      baseUrl: process.env.PEGA_DX_BASE_URL || 'https://staging-api.pega.com',
      apiVersion: 'v1',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      maxRetryDelay: 10000,
      retryMultiplier: 2,
      enableLogging: true,
      logLevel: 'info',
    },
    httpClient: {
      timeout: 30000,
      keepAlive: true,
      maxSockets: 15,
      maxFreeSockets: 8,
      keepAliveMsecs: 1000,
      userAgent: 'FragranceApp-Staging/1.0',
      followRedirects: true,
      maxRedirects: 5,
    },
    caching: {
      enabled: true,
      defaultTTL: 300, // 5 minutes
      maxSize: 500,
      strategy: 'lru',
      cacheKeyPrefix: 'staging:',
    },
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      maxRequests: 1000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
    },
    errorHandling: {
      includeStackTrace: false, // Don't include stack traces in staging
      logErrors: true,
    },
    monitoring: {
      enabled: true,
      collectMetrics: true,
      collectTraces: true, // Enable tracing in staging
      sampleRate: 0.5, // Sample 50% of requests
      metricsEndpoint: '/metrics',
      healthCheckInterval: 30000,
    },
  },

  database: {
    connection: {
      host: process.env.DB_HOST || 'staging-db.example.com',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fragrance_staging',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'staging-password',
      ssl: true, // Enable SSL in staging
      sslMode: 'require',
      connectionTimeout: 30000,
      idleTimeout: 30000,
      maxConnections: 15,
      minConnections: 3,
    },
    pooling: {
      enabled: true,
      maxPoolSize: 15,
      minPoolSize: 3,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 300000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
      validationQuery: 'SELECT 1',
      validationQueryTimeout: 5000,
    },
    query: {
      timeout: 30000,
      maxQueryLength: 10000,
      enableQueryLogging: true, // Enable query logging in staging
      logSlowQueries: true,
      slowQueryThreshold: 1000,
      enableQueryCache: true,
      queryCacheSize: 500,
    },
    migrations: {
      enabled: true,
      tableName: 'migrations',
      directory: './migrations',
      runOnStartup: false, // Don't run migrations on startup in staging
      backupBeforeMigration: true,
      backupDirectory: './backups',
    },
    backup: {
      enabled: true,
      schedule: '0 2 * * *', // Daily at 2 AM
      retentionDays: 14, // Keep backups for 2 weeks
      compression: true,
      encryption: true, // Enable encryption in staging
      backupDirectory: './backups',
      maxBackupSize: 1024 * 1024 * 1024, // 1GB
    },
    monitoring: {
      enabled: true,
      healthCheckInterval: 30000,
      metricsCollection: true,
      slowQueryLogging: true,
      connectionMonitoring: true,
      deadlockDetection: true,
    },
  },

  ui: {
    theme: {
      defaultTheme: 'system',
      enableThemeSwitching: true,
      customThemes: [],
      themePersistence: true,
    },
    animation: {
      enabled: true,
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
      },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      reduceMotion: false,
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
      lazyLoading: true,
      imageOptimization: true,
      codeSplitting: true,
      preloading: true,
      caching: true,
      compression: true,
    },
  },

  ingredients: {
    management: {
      enableCRUD: true,
      enableBulkOperations: true,
      enableSoftDelete: true,
      enableVersioning: false,
      maxIngredientsPerUser: 500,
      enableIngredientCategories: true,
      enableIngredientTags: true,
    },
    importExport: {
      enableCSVImport: true,
      enableCSVExport: true,
      enableJSONImport: true,
      enableJSONExport: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ['.csv', '.json', '.xlsx'],
      csvDelimiter: ',',
      csvEncoding: 'utf-8',
      batchSize: 100,
      enableValidation: true,
      enableProgressTracking: true,
    },
    validation: {
      requiredFields: ['name', 'category'],
      optionalFields: ['description', 'notes', 'tags'],
      fieldLengths: {
        name: { min: 1, max: 100 },
        description: { min: 0, max: 1000 },
        notes: { min: 0, max: 2000 },
        category: { min: 1, max: 50 },
      },
      enableDuplicateDetection: true,
      duplicateThreshold: 0.8,
      enableDataCleaning: true,
    },
    search: {
      enableFullTextSearch: true,
      enableFuzzySearch: true,
      enableAutoComplete: true,
      searchFields: ['name', 'description', 'category', 'tags'],
      maxSearchResults: 100,
      enableSearchHistory: true,
      searchHistoryLimit: 20,
      enableSearchSuggestions: true,
    },
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      enableInfiniteScroll: false,
      enableVirtualScrolling: false,
      maxPageSize: 1000,
    },
    performance: {
      enableCaching: true,
      cacheTTL: 300,
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableDataCompression: true,
    },
  },

  caseManagement: {
    workflow: {
      enableWorkflowEngine: true,
      enableStateTransitions: true,
      enableWorkflowTemplates: true,
      enableCustomWorkflows: false, // Disable custom workflows in staging
      maxWorkflowSteps: 20,
      enableParallelProcessing: false,
      enableWorkflowHistory: true,
    },
    statusManagement: {
      enableStatusTracking: true,
      predefinedStatuses: [
        { name: 'New', description: 'Newly created case', color: '#3b82f6', isActive: true, isFinal: false },
        { name: 'In Progress', description: 'Case is being worked on', color: '#f59e0b', isActive: true, isFinal: false },
        { name: 'Pending Review', description: 'Case pending review', color: '#8b5cf6', isActive: true, isFinal: false },
        { name: 'Resolved', description: 'Case has been resolved', color: '#10b981', isActive: true, isFinal: true },
        { name: 'Closed', description: 'Case has been closed', color: '#6b7280', isActive: true, isFinal: true },
      ],
      enableCustomStatuses: true,
      maxCustomStatuses: 10,
      enableStatusTransitions: true,
    },
    assignment: {
      enableAutoAssignment: false,
      enableRoundRobin: false,
      enableSkillBasedAssignment: false,
      enableWorkloadBalancing: false,
      maxCasesPerAgent: 50,
      enableEscalation: true,
      escalationTimeout: 24 * 60 * 60 * 1000, // 24 hours
    },
    notifications: {
      enableCaseNotifications: true,
      enableStatusChangeNotifications: true,
      enableAssignmentNotifications: true,
      enableSLAAlerts: true,
      enableEscalationNotifications: true,
      notificationChannels: ['email', 'in-app'],
      enableNotificationTemplates: true,
    },
    performance: {
      enableCaching: true,
      cacheTTL: 300,
      enableLazyLoading: true,
      enablePagination: true,
      defaultPageSize: 20,
      maxPageSize: 100,
    },
  },

  monitoring: {
    logging: {
      enabled: true,
      level: 'info',
      format: 'json', // Structured logging in staging
      enableConsoleLogging: true,
      enableFileLogging: true, // Enable file logging in staging
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
      enableErrorNotifications: true, // Enable error notifications in staging
      errorNotificationThreshold: 5,
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
    alerting: {
      enabled: true, // Enable alerting in staging
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
    analytics: {
      enabled: true,
      enableUsageAnalytics: true,
      enablePerformanceAnalytics: true,
      enableBusinessAnalytics: true,
      enableUserBehaviorAnalytics: false, // Disable user behavior analytics in staging
      analyticsRetentionDays: 90,
      enableAnalyticsExport: true,
      enableRealTimeAnalytics: true,
    },
  },

  security: {
    cors: {
      enabled: true,
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://staging.fragrance-app.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: [],
      credentials: true,
      maxAge: 86400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      maxRequests: 500, // Higher limit for staging
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
      enableRedis: false,
    },
    csrf: {
      enabled: true,
      secret: process.env.CSRF_SECRET || 'staging-csrf-secret',
      cookieName: '_csrf',
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000,
      },
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
      ignorePaths: [],
    },
    securityHeaders: {
      enabled: true,
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
      maxInputLength: 10000,
      enableInputSanitization: true,
      allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
    },
    auditLogging: {
      enabled: true,
      enableSecurityEvents: true,
      enableAccessLogging: true,
      enableDataChanges: false, // Disable data change logging in staging
      enableFailedAttempts: true,
      logRetentionDays: 30,
      enableRealTimeAlerts: true,
      alertThresholds: {
        failedLogins: 5,
        suspiciousActivity: 10,
        dataAccess: 100,
      },
    },
  },

  files: {
    upload: {
      enabled: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFilesPerRequest: 10,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      allowedExtensions: [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.pdf', '.txt', '.doc', '.docx',
      ],
      enableChunkedUpload: false,
      chunkSize: 1024 * 1024,
      enableResumeUpload: false,
      uploadTimeout: 300000, // 5 minutes
    },
    storage: {
      provider: 's3', // Use S3 in staging
      localPath: './uploads/staging',
      enableSubdirectories: true,
      subdirectoryStructure: 'date',
      customSubdirectoryPattern: '{year}/{month}/{day}',
      enableFileVersioning: false,
      maxVersions: 5,
    },
    processing: {
      enableImageProcessing: true,
      enableImageResize: true,
      enableImageCompression: true,
      enableThumbnailGeneration: true,
      imageFormats: ['jpeg', 'png', 'webp'],
      thumbnailSizes: [
        { name: 'small', width: 150, height: 150, quality: 80 },
        { name: 'medium', width: 300, height: 300, quality: 85 },
        { name: 'large', width: 600, height: 600, quality: 90 },
      ],
      enableWatermarking: false,
      watermarkText: '',
      watermarkPosition: 'bottom-right',
    },
    validation: {
      enableVirusScanning: false, // Disable virus scanning in staging
      enableContentValidation: true,
      enableFileIntegrityCheck: true,
      enableMetadataValidation: true,
      maxFileNameLength: 255,
      allowedFileNamePattern: '^[a-zA-Z0-9._-]+$',
      enableDuplicateDetection: true,
      duplicateDetectionMethod: 'hash',
    },
    accessControl: {
      enablePublicAccess: false, // Disable public access in staging
      enablePrivateAccess: true,
      enableSignedUrls: true,
      signedUrlExpiration: 3600,
      enableAccessLogging: true,
      enableDownloadTracking: true,
      enablePermissionBasedAccess: true,
    },
    cleanup: {
      enableAutomaticCleanup: true,
      cleanupSchedule: '0 2 * * *',
      orphanedFileRetentionDays: 14,
      temporaryFileRetentionHours: 24,
      enableSoftDelete: true,
      softDeleteRetentionDays: 30,
      enableHardDelete: false,
      hardDeleteRetentionDays: 90,
    },
    performance: {
      enableCaching: true,
      cacheTTL: 3600,
      enableLazyLoading: true,
      enablePreloading: true,
      enableCompression: true,
      compressionLevel: 6,
      enableStreaming: true,
    },
    security: {
      enableFileEncryption: false,
      enableAccessAudit: true,
      enableMalwareScanning: false,
      enableContentFiltering: true,
      blockedContentTypes: [
        'application/x-executable',
        'application/x-msdownload',
        'application/x-msdos-program',
      ],
      enableQuarantine: false,
      quarantineLocation: './quarantine',
    },
  },

  notifications: {
    email: {
      enabled: true,
      provider: 'smtp',
      smtp: {
        host: process.env.SMTP_HOST || 'staging-smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: true,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM || 'staging@fragrance-app.com',
        replyTo: process.env.SMTP_REPLY_TO || 'staging@fragrance-app.com',
      },
      enableHTML: true,
      enableTextFallback: true,
      maxRecipients: 100,
      rateLimit: 200, // Higher rate limit for staging
    },
    sms: {
      enabled: false, // Disable SMS in staging
      provider: 'twilio',
      rateLimit: 10,
      maxLength: 160,
    },
    push: {
      enabled: false, // Disable push notifications in staging
      provider: 'fcm',
      enableBatchSending: true,
      batchSize: 100,
    },
    inApp: {
      enabled: true,
      enableRealTime: true,
      enablePersistentStorage: true,
      maxNotifications: 100,
      notificationTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
      enableNotificationGroups: true,
      enableNotificationActions: true,
    },
    webhooks: {
      enabled: false, // Disable webhooks in staging
      endpoints: [],
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
    },
    templates: {
      enabled: true,
      enableCustomTemplates: true,
      defaultTemplates: {
        welcome: {
          subject: '[STAGING] Welcome to Fragrance App!',
          body: 'Welcome {{userName}}! Thank you for joining our fragrance community.',
          type: 'email',
          variables: ['userName'],
        },
        passwordReset: {
          subject: '[STAGING] Password Reset Request',
          body: 'Click the link to reset your password: {{resetLink}}',
          type: 'email',
          variables: ['resetLink'],
        },
        caseUpdate: {
          subject: '[STAGING] Case Update: {{caseTitle}}',
          body: 'Your case "{{caseTitle}}" has been updated to {{status}}.',
          type: 'email',
          variables: ['caseTitle', 'status'],
        },
      },
      enableTemplateVersioning: false,
      enableTemplateTesting: true,
    },
    scheduling: {
      enabled: true,
      enableDelayedNotifications: true,
      enableScheduledNotifications: true,
      enableRecurringNotifications: false,
      maxDelayHours: 24,
      enableTimezoneSupport: true,
      defaultTimezone: 'UTC',
    },
    preferences: {
      enabled: true,
      enableUserPreferences: true,
      enableChannelPreferences: true,
      enableFrequencyPreferences: true,
      defaultPreferences: {
        email: true,
        sms: false,
        push: false,
        inApp: true,
      },
      enableOptOut: true,
      enableUnsubscribe: true,
    },
    analytics: {
      enabled: true,
      enableDeliveryTracking: true,
      enableOpenTracking: true,
      enableClickTracking: true,
      enableBounceTracking: true,
      enableUnsubscribeTracking: true,
      analyticsRetentionDays: 90,
      enableRealTimeAnalytics: true,
    },
    performance: {
      enableQueue: true,
      queueProvider: 'database',
      maxConcurrentJobs: 10,
      jobTimeout: 300000, // 5 minutes
      enableBatchProcessing: true,
      batchSize: 100,
      enableRetryMechanism: true,
      maxRetries: 3,
      retryDelay: 5000,
    },
  },

  featureFlags: {
    management: {
      enabled: true,
      enableRuntimeToggles: true,
      enableUserTargeting: false, // Disable user targeting in staging
      enableEnvironmentOverrides: true,
      enableABTesting: false, // Disable A/B testing in staging
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
    defaultFlags: {
      'new-dashboard': {
        enabled: false, // Disable in staging
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
        enabled: false, // Disable in staging
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
        enabled: true, // Enable in staging
        description: 'Enable beta features for testing',
        type: 'boolean',
        defaultValue: true,
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
      enableLocalOverrides: false, // Disable local overrides in staging
      localOverrideFile: '.env.local',
    },
    performance: {
      enableCaching: true,
      cacheTTL: 300,
      enableLazyLoading: true,
      enablePreloading: true,
      maxCacheSize: 1000,
      enableCompression: true,
    },
    security: {
      enableFlagEncryption: false,
      enableAccessControl: true,
      enableAuditLogging: true,
      enableFlagValidation: true,
      enableSensitiveFlagProtection: true,
      sensitiveFlagPatterns: ['password', 'secret', 'key', 'token'],
    },
  },

  devTools: {
    hotReload: {
      enabled: false, // Disable hot reload in staging
      enableFileWatching: false,
      enableComponentReload: false,
      enableStyleReload: false,
      enableStatePreservation: false,
      watchPatterns: [],
      ignorePatterns: [],
      reloadDelay: 300,
    },
    debugging: {
      enabled: false, // Disable debugging in staging
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
      enabled: false, // Disable dev server in staging
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
      enabled: false, // Disable mock data in staging
      enableAPIMocking: false,
      enableDatabaseMocking: false,
      enableFileSystemMocking: false,
      mockDataPath: './src/mocks',
      enableDynamicMocking: false,
      enableMockDelay: false,
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
      enableVisualRegressionTests: false, // Disable visual regression tests in staging
      enablePerformanceTests: false, // Disable performance tests in staging
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
      enableCodeDuplicationDetection: false, // Disable duplication detection in staging
      enableSecurityScanning: true, // Enable security scanning in staging
    },
    utilities: {
      enabled: false, // Disable utilities in staging
      enableCodeGeneration: false,
      enableComponentScaffolding: false,
      enableAPIClientGeneration: false,
      enableDatabaseMigration: false,
      enableSeedData: false,
      enableBackupRestore: false,
      enableDataExport: false,
    },
    performanceMonitoring: {
      enabled: true,
      enableBundleAnalysis: true,
      enablePerformanceProfiling: true,
      enableMemoryLeakDetection: false, // Disable memory leak detection in staging
      enableSlowComponentDetection: true,
      enableNetworkMonitoring: true,
      performanceThresholds: {
        bundleSize: 1024 * 1024, // 1MB
        renderTime: 100, // 100ms
        memoryUsage: 100 * 1024 * 1024, // 100MB
      },
    },
    environment: {
      enableEnvironmentSwitching: false, // Disable environment switching in staging
      enableEnvironmentValidation: true,
      enableEnvironmentComparison: true,
      enableEnvironmentBackup: false, // Disable environment backup in staging
      environmentFiles: [
        '.env.staging',
        '.env.production',
      ],
    },
    documentation: {
      enabled: true,
      enableAutoDocumentation: true,
      enableStorybook: false, // Disable Storybook in staging
      enableComponentDocumentation: true,
      enableAPIDocumentation: true,
      enableArchitectureDocumentation: false, // Disable architecture documentation in staging
      documentationPath: './docs',
    },
    security: {
      enabled: true,
      enableSecurityScanning: true, // Enable security scanning in staging
      enableDependencyAudit: true,
      enableVulnerabilityScanning: true, // Enable vulnerability scanning in staging
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
      analyticsRetentionDays: 30, // Shorter retention for staging
      enableRealTimeAnalytics: true,
    },
  },
};

export default stagingConfig;

