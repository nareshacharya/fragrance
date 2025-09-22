import { z } from 'zod';

/**
 * Case Management feature configuration schema
 */
export const caseManagementConfigSchema = z.object({
  // Case Workflow Configuration
  workflow: z.object({
    enableWorkflowEngine: z.boolean().default(true),
    enableStateTransitions: z.boolean().default(true),
    enableWorkflowTemplates: z.boolean().default(true),
    enableCustomWorkflows: z.boolean().default(false),
    maxWorkflowSteps: z.number().default(20),
    enableParallelProcessing: z.boolean().default(false),
    enableWorkflowHistory: z.boolean().default(true),
  }),

  // Case Status Management
  statusManagement: z.object({
    enableStatusTracking: z.boolean().default(true),
    predefinedStatuses: z.array(z.object({
      name: z.string(),
      description: z.string(),
      color: z.string(),
      isActive: z.boolean().default(true),
      isFinal: z.boolean().default(false),
    })).default([
      { name: 'New', description: 'Newly created case', color: '#3b82f6', isActive: true, isFinal: false },
      { name: 'In Progress', description: 'Case is being worked on', color: '#f59e0b', isActive: true, isFinal: false },
      { name: 'Pending Review', description: 'Case pending review', color: '#8b5cf6', isActive: true, isFinal: false },
      { name: 'Resolved', description: 'Case has been resolved', color: '#10b981', isActive: true, isFinal: true },
      { name: 'Closed', description: 'Case has been closed', color: '#6b7280', isActive: true, isFinal: true },
    ]),
    enableCustomStatuses: z.boolean().default(true),
    maxCustomStatuses: z.number().default(10),
    enableStatusTransitions: z.boolean().default(true),
  }),

  // Case Assignment Rules
  assignment: z.object({
    enableAutoAssignment: z.boolean().default(false),
    enableRoundRobin: z.boolean().default(false),
    enableSkillBasedAssignment: z.boolean().default(false),
    enableWorkloadBalancing: z.boolean().default(false),
    maxCasesPerAgent: z.number().default(50),
    enableEscalation: z.boolean().default(true),
    escalationTimeout: z.number().default(24 * 60 * 60 * 1000), // 24 hours
  }),

  // Case Types and Categories
  caseTypes: z.object({
    enableCaseTypes: z.boolean().default(true),
    predefinedTypes: z.array(z.object({
      name: z.string(),
      description: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
      slaHours: z.number().default(24),
      requiredFields: z.array(z.string()).default([]),
    })).default([
      { name: 'General Inquiry', description: 'General customer inquiry', priority: 'medium', slaHours: 24, requiredFields: ['subject', 'description'] },
      { name: 'Technical Support', description: 'Technical support request', priority: 'high', slaHours: 8, requiredFields: ['subject', 'description', 'priority'] },
      { name: 'Bug Report', description: 'Software bug report', priority: 'high', slaHours: 4, requiredFields: ['subject', 'description', 'stepsToReproduce'] },
      { name: 'Feature Request', description: 'Feature request', priority: 'low', slaHours: 72, requiredFields: ['subject', 'description'] },
    ]),
    enableCustomTypes: z.boolean().default(true),
    maxCustomTypes: z.number().default(20),
  }),

  // Priority Management
  priority: z.object({
    enablePriorityLevels: z.boolean().default(true),
    priorityLevels: z.array(z.object({
      name: z.string(),
      level: z.number(),
      color: z.string(),
      slaHours: z.number(),
      escalationHours: z.number(),
    })).default([
      { name: 'Critical', level: 1, color: '#ef4444', slaHours: 2, escalationHours: 1 },
      { name: 'High', level: 2, color: '#f59e0b', slaHours: 8, escalationHours: 4 },
      { name: 'Medium', level: 3, color: '#3b82f6', slaHours: 24, escalationHours: 12 },
      { name: 'Low', level: 4, color: '#10b981', slaHours: 72, escalationHours: 48 },
    ]),
    enablePriorityEscalation: z.boolean().default(true),
    enablePriorityNotifications: z.boolean().default(true),
  }),

  // SLA Management
  sla: z.object({
    enableSLATracking: z.boolean().default(true),
    enableSLAAlerts: z.boolean().default(true),
    enableSLAReporting: z.boolean().default(true),
    defaultSLAHours: z.number().default(24),
    enableSLAEscalation: z.boolean().default(true),
    slaEscalationThreshold: z.number().default(0.8), // 80% of SLA
  }),

  // Notifications and Alerts
  notifications: z.object({
    enableCaseNotifications: z.boolean().default(true),
    enableStatusChangeNotifications: z.boolean().default(true),
    enableAssignmentNotifications: z.boolean().default(true),
    enableSLAAlerts: z.boolean().default(true),
    enableEscalationNotifications: z.boolean().default(true),
    notificationChannels: z.array(z.enum(['email', 'sms', 'push', 'in-app'])).default(['email', 'in-app']),
    enableNotificationTemplates: z.boolean().default(true),
  }),

  // Case Search and Filtering
  search: z.object({
    enableCaseSearch: z.boolean().default(true),
    enableAdvancedSearch: z.boolean().default(true),
    enableFullTextSearch: z.boolean().default(true),
    searchFields: z.array(z.string()).default(['subject', 'description', 'caseNumber', 'customerName']),
    enableSearchHistory: z.boolean().default(true),
    enableSavedSearches: z.boolean().default(true),
    maxSavedSearches: z.number().default(10),
  }),

  // Case Analytics and Reporting
  analytics: z.object({
    enableCaseAnalytics: z.boolean().default(true),
    enablePerformanceMetrics: z.boolean().default(true),
    enableAgentMetrics: z.boolean().default(true),
    enableSLAMetrics: z.boolean().default(true),
    enableTrendAnalysis: z.boolean().default(true),
    analyticsRetentionDays: z.number().default(365),
    enableRealTimeDashboards: z.boolean().default(true),
  }),

  // Case Permissions and Security
  security: z.object({
    enableCasePermissions: z.boolean().default(true),
    enableCasePrivacy: z.boolean().default(false),
    enableCaseSharing: z.boolean().default(false),
    enableAuditLogging: z.boolean().default(true),
    enableDataEncryption: z.boolean().default(false),
    enableAccessControl: z.boolean().default(true),
  }),

  // Integration Configuration
  integration: z.object({
    enablePegaIntegration: z.boolean().default(true),
    enableAPIIntegration: z.boolean().default(true),
    enableWebhookIntegration: z.boolean().default(false),
    enableThirdPartyIntegrations: z.boolean().default(false),
    integrationTimeout: z.number().default(30000),
  }),

  // Performance Configuration
  performance: z.object({
    enableCaching: z.boolean().default(true),
    cacheTTL: z.number().default(300), // 5 minutes
    enableLazyLoading: z.boolean().default(true),
    enablePagination: z.boolean().default(true),
    defaultPageSize: z.number().default(20),
    maxPageSize: z.number().default(100),
  }),
});

