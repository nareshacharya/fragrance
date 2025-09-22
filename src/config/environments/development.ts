import { type FeatureConfigs } from '../features';

/**
 * Development environment configuration
 * 
 * This configuration is optimized for development with debugging features,
 * hot reload, and development-specific settings enabled.
 */
const developmentConfig: Partial<FeatureConfigs> = {
  auth: {
    session: {
      timeout: 24 * 60 * 60 * 1000, // 24 hours for development
      refreshThreshold: 5 * 60 * 1000,
      maxConcurrentSessions: 10,
      secure: false, // Allow HTTP in development
      httpOnly: true,
      sameSite: 'lax',
    },
    jwt: {
      secret: 'development-jwt-secret-key-not-for-production',
      algorithm: 'HS256',
      expiresIn: '24h', // Longer expiration for development
      refreshExpiresIn: '30d',
      issuer: 'fragrance-app-dev',
      audience: 'fragrance-users-dev',
    },
    passwordPolicy: {
      minLength: 6, // Relaxed for development
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      historyCount: 3,
    },
    accountSecurity: {
      maxLoginAttempts: 10, // More lenient
      lockoutDuration: 5 * 60 * 1000, // 5 minutes
      requireEmailVerification: false,
      requirePhoneVerification: false,
      twoFactorEnabled: false,
      backupCodesCount: 5,
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting in development
      windowMs: 15 * 60 * 1000,
      maxRequests: 10000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },
  },

  api: {
    pegaDx: {
      baseUrl: process.env.PEGA_DX_BASE_URL || 'http://localhost:8080',
      apiVersion: 'v1',
      timeout: 60000, // Longer timeout for development
      retries: 1, // Fewer retries for faster feedback
      retryDelay: 1000,
      maxRetryDelay: 5000,
      retryMultiplier: 2,
      enableLogging: true,
      logLevel: 'debug', // More verbose logging
    },
    httpClient: {
      timeout: 60000,
      keepAlive: true,
      maxSockets: 20,
      maxFreeSockets: 10,
      keepAliveMsecs: 1000,
      userAgent: 'FragranceApp-Dev/1.0',
      followRedirects: true,
      maxRedirects: 5,
    },
    caching: {
      enabled: false, // Disable caching for development
      defaultTTL: 0,
      maxSize: 0,
      strategy: 'lru',
      cacheKeyPrefix: 'dev:',
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting
      windowMs: 15 * 60 * 1000,
      maxRequests: 10000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
    },
    errorHandling: {
      includeStackTrace: true, // Include stack traces in development
      logErrors: true,
    },
    monitoring: {
      enabled: true,
      collectMetrics: true,
      collectTraces: true, // Enable tracing in development
      sampleRate: 1.0, // Sample all requests
      metricsEndpoint: '/metrics',
      healthCheckInterval: 10000, // More frequent health checks
    },
  },

  database: {
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fragrance_dev',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: false, // Disable SSL for local development
      sslMode: 'disable',
      connectionTimeout: 60000,
      idleTimeout: 60000,
      maxConnections: 10,
      minConnections: 2,
    },
    pooling: {
      enabled: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 60000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 300000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
      validationQuery: 'SELECT 1',
      validationQueryTimeout: 5000,
    },
    query: {
      timeout: 60000,
      maxQueryLength: 10000,
      enableQueryLogging: true, // Enable query logging
      logSlowQueries: true,
      slowQueryThreshold: 100, // Lower threshold for development
      enableQueryCache: false, // Disable query cache
      queryCacheSize: 0,
    },
    migrations: {
      enabled: true,
      tableName: 'migrations',
      directory: './migrations',
      runOnStartup: true, // Run migrations on startup in development
      backupBeforeMigration: false,
      backupDirectory: './backups',
    },
    backup: {
      enabled: false, // Disable backups in development
      schedule: '0 3 * * *',
      retentionDays: 7,
      compression: true,
      encryption: false,
      backupDirectory: './backups',
      maxBackupSize: 100 * 1024 * 1024, // 100MB
    },
    monitoring: {
      enabled: true,
      healthCheckInterval: 10000,
      metricsCollection: true,
      slowQueryLogging: true,
      connectionMonitoring: true,
      deadlockDetection: true,
    },
  },

  ui: {
    theme: {
      defaultTheme: 'light', // Default to light theme in development
      enableThemeSwitching: true,
      customThemes: [],
      themePersistence: true,
    },
    animation: {
      enabled: true,
      duration: {
        fast: 100, // Faster animations for development
        normal: 200,
        slow: 300,
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
      lazyLoading: false, // Disable lazy loading for development
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
      maxIngredientsPerUser: 100, // Lower limit for development
      enableIngredientCategories: true,
      enableIngredientTags: true,
    },
    importExport: {
      enableCSVImport: true,
      enableCSVExport: true,
      enableJSONImport: true,
      enableJSONExport: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB for development
      allowedFileTypes: ['.csv', '.json'],
      csvDelimiter: ',',
      csvEncoding: 'utf-8',
      batchSize: 50, // Smaller batch size for development
      enableValidation: true,
      enableProgressTracking: true,
    },
    validation: {
      requiredFields: ['name'],
      optionalFields: ['description', 'notes', 'tags', 'category'],
      fieldLengths: {
        name: { min: 1, max: 50 },
        description: { min: 0, max: 500 },
        notes: { min: 0, max: 1000 },
        category: { min: 0, max: 30 },
      },
      enableDuplicateDetection: false, // Disable for development
      duplicateThreshold: 0.8,
      enableDataCleaning: true,
    },
    search: {
      enableFullTextSearch: true,
      enableFuzzySearch: true,
      enableAutoComplete: true,
      searchFields: ['name', 'description', 'category'],
      maxSearchResults: 50,
      enableSearchHistory: true,
      searchHistoryLimit: 10,
      enableSearchSuggestions: true,
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
      enableInfiniteScroll: false,
      enableVirtualScrolling: false,
      maxPageSize: 100,
    },
    performance: {
      enableCaching: false, // Disable caching for development
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
      enableCustomWorkflows: true, // Allow custom workflows in development
      maxWorkflowSteps: 50,
      enableParallelProcessing: false,
      enableWorkflowHistory: true,
    },
    statusManagement: {
      enableStatusTracking: true,
      predefinedStatuses: [
        { name: 'New', description: 'Newly created case', color: '#3b82f6', isActive: true, isFinal: false },
        { name: 'In Progress', description: 'Case is being worked on', color: '#f59e0b', isActive: true, isFinal: false },
        { name: 'Testing', description: 'Case is being tested', color: '#8b5cf6', isActive: true, isFinal: false },
        { name: 'Resolved', description: 'Case has been resolved', color: '#10b981', isActive: true, isFinal: true },
        { name: 'Closed', description: 'Case has been closed', color: '#6b7280', isActive: true, isFinal: true },
      ],
      enableCustomStatuses: true,
      maxCustomStatuses: 20,
      enableStatusTransitions: true,
    },
    assignment: {
      enableAutoAssignment: false,
      enableRoundRobin: false,
      enableSkillBasedAssignment: false,
      enableWorkloadBalancing: false,
      maxCasesPerAgent: 100, // Higher limit for development
      enableEscalation: true,
      escalationTimeout: 2 * 60 * 60 * 1000, // 2 hours
    },
    notifications: {
      enableCaseNotifications: true,
      enableStatusChangeNotifications: true,
      enableAssignmentNotifications: true,
      enableSLAAlerts: false, // Disable SLA alerts in development
      enableEscalationNotifications: true,
      notificationChannels: ['in-app'], // Only in-app notifications
      enableNotificationTemplates: true,
    },
    performance: {
      enableCaching: false, // Disable caching for development
      cacheTTL: 0,
      enableLazyLoading: false,
      enablePagination: true,
      defaultPageSize: 10,
      maxPageSize: 50,
    },
  },

  monitoring: {
    logging: {
      enabled: true,
      level: 'debug', // More verbose logging
      format: 'pretty', // Human-readable format
      enableConsoleLogging: true,
      enableFileLogging: false,
      logDirectory: './logs',
      maxLogFileSize: 10 * 1024 * 1024,
      maxLogFiles: 3,
      enableLogRotation: true,
      enableStructuredLogging: false, // Human-readable for development
    },
    performance: {
      enabled: true,
      enableMetricsCollection: true,
      enablePerformanceTracking: true,
      enableMemoryMonitoring: true,
      enableCPUMonitoring: true,
      enableNetworkMonitoring: true,
      metricsInterval: 30000, // More frequent metrics
      enableSlowQueryLogging: true,
      slowQueryThreshold: 100, // Lower threshold
    },
    errorTracking: {
      enabled: true,
      enableErrorReporting: true,
      enableStackTraceCapture: true,
      enableErrorAggregation: true,
      enableErrorNotifications: false, // Disable notifications in development
      errorNotificationThreshold: 100,
      enableErrorDashboard: true,
      errorRetentionDays: 7,
    },
    healthChecks: {
      enabled: true,
      enableDatabaseHealthCheck: true,
      enableAPIConnectivityCheck: true,
      enableExternalServiceCheck: false, // Disable external checks
      healthCheckInterval: 10000, // More frequent checks
      healthCheckTimeout: 5000,
      enableHealthCheckEndpoint: true,
      healthCheckEndpoint: '/health',
    },
    alerting: {
      enabled: false, // Disable alerting in development
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
      enableAlertCooldown: true,
      alertCooldownPeriod: 300000,
    },
    analytics: {
      enabled: true,
      enableUsageAnalytics: true,
      enablePerformanceAnalytics: true,
      enableBusinessAnalytics: true,
      enableUserBehaviorAnalytics: true, // Enable in development
      analyticsRetentionDays: 30,
      enableAnalyticsExport: true,
      enableRealTimeAnalytics: true,
    },
  },

  security: {
    cors: {
      enabled: true,
      origin: true, // Allow all origins in development
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: [],
      credentials: true,
      maxAge: 86400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting in development
      windowMs: 15 * 60 * 1000,
      maxRequests: 10000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
      enableRedis: false,
    },
    csrf: {
      enabled: false, // Disable CSRF in development
      secret: 'development-csrf-secret',
      cookieName: '_csrf',
      cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000,
      },
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
      ignorePaths: [],
    },
    securityHeaders: {
      enabled: false, // Disable security headers in development
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
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
      maxInputLength: 50000, // Higher limit for development
      enableInputSanitization: true,
      allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx', '.js', '.ts', '.json'],
      maxFileSize: 50 * 1024 * 1024, // 50MB for development
    },
    auditLogging: {
      enabled: true,
      enableSecurityEvents: true,
      enableAccessLogging: true,
      enableDataChanges: true, // Enable data change logging in development
      enableFailedAttempts: true,
      logRetentionDays: 30,
      enableRealTimeAlerts: false,
      alertThresholds: {
        failedLogins: 20,
        suspiciousActivity: 50,
        dataAccess: 1000,
      },
    },
  },

  files: {
    upload: {
      enabled: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB for development
      maxFilesPerRequest: 20,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/json',
        'text/csv',
      ],
      allowedExtensions: [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.pdf', '.txt', '.doc', '.docx',
        '.json', '.csv', '.js', '.ts',
      ],
      enableChunkedUpload: false,
      chunkSize: 1024 * 1024,
      enableResumeUpload: false,
      uploadTimeout: 600000, // 10 minutes for development
    },
    storage: {
      provider: 'local',
      localPath: './uploads/dev',
      enableSubdirectories: true,
      subdirectoryStructure: 'date',
      customSubdirectoryPattern: '{year}/{month}/{day}',
      enableFileVersioning: true, // Enable versioning in development
      maxVersions: 10,
    },
    processing: {
      enableImageProcessing: true,
      enableImageResize: true,
      enableImageCompression: false, // Disable compression for development
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
      enableVirusScanning: false, // Disable virus scanning in development
      enableContentValidation: true,
      enableFileIntegrityCheck: true,
      enableMetadataValidation: true,
      maxFileNameLength: 255,
      allowedFileNamePattern: '^[a-zA-Z0-9._-]+$',
      enableDuplicateDetection: false,
      duplicateDetectionMethod: 'hash',
    },
    accessControl: {
      enablePublicAccess: true, // Allow public access in development
      enablePrivateAccess: true,
      enableSignedUrls: false,
      signedUrlExpiration: 3600,
      enableAccessLogging: true,
      enableDownloadTracking: true,
      enablePermissionBasedAccess: false,
    },
    cleanup: {
      enableAutomaticCleanup: false, // Disable cleanup in development
      cleanupSchedule: '0 2 * * *',
      orphanedFileRetentionDays: 7,
      temporaryFileRetentionHours: 48,
      enableSoftDelete: true,
      softDeleteRetentionDays: 30,
      enableHardDelete: false,
      hardDeleteRetentionDays: 90,
    },
    performance: {
      enableCaching: false, // Disable caching for development
      cacheTTL: 0,
      enableLazyLoading: false,
      enablePreloading: false,
      enableCompression: false,
      compressionLevel: 6,
      enableStreaming: true,
    },
    security: {
      enableFileEncryption: false,
      enableAccessAudit: true,
      enableMalwareScanning: false,
      enableContentFiltering: false,
      blockedContentTypes: [],
      enableQuarantine: false,
      quarantineLocation: './quarantine',
    },
  },

  notifications: {
    email: {
      enabled: false, // Disable email in development
      provider: 'smtp',
      smtp: {
        host: 'localhost',
        port: 1025, // MailHog port
        secure: false,
        username: '',
        password: '',
        from: 'dev@fragrance-app.com',
        replyTo: 'dev@fragrance-app.com',
      },
      enableHTML: true,
      enableTextFallback: true,
      maxRecipients: 10,
      rateLimit: 1000,
    },
    sms: {
      enabled: false, // Disable SMS in development
      provider: 'twilio',
      rateLimit: 100,
      maxLength: 160,
    },
    push: {
      enabled: false, // Disable push notifications in development
      provider: 'fcm',
      enableBatchSending: true,
      batchSize: 100,
    },
    inApp: {
      enabled: true,
      enableRealTime: true,
      enablePersistentStorage: true,
      maxNotifications: 50,
      notificationTTL: 24 * 60 * 60 * 1000, // 24 hours
      enableNotificationGroups: true,
      enableNotificationActions: true,
    },
    webhooks: {
      enabled: false, // Disable webhooks in development
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
          subject: '[DEV] Welcome to Fragrance App!',
          body: 'Welcome {{userName}}! Thank you for joining our fragrance community.',
          type: 'email',
          variables: ['userName'],
        },
        passwordReset: {
          subject: '[DEV] Password Reset Request',
          body: 'Click the link to reset your password: {{resetLink}}',
          type: 'email',
          variables: ['resetLink'],
        },
        caseUpdate: {
          subject: '[DEV] Case Update: {{caseTitle}}',
          body: 'Your case "{{caseTitle}}" has been updated to {{status}}.',
          type: 'email',
          variables: ['caseTitle', 'status'],
        },
      },
      enableTemplateVersioning: true,
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
        email: false,
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
      analyticsRetentionDays: 30,
      enableRealTimeAnalytics: true,
    },
    performance: {
      enableQueue: false, // Disable queue in development
      queueProvider: 'memory',
      maxConcurrentJobs: 5,
      jobTimeout: 600000, // 10 minutes
      enableBatchProcessing: false,
      batchSize: 10,
      enableRetryMechanism: true,
      maxRetries: 3,
      retryDelay: 1000,
    },
  },

  featureFlags: {
    management: {
      enabled: true,
      enableRuntimeToggles: true,
      enableUserTargeting: true, // Enable user targeting in development
      enableEnvironmentOverrides: true,
      enableABTesting: true, // Enable A/B testing in development
      enableGradualRollout: true,
      enableFeatureDependencies: true,
    },
    storage: {
      provider: 'memory', // Use memory storage in development
      enableCaching: false,
      cacheTTL: 0,
      enablePersistence: false,
      enableBackup: false,
      backupInterval: 24 * 60 * 60 * 1000,
    },
    defaultFlags: {
      'new-dashboard': {
        enabled: true, // Enable in development
        description: 'Enable the new dashboard interface',
        type: 'boolean',
        defaultValue: true,
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
        enabled: true, // Enable in development
        description: 'Enable API version 2 endpoints',
        type: 'boolean',
        defaultValue: true,
        environments: {
          development: true,
          staging: false,
          production: false,
        },
      },
      'beta-features': {
        enabled: true, // Enable in development
        description: 'Enable beta features for testing',
        type: 'boolean',
        defaultValue: true,
        environments: {
          development: true,
          staging: true,
          production: false,
        },
      },
      'debug-mode': {
        enabled: true, // Enable debug mode in development
        description: 'Enable debug mode with additional logging',
        type: 'boolean',
        defaultValue: true,
        environments: {
          development: true,
          staging: false,
          production: false,
        },
      },
      'mock-data': {
        enabled: true, // Enable mock data in development
        description: 'Enable mock data for testing',
        type: 'boolean',
        defaultValue: true,
        environments: {
          development: true,
          staging: false,
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
      enableCaching: false, // Disable caching for development
      cacheTTL: 0,
      enableLazyLoading: false,
      enablePreloading: false,
      maxCacheSize: 0,
      enableCompression: false,
    },
    security: {
      enableFlagEncryption: false,
      enableAccessControl: false, // Disable access control in development
      enableAuditLogging: true,
      enableFlagValidation: true,
      enableSensitiveFlagProtection: false,
      sensitiveFlagPatterns: ['password', 'secret', 'key', 'token'],
    },
  },

  devTools: {
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
        'config/**/*',
      ],
      ignorePatterns: [
        'node_modules/**',
        '.git/**',
        'dist/**',
        'build/**',
        'coverage/**',
      ],
      reloadDelay: 100, // Faster reload for development
    },
    debugging: {
      enabled: true,
      enableSourceMaps: true,
      enableReactDevTools: true,
      enableReduxDevTools: true,
      enableNetworkDebugging: true,
      enablePerformanceDebugging: true,
      enableMemoryDebugging: true, // Enable memory debugging in development
      debugPort: 9229,
      enableRemoteDebugging: true, // Enable remote debugging
    },
    devServer: {
      enabled: true,
      port: 3000,
      host: 'localhost',
      enableHTTPS: false,
      enableProxy: true, // Enable proxy for development
      proxyTarget: 'http://localhost:8080',
      enableCORS: true,
      enableCompression: false, // Disable compression for development
      enableHistoryApiFallback: true,
    },
    mockData: {
      enabled: true,
      enableAPIMocking: true,
      enableDatabaseMocking: true, // Enable database mocking in development
      enableFileSystemMocking: true,
      mockDataPath: './src/mocks',
      enableDynamicMocking: true,
      enableMockDelay: true,
      mockDelayRange: {
        min: 50, // Faster mock responses
        max: 500,
      },
    },
    testing: {
      enabled: true,
      enableUnitTests: true,
      enableIntegrationTests: true,
      enableE2ETests: true,
      enableVisualRegressionTests: true, // Enable visual regression tests in development
      enablePerformanceTests: true, // Enable performance tests in development
      testCoverageThreshold: 70, // Lower threshold for development
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
      enableCodeDuplicationDetection: true, // Enable duplication detection in development
      enableSecurityScanning: true, // Enable security scanning in development
    },
    utilities: {
      enabled: true,
      enableCodeGeneration: true,
      enableComponentScaffolding: true,
      enableAPIClientGeneration: true,
      enableDatabaseMigration: true, // Enable database migration in development
      enableSeedData: true, // Enable seed data in development
      enableBackupRestore: true,
      enableDataExport: true,
    },
    performanceMonitoring: {
      enabled: true,
      enableBundleAnalysis: true,
      enablePerformanceProfiling: true,
      enableMemoryLeakDetection: true, // Enable memory leak detection in development
      enableSlowComponentDetection: true,
      enableNetworkMonitoring: true,
      performanceThresholds: {
        bundleSize: 2 * 1024 * 1024, // 2MB for development
        renderTime: 200, // 200ms for development
        memoryUsage: 200 * 1024 * 1024, // 200MB for development
      },
    },
    environment: {
      enableEnvironmentSwitching: true,
      enableEnvironmentValidation: true,
      enableEnvironmentComparison: true,
      enableEnvironmentBackup: true, // Enable environment backup in development
      environmentFiles: [
        '.env.development',
        '.env.staging',
        '.env.production',
        '.env.local',
        '.env.test',
      ],
    },
    documentation: {
      enabled: true,
      enableAutoDocumentation: true,
      enableStorybook: true,
      enableComponentDocumentation: true,
      enableAPIDocumentation: true,
      enableArchitectureDocumentation: true, // Enable architecture documentation in development
      documentationPath: './docs',
    },
    security: {
      enabled: true,
      enableSecurityScanning: true, // Enable security scanning in development
      enableDependencyAudit: true,
      enableVulnerabilityScanning: true, // Enable vulnerability scanning in development
      enableSecretsDetection: true,
      enableSecurityHeaders: false, // Disable security headers in development
      enableCSRFProtection: false, // Disable CSRF protection in development
    },
    analytics: {
      enabled: true,
      enableUsageTracking: true,
      enableErrorTracking: true,
      enablePerformanceTracking: true,
      enableFeatureUsageTracking: true,
      analyticsRetentionDays: 7, // Shorter retention for development
      enableRealTimeAnalytics: true,
    },
  },
};

export default developmentConfig;

