#!/usr/bin/env node

/**
 * Configuration Documentation Generator
 * Generates comprehensive documentation for all configuration options
 */

const fs = require('fs');
const path = require('path');

// Configuration metadata
const configMetadata = {
  auth: {
    title: 'Authentication Configuration',
    description: 'Configuration options for user authentication and authorization',
    sections: [
      {
        title: 'JWT Settings',
        description: 'JSON Web Token configuration',
        options: [
          { name: 'jwtSecret', type: 'string', required: true, description: 'Secret key for JWT signing' },
          { name: 'jwtExpiresIn', type: 'string', required: true, description: 'Token expiration time' },
          { name: 'jwtIssuer', type: 'string', required: false, description: 'JWT issuer identifier' },
          { name: 'jwtAudience', type: 'string', required: false, description: 'JWT audience identifier' }
        ]
      },
      {
        title: 'Session Management',
        description: 'User session configuration',
        options: [
          { name: 'sessionSecret', type: 'string', required: true, description: 'Secret for session signing' },
          { name: 'sessionMaxAge', type: 'number', required: true, description: 'Session maximum age in milliseconds' },
          { name: 'sessionSecure', type: 'boolean', required: false, description: 'Use secure cookies' },
          { name: 'sessionHttpOnly', type: 'boolean', required: false, description: 'HTTP-only cookies' }
        ]
      },
      {
        title: 'Password Policy',
        description: 'Password requirements and validation',
        options: [
          { name: 'minLength', type: 'number', required: true, description: 'Minimum password length' },
          { name: 'requireUppercase', type: 'boolean', required: false, description: 'Require uppercase letters' },
          { name: 'requireNumbers', type: 'boolean', required: false, description: 'Require numbers' },
          { name: 'requireSpecialChars', type: 'boolean', required: false, description: 'Require special characters' }
        ]
      }
    ]
  },
  
  api: {
    title: 'API Configuration',
    description: 'Configuration options for API endpoints and behavior',
    sections: [
      {
        title: 'Base Configuration',
        description: 'Basic API settings',
        options: [
          { name: 'baseUrl', type: 'string', required: true, description: 'Base URL for API endpoints' },
          { name: 'timeout', type: 'number', required: true, description: 'Request timeout in milliseconds' },
          { name: 'retries', type: 'number', required: false, description: 'Number of retry attempts' },
          { name: 'version', type: 'string', required: false, description: 'API version' }
        ]
      },
      {
        title: 'Rate Limiting',
        description: 'API rate limiting configuration',
        options: [
          { name: 'windowMs', type: 'number', required: true, description: 'Rate limit window in milliseconds' },
          { name: 'maxRequests', type: 'number', required: true, description: 'Maximum requests per window' },
          { name: 'skipSuccessfulRequests', type: 'boolean', required: false, description: 'Skip successful requests from rate limit' }
        ]
      }
    ]
  },
  
  database: {
    title: 'Database Configuration',
    description: 'Configuration options for database connections and behavior',
    sections: [
      {
        title: 'Connection Settings',
        description: 'Database connection configuration',
        options: [
          { name: 'url', type: 'string', required: true, description: 'Database connection URL' },
          { name: 'ssl', type: 'boolean', required: false, description: 'Enable SSL connection' },
          { name: 'host', type: 'string', required: false, description: 'Database host' },
          { name: 'port', type: 'number', required: false, description: 'Database port' },
          { name: 'database', type: 'string', required: false, description: 'Database name' },
          { name: 'username', type: 'string', required: false, description: 'Database username' },
          { name: 'password', type: 'string', required: false, description: 'Database password' }
        ]
      },
      {
        title: 'Connection Pool',
        description: 'Connection pool configuration',
        options: [
          { name: 'min', type: 'number', required: false, description: 'Minimum connections in pool' },
          { name: 'max', type: 'number', required: false, description: 'Maximum connections in pool' },
          { name: 'idleTimeoutMillis', type: 'number', required: false, description: 'Idle connection timeout' },
          { name: 'connectionTimeoutMillis', type: 'number', required: false, description: 'Connection timeout' }
        ]
      }
    ]
  },
  
  ui: {
    title: 'User Interface Configuration',
    description: 'Configuration options for user interface and user experience',
    sections: [
      {
        title: 'Display Settings',
        description: 'UI display configuration',
        options: [
          { name: 'theme', type: 'string', required: false, description: 'Default theme (light/dark/auto)' },
          { name: 'language', type: 'string', required: false, description: 'Default language' },
          { name: 'timezone', type: 'string', required: false, description: 'Default timezone' },
          { name: 'dateFormat', type: 'string', required: false, description: 'Date format' },
          { name: 'itemsPerPage', type: 'number', required: false, description: 'Default items per page' }
        ]
      }
    ]
  },
  
  ingredients: {
    title: 'Ingredient Management Configuration',
    description: 'Configuration options for ingredient management features',
    sections: [
      {
        title: 'File Upload',
        description: 'File upload configuration for ingredients',
        options: [
          { name: 'maxFileSize', type: 'number', required: true, description: 'Maximum file size in bytes' },
          { name: 'allowedTypes', type: 'array', required: true, description: 'Allowed file types' },
          { name: 'storageProvider', type: 'string', required: true, description: 'Storage provider (local/aws/azure/gcp)' },
          { name: 'cacheEnabled', type: 'boolean', required: false, description: 'Enable caching' },
          { name: 'cacheTtl', type: 'number', required: false, description: 'Cache TTL in seconds' }
        ]
      }
    ]
  },
  
  caseManagement: {
    title: 'Case Management Configuration',
    description: 'Configuration options for case management features',
    sections: [
      {
        title: 'Workflow Settings',
        description: 'Case workflow configuration',
        options: [
          { name: 'autoAssignment', type: 'boolean', required: false, description: 'Enable automatic case assignment' },
          { name: 'notificationEnabled', type: 'boolean', required: false, description: 'Enable notifications' },
          { name: 'escalationRules', type: 'array', required: false, description: 'Case escalation rules' }
        ]
      }
    ]
  },
  
  monitoring: {
    title: 'Monitoring Configuration',
    description: 'Configuration options for monitoring and logging',
    sections: [
      {
        title: 'Logging',
        description: 'Logging configuration',
        options: [
          { name: 'logLevel', type: 'string', required: true, description: 'Log level (error/warn/info/debug)' },
          { name: 'enableMetrics', type: 'boolean', required: false, description: 'Enable metrics collection' },
          { name: 'enableTracing', type: 'boolean', required: false, description: 'Enable distributed tracing' },
          { name: 'sentryDsn', type: 'string', required: false, description: 'Sentry DSN for error tracking' }
        ]
      }
    ]
  },
  
  security: {
    title: 'Security Configuration',
    description: 'Configuration options for security features',
    sections: [
      {
        title: 'CORS Settings',
        description: 'Cross-Origin Resource Sharing configuration',
        options: [
          { name: 'corsOrigins', type: 'array', required: true, description: 'Allowed CORS origins' },
          { name: 'corsMethods', type: 'array', required: false, description: 'Allowed CORS methods' },
          { name: 'corsHeaders', type: 'array', required: false, description: 'Allowed CORS headers' }
        ]
      },
      {
        title: 'Security Headers',
        description: 'Security header configuration',
        options: [
          { name: 'csrfEnabled', type: 'boolean', required: false, description: 'Enable CSRF protection' },
          { name: 'helmetEnabled', type: 'boolean', required: false, description: 'Enable Helmet security headers' },
          { name: 'rateLimitEnabled', type: 'boolean', required: false, description: 'Enable rate limiting' }
        ]
      }
    ]
  },
  
  files: {
    title: 'File Management Configuration',
    description: 'Configuration options for file management features',
    sections: [
      {
        title: 'File Storage',
        description: 'File storage configuration',
        options: [
          { name: 'maxFileSize', type: 'number', required: true, description: 'Maximum file size in bytes' },
          { name: 'allowedTypes', type: 'array', required: true, description: 'Allowed file types' },
          { name: 'storageProvider', type: 'string', required: true, description: 'Storage provider' },
          { name: 'encryptionEnabled', type: 'boolean', required: false, description: 'Enable file encryption' },
          { name: 'compressionEnabled', type: 'boolean', required: false, description: 'Enable file compression' }
        ]
      }
    ]
  },
  
  notifications: {
    title: 'Notifications Configuration',
    description: 'Configuration options for notification features',
    sections: [
      {
        title: 'Email Settings',
        description: 'Email notification configuration',
        options: [
          { name: 'emailEnabled', type: 'boolean', required: false, description: 'Enable email notifications' },
          { name: 'smtpHost', type: 'string', required: false, description: 'SMTP host' },
          { name: 'smtpPort', type: 'number', required: false, description: 'SMTP port' },
          { name: 'smtpUser', type: 'string', required: false, description: 'SMTP username' },
          { name: 'smtpPass', type: 'string', required: false, description: 'SMTP password' }
        ]
      }
    ]
  },
  
  featureFlags: {
    title: 'Feature Flags Configuration',
    description: 'Configuration options for feature flags',
    sections: [
      {
        title: 'Feature Toggles',
        description: 'Feature flag settings',
        options: [
          { name: 'pegaIntegration', type: 'boolean', required: false, description: 'Enable Pega integration' },
          { name: 'advancedAnalytics', type: 'boolean', required: false, description: 'Enable advanced analytics' },
          { name: 'realTimeUpdates', type: 'boolean', required: false, description: 'Enable real-time updates' },
          { name: 'fileUpload', type: 'boolean', required: false, description: 'Enable file upload' },
          { name: 'notifications', type: 'boolean', required: false, description: 'Enable notifications' }
        ]
      }
    ]
  },
  
  devTools: {
    title: 'Development Tools Configuration',
    description: 'Configuration options for development tools',
    sections: [
      {
        title: 'Development Features',
        description: 'Development tool settings',
        options: [
          { name: 'hotReload', type: 'boolean', required: false, description: 'Enable hot reload' },
          { name: 'debugMode', type: 'boolean', required: false, description: 'Enable debug mode' },
          { name: 'mockData', type: 'boolean', required: false, description: 'Enable mock data' },
          { name: 'performanceMonitoring', type: 'boolean', required: false, description: 'Enable performance monitoring' }
        ]
      }
    ]
  }
};

