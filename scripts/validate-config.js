#!/usr/bin/env node

/**
 * Configuration Validation Script
 * Validates all configuration files and environment variables
 */

const fs = require('fs');
const path = require('path');
const { z } = require('zod');

// Register ts-node for TypeScript support
require('ts-node/register');

// Import feature configs and schemas from TypeScript modules
let configSchemas, defaultFeatureConfigs;
try {
  const features = require('../src/config/features');
  configSchemas = features.featureConfigSchemas;
  defaultFeatureConfigs = features.defaultFeatureConfigs;
} catch (error) {
  console.error('Failed to load feature configurations:', error.message);
  process.exit(1);
}

// Environment variable schemas
const envSchemas = {
  development: z.object({
    NODE_ENV: z.literal('development'),
    PORT: z.string().transform(Number),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    SESSION_SECRET: z.string().min(32)
  }),
  
  staging: z.object({
    NODE_ENV: z.literal('staging'),
    PORT: z.string().transform(Number),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    SESSION_SECRET: z.string().min(32),
    PEGA_API_URL: z.string().url(),
    PEGA_API_KEY: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().transform(Number),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1)
  }),
  
  production: z.object({
    NODE_ENV: z.literal('production'),
    PORT: z.string().transform(Number),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    SESSION_SECRET: z.string().min(32),
    PEGA_API_URL: z.string().url(),
    PEGA_API_KEY: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().transform(Number),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SENTRY_DSN: z.string().url(),
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_BUCKET: z.string().min(1)
  })
};

// Validation results
const results = {
  passed: 0,
  failed: 0,
  errors: [],
  warnings: []
};

/**
 * Validate configuration file
 */
