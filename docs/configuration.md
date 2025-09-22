# Configuration Guide

This guide provides comprehensive documentation for the Fragrance App configuration system, including feature-based configuration, environment management, feature flags, and best practices.

## 🏗️ Configuration Architecture

The Fragrance App uses a sophisticated feature-based configuration system that provides:

- **Modular Organization**: Feature-specific configuration modules
- **Environment Overrides**: Environment-specific configuration loading
- **Type Safety**: Full TypeScript support with Zod validation
- **Hot Reload**: Development-time configuration hot reloading
- **Validation**: Comprehensive configuration validation
- **Caching**: Intelligent configuration caching

### Configuration Structure

```
src/config/
├── features/                 # Feature configuration modules
│   ├── auth.ts              # Authentication configuration
│   ├── api.ts               # API and Pega DX configuration
│   ├── database.ts          # Database configuration
│   ├── ui.ts                # UI/UX configuration
│   ├── ingredients.ts       # Ingredient management config
│   ├── case-management.ts   # Case management config
│   ├── monitoring.ts        # Logging and monitoring config
│   ├── security.ts          # Security configuration
│   ├── files.ts             # File management config
│   ├── notifications.ts     # Notification system config
│   ├── feature-flags.ts     # Feature flags configuration
│   ├── dev-tools.ts         # Development tools config
│   └── index.ts             # Feature configuration index
├── environments/             # Environment-specific configs
│   ├── development.ts       # Development environment
│   ├── staging.ts           # Staging environment
│   ├── production.ts        # Production environment
│   ├── test.ts              # Test environment
│   └── index.ts             # Environment configuration index
├── loader.ts                # Configuration loading utilities
├── validation.ts            # Configuration validation
├── utils.ts                 # Configuration utilities
├── types.ts                 # Configuration types
├── testing.ts               # Configuration testing utilities
└── index.ts                 # Main configuration interface
```

## 🔧 Feature Configuration

### Authentication Configuration

The authentication configuration (`src/config/features/auth.ts`) manages:

- **Session Management**: Timeout, refresh, and concurrent sessions
- **JWT Configuration**: Secret, algorithm, expiration, and audience
- **OAuth2 Integration**: Provider configuration and scopes
- **Password Policy**: Complexity requirements and history
- **Account Security**: Login attempts, lockout, and 2FA
- **RBAC**: Role-based access control configuration
- **Security Headers**: HTTP security headers
- **Rate Limiting**: Request rate limiting

```typescript
import { authConfigSchema, defaultAuthConfig } from '@/config/features/auth';

// Example: Custom authentication configuration
const customAuthConfig = {
  session: {
    timeout: 2 * 60 * 60 * 1000, // 2 hours
    refreshThreshold: 5 * 60 * 1000, // 5 minutes
    maxConcurrentSessions: 3,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    algorithm: 'HS256',
    expiresIn: '2h',
    refreshExpiresIn: '7d',
    issuer: 'fragrance-app',
    audience: 'fragrance-users',
  },
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    historyCount: 5,
  },
  // ... other configuration options
};
```

### API Configuration

The API configuration (`src/config/features/api.ts`) manages:

- **Pega DX Integration**: Base URL, version, timeout, and retries
- **HTTP Client**: Connection settings and timeouts
- **Request/Response**: Compression, body size, and headers
- **Caching**: TTL, size limits, and strategies
- **Rate Limiting**: Request limits and window settings
- **API Versioning**: Version management and headers
- **Error Handling**: Error codes and retry policies
- **Monitoring**: Metrics collection and health checks

```typescript
import { apiConfigSchema, defaultApiConfig } from '@/config/features/api';

// Example: Custom API configuration
const customApiConfig = {
  pegaDx: {
    baseUrl: process.env.PEGA_DX_BASE_URL || 'https://api.pega.com',
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
    maxSockets: 20,
    maxFreeSockets: 10,
    keepAliveMsecs: 1000,
    userAgent: 'FragranceApp/1.0',
    followRedirects: true,
    maxRedirects: 5,
  },
  caching: {
    enabled: true,
    defaultTTL: 300, // 5 minutes
    maxSize: 1000,
    strategy: 'lru',
    cacheKeyPrefix: 'api:',
  },
  // ... other configuration options
};
```

