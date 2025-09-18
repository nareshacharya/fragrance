import { BaseService } from './base'
import { 
  Case, 
  CreateCaseRequest, 
  UpdateCaseRequest,
  CaseAssignment,
  CaseComment,
  CreateCaseCommentRequest,
  CaseAttachment,
  SingleResponse, 
  PaginatedResponse,
  SearchParams,
  ApiRequestOptions 
} from '../types'
import { schemas } from '../types'
import { validateData } from '../utils'
import { logger } from '../logger'

/**
 * Case service for Pega DX case management
 */
export class CaseService extends BaseService<Case, CreateCaseRequest, UpdateCaseRequest> {
  constructor() {
    super('/api/v1/cases')
  }

  /**
   * Assign case to user
   */
  async assign(
    id: string, 
    assignment: CaseAssignment, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Case>> {
    try {
      const url = this.buildCustomUrl(id, 'assign')
      const response = await this.client.post<SingleResponse<Case>>(url, assignment, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.assign:', {
        url,
        id,
        assignment: this.sanitizeData(assignment),
      })

      return response
    } catch (error) {
      logger.error('CaseService.assign failed:', error)
      throw error
    }
  }

  /**
   * Resolve case
   */
  async resolve(
    id: string, 
    resolution: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Case>> {
    try {
      const url = this.buildCustomUrl(id, 'resolve')
      const response = await this.client.post<SingleResponse<Case>>(url, { resolution }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.resolve:', {
        url,
        id,
        resolution,
      })

      return response
    } catch (error) {
      logger.error('CaseService.resolve failed:', error)
      throw error
    }
  }

  /**
   * Get case comments
   */
  async getComments(
    id: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<CaseComment>> {
    try {
      const url = this.buildCustomUrl(id, 'comments')
      const response = await this.client.get<PaginatedResponse<CaseComment>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug('CaseService.getComments:', { url, id })

      return response
    } catch (error) {
      logger.error('CaseService.getComments failed:', error)
      throw error
    }
  }

  /**
   * Add comment to case
   */
  async addComment(
    id: string, 
    comment: CreateCaseCommentRequest, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<CaseComment>> {
    try {
      // Validate comment data
      const validatedComment = validateData(schemas.createCaseComment, comment)
      
      const url = this.buildCustomUrl(id, 'comments')
      const response = await this.client.post<SingleResponse<CaseComment>>(url, validatedComment, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.addComment:', {
        url,
        id,
        comment: this.sanitizeData(validatedComment),
      })

      return response
    } catch (error) {
      logger.error('CaseService.addComment failed:', error)
      throw error
    }
  }

  /**
   * Update case comment
   */
  async updateComment(
    caseId: string, 
    commentId: string, 
    content: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<CaseComment>> {
    try {
      const url = this.buildCustomUrl(caseId, 'comments', commentId)
      const response = await this.client.put<SingleResponse<CaseComment>>(url, { content }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.updateComment:', {
        url,
        caseId,
        commentId,
      })

      return response
    } catch (error) {
      logger.error('CaseService.updateComment failed:', error)
      throw error
    }
  }

  /**
   * Delete case comment
   */
  async deleteComment(
    caseId: string, 
    commentId: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{ success: boolean }>> {
    try {
      const url = this.buildCustomUrl(caseId, 'comments', commentId)
      const response = await this.client.delete<SingleResponse<{ success: boolean }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.deleteComment:', {
        url,
        caseId,
        commentId,
      })

      return response
    } catch (error) {
      logger.error('CaseService.deleteComment failed:', error)
      throw error
    }
  }

  /**
   * Get case attachments
   */
  async getAttachments(
    id: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<CaseAttachment>> {
    try {
      const url = this.buildCustomUrl(id, 'attachments')
      const response = await this.client.get<PaginatedResponse<CaseAttachment>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug('CaseService.getAttachments:', { url, id })

      return response
    } catch (error) {
      logger.error('CaseService.getAttachments failed:', error)
      throw error
    }
  }

  /**
   * Upload attachment to case
   */
  async uploadAttachment(
    id: string, 
    file: File, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<CaseAttachment>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('caseId', id)

      const url = this.buildCustomUrl(id, 'attachments')
      const response = await this.client.post<SingleResponse<CaseAttachment>>(url, formData, {
        timeout: options?.timeout,
        headers: {
          ...options?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })

      logger.debug('CaseService.uploadAttachment:', {
        url,
        id,
        fileName: file.name,
        fileSize: file.size,
      })

      return response
    } catch (error) {
      logger.error('CaseService.uploadAttachment failed:', error)
      throw error
    }
  }

  /**
   * Delete case attachment
   */
  async deleteAttachment(
    caseId: string, 
    attachmentId: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{ success: boolean }>> {
    try {
      const url = this.buildCustomUrl(caseId, 'attachments', attachmentId)
      const response = await this.client.delete<SingleResponse<{ success: boolean }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.deleteAttachment:', {
        url,
        caseId,
        attachmentId,
      })

      return response
    } catch (error) {
      logger.error('CaseService.deleteAttachment failed:', error)
      throw error
    }
  }

