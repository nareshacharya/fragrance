import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  initializeConfig,
  getConfig,
  getFeatureConfig,
  isFeatureEnabled,
  getFeatureFlag,
  setFeatureFlag,
  getAllFeatureFlags,
  getDatabaseConfig,
  getDatabaseUrl,
  isDatabaseSSLEnabled,
  getApiConfig,
  getPegaDxConfig,
  getApiBaseUrl,
  getApiTimeout,
  getAuthConfig,
  getJWTConfig,
  getSessionConfig,
  isJWTEnabled,
  getJWTSecret,
  getSecurityConfig,
  getCORSConfig,
  getSecurityHeaders,
  isCORSEnabled,
  getCORSOrigins,
  getFilesConfig,
  getUploadConfig,
  getStorageConfig,
  getMaxFileSize,
  getAllowedFileTypes,
  isFileUploadEnabled,
  getNotificationsConfig,
  getEmailConfig,
  getSMSConfig,
  isEmailEnabled,
  isSMSEnabled,
  getSMTPConfig,
  getUIConfig,
  getThemeConfig,
  getDesignSystemConfig,
  getDefaultTheme,
  isThemeSwitchingEnabled,
  getMonitoringConfig,
  getLoggingConfig,
  getPerformanceConfig,
  isLoggingEnabled,
  getLogLevel,
  getDevToolsConfig,
  getHotReloadConfig,
  getDebuggingConfig,
  isHotReloadEnabled,
  isDebuggingEnabled,
  getCurrentEnvironment,
  isDevelopmentEnvironment,
  isProductionEnvironment,
  isTestEnvironment,
  validateCurrentConfig,
  debugConfig,
  getConfigSummary,
  reloadConfig,
  updateFeatureConfig,
} from './utils';
import { createMockConfig } from './testing';