function validateConfigFile(filePath, schema) {
  try {
    if (!fs.existsSync(filePath)) {
      results.errors.push(`Configuration file not found: ${filePath}`);
      results.failed++;
      return false;
    }
    
    // Import the TypeScript module instead of parsing as JSON
    const config = require(filePath).default || require(filePath);
    const validation = schema.safeParse(config);
    
    if (validation.success) {
      results.passed++;
      return true;
    } else {
      validation.error.errors.forEach(error => {
        results.errors.push(`${filePath}: ${error.path.join('.')} - ${error.message}`);
      });
      results.failed++;
      return false;
    }
  } catch (error) {
    results.errors.push(`${filePath}: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Validate environment variables
 */
function validateEnvironment(env) {
  try {
    const schema = envSchemas[env];
    if (!schema) {
      results.errors.push(`Unknown environment: ${env}`);
      results.failed++;
      return false;
    }
    
    const validation = schema.safeParse(process.env);
    
    if (validation.success) {
      results.passed++;
      return true;
    } else {
      validation.error.errors.forEach(error => {
        results.errors.push(`Environment ${env}: ${error.path.join('.')} - ${error.message}`);
      });
      results.failed++;
      return false;
    }
  } catch (error) {
    results.errors.push(`Environment ${env}: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Check for missing configuration files
 */
function checkMissingFiles() {
  const requiredFiles = [
    'src/config/features/auth.ts',
    'src/config/features/api.ts',
    'src/config/features/database.ts',
    'src/config/features/ui.ts',
    'src/config/features/ingredients.ts',
    'src/config/features/case-management.ts',
    'src/config/features/monitoring.ts',
    'src/config/features/security.ts',
    'src/config/features/files.ts',
    'src/config/features/notifications.ts',
    'src/config/features/feature-flags.ts',
    'src/config/features/dev-tools.ts',
    'src/config/environments/development.ts',
    'src/config/environments/staging.ts',
    'src/config/environments/production.ts',
    'src/config/environments/test.ts'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      results.errors.push(`Missing required file: ${file}`);
      results.failed++;
    }
  });
}

/**
 * Check for security issues
 */
function checkSecurityIssues() {
  const securityChecks = [
    {
      name: 'JWT Secret Length',
      check: () => {
        const jwtSecret = process.env.JWT_SECRET;
        if (jwtSecret && jwtSecret.length < 32) {
          results.warnings.push('JWT secret should be at least 32 characters long');
        }
      }
    },
    {
      name: 'Session Secret Length',
      check: () => {
        const sessionSecret = process.env.SESSION_SECRET;
        if (sessionSecret && sessionSecret.length < 32) {
          results.warnings.push('Session secret should be at least 32 characters long');
        }
      }
    },
    {
      name: 'Database SSL',
      check: () => {
        const dbUrl = process.env.DATABASE_URL;
        if (dbUrl && !dbUrl.includes('sslmode=require')) {
          results.warnings.push('Database connection should use SSL in production');
        }
      }
    },
    {
      name: 'CORS Configuration',
      check: () => {
        const corsOrigins = process.env.CORS_ORIGINS;
        if (corsOrigins && corsOrigins.includes('*')) {
          results.warnings.push('CORS origins should not use wildcard (*) in production');
        }
      }
    }
  ];
  
  securityChecks.forEach(check => {
    try {
      check.check();
    } catch (error) {
      results.errors.push(`Security check failed (${check.name}): ${error.message}`);
      results.failed++;
    }
  });
}

/**
 * Generate validation report
 */
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.passed + results.failed,
      passed: results.passed,
      failed: results.failed,
      warnings: results.warnings.length
    },
    errors: results.errors,
    warnings: results.warnings
  };
  
  // Write report to file
  const reportPath = 'config-validation-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Configuration Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .error { color: #d32f2f; }
        .warning { color: #f57c00; }
        .success { color: #388e3c; }
        .section { margin: 20px 0; }
        .item { margin: 5px 0; padding: 5px; border-left: 3px solid #ccc; }
        .error .item { border-left-color: #d32f2f; }
        .warning .item { border-left-color: #f57c00; }
    </style>
</head>
<body>
    <h1>Configuration Validation Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Checks:</strong> ${report.summary.total}</p>
        <p><strong>Passed:</strong> <span class="success">${report.summary.passed}</span></p>
        <p><strong>Failed:</strong> <span class="error">${report.summary.failed}</span></p>
        <p><strong>Warnings:</strong> <span class="warning">${report.summary.warnings}</span></p>
    </div>
    
    ${report.errors.length > 0 ? `
    <div class="section error">
        <h2>Errors</h2>
        ${report.errors.map(error => `<div class="item">${error}</div>`).join('')}
    </div>
    ` : ''}
    
    ${report.warnings.length > 0 ? `
    <div class="section warning">
        <h2>Warnings</h2>
        ${report.warnings.map(warning => `<div class="item">${warning}</div>`).join('')}
    </div>
    ` : ''}
    
    <p><em>Report generated at: ${report.timestamp}</em></p>
</body>
</html>`;
  
  fs.writeFileSync('config-validation-report.html', htmlReport);
  
  return report;
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Validating configuration...\n');
  
  // Check for missing files
  checkMissingFiles();
  
  // Validate configuration files
  Object.entries(configSchemas).forEach(([name, schema]) => {
    const filePath = path.resolve(__dirname, `../src/config/features/${name}.ts`);
    validateConfigFile(filePath, schema);
  });
  
  // Validate environment-specific configurations
  ['development', 'staging', 'production'].forEach(env => {
    validateEnvironment(env);
  });
  
  // Check for security issues
  checkSecurityIssues();
  
  // Generate report
  const report = generateReport();
  
  // Print summary
  console.log('📊 Validation Summary:');
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`⚠️  Warnings: ${report.summary.warnings}`);
  
  if (report.errors.length > 0) {
    console.log('\n❌ Errors:');
    report.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    report.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\n📄 Reports generated:');
  console.log('  - config-validation-report.json');
  console.log('  - config-validation-report.html');
  
  // Exit with appropriate code
  if (report.summary.failed > 0) {
    console.log('\n❌ Validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ Validation passed!');
    process.exit(0);
  }
}

// Run validation if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateConfigFile,
  validateEnvironment,
  checkSecurityIssues,
  generateReport
};
