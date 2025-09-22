import { z } from 'zod';

/**
 * Database feature configuration schema
 */
export const databaseConfigSchema = z.object({
  // Connection Configuration
  connection: z.object({
    host: z.string().default('localhost'),
    port: z.number().default(5432),
    database: z.string(),
    username: z.string(),
    password: z.string(),
    ssl: z.boolean().default(false),
    sslMode: z.enum(['disable', 'allow', 'prefer', 'require', 'verify-ca', 'verify-full']).default('prefer'),
    connectionTimeout: z.number().default(30000),
    idleTimeout: z.number().default(30000),
    maxConnections: z.number().default(20),
    minConnections: z.number().default(5),
  }),

  // Connection Pooling
  pooling: z.object({
    enabled: z.boolean().default(true),
    maxPoolSize: z.number().default(20),
    minPoolSize: z.number().default(5),
    acquireTimeoutMillis: z.number().default(30000),
    createTimeoutMillis: z.number().default(30000),
    destroyTimeoutMillis: z.number().default(5000),
    idleTimeoutMillis: z.number().default(300000),
    reapIntervalMillis: z.number().default(1000),
    createRetryIntervalMillis: z.number().default(200),
    validationQuery: z.string().default('SELECT 1'),
    validationQueryTimeout: z.number().default(5000),
  }),

  // Query Configuration
  query: z.object({
    timeout: z.number().default(30000),
    maxQueryLength: z.number().default(10000),
    enableQueryLogging: z.boolean().default(false),
    logSlowQueries: z.boolean().default(true),
    slowQueryThreshold: z.number().default(1000),
    enableQueryCache: z.boolean().default(true),
    queryCacheSize: z.number().default(1000),
  }),

  // Transaction Configuration
  transactions: z.object({
    isolationLevel: z.enum(['READ_UNCOMMITTED', 'READ_COMMITTED', 'REPEATABLE_READ', 'SERIALIZABLE']).default('READ_COMMITTED'),
    autoCommit: z.boolean().default(true),
    rollbackOnError: z.boolean().default(true),
    maxTransactionTime: z.number().default(300000), // 5 minutes
  }),

  // Migration Configuration
  migrations: z.object({
    enabled: z.boolean().default(true),
    tableName: z.string().default('migrations'),
    directory: z.string().default('./migrations'),
    runOnStartup: z.boolean().default(false),
    backupBeforeMigration: z.boolean().default(true),
    backupDirectory: z.string().default('./backups'),
  }),

  // Backup Configuration
  backup: z.object({
    enabled: z.boolean().default(true),
    schedule: z.string().default('0 2 * * *'), // Daily at 2 AM
    retentionDays: z.number().default(30),
    compression: z.boolean().default(true),
    encryption: z.boolean().default(false),
    backupDirectory: z.string().default('./backups'),
    maxBackupSize: z.number().default(1024 * 1024 * 1024), // 1GB
  }),

  // Performance Optimization
  performance: z.object({
    enableQueryOptimization: z.boolean().default(true),
    enableIndexOptimization: z.boolean().default(true),
    enableConnectionOptimization: z.boolean().default(true),
    analyzeInterval: z.number().default(24 * 60 * 60 * 1000), // 24 hours
    vacuumInterval: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days
  }),

  // Monitoring and Health Checks
  monitoring: z.object({
    enabled: z.boolean().default(true),
    healthCheckInterval: z.number().default(30000),
    metricsCollection: z.boolean().default(true),
    slowQueryLogging: z.boolean().default(true),
    connectionMonitoring: z.boolean().default(true),
    deadlockDetection: z.boolean().default(true),
  }),

  // Security Configuration
  security: z.object({
    encryptConnections: z.boolean().default(true),
    validateCertificates: z.boolean().default(true),
    connectionEncryption: z.enum(['none', 'ssl', 'tls']).default('ssl'),
    auditLogging: z.boolean().default(false),
    sensitiveDataMasking: z.boolean().default(true),
  }),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

/**
 * Default database configuration
 */
export const defaultDatabaseConfig: DatabaseConfig = {
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
  query: {
    timeout: 30000,
    maxQueryLength: 10000,
    enableQueryLogging: false,
    logSlowQueries: true,
    slowQueryThreshold: 1000,
    enableQueryCache: true,
    queryCacheSize: 1000,
  },
  transactions: {
    isolationLevel: 'READ_COMMITTED',
    autoCommit: true,
    rollbackOnError: true,
    maxTransactionTime: 300000,
  },
  migrations: {
    enabled: true,
    tableName: 'migrations',
    directory: './migrations',
    runOnStartup: false,
    backupBeforeMigration: true,
    backupDirectory: './backups',
  },
  backup: {
    enabled: true,
    schedule: '0 2 * * *',
    retentionDays: 30,
    compression: true,
    encryption: false,
    backupDirectory: './backups',
    maxBackupSize: 1024 * 1024 * 1024,
  },
  performance: {
    enableQueryOptimization: true,
    enableIndexOptimization: true,
    enableConnectionOptimization: true,
    analyzeInterval: 24 * 60 * 60 * 1000,
    vacuumInterval: 7 * 24 * 60 * 60 * 1000,
  },
  monitoring: {
    enabled: true,
    healthCheckInterval: 30000,
    metricsCollection: true,
    slowQueryLogging: true,
    connectionMonitoring: true,
    deadlockDetection: true,
  },
  security: {
    encryptConnections: true,
    validateCertificates: true,
    connectionEncryption: 'ssl',
    auditLogging: false,
    sensitiveDataMasking: true,
  },
};

