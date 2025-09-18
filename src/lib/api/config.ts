import { pega, api, features, isDevelopment, isProduction } from '@/config/env'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * API configuration interface
 */
export interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
  enableLogging: boolean
  enableRetry: boolean
  enableAuth: boolean
  enableMetrics: boolean
}

/**
 * Pega DX specific configuration
 */
export interface PegaConfig {
  apiUrl: string
  apiKey: string
  clientId: string
  clientSecret: string
  enableIntegration: boolean
}

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  isDevelopment: boolean
  isProduction: boolean
  enableDebugMode: boolean
  enableHotReload: boolean
}

/**
 * Feature flags configuration
 */
export interface FeatureFlags {
  pegaIntegration: boolean
  advancedAnalytics: boolean
  realTimeUpdates: boolean
}

/**
 * Default API configuration
 */
export const defaultApiConfig: ApiConfig = {
  baseURL: pega.apiUrl,
  timeout: api.timeout,
  retries: 3,
  retryDelay: 1000,
  enableLogging: isDevelopment,
  enableRetry: true,
  enableAuth: true,
  enableMetrics: features.advancedAnalytics,
}

/**
 * Pega DX configuration
 */
export const pegaConfig: PegaConfig = {
  apiUrl: pega.apiUrl,
  apiKey: pega.apiKey,
  clientId: pega.clientId,
  clientSecret: pega.clientSecret,
  enableIntegration: features.pegaIntegration,
}

/**
 * Environment configuration
 */
export const environmentConfig: EnvironmentConfig = {
  isDevelopment,
  isProduction,
  enableDebugMode: isDevelopment,
  enableHotReload: isDevelopment,
}

/**
 * Feature flags configuration
 */
export const featureFlags: FeatureFlags = {
  pegaIntegration: features.pegaIntegration,
  advancedAnalytics: features.advancedAnalytics,
  realTimeUpdates: features.realTimeUpdates,
}

/**
 * Pega DX API endpoints configuration
 */
export const pegaEndpoints = {
  // Authentication endpoints
  auth: {
    token: '/oauth/token',
    refresh: '/oauth/refresh',
    revoke: '/oauth/revoke',
    userinfo: '/oauth/userinfo',
  },
  
  // Case management endpoints
  cases: {
    list: '/api/v1/cases',
    create: '/api/v1/cases',
    get: '/api/v1/cases/:id',
    update: '/api/v1/cases/:id',
    delete: '/api/v1/cases/:id',
    assign: '/api/v1/cases/:id/assign',
    resolve: '/api/v1/cases/:id/resolve',
    comments: '/api/v1/cases/:id/comments',
    attachments: '/api/v1/cases/:id/attachments',
    history: '/api/v1/cases/:id/history',
  },
  
  // User management endpoints
  users: {
    list: '/api/v1/users',
    create: '/api/v1/users',
    get: '/api/v1/users/:id',
    update: '/api/v1/users/:id',
    delete: '/api/v1/users/:id',
    profile: '/api/v1/users/profile',
    roles: '/api/v1/users/:id/roles',
    permissions: '/api/v1/users/:id/permissions',
    groups: '/api/v1/users/:id/groups',
  },
  
  // Data management endpoints
  data: {
    pages: '/api/v1/data/pages',
    reports: '/api/v1/data/reports',
    analytics: '/api/v1/data/analytics',
    export: '/api/v1/data/export',
    import: '/api/v1/data/import',
    validate: '/api/v1/data/validate',
  },
  
  // Workflow endpoints
  workflows: {
    list: '/api/v1/workflows',
    start: '/api/v1/workflows/start',
    get: '/api/v1/workflows/:id',
    update: '/api/v1/workflows/:id',
    complete: '/api/v1/workflows/:id/complete',
    cancel: '/api/v1/workflows/:id/cancel',
    assignments: '/api/v1/workflows/:id/assignments',
    history: '/api/v1/workflows/:id/history',
  },
  
  // Decision endpoints
  decisions: {
    list: '/api/v1/decisions',
    execute: '/api/v1/decisions/execute',
    get: '/api/v1/decisions/:id',
    history: '/api/v1/decisions/:id/history',
    test: '/api/v1/decisions/:id/test',
  },
  
  // Integration endpoints
  integrations: {
    webhooks: '/api/v1/integrations/webhooks',
    connectors: '/api/v1/integrations/connectors',
    events: '/api/v1/integrations/events',
    mappings: '/api/v1/integrations/mappings',
  },
} as const

/**
 * API endpoint builder utility
 */
export class EndpointBuilder {
  private baseUrl: string
  private version: string

  constructor(baseUrl: string = pega.apiUrl, version: string = 'v1') {
    this.baseUrl = baseUrl
    this.version = version
  }