// Environment configurations
const environmentConfigs = {
  development: {
    title: 'Development Environment',
    description: 'Configuration for development environment',
    features: [
      'Hot reload enabled',
      'Debug mode enabled',
      'Mock data available',
      'Performance monitoring enabled',
      'Error reporting enabled'
    ],
    requirements: [
      'NODE_ENV=development',
      'PORT=3000',
      'DATABASE_URL (local database)',
      'REDIS_URL (local Redis)',
      'JWT_SECRET (development secret)',
      'SESSION_SECRET (development secret)'
    ]
  },
  
  staging: {
    title: 'Staging Environment',
    description: 'Configuration for staging environment',
    features: [
      'Production-like setup',
      'Integration testing enabled',
      'Performance monitoring enabled',
      'Error reporting enabled',
      'Security features enabled'
    ],
    requirements: [
      'NODE_ENV=staging',
      'PORT=3000',
      'DATABASE_URL (staging database)',
      'REDIS_URL (staging Redis)',
      'JWT_SECRET (staging secret)',
      'SESSION_SECRET (staging secret)',
      'PEGA_API_URL (staging Pega)',
      'PEGA_API_KEY (staging key)',
      'SMTP_HOST (email service)',
      'SMTP_PORT (email port)',
      'SMTP_USER (email user)',
      'SMTP_PASS (email password)'
    ]
  },
  
  production: {
    title: 'Production Environment',
    description: 'Configuration for production environment',
    features: [
      'Full security enabled',
      'Performance optimized',
      'Monitoring enabled',
      'Error tracking enabled',
      'Backup enabled'
    ],
    requirements: [
      'NODE_ENV=production',
      'PORT=3000',
      'DATABASE_URL (production database)',
      'REDIS_URL (production Redis)',
      'JWT_SECRET (production secret)',
      'SESSION_SECRET (production secret)',
      'PEGA_API_URL (production Pega)',
      'PEGA_API_KEY (production key)',
      'SMTP_HOST (production email)',
      'SMTP_PORT (production email port)',
      'SMTP_USER (production email user)',
      'SMTP_PASS (production email password)',
      'SENTRY_DSN (error tracking)',
      'AWS_REGION (cloud region)',
      'AWS_ACCESS_KEY_ID (cloud access key)',
      'AWS_SECRET_ACCESS_KEY (cloud secret key)',
      'AWS_BUCKET (cloud bucket)'
    ]
  }
};