describe('Configuration Utilities', () => {
  beforeEach(() => {
    // Reset environment
    delete process.env.NODE_ENV;
    // Clear any existing config instance
    (global as any).configInstance = null;
  });

  afterEach(() => {
    // Clean up after each test
    (global as any).configInstance = null;
  });

  describe('Configuration Initialization', () => {
    it('should initialize configuration', () => {
      const config = initializeConfig();
      
      expect(config).toBeDefined();
      expect(config.auth).toBeDefined();
      expect(config.api).toBeDefined();
    });

    it('should initialize with overrides', () => {
      const overrides = {
        auth: {
          session: {
            timeout: 60000,
          },
        },
      };

      const config = initializeConfig(overrides);
      
      expect(config.auth.session.timeout).toBe(60000);
    });

    it('should return same instance on subsequent calls', () => {
      const config1 = getConfig();
      const config2 = getConfig();
      
      expect(config1).toBe(config2);
    });
  });

  describe('Feature Configuration Access', () => {
    it('should get feature configuration', () => {
      const authConfig = getFeatureConfig('auth');
      
      expect(authConfig).toBeDefined();
      expect(authConfig.session).toBeDefined();
      expect(authConfig.jwt).toBeDefined();
    });

    it('should check if feature is enabled', () => {
      const enabled = isFeatureEnabled('auth');
      
      expect(typeof enabled).toBe('boolean');
    });

    it('should handle unknown feature names', () => {
      expect(() => {
        getFeatureConfig('unknownFeature' as any);
      }).toThrow();
    });
  });

  describe('Feature Flags', () => {
    it('should get feature flag value', () => {
      const flagValue = getFeatureFlag('new-dashboard');
      
      expect(typeof flagValue).toBe('boolean');
    });

    it('should get feature flag with default value', () => {
      const flagValue = getFeatureFlag('unknown-flag', true);
      
      expect(flagValue).toBe(true);
    });

    it('should set feature flag', () => {
      setFeatureFlag('new-dashboard', true);
      const flagValue = getFeatureFlag('new-dashboard');
      
      expect(flagValue).toBe(true);
    });

    it('should get all feature flags', () => {
      const flags = getAllFeatureFlags();
      
      expect(typeof flags).toBe('object');
      expect(flags['new-dashboard']).toBeDefined();
      expect(flags['advanced-search']).toBeDefined();
    });

    it('should respect environment variable overrides', () => {
      process.env.FEATURE_NEW_DASHBOARD = 'true';
      
      const flagValue = getFeatureFlag('new-dashboard');
      
      expect(flagValue).toBe(true);
      
      delete process.env.FEATURE_NEW_DASHBOARD;
    });
  });

  describe('Database Configuration', () => {
    it('should get database configuration', () => {
      const dbConfig = getDatabaseConfig();
      
      expect(dbConfig).toBeDefined();
      expect(dbConfig.connection).toBeDefined();
      expect(dbConfig.pooling).toBeDefined();
    });

    it('should get database URL', () => {
      const dbUrl = getDatabaseUrl();
      
      expect(typeof dbUrl).toBe('string');
      expect(dbUrl).toContain('postgresql://');
    });

    it('should check SSL enabled status', () => {
      const sslEnabled = isDatabaseSSLEnabled();
      
      expect(typeof sslEnabled).toBe('boolean');
    });
  });

  describe('API Configuration', () => {
    it('should get API configuration', () => {
      const apiConfig = getApiConfig();
      
      expect(apiConfig).toBeDefined();
      expect(apiConfig.pegaDx).toBeDefined();
      expect(apiConfig.httpClient).toBeDefined();
    });

    it('should get Pega DX configuration', () => {
      const pegaConfig = getPegaDxConfig();
      
      expect(pegaConfig).toBeDefined();
      expect(pegaConfig.baseUrl).toBeDefined();
      expect(pegaConfig.apiVersion).toBeDefined();
    });

    it('should get API base URL', () => {
      const baseUrl = getApiBaseUrl();
      
      expect(typeof baseUrl).toBe('string');
      expect(baseUrl).toContain('/api/');
    });

    it('should get API timeout', () => {
      const timeout = getApiTimeout();
      
      expect(typeof timeout).toBe('number');
      expect(timeout).toBeGreaterThan(0);
    });
  });

  describe('Authentication Configuration', () => {
    it('should get auth configuration', () => {
      const authConfig = getAuthConfig();
      
      expect(authConfig).toBeDefined();
      expect(authConfig.session).toBeDefined();
      expect(authConfig.jwt).toBeDefined();
    });

    it('should get JWT configuration', () => {
      const jwtConfig = getJWTConfig();
      
      expect(jwtConfig).toBeDefined();
      expect(jwtConfig.secret).toBeDefined();
      expect(jwtConfig.algorithm).toBeDefined();
    });

    it('should get session configuration', () => {
      const sessionConfig = getSessionConfig();
      
      expect(sessionConfig).toBeDefined();
      expect(sessionConfig.timeout).toBeDefined();
      expect(sessionConfig.secure).toBeDefined();
    });

    it('should check JWT enabled status', () => {
      const jwtEnabled = isJWTEnabled();
      
      expect(typeof jwtEnabled).toBe('boolean');
    });

    it('should get JWT secret', () => {
      const secret = getJWTSecret();
      
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThan(0);
    });
  });

  describe('Security Configuration', () => {
    it('should get security configuration', () => {
      const securityConfig = getSecurityConfig();
      
      expect(securityConfig).toBeDefined();
      expect(securityConfig.cors).toBeDefined();
      expect(securityConfig.securityHeaders).toBeDefined();
    });

    it('should get CORS configuration', () => {
      const corsConfig = getCORSConfig();
      
      expect(corsConfig).toBeDefined();
      expect(corsConfig.enabled).toBeDefined();
      expect(corsConfig.origin).toBeDefined();
    });

    it('should get security headers', () => {
      const headers = getSecurityHeaders();
      
      expect(typeof headers).toBe('object');
      expect(headers['X-Content-Type-Options']).toBeDefined();
      expect(headers['X-Frame-Options']).toBeDefined();
    });

    it('should check CORS enabled status', () => {
      const corsEnabled = isCORSEnabled();
      
      expect(typeof corsEnabled).toBe('boolean');
    });

    it('should get CORS origins', () => {
      const origins = getCORSOrigins();
      
      expect(Array.isArray(origins)).toBe(true);
    });
  });

  describe('Files Configuration', () => {
    it('should get files configuration', () => {
      const filesConfig = getFilesConfig();
      
      expect(filesConfig).toBeDefined();
      expect(filesConfig.upload).toBeDefined();
      expect(filesConfig.storage).toBeDefined();
    });

    it('should get upload configuration', () => {
      const uploadConfig = getUploadConfig();
      
      expect(uploadConfig).toBeDefined();
      expect(uploadConfig.maxFileSize).toBeDefined();
      expect(uploadConfig.allowedMimeTypes).toBeDefined();
    });

    it('should get storage configuration', () => {
      const storageConfig = getStorageConfig();
      
      expect(storageConfig).toBeDefined();
      expect(storageConfig.provider).toBeDefined();
      expect(storageConfig.localPath).toBeDefined();
    });

    it('should get max file size', () => {
      const maxSize = getMaxFileSize();
      
      expect(typeof maxSize).toBe('number');
      expect(maxSize).toBeGreaterThan(0);
    });

    it('should get allowed file types', () => {
      const allowedTypes = getAllowedFileTypes();
      
      expect(Array.isArray(allowedTypes)).toBe(true);
      expect(allowedTypes.length).toBeGreaterThan(0);
    });

    it('should check file upload enabled status', () => {
      const uploadEnabled = isFileUploadEnabled();
      
      expect(typeof uploadEnabled).toBe('boolean');
    });
  });

  describe('Notifications Configuration', () => {
    it('should get notifications configuration', () => {
      const notificationsConfig = getNotificationsConfig();
      
      expect(notificationsConfig).toBeDefined();
      expect(notificationsConfig.email).toBeDefined();
      expect(notificationsConfig.sms).toBeDefined();
    });

    it('should get email configuration', () => {
      const emailConfig = getEmailConfig();
      
      expect(emailConfig).toBeDefined();
      expect(emailConfig.enabled).toBeDefined();
      expect(emailConfig.smtp).toBeDefined();
    });

    it('should get SMS configuration', () => {
      const smsConfig = getSMSConfig();
      
      expect(smsConfig).toBeDefined();
      expect(smsConfig.enabled).toBeDefined();
      expect(smsConfig.provider).toBeDefined();
    });

    it('should check email enabled status', () => {
      const emailEnabled = isEmailEnabled();
      
      expect(typeof emailEnabled).toBe('boolean');
    });

    it('should check SMS enabled status', () => {
      const smsEnabled = isSMSEnabled();
      
      expect(typeof smsEnabled).toBe('boolean');
    });

    it('should get SMTP configuration', () => {
      const smtpConfig = getSMTPConfig();
      
      expect(smtpConfig).toBeDefined();
      expect(smtpConfig.host).toBeDefined();
      expect(smtpConfig.port).toBeDefined();
    });
  });

  describe('UI Configuration', () => {
    it('should get UI configuration', () => {
      const uiConfig = getUIConfig();
      
      expect(uiConfig).toBeDefined();
      expect(uiConfig.theme).toBeDefined();
      expect(uiConfig.designSystem).toBeDefined();
    });

    it('should get theme configuration', () => {
      const themeConfig = getThemeConfig();
      
      expect(themeConfig).toBeDefined();
      expect(themeConfig.defaultTheme).toBeDefined();
      expect(themeConfig.enableThemeSwitching).toBeDefined();
    });

    it('should get design system configuration', () => {
      const designSystemConfig = getDesignSystemConfig();
      
      expect(designSystemConfig).toBeDefined();
      expect(designSystemConfig.primaryColor).toBeDefined();
      expect(designSystemConfig.neutralColors).toBeDefined();
    });

    it('should get default theme', () => {
      const defaultTheme = getDefaultTheme();
      
      expect(typeof defaultTheme).toBe('string');
      expect(['light', 'dark', 'system']).toContain(defaultTheme);
    });

    it('should check theme switching enabled status', () => {
      const themeSwitchingEnabled = isThemeSwitchingEnabled();
      
      expect(typeof themeSwitchingEnabled).toBe('boolean');
    });
  });

  describe('Monitoring Configuration', () => {
    it('should get monitoring configuration', () => {
      const monitoringConfig = getMonitoringConfig();
      
      expect(monitoringConfig).toBeDefined();
      expect(monitoringConfig.logging).toBeDefined();
      expect(monitoringConfig.performance).toBeDefined();
    });

    it('should get logging configuration', () => {
      const loggingConfig = getLoggingConfig();
      
      expect(loggingConfig).toBeDefined();
      expect(loggingConfig.enabled).toBeDefined();
      expect(loggingConfig.level).toBeDefined();
    });

    it('should get performance configuration', () => {
      const performanceConfig = getPerformanceConfig();
      
      expect(performanceConfig).toBeDefined();
      expect(performanceConfig.enabled).toBeDefined();
      expect(performanceConfig.enableMetricsCollection).toBeDefined();
    });

    it('should check logging enabled status', () => {
      const loggingEnabled = isLoggingEnabled();
      
      expect(typeof loggingEnabled).toBe('boolean');
    });

    it('should get log level', () => {
      const logLevel = getLogLevel();
      
      expect(typeof logLevel).toBe('string');
      expect(['debug', 'info', 'warn', 'error']).toContain(logLevel);
    });
  });

  describe('Development Tools Configuration', () => {
    it('should get dev tools configuration', () => {
      const devToolsConfig = getDevToolsConfig();
      
      expect(devToolsConfig).toBeDefined();
      expect(devToolsConfig.hotReload).toBeDefined();
      expect(devToolsConfig.debugging).toBeDefined();
    });

    it('should get hot reload configuration', () => {
      const hotReloadConfig = getHotReloadConfig();
      
      expect(hotReloadConfig).toBeDefined();
      expect(hotReloadConfig.enabled).toBeDefined();
      expect(hotReloadConfig.enableFileWatching).toBeDefined();
    });

    it('should get debugging configuration', () => {
      const debuggingConfig = getDebuggingConfig();
      
      expect(debuggingConfig).toBeDefined();
      expect(debuggingConfig.enabled).toBeDefined();
      expect(debuggingConfig.enableSourceMaps).toBeDefined();
    });

    it('should check hot reload enabled status', () => {
      const hotReloadEnabled = isHotReloadEnabled();
      
      expect(typeof hotReloadEnabled).toBe('boolean');
    });

    it('should check debugging enabled status', () => {
      const debuggingEnabled = isDebuggingEnabled();
      
      expect(typeof debuggingEnabled).toBe('boolean');
    });
  });

  describe('Environment Utilities', () => {
    it('should get current environment', () => {
      const environment = getCurrentEnvironment();
      
      expect(typeof environment).toBe('string');
      expect(['development', 'staging', 'production', 'test']).toContain(environment);
    });

    it('should check development environment', () => {
      process.env.NODE_ENV = 'development';
      const isDev = isDevelopmentEnvironment();
      
      expect(isDev).toBe(true);
    });

    it('should check production environment', () => {
      process.env.NODE_ENV = 'production';
      const isProd = isProductionEnvironment();
      
      expect(isProd).toBe(true);
    });

    it('should check test environment', () => {
      process.env.NODE_ENV = 'test';
      const isTest = isTestEnvironment();
      
      expect(isTest).toBe(true);
    });
  });

  describe('Configuration Validation', () => {
    it('should validate current configuration', () => {
      const isValid = validateCurrentConfig();
      
      expect(typeof isValid).toBe('boolean');
    });

    it('should validate configuration with required properties', () => {
      // Set required environment variables
      process.env.JWT_SECRET = 'test-secret';
      process.env.DB_HOST = 'localhost';
      process.env.DB_NAME = 'test-db';
      process.env.DB_USER = 'test-user';
      process.env.DB_PASSWORD = 'test-password';
      process.env.PEGA_DX_BASE_URL = 'http://localhost:8080';
      
      const isValid = validateCurrentConfig();
      
      expect(isValid).toBe(true);
    });
  });

  describe('Configuration Debugging', () => {
    it('should debug configuration', () => {
      // Mock console.log to avoid output during tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      debugConfig();
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should debug specific feature configuration', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      debugConfig('auth');
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should get configuration summary', () => {
      const summary = getConfigSummary();
      
      expect(typeof summary).toBe('object');
      expect(summary.auth).toBeDefined();
      expect(summary.api).toBeDefined();
    });
  });

  describe('Configuration Reload', () => {
    it('should reload configuration', () => {
      const config1 = getConfig();
      const config2 = reloadConfig();
      
      expect(config2).toBeDefined();
      expect(config2.auth).toBeDefined();
    });

    it('should reload configuration with overrides', () => {
      const overrides = {
        auth: {
          session: {
            timeout: 120000,
          },
        },
      };

      const config = reloadConfig(overrides);
      
      expect(config.auth.session.timeout).toBe(120000);
    });

    it('should update feature configuration', () => {
      const updates = {
        session: {
          timeout: 180000,
        },
      };

      const updatedConfig = updateFeatureConfig('auth', updates);
      
      expect(updatedConfig.session.timeout).toBe(180000);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing configuration gracefully', () => {
      (global as any).configInstance = null;
      
      expect(() => {
        getConfig();
      }).not.toThrow();
    });

    it('should handle invalid feature names', () => {
      expect(() => {
        getFeatureConfig('invalidFeature' as any);
      }).toThrow();
    });

    it('should handle configuration validation errors', () => {
      // This should not throw an error, but return false
      const isValid = validateCurrentConfig();
      
      expect(typeof isValid).toBe('boolean');
    });
  });

  describe('Performance', () => {
    it('should access configurations quickly', () => {
      const startTime = Date.now();
      
      getConfig();
      getFeatureConfig('auth');
      getFeatureConfig('api');
      getFeatureConfig('database');
      
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(100); // Should access in less than 100ms
    });

    it('should cache configurations efficiently', () => {
      const config1 = getConfig();
      const config2 = getConfig();
      
      expect(config1).toBe(config2); // Should be the same reference
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed configurations', () => {
      const authConfig = getFeatureConfig('auth');
      
      expect(typeof authConfig.session.timeout).toBe('number');
      expect(typeof authConfig.jwt.secret).toBe('string');
      expect(typeof authConfig.passwordPolicy.minLength).toBe('number');
    });

    it('should return properly typed feature flags', () => {
      const flagValue = getFeatureFlag('new-dashboard');
      
      expect(typeof flagValue).toBe('boolean');
    });

    it('should return properly typed environment values', () => {
      const environment = getCurrentEnvironment();
      
      expect(typeof environment).toBe('string');
    });
  });
});

