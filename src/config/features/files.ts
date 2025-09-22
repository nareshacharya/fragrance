import { z } from 'zod';

/**
 * File management feature configuration schema
 */
export const filesConfigSchema = z.object({
  // Upload Configuration
  upload: z.object({
    enabled: z.boolean().default(true),
    maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
    maxFilesPerRequest: z.number().default(10),
    allowedMimeTypes: z.array(z.string()).default([
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]),
    allowedExtensions: z.array(z.string()).default([
      '.jpg', '.jpeg', '.png', '.gif', '.webp',
      '.pdf', '.txt', '.doc', '.docx'
    ]),
    enableChunkedUpload: z.boolean().default(false),
    chunkSize: z.number().default(1024 * 1024), // 1MB
    enableResumeUpload: z.boolean().default(false),
    uploadTimeout: z.number().default(300000), // 5 minutes
  }),

  // Storage Configuration
  storage: z.object({
    provider: z.enum(['local', 's3', 'gcs', 'azure']).default('local'),
    localPath: z.string().default('./uploads'),
    enableSubdirectories: z.boolean().default(true),
    subdirectoryStructure: z.enum(['date', 'user', 'type', 'custom']).default('date'),
    customSubdirectoryPattern: z.string().default('{year}/{month}/{day}'),
    enableFileVersioning: z.boolean().default(false),
    maxVersions: z.number().default(5),
  }),

  // Cloud Storage Configuration
  cloudStorage: z.object({
    // AWS S3
    s3: z.object({
      bucket: z.string().optional(),
      region: z.string().optional(),
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
      endpoint: z.string().optional(),
      enablePublicAccess: z.boolean().default(false),
      enableCDN: z.boolean().default(false),
      cdnUrl: z.string().optional(),
    }),

    // Google Cloud Storage
    gcs: z.object({
      bucket: z.string().optional(),
      projectId: z.string().optional(),
      keyFilename: z.string().optional(),
      enablePublicAccess: z.boolean().default(false),
      enableCDN: z.boolean().default(false),
      cdnUrl: z.string().optional(),
    }),

    // Azure Blob Storage
    azure: z.object({
      accountName: z.string().optional(),
      accountKey: z.string().optional(),
      containerName: z.string().optional(),
      enablePublicAccess: z.boolean().default(false),
      enableCDN: z.boolean().default(false),
      cdnUrl: z.string().optional(),
    }),
  }),

  // File Processing
  processing: z.object({
    enableImageProcessing: z.boolean().default(true),
    enableImageResize: z.boolean().default(true),
    enableImageCompression: z.boolean().default(true),
    enableThumbnailGeneration: z.boolean().default(true),
    imageFormats: z.array(z.string()).default(['jpeg', 'png', 'webp']),
    thumbnailSizes: z.array(z.object({
      name: z.string(),
      width: z.number(),
      height: z.number(),
      quality: z.number().min(1).max(100).default(80),
    })).default([
      { name: 'small', width: 150, height: 150, quality: 80 },
      { name: 'medium', width: 300, height: 300, quality: 85 },
      { name: 'large', width: 600, height: 600, quality: 90 },
    ]),
    enableWatermarking: z.boolean().default(false),
    watermarkText: z.string().default(''),
    watermarkPosition: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']).default('bottom-right'),
  }),

  // File Validation
  validation: z.object({
    enableVirusScanning: z.boolean().default(false),
    enableContentValidation: z.boolean().default(true),
    enableFileIntegrityCheck: z.boolean().default(true),
    enableMetadataValidation: z.boolean().default(true),
    maxFileNameLength: z.number().default(255),
    allowedFileNamePattern: z.string().default('^[a-zA-Z0-9._-]+$'),
    enableDuplicateDetection: z.boolean().default(true),
    duplicateDetectionMethod: z.enum(['hash', 'name', 'size']).default('hash'),
  }),

  // File Access Control
  accessControl: z.object({
    enablePublicAccess: z.boolean().default(false),
    enablePrivateAccess: z.boolean().default(true),
    enableSignedUrls: z.boolean().default(false),
    signedUrlExpiration: z.number().default(3600), // 1 hour
    enableAccessLogging: z.boolean().default(true),
    enableDownloadTracking: z.boolean().default(true),
    enablePermissionBasedAccess: z.boolean().default(false),
  }),

  // File Cleanup and Maintenance
  cleanup: z.object({
    enableAutomaticCleanup: z.boolean().default(false),
    cleanupSchedule: z.string().default('0 2 * * *'), // Daily at 2 AM
    orphanedFileRetentionDays: z.number().default(30),
    temporaryFileRetentionHours: z.number().default(24),
    enableSoftDelete: z.boolean().default(true),
    softDeleteRetentionDays: z.number().default(90),
    enableHardDelete: z.boolean().default(false),
    hardDeleteRetentionDays: z.number().default(365),
  }),

  // Backup Configuration
  backup: z.object({
    enabled: z.boolean().default(false),
    schedule: z.string().default('0 3 * * *'), // Daily at 3 AM
    retentionDays: z.number().default(30),
    enableIncrementalBackup: z.boolean().default(true),
    enableCompression: z.boolean().default(true),
    enableEncryption: z.boolean().default(false),
    backupLocation: z.string().default('./backups'),
  }),

  // Performance Configuration
  performance: z.object({
    enableCaching: z.boolean().default(true),
    cacheTTL: z.number().default(3600), // 1 hour
    enableLazyLoading: z.boolean().default(true),
    enablePreloading: z.boolean().default(false),
    enableCompression: z.boolean().default(true),
    compressionLevel: z.number().min(1).max(9).default(6),
    enableStreaming: z.boolean().default(true),
  }),

  // Security Configuration
  security: z.object({
    enableFileEncryption: z.boolean().default(false),
    enableAccessAudit: z.boolean().default(true),
    enableMalwareScanning: z.boolean().default(false),
    enableContentFiltering: z.boolean().default(false),
    blockedContentTypes: z.array(z.string()).default([
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msdos-program',
    ]),
    enableQuarantine: z.boolean().default(false),
    quarantineLocation: z.string().default('./quarantine'),
  }),
});