/**
 * Generate configuration documentation
 */
function generateConfigDocs() {
  const docs = [];
  
  // Add header
  docs.push('# Configuration Documentation');
  docs.push('');
  docs.push('This document provides comprehensive documentation for all configuration options in the Fragrance Management System.');
  docs.push('');
  docs.push('## Table of Contents');
  docs.push('');
  
  // Generate table of contents
  Object.keys(configMetadata).forEach(key => {
    const config = configMetadata[key];
    docs.push(`- [${config.title}](#${key}-configuration)`);
  });
  
  docs.push('- [Environment Configurations](#environment-configurations)');
  docs.push('- [Configuration Validation](#configuration-validation)');
  docs.push('- [Best Practices](#best-practices)');
  docs.push('');
  
  // Generate configuration sections
  Object.entries(configMetadata).forEach(([key, config]) => {
    docs.push(`## ${config.title}`);
    docs.push('');
    docs.push(config.description);
    docs.push('');
    
    config.sections.forEach(section => {
      docs.push(`### ${section.title}`);
      docs.push('');
      docs.push(section.description);
      docs.push('');
      docs.push('| Option | Type | Required | Description |');
      docs.push('|--------|------|----------|-------------|');
      
      section.options.forEach(option => {
        const required = option.required ? 'Yes' : 'No';
        docs.push(`| \`${option.name}\` | \`${option.type}\` | ${required} | ${option.description} |`);
      });
      
      docs.push('');
    });
  });
  
  // Generate environment configurations
  docs.push('## Environment Configurations');
  docs.push('');
  
  Object.entries(environmentConfigs).forEach(([key, config]) => {
    docs.push(`### ${config.title}`);
    docs.push('');
    docs.push(config.description);
    docs.push('');
    docs.push('#### Features');
    docs.push('');
    config.features.forEach(feature => {
      docs.push(`- ${feature}`);
    });
    docs.push('');
    docs.push('#### Required Environment Variables');
    docs.push('');
    config.requirements.forEach(requirement => {
      docs.push(`- \`${requirement}\``);
    });
    docs.push('');
  });
  
  // Add configuration validation section
  docs.push('## Configuration Validation');
  docs.push('');
  docs.push('The system includes built-in configuration validation to ensure all required settings are properly configured.');
  docs.push('');
  docs.push('### Running Validation');
  docs.push('');
  docs.push('```bash');
  docs.push('# Validate all configurations');
  docs.push('npm run config:validate');
  docs.push('');
  docs.push('# Validate specific environment');
  docs.push('NODE_ENV=production npm run config:validate');
  docs.push('```');
  docs.push('');
  docs.push('### Validation Checks');
  docs.push('');
  docs.push('- **Required Fields**: Ensures all required configuration options are set');
  docs.push('- **Type Validation**: Validates that configuration values match expected types');
  docs.push('- **Security Checks**: Validates security-related configuration');
  docs.push('- **Environment Variables**: Checks that all required environment variables are set');
  docs.push('- **File Existence**: Verifies that all required configuration files exist');
  docs.push('');
  
  // Add best practices section
  docs.push('## Best Practices');
  docs.push('');
  docs.push('### Security');
  docs.push('');
  docs.push('- Use strong, unique secrets for JWT and session signing');
  docs.push('- Enable SSL/TLS for database connections in production');
  docs.push('- Configure CORS origins properly (avoid wildcards)');
  docs.push('- Use environment variables for sensitive configuration');
  docs.push('- Regularly rotate secrets and API keys');
  docs.push('');
  docs.push('### Performance');
  docs.push('');
  docs.push('- Configure appropriate connection pool sizes');
  docs.push('- Enable caching where appropriate');
  docs.push('- Set reasonable timeouts and retry limits');
  docs.push('- Monitor and tune performance settings');
  docs.push('');
  docs.push('### Development');
  docs.push('');
  docs.push('- Use different configurations for different environments');
  docs.push('- Keep development secrets separate from production');
  docs.push('- Use feature flags to control functionality');
  docs.push('- Document any custom configuration changes');
  docs.push('');
  docs.push('### Maintenance');
  docs.push('');
  docs.push('- Regularly review and update configuration');
  docs.push('- Monitor configuration changes in version control');
  docs.push('- Test configuration changes in staging before production');
  docs.push('- Keep configuration documentation up to date');
  docs.push('');
  
  return docs.join('\n');
}

