import { z } from 'zod';

/**
 * Notifications feature configuration schema
 */
export const notificationsConfigSchema = z.object({
  // Email Configuration
  email: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['smtp', 'sendgrid', 'ses', 'mailgun', 'postmark']).default('smtp'),
    smtp: z.object({
      host: z.string().default('localhost'),
      port: z.number().default(587),
      secure: z.boolean().default(false),
      username: z.string().optional(),
      password: z.string().optional(),
      from: z.string().default('noreply@fragrance-app.com'),
      replyTo: z.string().optional(),
    }),
    sendgrid: z.object({
      apiKey: z.string().optional(),
      from: z.string().default('noreply@fragrance-app.com'),
      replyTo: z.string().optional(),
    }),
    ses: z.object({
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
      region: z.string().default('us-east-1'),
      from: z.string().default('noreply@fragrance-app.com'),
      replyTo: z.string().optional(),
    }),
    mailgun: z.object({
      apiKey: z.string().optional(),
      domain: z.string().optional(),
      from: z.string().default('noreply@fragrance-app.com'),
      replyTo: z.string().optional(),
    }),
    postmark: z.object({
      apiKey: z.string().optional(),
      from: z.string().default('noreply@fragrance-app.com'),
      replyTo: z.string().optional(),
    }),
    enableHTML: z.boolean().default(true),
    enableTextFallback: z.boolean().default(true),
    maxRecipients: z.number().default(100),
    rateLimit: z.number().default(100), // emails per hour
  }),

  // SMS Configuration
  sms: z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['twilio', 'aws-sns', 'sendgrid']).default('twilio'),
    twilio: z.object({
      accountSid: z.string().optional(),
      authToken: z.string().optional(),
      from: z.string().optional(),
    }),
    awsSns: z.object({
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
      region: z.string().default('us-east-1'),
    }),
    sendgrid: z.object({
      apiKey: z.string().optional(),
      from: z.string().optional(),
    }),
    rateLimit: z.number().default(10), // SMS per hour
    maxLength: z.number().default(160),
  }),

  // Push Notifications
  push: z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['fcm', 'apns', 'web-push']).default('fcm'),
    fcm: z.object({
      serverKey: z.string().optional(),
      projectId: z.string().optional(),
    }),
    apns: z.object({
      keyId: z.string().optional(),
      teamId: z.string().optional(),
      bundleId: z.string().optional(),
      privateKey: z.string().optional(),
    }),
    webPush: z.object({
      publicKey: z.string().optional(),
      privateKey: z.string().optional(),
      subject: z.string().optional(),
    }),
    enableBatchSending: z.boolean().default(true),
    batchSize: z.number().default(100),
  }),

  // In-App Notifications
  inApp: z.object({
    enabled: z.boolean().default(true),
    enableRealTime: z.boolean().default(true),
    enablePersistentStorage: z.boolean().default(true),
    maxNotifications: z.number().default(100),
    notificationTTL: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days
    enableNotificationGroups: z.boolean().default(true),
    enableNotificationActions: z.boolean().default(true),
  }),

  // Webhook Notifications
  webhooks: z.object({
    enabled: z.boolean().default(false),
    endpoints: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      events: z.array(z.string()),
      secret: z.string().optional(),
      timeout: z.number().default(30000),
      retries: z.number().default(3),
      enabled: z.boolean().default(true),
    })).default([]),
    enableRetry: z.boolean().default(true),
    maxRetries: z.number().default(3),
    retryDelay: z.number().default(1000),
  }),

  // Notification Templates
  templates: z.object({
    enabled: z.boolean().default(true),
    enableCustomTemplates: z.boolean().default(true),
    defaultTemplates: z.record(z.object({
      subject: z.string(),
      body: z.string(),
      type: z.enum(['email', 'sms', 'push', 'in-app']),
      variables: z.array(z.string()).default([]),
    })).default({
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
    }),
    enableTemplateVersioning: z.boolean().default(false),
    enableTemplateTesting: z.boolean().default(true),
  }),

  // Notification Scheduling
  scheduling: z.object({
    enabled: z.boolean().default(true),
    enableDelayedNotifications: z.boolean().default(true),
    enableScheduledNotifications: z.boolean().default(true),
    enableRecurringNotifications: z.boolean().default(false),
    maxDelayHours: z.number().default(24),
    enableTimezoneSupport: z.boolean().default(true),
    defaultTimezone: z.string().default('UTC'),
  }),

  // Notification Preferences
  preferences: z.object({
    enabled: z.boolean().default(true),
    enableUserPreferences: z.boolean().default(true),
    enableChannelPreferences: z.boolean().default(true),
    enableFrequencyPreferences: z.boolean().default(true),
    defaultPreferences: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
      inApp: z.boolean().default(true),
    }),
    enableOptOut: z.boolean().default(true),
    enableUnsubscribe: z.boolean().default(true),
  }),

  // Analytics and Tracking
  analytics: z.object({
    enabled: z.boolean().default(true),
    enableDeliveryTracking: z.boolean().default(true),
    enableOpenTracking: z.boolean().default(true),
    enableClickTracking: z.boolean().default(true),
    enableBounceTracking: z.boolean().default(true),
    enableUnsubscribeTracking: z.boolean().default(true),
    analyticsRetentionDays: z.number().default(90),
    enableRealTimeAnalytics: z.boolean().default(true),
  }),

  // Performance Configuration
  performance: z.object({
    enableQueue: z.boolean().default(true),
    queueProvider: z.enum(['redis', 'database', 'memory']).default('database'),
    maxConcurrentJobs: z.number().default(10),
    jobTimeout: z.number().default(300000), // 5 minutes
    enableBatchProcessing: z.boolean().default(true),
    batchSize: z.number().default(100),
    enableRetryMechanism: z.boolean().default(true),
    maxRetries: z.number().default(3),
    retryDelay: z.number().default(5000),
  }),
});