### Database Configuration

The database configuration (`src/config/features/database.ts`) manages:

- **Connection Settings**: Host, port, database, credentials, and SSL
- **Connection Pooling**: Pool size, timeouts, and validation
- **Query Configuration**: Timeouts, logging, and caching
- **Transaction Settings**: Isolation levels and rollback policies
- **Migration Management**: Migration table and directory
- **Backup Configuration**: Schedule, retention, and compression
- **Performance Optimization**: Query optimization and indexing
- **Monitoring**: Health checks and metrics collection

```typescript
import { databaseConfigSchema, defaultDatabaseConfig } from '@/config/features/database';

// Example: Custom database configuration
const customDatabaseConfig = {
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fragrance_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production',
    sslMode: 'prefer',
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
  // ... other configuration options
};
```

## 🌍 Environment Configuration

### Environment-Specific Settings

The application supports four environments with specific configurations:

#### Development Environment

```typescript
// src/config/environments/development.ts
const developmentConfig = {
  auth: {
    session: {
      timeout: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // Allow HTTP
    },
    jwt: {
      secret: 'development-jwt-secret-key-not-for-production',
      expiresIn: '24h',
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting
    },
  },
  api: {
    pegaDx: {
      baseUrl: 'http://localhost:8080',
      timeout: 60000, // Longer timeout
      retries: 1, // Fewer retries
      logLevel: 'debug', // Verbose logging
    },
    caching: {
      enabled: false, // Disable caching
    },
  },
  // ... other development-specific settings
};
```

#### Staging Environment

```typescript
// src/config/environments/staging.ts
const stagingConfig = {
  auth: {
    session: {
      timeout: 8 * 60 * 60 * 1000, // 8 hours
      secure: true, // Require HTTPS
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'staging-jwt-secret-key',
      expiresIn: '8h',
    },
    rateLimiting: {
      enabled: true,
      maxRequests: 200, // Higher limit
    },
  },
  api: {
    pegaDx: {
      baseUrl: 'https://staging-api.pega.com',
      timeout: 30000,
      retries: 3,
      logLevel: 'info',
    },
    caching: {
      enabled: true,
      defaultTTL: 300,
    },
  },
  // ... other staging-specific settings
};
```

#### Production Environment

```typescript
// src/config/environments/production.ts
const productionConfig = {
  auth: {
    session: {
      timeout: 2 * 60 * 60 * 1000, // 2 hours
      secure: true, // Require HTTPS
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'production-jwt-secret-must-be-changed',
      expiresIn: '2h',
    },
    passwordPolicy: {
      minLength: 12, // Stronger requirements
    },
    accountSecurity: {
      maxLoginAttempts: 3, // Stricter limits
      lockoutDuration: 30 * 60 * 1000, // 30 minutes
      twoFactorEnabled: true, // Enable 2FA
    },
    rateLimiting: {
      enabled: true,
      maxRequests: 100, // Stricter limits
    },
  },
  api: {
    pegaDx: {
      baseUrl: 'https://api.pega.com',
      timeout: 30000,
      retries: 3,
      logLevel: 'warn', // Less verbose
    },
    caching: {
      enabled: true,
      defaultTTL: 600, // 10 minutes
    },
  },
  // ... other production-specific settings
};
```

#### Test Environment

```typescript
// src/config/environments/test.ts
const testConfig = {
  auth: {
    session: {
      timeout: 60 * 60 * 1000, // 1 hour
      secure: false, // Allow HTTP
    },
    jwt: {
      secret: 'test-jwt-secret-key',
      expiresIn: '1h',
    },
    passwordPolicy: {
      minLength: 4, // Minimal requirements
    },
    rateLimiting: {
      enabled: false, // Disable rate limiting
    },
  },
  api: {
    pegaDx: {
      baseUrl: 'http://localhost:8080',
      timeout: 5000, // Short timeout
      retries: 0, // No retries
      logLevel: 'error',
    },
    caching: {
      enabled: false, // Disable caching
    },
  },
  // ... other test-specific settings
};
```

## 🚩 Feature Flags