export type FilesConfig = z.infer<typeof filesConfigSchema>;

/**
 * Default files configuration
 */
export const defaultFilesConfig: FilesConfig = {
  upload: {
    enabled: true,
    maxFileSize: 10 * 1024 * 1024,
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
      '.pdf', '.txt', '.doc', '.docx'
    ],
    enableChunkedUpload: false,
    chunkSize: 1024 * 1024,
    enableResumeUpload: false,
    uploadTimeout: 300000,
  },
  storage: {
    provider: 'local',
    localPath: './uploads',
    enableSubdirectories: true,
    subdirectoryStructure: 'date',
    customSubdirectoryPattern: '{year}/{month}/{day}',
    enableFileVersioning: false,
    maxVersions: 5,
  },
  cloudStorage: {
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_ENDPOINT,
      enablePublicAccess: false,
      enableCDN: false,
    },
    gcs: {
      bucket: process.env.GCS_BUCKET,
      projectId: process.env.GCS_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILENAME,
      enablePublicAccess: false,
      enableCDN: false,
    },
    azure: {
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
      enablePublicAccess: false,
      enableCDN: false,
    },
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
    enableVirusScanning: false,
    enableContentValidation: true,
    enableFileIntegrityCheck: true,
    enableMetadataValidation: true,
    maxFileNameLength: 255,
    allowedFileNamePattern: '^[a-zA-Z0-9._-]+$',
    enableDuplicateDetection: true,
    duplicateDetectionMethod: 'hash',
  },
  accessControl: {
    enablePublicAccess: false,
    enablePrivateAccess: true,
    enableSignedUrls: false,
    signedUrlExpiration: 3600,
    enableAccessLogging: true,
    enableDownloadTracking: true,
    enablePermissionBasedAccess: false,
  },
  cleanup: {
    enableAutomaticCleanup: false,
    cleanupSchedule: '0 2 * * *',
    orphanedFileRetentionDays: 30,
    temporaryFileRetentionHours: 24,
    enableSoftDelete: true,
    softDeleteRetentionDays: 90,
    enableHardDelete: false,
    hardDeleteRetentionDays: 365,
  },
  backup: {
    enabled: false,
    schedule: '0 3 * * *',
    retentionDays: 30,
    enableIncrementalBackup: true,
    enableCompression: true,
    enableEncryption: false,
    backupLocation: './backups',
  },
  performance: {
    enableCaching: true,
    cacheTTL: 3600,
    enableLazyLoading: true,
    enablePreloading: false,
    enableCompression: true,
    compressionLevel: 6,
    enableStreaming: true,
  },
  security: {
    enableFileEncryption: false,
    enableAccessAudit: true,
    enableMalwareScanning: false,
    enableContentFiltering: false,
    blockedContentTypes: [
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msdos-program',
    ],
    enableQuarantine: false,
    quarantineLocation: './quarantine',
  },
};