  /**
   * Get case history
   */
  async getHistory(
    id: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<{
    id: string
    action: string
    timestamp: string
    userId: string
    userName: string
    details: Record<string, any>
  }>> {
    try {
      const url = this.buildCustomUrl(id, 'history')
      const response = await this.client.get<PaginatedResponse<{
        id: string
        action: string
        timestamp: string
        userId: string
        userName: string
        details: Record<string, any>
      }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug('CaseService.getHistory:', { url, id })

      return response
    } catch (error) {
      logger.error('CaseService.getHistory failed:', error)
      throw error
    }
  }

  /**
   * Search cases by status
   */
  async searchByStatus(
    status: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Case>> {
    try {
      const searchParams: SearchParams = {
        filters: { status },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.searchByStatus failed:', error)
      throw error
    }
  }

  /**
   * Search cases by priority
   */
  async searchByPriority(
    priority: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Case>> {
    try {
      const searchParams: SearchParams = {
        filters: { priority },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.searchByPriority failed:', error)
      throw error
    }
  }

  /**
   * Search cases by assignee
   */
  async searchByAssignee(
    assigneeId: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Case>> {
    try {
      const searchParams: SearchParams = {
        filters: { assigneeId },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.searchByAssignee failed:', error)
      throw error
    }
  }

  /**
   * Search cases by requester
   */
  async searchByRequester(
    requesterId: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Case>> {
    try {
      const searchParams: SearchParams = {
        filters: { requesterId },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.searchByRequester failed:', error)
      throw error
    }
  }

  /**
   * Search cases by case type
   */
  async searchByCaseType(
    caseType: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Case>> {
    try {
      const searchParams: SearchParams = {
        filters: { caseType },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.searchByCaseType failed:', error)
      throw error
    }
  }

  /**
   * Get overdue cases
   */
  async getOverdueCases(options?: ApiRequestOptions): Promise<PaginatedResponse<Case>> {
    try {
      const searchParams: SearchParams = {
        filters: { 
          dueDate: { $lt: new Date().toISOString() },
          status: { $ne: 'resolved' }
        },
        pagination: { page: 1, limit: 100 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.getOverdueCases failed:', error)
      throw error
    }
  }

  /**
   * Get cases due soon
   */
  async getCasesDueSoon(
    days: number = 7, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Case>> {
    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + days)

      const searchParams: SearchParams = {
        filters: { 
          dueDate: { $lte: dueDate.toISOString() },
          status: { $ne: 'resolved' }
        },
        pagination: { page: 1, limit: 100 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('CaseService.getCasesDueSoon failed:', error)
      throw error
    }
  }

  /**
   * Get case statistics
   */
  async getStatistics(options?: ApiRequestOptions): Promise<SingleResponse<{
    total: number
    open: number
    inProgress: number
    pendingReview: number
    resolved: number
    closed: number
    overdue: number
    dueSoon: number
  }>> {
    try {
      const url = this.buildCustomUrl('statistics')
      const response = await this.client.get<SingleResponse<{
        total: number
        open: number
        inProgress: number
        pendingReview: number
        resolved: number
        closed: number
        overdue: number
        dueSoon: number
      }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('CaseService.getStatistics:', { url })

      return response
    } catch (error) {
      logger.error('CaseService.getStatistics failed:', error)
      throw error
    }
  }

  /**
   * Bulk update cases
   */
  async bulkUpdate(
    caseIds: string[], 
    updates: Partial<UpdateCaseRequest>, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{ updated: number; failed: number }>> {
    try {
      const url = this.buildCustomUrl('bulk-update')
      const response = await this.client.post<SingleResponse<{ updated: number; failed: number }>>(
        url, 
        { caseIds, updates }, 
        {
          timeout: options?.timeout,
          headers: options?.headers,
        }
      )

      logger.debug('CaseService.bulkUpdate:', {
        url,
        caseIds,
        updates: this.sanitizeData(updates),
      })

      return response
    } catch (error) {
      logger.error('CaseService.bulkUpdate failed:', error)
      throw error
    }
  }

  /**
   * Bulk assign cases
   */
  async bulkAssign(
    caseIds: string[], 
    assigneeId: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{ assigned: number; failed: number }>> {
    try {
      const url = this.buildCustomUrl('bulk-assign')
      const response = await this.client.post<SingleResponse<{ assigned: number; failed: number }>>(
        url, 
        { caseIds, assigneeId }, 
        {
          timeout: options?.timeout,
          headers: options?.headers,
        }
      )

      logger.debug('CaseService.bulkAssign:', {
        url,
        caseIds,
        assigneeId,
      })

      return response
    } catch (error) {
      logger.error('CaseService.bulkAssign failed:', error)
      throw error
    }
  }

  /**
   * Validate case data before creation
   */
  protected validateCreateData(data: CreateCaseRequest): CreateCaseRequest {
    return validateData(schemas.createCase, data)
  }

  /**
   * Validate case data before update
   */
  protected validateUpdateData(data: UpdateCaseRequest): UpdateCaseRequest {
    return validateData(schemas.updateCase, data)
  }

  /**
   * Override create method to include validation
   */
  async create(data: CreateCaseRequest, options?: ApiRequestOptions): Promise<SingleResponse<Case>> {
    const validatedData = this.validateCreateData(data)
    return super.create(validatedData, options)
  }

  /**
   * Override update method to include validation
   */
  async update(id: string, data: UpdateCaseRequest, options?: ApiRequestOptions): Promise<SingleResponse<Case>> {
    const validatedData = this.validateUpdateData(data)
    return super.update(id, validatedData, options)
  }
}

/**
 * Default case service instance
 */
export const caseService = new CaseService()

/**
 * Create case service instance
 */
export function createCaseService(): CaseService {
  return new CaseService()
}