### Feature Flag Configuration

Feature flags provide runtime configuration control:

```typescript
// src/config/features/feature-flags.ts
const featureFlagsConfig = {
  management: {
    enabled: true,
    enableRuntimeToggles: true,
    enableUserTargeting: false,
    enableEnvironmentOverrides: true,
    enableABTesting: false,
    enableGradualRollout: false,
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
  },
};
```

### Using Feature Flags

```typescript
import { getFeatureFlag, setFeatureFlag, getAllFeatureFlags } from '@/config';

// Check if a feature is enabled
const isNewDashboardEnabled = getFeatureFlag('new-dashboard');

// Set a feature flag
setFeatureFlag('new-dashboard', true);

// Get all feature flags
const allFlags = getAllFeatureFlags();

// Environment variable override
process.env.FEATURE_NEW_DASHBOARD = 'true';
const flagValue = getFeatureFlag('new-dashboard'); // Returns true
```

## 🔧 Configuration Loading

### Loading Configurations

```typescript
import { 
  loadAllConfigs, 
  loadFeatureConfig, 
  initializeConfig,
  getConfig 
} from '@/config';

// Load all configurations
const configs = loadAllConfigs();

// Load specific feature configuration
const authConfig = loadFeatureConfig('auth');

// Load with overrides
const configsWithOverrides = loadAllConfigs({
  auth: {
    session: {
      timeout: 60000,
    },
  },
});

// Initialize configuration system
const configs = initializeConfig({
  enableHotReload: true,
  enableCaching: true,
  cacheTTL: 300000,
});

// Get current configuration instance
const configs = getConfig();
```

### Environment Detection

```typescript
import { 
  getEnvironment, 
  isDevelopment, 
  isProduction, 
  isTest 
} from '@/config';

// Get current environment
const environment = getEnvironment(); // 'development', 'staging', 'production', 'test'

// Check environment
if (isDevelopment()) {
  console.log('Running in development mode');
}

if (isProduction()) {
  console.log('Running in production mode');
}

if (isTest()) {
  console.log('Running in test mode');
}
```

## ✅ Configuration Validation

### Schema Validation

```typescript
import { 
  validateConfigWithDetails, 
  validateAllConfigs, 
  validateForEnvironment 
} from '@/config';

// Validate specific feature configuration
const result = validateConfigWithDetails('auth', authConfig);
if (!result.success) {
  console.error('Validation errors:', result.errors);
  console.warn('Validation warnings:', result.warnings);
}

// Validate all configurations
const result = validateAllConfigs(configs);
if (!result.success) {
  console.error('Configuration validation failed:', result.errors);
}

// Validate for specific environment
const result = validateForEnvironment(configs, 'production');
if (!result.success) {
  console.error('Production validation failed:', result.errors);
}
```

### Custom Validation Rules

```typescript
// Example: Custom validation for JWT secret strength
const validateJWTSecret = (secret: string): boolean => {
  return secret.length >= 32 && secret !== 'your-super-secret-jwt-key-change-in-production';
};

// Example: Custom validation for database SSL in production
const validateDatabaseSSL = (config: any, environment: string): boolean => {
  if (environment === 'production' && !config.connection.ssl) {
    throw new Error('SSL must be enabled for database in production');
  }
  return true;
};
```

## 🧪 Configuration Testing

### Testing Configurations

```typescript
import { 
  createTestConfig, 
  testConfigLoading, 
  testConfigValidation,
  runConfigTests 
} from '@/config/testing';

// Create test configuration
const testConfig = createTestConfig({
  environment: 'test',
  overrides: {
    auth: {
      session: {
        timeout: 60000,
      },
    },
  },
});

// Test configuration loading
const result = await testConfigLoading();
console.log('Loading test result:', result);

// Test configuration validation
const validationResult = await testConfigValidation('auth', authConfig);
console.log('Validation test result:', validationResult);

// Run comprehensive configuration tests
const testResults = await runConfigTests();
console.log('Test summary:', testResults.summary);
```

### Mock Configurations