export type NotificationsConfig = z.infer<typeof notificationsConfigSchema>;

/**
 * Default notifications configuration
 */
export const defaultNotificationsConfig: NotificationsConfig = {
  email: {
    enabled: true,
    provider: 'smtp',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
      from: process.env.SMTP_FROM || 'noreply@fragrance-app.com',
      replyTo: process.env.SMTP_REPLY_TO,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM || 'noreply@fragrance-app.com',
      replyTo: process.env.SENDGRID_REPLY_TO,
    },
    ses: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      region: process.env.AWS_SES_REGION || 'us-east-1',
      from: process.env.AWS_SES_FROM || 'noreply@fragrance-app.com',
      replyTo: process.env.AWS_SES_REPLY_TO,
    },
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      from: process.env.MAILGUN_FROM || 'noreply@fragrance-app.com',
      replyTo: process.env.MAILGUN_REPLY_TO,
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY,
      from: process.env.POSTMARK_FROM || 'noreply@fragrance-app.com',
      replyTo: process.env.POSTMARK_REPLY_TO,
    },
    enableHTML: true,
    enableTextFallback: true,
    maxRecipients: 100,
    rateLimit: 100,
  },
  sms: {
    enabled: false,
    provider: 'twilio',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      from: process.env.TWILIO_FROM,
    },
    awsSns: {
      accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY,
      region: process.env.AWS_SNS_REGION || 'us-east-1',
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_SMS_API_KEY,
      from: process.env.SENDGRID_SMS_FROM,
    },
    rateLimit: 10,
    maxLength: 160,
  },
  push: {
    enabled: false,
    provider: 'fcm',
    fcm: {
      serverKey: process.env.FCM_SERVER_KEY,
      projectId: process.env.FCM_PROJECT_ID,
    },
    apns: {
      keyId: process.env.APNS_KEY_ID,
      teamId: process.env.APNS_TEAM_ID,
      bundleId: process.env.APNS_BUNDLE_ID,
      privateKey: process.env.APNS_PRIVATE_KEY,
    },
    webPush: {
      publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
      privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
      subject: process.env.WEB_PUSH_SUBJECT,
    },
    enableBatchSending: true,
    batchSize: 100,
  },
  inApp: {
    enabled: true,
    enableRealTime: true,
    enablePersistentStorage: true,
    maxNotifications: 100,
    notificationTTL: 7 * 24 * 60 * 60 * 1000,
    enableNotificationGroups: true,
    enableNotificationActions: true,
  },
  webhooks: {
    enabled: false,
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
    analyticsRetentionDays: 90,
    enableRealTimeAnalytics: true,
  },
  performance: {
    enableQueue: true,
    queueProvider: 'database',
    maxConcurrentJobs: 10,
    jobTimeout: 300000,
    enableBatchProcessing: true,
    batchSize: 100,
    enableRetryMechanism: true,
    maxRetries: 3,
    retryDelay: 5000,
  },
};

