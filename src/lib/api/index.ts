/**
 * Main API client index file for Pega DX integration
 * This file exports all services, types, and utilities for easy importing throughout the application
 */

// Core API client and configuration
export { 
  ApiClient, 
  apiClient, 
  createApiClient,
  type HttpClientConfig 
} from './client'

// Authentication services
export { 
  AuthService, 
  authService, 
  createAuthService,
  type TokenData, 
  type UserInfo, 
  type AuthState 
} from './auth'

// Error handling
export {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  ExternalApiError,
  NetworkError,
  TimeoutError,
  RateLimitError,
  isRetryableError,
  calculateRetryDelay,
  transformAxiosError,
  createErrorResponse,
  isErrorType,
  getErrorMessage,
  getErrorCode,
  getErrorStatus,
  type RetryConfig,
  defaultRetryConfig,
} from './errors'

// Interceptors
export {
  setupInterceptors,
  setupRequestInterceptors,
  setupResponseInterceptors,
  addCustomHeaders,
  addTransformationInterceptor,
  addRateLimitInterceptor,
  type InterceptorConfig,
  type RequestInterceptorConfig,
  type ResponseInterceptorConfig,
} from './interceptors'

// Configuration
export {
  endpointBuilder,
  createEndpointBuilder,
  getEnvironmentConfig,
  validateApiConfig,
  getCurrentApiConfig,
  updateApiConfig,
  isFeatureEnabled,
  getEnabledFeatures,
  type ApiConfig,
  type PegaConfig,
  type EnvironmentConfig,
  type FeatureFlags,
  pegaEndpoints,
  pegaConfig,
  environmentConfig,
  featureFlags,
  defaultApiConfig,
} from './config'

// Types and schemas
export {
  // Base types
  type BaseResponse,
  type Pagination,
  type PaginatedResponse,
  type SingleResponse,
  type ErrorResponse,
  
  // User types
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
  
  // Case types
  type Case,
  type CreateCaseRequest,
  type UpdateCaseRequest,
  type CaseAssignment,
  type CaseComment,
  type CreateCaseCommentRequest,
  type CaseAttachment,
  
  // Workflow types
  type Workflow,
  type StartWorkflowRequest,
  
  // Data types
  type DataPage,
  type Report,
  type GenerateReportRequest,
  
  // Utility types
  type SearchParams,
  type FilterOptions,
  type SortOptions,
  type ApiRequestOptions,
  type ApiResponseOptions,
  type ServiceMethod,
  type CrudService,
  type AuthService as AuthServiceInterface,
  type WorkflowService,
  
  // Schemas
  schemas,
  userSchema,
  createUserSchema,
  updateUserSchema,
  caseSchema,
  createCaseSchema,
  updateCaseSchema,
  caseAssignmentSchema,
  caseCommentSchema,
  createCaseCommentSchema,
  caseAttachmentSchema,
  workflowSchema,
  startWorkflowSchema,
  dataPageSchema,
  reportSchema,
  generateReportSchema,
} from './types'

// Utilities
export {
  UrlBuilder,
  createUrlBuilder,
  serializeSearchParams,
  deserializeSearchParams,
  buildFilterQuery,
  parseFilterQuery,
  validateData,
  safeValidateData,
  transformResponseData,
  deepClone,
  deepMerge,
  objectToFormData,
  formDataToObject,
  delay,
  debounce,
  throttle,
  generateId,
  formatBytes,
  formatDuration,
  isEmpty,
  isNotEmpty,
  sanitizeForUrl,
  createQueryString,
  parseQueryString,
} from './utils'

// Services
export {
  BaseService,
} from './services/base'

export {
  UserService,
  userService,
  createUserService,
} from './services/users'

export {
  CaseService,
  caseService,
  createCaseService,
} from './services/cases'

export {
  DataService,
  dataService,
  createDataService,
} from './services/data'

export {
  IngredientService,
  ingredientService,
} from './services/ingredients'

// Logging
export {
  Logger,
  logger,
  createLogger,
  createChildLogger,
  PerformanceTimer,
  createTimer,
  timeExecution,
  type LoggerConfig,
  type LogEntry,
  type LogLevel,
} from './logger'

// Retry utilities
export {
  ExponentialBackoffStrategy,
  LinearBackoffStrategy,
  FixedDelayStrategy,
  CircuitBreakerStrategy,
  RetryUtil,
  retryUtil,
  createRetryUtil,
  retry,
  retryRequest,
  createRetryInterceptor,
  createRetryMiddleware,
  RetryStrategies,
  type RetryStrategy,
  type RetryOptions,
  defaultRetryOptions,
} from './retry'

