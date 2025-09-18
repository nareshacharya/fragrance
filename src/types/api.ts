/**
 * API-specific types for Pega DX integration
 * This file extends the main types system with API-specific interfaces
 */

// Re-export all types from the API types module
export * from '@/lib/api/types'

// Additional API-specific types that extend the main system


/**
 * Authentication token interface
 */
export interface AuthToken {
  accessToken: string
  tokenType: string
  expiresAt: Date
  refreshToken?: string
  scope?: string
}

/**
 * API request metadata interface
 */
export interface ApiRequestMetadata {
  requestId: string
  timestamp: Date
  duration?: number
  retryCount?: number
  userId?: string
}

/**
 * API response metadata interface
 */
export interface ApiResponseMetadata {
  requestId: string
  timestamp: Date
  duration: number
  status: number
  size?: number
  cacheHit?: boolean
}

/**
 * Pagination request interface
 */
export interface PaginationRequest {
  page: number
  limit: number
  offset?: number
}

/**
 * Pagination response interface
 */
export interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Search request interface
 */
export interface SearchRequest {
  query?: string
  filters?: Record<string, any>
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
  pagination?: PaginationRequest
}

/**
 * Filter condition interface
 */
export interface FilterCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith'
  value: any
}

/**
 * Sort condition interface
 */
export interface SortCondition {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * API error details interface
 */
export interface ApiErrorDetails {
  code: string
  message: string
  field?: string
  value?: any
  context?: Record<string, any>
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

/**
 * API response wrapper interface
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiErrorDetails
  message?: string
  timestamp: string
  requestId?: string
  metadata?: ApiResponseMetadata
}

/**
 * Paginated API response interface
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationResponse
}

/**
 * File upload response interface
 */
export interface FileUploadResponse {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
}

/**
 * Bulk operation result interface
 */
export interface BulkOperationResult {
  total: number
  successful: number
  failed: number
  errors: Array<{
    index: number
    error: ApiErrorDetails
  }>
}

/**
 * API health check interface
 */
export interface ApiHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  services: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy'
    responseTime?: number
    lastCheck: string
  }>
}

/**
 * API metrics interface
 */
export interface ApiMetrics {
  requests: {
    total: number
    successful: number
    failed: number
    rate: number
  }
  responseTime: {
    average: number
    p50: number
    p95: number
    p99: number
  }
  errors: {
    byCode: Record<string, number>
    byEndpoint: Record<string, number>
  }
  cache: {
    hitRate: number
    missRate: number
  }
}

/**
 * Webhook payload interface
 */
export interface WebhookPayload<T = any> {
  event: string
  timestamp: string
  data: T
  metadata: {
    source: string
    version: string
    requestId: string
  }
}

/**
 * Webhook subscription interface
 */
