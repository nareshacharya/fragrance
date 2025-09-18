import { z } from 'zod'

/**
 * Base response interface for all API responses
 */
export interface BaseResponse {
  success: boolean
  message?: string
  timestamp: string
  requestId?: string
}

/**
 * Pagination interface
 */
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends BaseResponse {
  data: T[]
  pagination: Pagination
}

/**
 * Single item response interface
 */
export interface SingleResponse<T> extends BaseResponse {
  data: T
}

/**
 * Error response interface
 */
export interface ErrorResponse extends BaseResponse {
  error: {
    code: string
    message: string
    status: number
    details?: any
    validationErrors?: Record<string, string[]>
  }
}

/**
 * User schema for Pega DX
 */
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  roles: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  department: z.string().optional(),
  isActive: z.boolean().default(true),
  lastLoginAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * User interface
 */
export type User = z.infer<typeof userSchema>

/**
 * Create user request schema
 */
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
})

/**
 * Create user request interface
 */
export type CreateUserRequest = z.infer<typeof createUserSchema>

/**
 * Update user request schema
 */
export const updateUserSchema = createUserSchema.partial()

/**
 * Update user request interface
 */
export type UpdateUserRequest = z.infer<typeof updateUserSchema>

/**
 * Case schema for Pega DX
 */
export const caseSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  assigneeId: z.string().optional(),
  assigneeName: z.string().optional(),
  requesterId: z.string(),
  requesterName: z.string(),
  caseType: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().datetime().optional(),
  resolvedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
})

/**
 * Case interface
 */
export type Case = z.infer<typeof caseSchema>

/**
 * Create case request schema
 */
export const createCaseSchema = caseSchema.omit({
  id: true,
  caseId: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
  assigneeName: true,
  requesterName: true,
})

/**
 * Create case request interface
 */
export type CreateCaseRequest = z.infer<typeof createCaseSchema>

/**
 * Update case request schema
 */
export const updateCaseSchema = createCaseSchema.partial()

/**
 * Update case request interface
 */
export type UpdateCaseRequest = z.infer<typeof updateCaseSchema>

/**
 * Case assignment schema
 */
export const caseAssignmentSchema = z.object({
  assigneeId: z.string(),
  assigneeName: z.string().optional(),
  assignedBy: z.string(),
  assignedAt: z.string().datetime(),
  notes: z.string().optional(),
})

/**
 * Case assignment interface
 */
export type CaseAssignment = z.infer<typeof caseAssignmentSchema>

/**
 * Case comment schema
 */
export const caseCommentSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  content: z.string(),
  isInternal: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * Case comment interface
 */
export type CaseComment = z.infer<typeof caseCommentSchema>

/**
 * Create case comment request schema
 */
export const createCaseCommentSchema = caseCommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorName: true,
})

/**
 * Create case comment request interface
 */
export type CreateCaseCommentRequest = z.infer<typeof createCaseCommentSchema>

/**
 * Case attachment schema
 */
export const caseAttachmentSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  fileName: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedBy: z.string(),
  uploadedAt: z.string().datetime(),
  downloadUrl: z.string().url().optional(),
})

/**
 * Case attachment interface
 */
export type CaseAttachment = z.infer<typeof caseAttachmentSchema>

/**
 * Workflow schema
 */
export const workflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  version: z.string(),
  processDefinitionId: z.string(),
  startedBy: z.string(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  variables: z.record(z.any()).optional(),
})

/**
 * Workflow interface
 */
export type Workflow = z.infer<typeof workflowSchema>

/**
 * Start workflow request schema
 */
export const startWorkflowSchema = z.object({
  processDefinitionId: z.string(),
  variables: z.record(z.any()).optional(),
  assigneeId: z.string().optional(),
  priority: z.string().optional(),
})

/**
 * Start workflow request interface
 */
export type StartWorkflowRequest = z.infer<typeof startWorkflowSchema>

/**
 * Data page schema
 */
export const dataPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dataType: z.string(),
  pageSize: z.number().default(20),
  totalRecords: z.number(),
  data: z.array(z.record(z.any())),
  metadata: z.record(z.any()).optional(),
  lastUpdated: z.string().datetime(),
})

/**
 * Data page interface
 */
export type DataPage = z.infer<typeof dataPageSchema>

/**
 * Report schema
 */
export const reportSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  reportType: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  parameters: z.record(z.any()).optional(),
  resultUrl: z.string().url().optional(),
  generatedBy: z.string(),
  generatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  errorMessage: z.string().optional(),
})

/**
 * Report interface
 */
export type Report = z.infer<typeof reportSchema>

/**
 * Generate report request schema
 */
export const generateReportSchema = z.object({
  reportType: z.string(),
  parameters: z.record(z.any()).optional(),
  format: z.enum(['pdf', 'excel', 'csv', 'json']).default('pdf'),
})

/**
 * Generate report request interface
 */
export type GenerateReportRequest = z.infer<typeof generateReportSchema>

/**
 * Search parameters interface
 */
export interface SearchParams {
  query?: string
  filters?: Record<string, any>
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
  pagination?: {
    page: number
    limit: number
  }
}