export type CaseManagementConfig = z.infer<typeof caseManagementConfigSchema>;

/**
 * Default case management configuration
 */
export const defaultCaseManagementConfig: CaseManagementConfig = {
  workflow: {
    enableWorkflowEngine: true,
    enableStateTransitions: true,
    enableWorkflowTemplates: true,
    enableCustomWorkflows: false,
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
    escalationTimeout: 24 * 60 * 60 * 1000,
  },
  caseTypes: {
    enableCaseTypes: true,
    predefinedTypes: [
      { name: 'General Inquiry', description: 'General customer inquiry', priority: 'medium', slaHours: 24, requiredFields: ['subject', 'description'] },
      { name: 'Technical Support', description: 'Technical support request', priority: 'high', slaHours: 8, requiredFields: ['subject', 'description', 'priority'] },
      { name: 'Bug Report', description: 'Software bug report', priority: 'high', slaHours: 4, requiredFields: ['subject', 'description', 'stepsToReproduce'] },
      { name: 'Feature Request', description: 'Feature request', priority: 'low', slaHours: 72, requiredFields: ['subject', 'description'] },
    ],
    enableCustomTypes: true,
    maxCustomTypes: 20,
  },
  priority: {
    enablePriorityLevels: true,
    priorityLevels: [
      { name: 'Critical', level: 1, color: '#ef4444', slaHours: 2, escalationHours: 1 },
      { name: 'High', level: 2, color: '#f59e0b', slaHours: 8, escalationHours: 4 },
      { name: 'Medium', level: 3, color: '#3b82f6', slaHours: 24, escalationHours: 12 },
      { name: 'Low', level: 4, color: '#10b981', slaHours: 72, escalationHours: 48 },
    ],
    enablePriorityEscalation: true,
    enablePriorityNotifications: true,
  },
  sla: {
    enableSLATracking: true,
    enableSLAAlerts: true,
    enableSLAReporting: true,
    defaultSLAHours: 24,
    enableSLAEscalation: true,
    slaEscalationThreshold: 0.8,
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
  search: {
    enableCaseSearch: true,
    enableAdvancedSearch: true,
    enableFullTextSearch: true,
    searchFields: ['subject', 'description', 'caseNumber', 'customerName'],
    enableSearchHistory: true,
    enableSavedSearches: true,
    maxSavedSearches: 10,
  },
  analytics: {
    enableCaseAnalytics: true,
    enablePerformanceMetrics: true,
    enableAgentMetrics: true,
    enableSLAMetrics: true,
    enableTrendAnalysis: true,
    analyticsRetentionDays: 365,
    enableRealTimeDashboards: true,
  },
  security: {
    enableCasePermissions: true,
    enableCasePrivacy: false,
    enableCaseSharing: false,
    enableAuditLogging: true,
    enableDataEncryption: false,
    enableAccessControl: true,
  },
  integration: {
    enablePegaIntegration: true,
    enableAPIIntegration: true,
    enableWebhookIntegration: false,
    enableThirdPartyIntegrations: false,
    integrationTimeout: 30000,
  },
  performance: {
    enableCaching: true,
    cacheTTL: 300,
    enableLazyLoading: true,
    enablePagination: true,
    defaultPageSize: 20,
    maxPageSize: 100,
  },
};