  /**
   * Build endpoint URL with parameters
   */
  build(endpoint: string, params?: Record<string, string | number>): string {
    let url = `${this.baseUrl}${endpoint}`
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value))
      })
    }
    
    return url
  }

  /**
   * Build endpoint URL with query parameters
   */
  buildWithQuery(
    endpoint: string, 
    params?: Record<string, string | number>,
    query?: Record<string, string | number | boolean>
  ): string {
    let url = this.build(endpoint, params)
    
    if (query) {
      const searchParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    return url
  }

  /**
   * Get authentication endpoints
   */
  getAuthEndpoints() {
    return {
      token: this.build(pegaEndpoints.auth.token),
      refresh: this.build(pegaEndpoints.auth.refresh),
      revoke: this.build(pegaEndpoints.auth.revoke),
      userinfo: this.build(pegaEndpoints.auth.userinfo),
    }
  }

  /**
   * Get case management endpoints
   */
  getCaseEndpoints() {
    return {
      list: this.build(pegaEndpoints.cases.list),
      create: this.build(pegaEndpoints.cases.create),
      get: (id: string) => this.build(pegaEndpoints.cases.get, { id }),
      update: (id: string) => this.build(pegaEndpoints.cases.update, { id }),
      delete: (id: string) => this.build(pegaEndpoints.cases.delete, { id }),
      assign: (id: string) => this.build(pegaEndpoints.cases.assign, { id }),
      resolve: (id: string) => this.build(pegaEndpoints.cases.resolve, { id }),
      comments: (id: string) => this.build(pegaEndpoints.cases.comments, { id }),
      attachments: (id: string) => this.build(pegaEndpoints.cases.attachments, { id }),
      history: (id: string) => this.build(pegaEndpoints.cases.history, { id }),
    }
  }

  /**
   * Get user management endpoints
   */
  getUserEndpoints() {
    return {
      list: this.build(pegaEndpoints.users.list),
      create: this.build(pegaEndpoints.users.create),
      get: (id: string) => this.build(pegaEndpoints.users.get, { id }),
      update: (id: string) => this.build(pegaEndpoints.users.update, { id }),
      delete: (id: string) => this.build(pegaEndpoints.users.delete, { id }),
      profile: this.build(pegaEndpoints.users.profile),
      roles: (id: string) => this.build(pegaEndpoints.users.roles, { id }),
      permissions: (id: string) => this.build(pegaEndpoints.users.permissions, { id }),
      groups: (id: string) => this.build(pegaEndpoints.users.groups, { id }),
    }
  }

  /**
   * Get data management endpoints
   */
  getDataEndpoints() {
    return {
      pages: this.build(pegaEndpoints.data.pages),
      reports: this.build(pegaEndpoints.data.reports),
      analytics: this.build(pegaEndpoints.data.analytics),
      export: this.build(pegaEndpoints.data.export),
      import: this.build(pegaEndpoints.data.import),
      validate: this.build(pegaEndpoints.data.validate),
    }
  }

  /**
   * Get workflow endpoints
   */
  getWorkflowEndpoints() {
    return {
      list: this.build(pegaEndpoints.workflows.list),
      start: this.build(pegaEndpoints.workflows.start),
      get: (id: string) => this.build(pegaEndpoints.workflows.get, { id }),
      update: (id: string) => this.build(pegaEndpoints.workflows.update, { id }),
      complete: (id: string) => this.build(pegaEndpoints.workflows.complete, { id }),
      cancel: (id: string) => this.build(pegaEndpoints.workflows.cancel, { id }),
      assignments: (id: string) => this.build(pegaEndpoints.workflows.assignments, { id }),
      history: (id: string) => this.build(pegaEndpoints.workflows.history, { id }),
    }
  }

  /**
   * Get decision endpoints
   */
  getDecisionEndpoints() {
    return {
      list: this.build(pegaEndpoints.decisions.list),
      execute: this.build(pegaEndpoints.decisions.execute),
      get: (id: string) => this.build(pegaEndpoints.decisions.get, { id }),
      history: (id: string) => this.build(pegaEndpoints.decisions.history, { id }),
      test: (id: string) => this.build(pegaEndpoints.decisions.test, { id }),
    }
  }

  /**
   * Get integration endpoints
   */
  getIntegrationEndpoints() {
    return {
      webhooks: this.build(pegaEndpoints.integrations.webhooks),
      connectors: this.build(pegaEndpoints.integrations.connectors),
      events: this.build(pegaEndpoints.integrations.events),
      mappings: this.build(pegaEndpoints.integrations.mappings),
    }
  }
}

/**
 * Default endpoint builder instance
 */
export const endpointBuilder = new EndpointBuilder()

/**
 * Create endpoint builder with custom configuration
 */
export function createEndpointBuilder(baseUrl?: string, version?: string): EndpointBuilder {
  return new EndpointBuilder(baseUrl, version)
}

/**
 * Get configuration for specific environment
 */
export function getEnvironmentConfig(environment: 'development' | 'staging' | 'production'): ApiConfig {
  const baseConfig = { ...defaultApiConfig }

  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        enableLogging: true,
        enableMetrics: false,
        retries: 1,
        retryDelay: 500,
      }

    case 'staging':
      return {
        ...baseConfig,
        enableLogging: true,
        enableMetrics: true,
        retries: 2,
        retryDelay: 1000,
      }

    case 'production':
      return {
        ...baseConfig,
        enableLogging: false,
        enableMetrics: true,
        retries: 3,
        retryDelay: 2000,
      }

    default:
      return baseConfig
  }
}

/**
 * Validate API configuration
 */
export function validateApiConfig(config: ApiConfig): boolean {
  try {
    if (!config.baseURL || typeof config.baseURL !== 'string') {
      throw new Error('baseURL is required and must be a string')
    }

    if (config.timeout <= 0) {
      throw new Error('timeout must be a positive number')
    }

    if (config.retries < 0) {
      throw new Error('retries must be a non-negative number')
    }

    if (config.retryDelay <= 0) {
      throw new Error('retryDelay must be a positive number')
    }

    return true
  } catch (error) {
    console.error('API configuration validation failed:', error)
    return false
  }
}

/**
 * Get current API configuration
 */
export function getCurrentApiConfig(): ApiConfig {
  return { ...defaultApiConfig }
}

/**
 * Update API configuration
 */
export function updateApiConfig(updates: Partial<ApiConfig>): ApiConfig {
  const newConfig = { ...defaultApiConfig, ...updates }
  
  if (!validateApiConfig(newConfig)) {
    throw new Error('Invalid API configuration')
  }
  
  return newConfig
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature]
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature)
}

/**
 * Export types for external use
 */
export type { ApiConfig, PegaConfig, EnvironmentConfig, FeatureFlags }