// Service registry for easy access to all services
export class ApiServiceRegistry {
  public readonly auth: typeof authService
  public readonly users: typeof userService
  public readonly cases: typeof caseService
  public readonly data: typeof dataService
  public readonly ingredients: typeof ingredientService
  public readonly client: typeof apiClient
  public readonly logger: typeof logger
  public readonly retry: typeof retryUtil

  constructor() {
    this.auth = authService
    this.users = userService
    this.cases = caseService
    this.data = dataService
    this.ingredients = ingredientService
    this.client = apiClient
    this.logger = logger
    this.retry = retryUtil
  }

  /**
   * Initialize all services with authentication
   */
  async initialize(): Promise<void> {
    try {
      await this.auth.authenticate()
      this.logger.info('API services initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize API services:', error)
      throw error
    }
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    auth: boolean
    users: boolean
    cases: boolean
    data: boolean
    ingredients: boolean
    overall: boolean
  }> {
    const health = {
      auth: false,
      users: false,
      cases: false,
      data: false,
      ingredients: false,
      overall: false,
    }

    try {
      // Check auth service
      const authState = this.auth.getAuthState()
      health.auth = authState.isAuthenticated

      // Check other services (basic connectivity)
      // Note: In a real implementation, you might want to make actual API calls
      health.users = true
      health.cases = true
      health.data = true
      health.ingredients = true

      health.overall = Object.values(health).every(status => status === true)

      return health
    } catch (error) {
      this.logger.error('Health check failed:', error)
      return health
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.auth.logout()
      this.logger.info('API services cleaned up successfully')
    } catch (error) {
      this.logger.warn('Error during API services cleanup:', error)
    }
  }
}

/**
 * Default API service registry instance
 */
export const apiServices = new ApiServiceRegistry()

/**
 * Create API service registry instance
 */
export function createApiServiceRegistry(): ApiServiceRegistry {
  return new ApiServiceRegistry()
}

/**
 * API client factory for creating custom configurations
 */
export class ApiClientFactory {
  /**
   * Create API client for development environment
   */
  static createDevelopmentClient(): typeof apiClient {
    return new ApiClient({
      enableLogging: true,
      enableRetry: true,
      retries: 1,
      retryDelay: 500,
    })
  }

  /**
   * Create API client for production environment
   */
  static createProductionClient(): typeof apiClient {
    return new ApiClient({
      enableLogging: false,
      enableRetry: true,
      retries: 3,
      retryDelay: 2000,
    })
  }

  /**
   * Create API client for testing environment
   */
  static createTestClient(): typeof apiClient {
    return new ApiClient({
      enableLogging: false,
      enableRetry: false,
      retries: 0,
      retryDelay: 0,
    })
  }

  /**
   * Create API client with custom configuration
   */
  static createCustomClient(config: Partial<ApiClientConfig>): typeof apiClient {
    return new ApiClient(config)
  }
}

/**
 * Utility functions for common API operations
 */
export const ApiUtils = {
  /**
   * Create search parameters
   */
  createSearchParams: (params: {
    query?: string
    filters?: Record<string, any>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }) => ({
    query: params.query,
    filters: params.filters,
    sort: params.sortBy ? {
      field: params.sortBy,
      direction: params.sortOrder || 'asc' as const,
    } : undefined,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 20,
    },
  }),

  /**
   * Create pagination parameters
   */
  createPaginationParams: (page: number = 1, limit: number = 20) => ({
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
  }),

  /**
   * Create filter parameters
   */
  createFilterParams: (filters: Record<string, any>) => {
    const cleanFilters: Record<string, any> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanFilters[key] = value
      }
    })
    return cleanFilters
  },

  /**
   * Validate API response
   */
  validateResponse: <T>(response: any): T => {
    if (!response) {
      throw new Error('Empty response received')
    }
    return response
  },

  /**
   * Handle API errors
   */
  handleError: (error: any, context?: string) => {
    logger.error(`API Error${context ? ` in ${context}` : ''}:`, error)
    throw error
  },

  /**
   * Create request options
   */
  createRequestOptions: (options: {
    timeout?: number
    headers?: Record<string, string>
    params?: Record<string, any>
  } = {}) => ({
    timeout: options.timeout || 30000,
    headers: options.headers || {},
    params: options.params || {},
  }),
}