/**
 * Filter options interface
 */
export interface FilterOptions {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith'
  value: any
}

/**
 * Sort options interface
 */
export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * API request options interface
 */
export interface ApiRequestOptions {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
}

/**
 * API response options interface
 */
export interface ApiResponseOptions {
  validateSchema?: boolean
  transformData?: boolean
  includeMetadata?: boolean
}

/**
 * Service method signature interface
 */
export interface ServiceMethod<TRequest, TResponse> {
  (request: TRequest, options?: ApiRequestOptions): Promise<TResponse>
}

/**
 * CRUD service interface
 */
export interface CrudService<T, TCreate, TUpdate> {
  list(params?: SearchParams, options?: ApiRequestOptions): Promise<PaginatedResponse<T>>
  get(id: string, options?: ApiRequestOptions): Promise<SingleResponse<T>>
  create(data: TCreate, options?: ApiRequestOptions): Promise<SingleResponse<T>>
  update(id: string, data: TUpdate, options?: ApiRequestOptions): Promise<SingleResponse<T>>
  delete(id: string, options?: ApiRequestOptions): Promise<BaseResponse>
}

/**
 * Authentication service interface
 */
export interface AuthService {
  authenticate(): Promise<{ accessToken: string; expiresAt: Date }>
  refreshToken(): Promise<{ accessToken: string; expiresAt: Date }>
  logout(): Promise<void>
  getAccessToken(): Promise<string>
  getUserInfo(): Promise<User>
  hasRole(role: string): Promise<boolean>
  hasAnyRole(roles: string[]): Promise<boolean>
}

/**
 * Case service interface
 */
export interface CaseService extends CrudService<Case, CreateCaseRequest, UpdateCaseRequest> {
  assign(id: string, assignment: CaseAssignment, options?: ApiRequestOptions): Promise<SingleResponse<Case>>
  resolve(id: string, resolution: string, options?: ApiRequestOptions): Promise<SingleResponse<Case>>
  getComments(id: string, options?: ApiRequestOptions): Promise<PaginatedResponse<CaseComment>>
  addComment(id: string, comment: CreateCaseCommentRequest, options?: ApiRequestOptions): Promise<SingleResponse<CaseComment>>
  getAttachments(id: string, options?: ApiRequestOptions): Promise<PaginatedResponse<CaseAttachment>>
  getHistory(id: string, options?: ApiRequestOptions): Promise<PaginatedResponse<any>>
}

/**
 * User service interface
 */
export interface UserService extends CrudService<User, CreateUserRequest, UpdateUserRequest> {
  getProfile(options?: ApiRequestOptions): Promise<SingleResponse<User>>
  updateProfile(data: UpdateUserRequest, options?: ApiRequestOptions): Promise<SingleResponse<User>>
  getRoles(id: string, options?: ApiRequestOptions): Promise<SingleResponse<string[]>>
  updateRoles(id: string, roles: string[], options?: ApiRequestOptions): Promise<SingleResponse<User>>
  getPermissions(id: string, options?: ApiRequestOptions): Promise<SingleResponse<string[]>>
}

/**
 * Data service interface
 */
export interface DataService {
  getDataPage(name: string, params?: Record<string, any>, options?: ApiRequestOptions): Promise<SingleResponse<DataPage>>
  getReports(params?: SearchParams, options?: ApiRequestOptions): Promise<PaginatedResponse<Report>>
  generateReport(request: GenerateReportRequest, options?: ApiRequestOptions): Promise<SingleResponse<Report>>
  getReport(id: string, options?: ApiRequestOptions): Promise<SingleResponse<Report>>
  downloadReport(id: string, options?: ApiRequestOptions): Promise<Blob>
}

/**
 * Workflow service interface
 */
export interface WorkflowService {
  getWorkflows(params?: SearchParams, options?: ApiRequestOptions): Promise<PaginatedResponse<Workflow>>
  startWorkflow(request: StartWorkflowRequest, options?: ApiRequestOptions): Promise<SingleResponse<Workflow>>
  getWorkflow(id: string, options?: ApiRequestOptions): Promise<SingleResponse<Workflow>>
  updateWorkflow(id: string, variables: Record<string, any>, options?: ApiRequestOptions): Promise<SingleResponse<Workflow>>
  completeWorkflow(id: string, options?: ApiRequestOptions): Promise<SingleResponse<Workflow>>
  cancelWorkflow(id: string, reason?: string, options?: ApiRequestOptions): Promise<SingleResponse<Workflow>>
}

/**
 * Export all schemas for validation
 */
export const schemas = {
  user: userSchema,
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  case: caseSchema,
  createCase: createCaseSchema,
  updateCase: updateCaseSchema,
  caseAssignment: caseAssignmentSchema,
  caseComment: caseCommentSchema,
  createCaseComment: createCaseCommentSchema,
  caseAttachment: caseAttachmentSchema,
  workflow: workflowSchema,
  startWorkflow: startWorkflowSchema,
  dataPage: dataPageSchema,
  report: reportSchema,
  generateReport: generateReportSchema,
} as const

// All types are already exported above as interfaces and types