```typescript
import { createMockConfig } from '@/config/testing';

// Create mock configuration for testing
const mockConfig = createMockConfig({
  auth: {
    session: {
      timeout: 30000,
    },
  },
});

// Use in tests
describe('Authentication', () => {
  it('should validate session timeout', () => {
    expect(mockConfig.auth.session.timeout).toBe(30000);
  });
});
```

## 🔄 Hot Reloading

### Development Hot Reload

```typescript
import { 
  enableHotReload, 
  addConfigChangeListener, 
  removeConfigChangeListener 
} from '@/config';

// Enable hot reload in development
if (process.env.NODE_ENV === 'development') {
  enableHotReload();
}

// Listen for configuration changes
const configChangeListener = (config: any) => {
  console.log('Configuration changed:', config);
};

addConfigChangeListener(configChangeListener);

// Remove listener when done
removeConfigChangeListener(configChangeListener);
```

## 💾 Configuration Caching

### Cache Management

```typescript
import { 
  clearConfigCache, 
  getConfigCacheInfo, 
  isConfigCached 
} from '@/config';

// Clear all cached configurations
clearConfigCache();

// Clear specific cache entry
clearConfigCache('all-configs');

// Get cache information
const cacheInfo = getConfigCacheInfo();
console.log('Cache size:', cacheInfo.size);
console.log('Cache keys:', cacheInfo.keys);
console.log('Cache timestamps:', cacheInfo.timestamps);

// Check if configuration is cached
const isCached = isConfigCached('all-configs');
console.log('Configuration cached:', isCached);
```

## 🚀 Best Practices

### Configuration Organization

1. **Feature-Based**: Organize configurations by feature domains
2. **Environment-Specific**: Use environment-specific overrides
3. **Validation**: Always validate configurations with schemas
4. **Type Safety**: Use TypeScript for configuration types
5. **Documentation**: Document configuration options and defaults

### Security Considerations

1. **Secrets Management**: Never commit secrets to version control
2. **Environment Variables**: Use environment variables for sensitive data
3. **Validation**: Validate all configuration inputs
4. **Audit Logging**: Log configuration changes in production
5. **Access Control**: Restrict configuration access in production

### Performance Optimization

1. **Caching**: Enable configuration caching in production
2. **Lazy Loading**: Load configurations only when needed
3. **Validation**: Cache validation results
4. **Hot Reload**: Disable hot reload in production
5. **Monitoring**: Monitor configuration loading performance

### Development Workflow

1. **Local Overrides**: Use `.env.local` for local development
2. **Feature Flags**: Use feature flags for gradual rollouts
3. **Testing**: Test configurations in all environments
4. **Documentation**: Keep configuration documentation updated
5. **Migration**: Plan configuration migrations carefully

## 🔍 Troubleshooting

### Common Issues

#### Configuration Not Loading

```typescript
// Check environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Check configuration loading
try {
  const configs = loadAllConfigs();
  console.log('Configuration loaded successfully');
} catch (error) {
  console.error('Configuration loading failed:', error);
}
```

#### Validation Errors

```typescript
// Debug validation errors
const result = validateConfigWithDetails('auth', authConfig);
if (!result.success) {
  result.errors.forEach(error => {
    console.error(`Validation error at ${error.path}: ${error.message}`);
  });
}
```

#### Environment Issues

```typescript
// Check environment detection
const environment = getEnvironment();
console.log('Current environment:', environment);

// Check environment-specific configuration
const envConfig = loadEnvironmentConfig();
console.log('Environment configuration:', envConfig);
```

### Debugging Tools

```typescript
import { debugConfig, getConfigSummary } from '@/config';

// Debug current configuration
debugConfig();

// Debug specific feature
debugConfig('auth');

// Get configuration summary
const summary = getConfigSummary();
console.log('Configuration summary:', summary);
```

## 📚 Additional Resources

- [Architecture Guide](architecture.md) - System architecture overview
- [Development Guide](development.md) - Development setup and guidelines
- [API Documentation](api.md) - API reference and examples
- [Security Guide](security.md) - Security features and best practices
- [Troubleshooting Guide](troubleshooting.md) - Common issues and solutions

---

This configuration guide provides comprehensive documentation for the Fragrance App configuration system. For specific implementation details, refer to the individual configuration files and code examples.