export interface WebhookSubscription {
  id: string
  url: string
  events: string[]
  secret?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * API rate limit interface
 */
export interface ApiRateLimit {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * API client instance interface
 */
export interface ApiClientInstance {
  get<T>(url: string, config?: any): Promise<T>
  post<T>(url: string, data?: any, config?: any): Promise<T>
  put<T>(url: string, data?: any, config?: any): Promise<T>
  patch<T>(url: string, data?: any, config?: any): Promise<T>
  delete<T>(url: string, config?: any): Promise<T>
  request<T>(config: any): Promise<T>
}

/**
 * Service method signature interface
 */
export type ServiceMethod<TRequest = any, TResponse = any> = (
  request: TRequest,
  options?: {
    timeout?: number
    retries?: number
    headers?: Record<string, string>
    params?: Record<string, any>
  }
) => Promise<TResponse>

/**
 * CRUD service interface
 */
export interface CrudServiceInterface<T, TCreate, TUpdate> {
  list(params?: SearchRequest): Promise<PaginatedApiResponse<T>>
  get(id: string): Promise<ApiResponse<T>>
  create(data: TCreate): Promise<ApiResponse<T>>
  update(id: string, data: TUpdate): Promise<ApiResponse<T>>
  delete(id: string): Promise<ApiResponse<void>>
}

/**
 * Authentication service interface
 */
export interface AuthServiceInterface {
  authenticate(): Promise<AuthToken>
  refreshToken(): Promise<AuthToken>
  logout(): Promise<void>
  getAccessToken(): Promise<string>
  getUserInfo(): Promise<ApiResponse<any>>
  hasRole(role: string): Promise<boolean>
  hasAnyRole(roles: string[]): Promise<boolean>
}

/**
 * Case service interface
 */
export interface CaseServiceInterface extends CrudServiceInterface<any, any, any> {
  assign(id: string, assignment: any): Promise<ApiResponse<any>>
  resolve(id: string, resolution: string): Promise<ApiResponse<any>>
  getComments(id: string): Promise<PaginatedApiResponse<any>>
  addComment(id: string, comment: any): Promise<ApiResponse<any>>
  getAttachments(id: string): Promise<PaginatedApiResponse<any>>
  uploadAttachment(id: string, file: File): Promise<ApiResponse<any>>
  getHistory(id: string): Promise<PaginatedApiResponse<any>>
}

/**
 * User service interface
 */
export interface UserServiceInterface extends CrudServiceInterface<any, any, any> {
  getProfile(): Promise<ApiResponse<any>>
  updateProfile(data: any): Promise<ApiResponse<any>>
  getRoles(id: string): Promise<ApiResponse<string[]>>
  updateRoles(id: string, roles: string[]): Promise<ApiResponse<any>>
  getPermissions(id: string): Promise<ApiResponse<string[]>>
  getGroups(id: string): Promise<ApiResponse<string[]>>
  updateGroups(id: string, groups: string[]): Promise<ApiResponse<any>>
}

/**
 * Data service interface
 */
export interface DataServiceInterface {
  getDataPage(name: string, params?: Record<string, any>): Promise<ApiResponse<any>>
  getReports(params?: SearchRequest): Promise<PaginatedApiResponse<any>>
  generateReport(request: any): Promise<ApiResponse<any>>
  getReport(id: string): Promise<ApiResponse<any>>
  downloadReport(id: string): Promise<Blob>
  getAnalytics(type: string, params?: Record<string, any>): Promise<ApiResponse<any>>
  exportData(dataType: string, format: string, filters?: Record<string, any>): Promise<Blob>
  importData(dataType: string, file: File): Promise<ApiResponse<any>>
  validateData(dataType: string, data: any[]): Promise<ApiResponse<any>>
}

/**
 * Workflow service interface
 */
export interface WorkflowServiceInterface {
  getWorkflows(params?: SearchRequest): Promise<PaginatedApiResponse<any>>
  startWorkflow(request: any): Promise<ApiResponse<any>>
  getWorkflow(id: string): Promise<ApiResponse<any>>
  updateWorkflow(id: string, variables: Record<string, any>): Promise<ApiResponse<any>>
  completeWorkflow(id: string): Promise<ApiResponse<any>>
  cancelWorkflow(id: string, reason?: string): Promise<ApiResponse<any>>
}

/**
 * API service registry interface
 */
export interface ApiServiceRegistry {
  auth: AuthServiceInterface
  users: UserServiceInterface
  cases: CaseServiceInterface
  data: DataServiceInterface
  workflows: WorkflowServiceInterface
}

/**
 * Extended API configuration interface
 */
export interface ExtendedApiConfiguration {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
  enableLogging: boolean
  enableRetry: boolean
  enableAuth: boolean
  enableMetrics: boolean
  headers: Record<string, string>
  interceptors: {
    request: Array<(config: any) => any>
    response: Array<(response: any) => any>
    error: Array<(error: any) => any>
  }
}

/**
 * API middleware interface
 */
export interface ApiMiddleware {
  name: string
  request?: (config: any) => any
  response?: (response: any) => any
  error?: (error: any) => any
}

/**
 * API plugin interface
 */
export interface ApiPlugin {
  name: string
  version: string
  install(client: ApiClientInstance): void
  uninstall?(): void
}

/**
 * API event interface
 */
export interface ApiEvent {
  type: string
  timestamp: string
  data: any
  source: string
}

/**
 * API event listener interface
 */
export interface ApiEventListener {
  event: string
  handler: (event: ApiEvent) => void
  once?: boolean
}

/**
 * API cache interface
 */
export interface ApiCache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  has(key: string): Promise<boolean>
}

/**
 * API retry configuration interface
 */
export interface ApiRetryConfig {
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
  maxRetryDelay: number
  retryableStatusCodes: number[]
  retryableErrorCodes: string[]
}

/**
 * API timeout configuration interface
 */
export interface ApiTimeoutConfig {
  request: number
  connect: number
  socket: number
  response: number
}

/**
 * API logging configuration interface
 */
export interface ApiLoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  format: 'json' | 'simple' | 'pretty'
  enableRequestLogging: boolean
  enableResponseLogging: boolean
  enableErrorLogging: boolean
  sanitizeData: boolean
  excludeHeaders: string[]
  excludeFields: string[]
}
