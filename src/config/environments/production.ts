import { type FeatureConfigs } from '../features';

/**
 * Production environment configuration
 * 
 * This configuration is optimized for production with maximum security,
 * performance, and reliability settings enabled.
 */
const productionConfig: Partial<FeatureConfigs> = {
  auth: {
    session: {
      timeout: 2 * 60 * 60 * 1000, // 2 hours for production
      refreshThreshold: 5 * 60 * 1000,
      maxConcurrentSessions: 3,
      secure: true, // Require HTTPS in production
      httpOnly: true,
      sameSite: 'strict',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'production-jwt-secret-must-be-changed',
      algorithm: 'HS256',
      expiresIn: '2h',
      refreshExpiresIn: '7d',
      issuer: 'fragrance-app-production',
      audience: 'fragrance-users-production',
    },
    passwordPolicy: {
      minLength: 12, // Stronger password requirements
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      historyCount: 5,
    },
    accountSecurity: {
      maxLoginAttempts: 3, // Stricter login attempts
      lockoutDuration: 30 * 60 * 1000, // 30 minutes
      requireEmailVerification: true,
      requirePhoneVerification: true, // Require phone verification in production
      twoFactorEnabled: true, // Enable 2FA in production
      backupCodesCount: 10,
    },
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      maxRequests: 100, // Stricter rate limiting
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },
  },

  api: {
    pegaDx: {
      baseUrl: process.env.PEGA_DX_BASE_URL || 'https://api.pega.com',
      apiVersion: 'v1',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      maxRetryDelay: 10000,
      retryMultiplier: 2,
      enableLogging: true,
      logLevel: 'warn', // Less verbose logging in production
    },
    httpClient: {
      timeout: 30000,
      keepAlive: true,
      maxSockets: 20,
      maxFreeSockets: 10,
      keepAliveMsecs: 1000,
      userAgent: 'FragranceApp-Production/1.0',
      followRedirects: true,
      maxRedirects: 5,
    },
    caching: {
      enabled: true,
      defaultTTL: 600, // 10 minutes
      maxSize: 2000,
      strategy: 'lru',
      cacheKeyPrefix: 'prod:',
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
      includeStackTrace: false, // Never include stack traces in production
      logErrors: true,
    },
    monitoring: {
      enabled: true,
      collectMetrics: true,
      collectTraces: false, // Disable tracing in production
      sampleRate: 0.1, // Sample only 10% of requests
      metricsEndpoint: '/metrics',
      healthCheckInterval: 60000, // Less frequent health checks
    },
  },

  database: {
    connection: {
      host: process.env.DB_HOST || 'production-db.example.com',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fragrance_production',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'production-password',
      ssl: true, // Require SSL in production
      sslMode: 'require',
      connectionTimeout: 30000,
      idleTimeout: 30000,
      maxConnections: 20,
      minConnections: 5,
    },
    pooling: {
      enabled: true,
      maxPoolSize: 20,
      minPoolSize: 5,
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
      enableQueryLogging: false, // Disable query logging in production
      logSlowQueries: true,
      slowQueryThreshold: 2000, // Higher threshold for production
      enableQueryCache: true,
      queryCacheSize: 1000,
    },
    migrations: {
      enabled: true,
      tableName: 'migrations',
      directory: './migrations',
      runOnStartup: false, // Never run migrations on startup in production
      backupBeforeMigration: true,
      backupDirectory: './backups',
    },
    backup: {
      enabled: true,
      schedule: '0 2 * * *', // Daily at 2 AM
      retentionDays: 30, // Keep backups for 30 days
      compression: true,
      encryption: true, // Enable encryption in production
      backupDirectory: './backups',
      maxBackupSize: 1024 * 1024 * 1024, // 1GB
    },
    monitoring: {
      enabled: true,
      healthCheckInterval: 60000, // Less frequent health checks
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
      maxIngredientsPerUser: 1000,
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
      cacheTTL: 600, // 10 minutes
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
      enableCustomWorkflows: false, // Disable custom workflows in production
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
      enableCustomStatuses: false, // Disable custom statuses in production
      maxCustomStatuses: 0,
      enableStatusTransitions: true,
    },
    assignment: {
      enableAutoAssignment: true, // Enable auto assignment in production
      enableRoundRobin: true,
      enableSkillBasedAssignment: true,
      enableWorkloadBalancing: true,
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
      notificationChannels: ['email', 'sms', 'push', 'in-app'],
      enableNotificationTemplates: true,
    },
    performance: {
      enableCaching: true,
      cacheTTL: 600, // 10 minutes
      enableLazyLoading: true,
      enablePagination: true,
      defaultPageSize: 20,
      maxPageSize: 100,
    },
  },

  monitoring: {
    logging: {
      enabled: true,
      level: 'warn', // Less verbose logging in production
      format: 'json', // Structured logging
      enableConsoleLogging: false, // Disable console logging in production
      enableFileLogging: true,
      logDirectory: './logs',
      maxLogFileSize: 10 * 1024 * 1024,
      maxLogFiles: 10,
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
      metricsInterval: 300000, // 5 minutes
      enableSlowQueryLogging: true,
      slowQueryThreshold: 2000,
    },
    errorTracking: {
      enabled: true,
      enableErrorReporting: true,
      enableStackTraceCapture: false, // Don't capture stack traces in production
      enableErrorAggregation: true,
      enableErrorNotifications: true,
      errorNotificationThreshold: 1, // Alert on first error
      enableErrorDashboard: true,
      errorRetentionDays: 90,
    },
    healthChecks: {
      enabled: true,
      enableDatabaseHealthCheck: true,
      enableAPIConnectivityCheck: true,
      enableExternalServiceCheck: true,
      healthCheckInterval: 60000, // Less frequent health checks
      healthCheckTimeout: 5000,
      enableHealthCheckEndpoint: true,
      healthCheckEndpoint: '/health',
    },
    alerting: {
      enabled: true,
      enableEmailAlerts: true,
      enableSlackAlerts: true,
      enableWebhookAlerts: true,
      alertThresholds: {
        errorRate: 0.01, // Alert on 1% error rate
        responseTime: 1000, // Alert on 1 second response time
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
      enableUserBehaviorAnalytics: false, // Disable user behavior analytics in production
      analyticsRetentionDays: 365,
      enableAnalyticsExport: true,
      enableRealTimeAnalytics: true,
    },
  },

  security: {
    cors: {
      enabled: true,
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://fragrance-app.com'],
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
      maxRequests: 100, // Stricter rate limiting
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: 'ip',
      enableRedis: true, // Use Redis in production
      redisUrl: process.env.REDIS_URL,
    },
    csrf: {
      enabled: true,
      secret: process.env.CSRF_SECRET || 'production-csrf-secret',
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
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Content-Security-Policy': "default-src 'self'",
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
      enableDynamicHeaders: true,
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
      enableDataChanges: false, // Disable data change logging in production
      enableFailedAttempts: true,
      logRetentionDays: 90,
      enableRealTimeAlerts: true,
      alertThresholds: {
        failedLogins: 3,
        suspiciousActivity: 5,
        dataAccess: 50,
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
      enableChunkedUpload: true, // Enable chunked upload in production
      chunkSize: 1024 * 1024,
      enableResumeUpload: true,
      uploadTimeout: 300000, // 5 minutes
    },
    storage: {
      provider: 's3', // Use S3 in production
      localPath: './uploads/production',
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
      enableWatermarking: true, // Enable watermarking in production
      watermarkText: 'Fragrance App',
      watermarkPosition: 'bottom-right',
    },
    validation: {
      enableVirusScanning: true, // Enable virus scanning in production
      enableContentValidation: true,
      enableFileIntegrityCheck: true,
      enableMetadataValidation: true,
      maxFileNameLength: 255,
      allowedFileNamePattern: '^[a-zA-Z0-9._-]+$',
      enableDuplicateDetection: true,
      duplicateDetectionMethod: 'hash',
    },
    accessControl: {
      enablePublicAccess: false, // Disable public access in production
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
      orphanedFileRetentionDays: 7,
      temporaryFileRetentionHours: 24,
      enableSoftDelete: true,
      softDeleteRetentionDays: 30,
      enableHardDelete: true,
      hardDeleteRetentionDays: 90,
    },
    performance: {
      enableCaching: true,
      cacheTTL: 7200, // 2 hours
      enableLazyLoading: true,
      enablePreloading: true,
      enableCompression: true,
      compressionLevel: 9, // Maximum compression
      enableStreaming: true,
    },
    security: {
      enableFileEncryption: true, // Enable file encryption in production
      enableAccessAudit: true,
      enableMalwareScanning: true,
      enableContentFiltering: true,
      blockedContentTypes: [
        'application/x-executable',
        'application/x-msdownload',
        'application/x-msdos-program',
        'application/x-sh',
        'application/x-bat',
      ],
      enableQuarantine: true,
      quarantineLocation: './quarantine',
    },
  },

  notifications: {
    email: {
      enabled: true,
      provider: 'smtp',
      smtp: {
        host: process.env.SMTP_HOST || 'production-smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: true,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM || 'noreply@fragrance-app.com',
        replyTo: process.env.SMTP_REPLY_TO || 'support@fragrance-app.com',
      },
      enableHTML: true,
      enableTextFallback: true,
      maxRecipients: 100,
      rateLimit: 100, // Stricter rate limiting
    },
    sms: {
      enabled: true, // Enable SMS in production
      provider: 'twilio',
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        from: process.env.TWILIO_FROM,
      },
      rateLimit: 10,
      maxLength: 160,
    },
    push: {
      enabled: true, // Enable push notifications in production
      provider: 'fcm',
      fcm: {
        serverKey: process.env.FCM_SERVER_KEY,
        projectId: process.env.FCM_PROJECT_ID,
      },
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
      enabled: true, // Enable webhooks in production
      endpoints: process.env.WEBHOOK_ENDPOINTS ? process.env.WEBHOOK_ENDPOINTS.split(',') : [],
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
    },
    templates: {
      enabled: true,
      enableCustomTemplates: false, // Disable custom templates in production
      defaultTemplates: {
        welcome: {
          subject: 'Welcome to Fragrance App!',
          body: 'Welcome {{userName}}! Thank you for joining our fragrance community.',
          type: 'email',
          variables: ['userName'],
        },
        passwordReset: {
          subject: 'Password Reset Request',
          body: 'Click the link to reset your password: {{resetLink}}',
          type: 'email',
          variables: ['resetLink'],
        },
        caseUpdate: {
          subject: 'Case Update: {{caseTitle}}',
          body: 'Your case "{{caseTitle}}" has been updated to {{status}}.',
          type: 'email',
          variables: ['caseTitle', 'status'],
        },
      },
      enableTemplateVersioning: false,
      enableTemplateTesting: false,
    },
    scheduling: {
      enabled: true,
      enableDelayedNotifications: true,
      enableScheduledNotifications: true,
      enableRecurringNotifications: true, // Enable recurring notifications in production
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
        sms: true,
        push: true,
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
      analyticsRetentionDays: 365,
      enableAnalyticsExport: true,
      enableRealTimeAnalytics: true,
    },
    performance: {
      enableQueue: true,
      queueProvider: 'redis', // Use Redis in production
      maxConcurrentJobs: 20,
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
      enableRuntimeToggles: false, // Disable runtime toggles in production
      enableUserTargeting: false, // Disable user targeting in production
      enableEnvironmentOverrides: true,
      enableABTesting: false, // Disable A/B testing in production
      enableGradualRollout: false,
      enableFeatureDependencies: false,
    },
    storage: {
      provider: 'redis', // Use Redis in production
      enableCaching: true,
      cacheTTL: 600, // 10 minutes
      enablePersistence: true,
      enableBackup: true,
      backupInterval: 24 * 60 * 60 * 1000,
    },
    defaultFlags: {
      'new-dashboard': {
        enabled: false, // Disable in production
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
        enabled: false, // Disable in production
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
        enabled: false, // Disable in production
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
      enableDevelopmentOverrides: false, // Disable development overrides in production
      enableStagingOverrides: false, // Disable staging overrides in production
      enableProductionOverrides: true,
      overridePrefix: 'FEATURE_',
      enableLocalOverrides: false, // Disable local overrides in production
      localOverrideFile: '.env.local',
    },
    performance: {
      enableCaching: true,
      cacheTTL: 600, // 10 minutes
      enableLazyLoading: true,
      enablePreloading: true,
      maxCacheSize: 2000,
      enableCompression: true,
    },
    security: {
      enableFlagEncryption: true, // Enable flag encryption in production
      enableAccessControl: true,
      enableAuditLogging: true,
      enableFlagValidation: true,
      enableSensitiveFlagProtection: true,
      sensitiveFlagPatterns: ['password', 'secret', 'key', 'token'],
    },
  },

  devTools: {
    hotReload: {
      enabled: false, // Disable hot reload in production
      enableFileWatching: false,
      enableComponentReload: false,
      enableStyleReload: false,
      enableStatePreservation: false,
      watchPatterns: [],
      ignorePatterns: [],
      reloadDelay: 300,
    },
    debugging: {
      enabled: false, // Disable debugging in production
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
      enabled: false, // Disable dev server in production
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
      enabled: false, // Disable mock data in production
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
      enabled: false, // Disable testing in production
      enableUnitTests: false,
      enableIntegrationTests: false,
      enableE2ETests: false,
      enableVisualRegressionTests: false,
      enablePerformanceTests: false,
      testCoverageThreshold: 0,
      enableTestCoverage: false,
      enableTestParallelization: false,
    },
    codeQuality: {
      enabled: false, // Disable code quality tools in production
      enableESLint: false,
      enablePrettier: false,
      enableTypeScript: false,
      enableImportSorting: false,
      enableUnusedImportDetection: false,
      enableCodeDuplicationDetection: false,
      enableSecurityScanning: false,
    },
    utilities: {
      enabled: false, // Disable utilities in production
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
      enableBundleAnalysis: false, // Disable bundle analysis in production
      enablePerformanceProfiling: true,
      enableMemoryLeakDetection: false,
      enableSlowComponentDetection: true,
      enableNetworkMonitoring: true,
      performanceThresholds: {
        bundleSize: 1024 * 1024, // 1MB
        renderTime: 100, // 100ms
        memoryUsage: 100 * 1024 * 1024, // 100MB
      },
    },
    environment: {
      enableEnvironmentSwitching: false, // Disable environment switching in production
      enableEnvironmentValidation: true,
      enableEnvironmentComparison: false, // Disable environment comparison in production
      enableEnvironmentBackup: false, // Disable environment backup in production
      environmentFiles: [
        '.env.production',
      ],
    },
    documentation: {
      enabled: false, // Disable documentation in production
      enableAutoDocumentation: false,
      enableStorybook: false,
      enableComponentDocumentation: false,
      enableAPIDocumentation: false,
      enableArchitectureDocumentation: false,
      documentationPath: './docs',
    },
    security: {
      enabled: true,
      enableSecurityScanning: true, // Enable security scanning in production
      enableDependencyAudit: true,
      enableVulnerabilityScanning: true, // Enable vulnerability scanning in production
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
      analyticsRetentionDays: 365,
      enableRealTimeAnalytics: true,
    },
  },
};

export default productionConfig;