/**
 * Generate environment-specific documentation
 */
function generateEnvironmentDocs() {
  const docs = [];
  
  docs.push('# Environment Configuration Guide');
  docs.push('');
  docs.push('This guide provides detailed information about configuring the Fragrance Management System for different environments.');
  docs.push('');
  
  Object.entries(environmentConfigs).forEach(([key, config]) => {
    docs.push(`## ${config.title}`);
    docs.push('');
    docs.push(config.description);
    docs.push('');
    docs.push('### Features');
    docs.push('');
    config.features.forEach(feature => {
      docs.push(`- ${feature}`);
    });
    docs.push('');
    docs.push('### Required Environment Variables');
    docs.push('');
    config.requirements.forEach(requirement => {
      docs.push(`- \`${requirement}\``);
    });
    docs.push('');
    docs.push('### Example Configuration');
    docs.push('');
    docs.push('```bash');
    docs.push(`# ${config.title} Configuration`);
    docs.push('');
    config.requirements.forEach(requirement => {
      if (requirement.includes('=')) {
        docs.push(requirement);
      } else {
        docs.push(`${requirement}=your-value-here`);
      }
    });
    docs.push('```');
    docs.push('');
  });
  
  return docs.join('\n');
}

/**
 * Generate API documentation
 */
function generateApiDocs() {
  const docs = [];
  
  docs.push('# Configuration API Documentation');
  docs.push('');
  docs.push('This document describes the programmatic API for configuration management.');
  docs.push('');
  docs.push('## Configuration Loader');
  docs.push('');
  docs.push('The configuration loader provides a unified interface for accessing configuration values.');
  docs.push('');
  docs.push('```typescript');
  docs.push('import { configLoader } from "@/config";');
  docs.push('');
  docs.push('// Load configuration');
  docs.push('const config = await configLoader.load();');
  docs.push('');
  docs.push('// Access specific configuration');
  docs.push('const authConfig = config.auth;');
  docs.push('const dbConfig = config.database;');
  docs.push('```');
  docs.push('');
  docs.push('## Configuration Validation');
  docs.push('');
  docs.push('```typescript');
  docs.push('import { configValidator } from "@/config";');
  docs.push('');
  docs.push('// Validate configuration');
  docs.push('const result = await configValidator.validate(config);');
  docs.push('');
  docs.push('if (!result.isValid) {');
  docs.push('  console.error("Configuration validation failed:", result.errors);');
  docs.push('}');
  docs.push('```');
  docs.push('');
  docs.push('## Configuration Utilities');
  docs.push('');
  docs.push('```typescript');
  docs.push('import { configUtils } from "@/config";');
  docs.push('');
  docs.push('// Check if feature is enabled');
  docs.push('if (configUtils.isFeatureEnabled("pegaIntegration")) {');
  docs.push('  // Pega integration is enabled');
  docs.push('}');
  docs.push('');
  docs.push('// Get configuration value with default');
  docs.push('const timeout = configUtils.getConfigValue("api.timeout", 5000);');
  docs.push('```');
  docs.push('');
  
  return docs.join('\n');
}

/**
 * Main function
 */
function main() {
  console.log('📚 Generating configuration documentation...\n');
  
  // Create docs directory if it doesn't exist
  const docsDir = 'docs/config-generated';
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Generate main configuration documentation
  const configDocs = generateConfigDocs();
  fs.writeFileSync(path.join(docsDir, 'configuration.md'), configDocs);
  
  // Generate environment documentation
  const envDocs = generateEnvironmentDocs();
  fs.writeFileSync(path.join(docsDir, 'environments.md'), envDocs);
  
  // Generate API documentation
  const apiDocs = generateApiDocs();
  fs.writeFileSync(path.join(docsDir, 'api.md'), apiDocs);
  
  // Generate index file
  const indexDocs = [
    '# Configuration Documentation Index',
    '',
    'This directory contains auto-generated configuration documentation.',
    '',
    '## Files',
    '',
    '- [configuration.md](./configuration.md) - Main configuration documentation',
    '- [environments.md](./environments.md) - Environment-specific configuration',
    '- [api.md](./api.md) - Configuration API documentation',
    '',
    '## Usage',
    '',
    'These documents are automatically generated from the configuration metadata.',
    'To regenerate them, run:',
    '',
    '```bash',
    'npm run config:docs',
    '```',
    '',
    '## Last Updated',
    '',
    `Generated on: ${new Date().toISOString()}`
  ].join('\n');
  
  fs.writeFileSync(path.join(docsDir, 'README.md'), indexDocs);
  
  console.log('✅ Configuration documentation generated successfully!');
  console.log('');
  console.log('📄 Generated files:');
  console.log(`  - ${docsDir}/configuration.md`);
  console.log(`  - ${docsDir}/environments.md`);
  console.log(`  - ${docsDir}/api.md`);
  console.log(`  - ${docsDir}/README.md`);
  console.log('');
  console.log('🔗 View documentation at: docs/config-generated/');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateConfigDocs,
  generateEnvironmentDocs,
  generateApiDocs
};
