import { BaseService } from './base'
import { 
  DataPage, 
  Report, 
  GenerateReportRequest,
  SingleResponse, 
  PaginatedResponse,
  SearchParams,
  ApiRequestOptions 
} from '../types'
import { schemas } from '../types'
import { validateData } from '../utils'
import { logger } from '../logger'

/**
 * Data service for Pega DX data management and reporting
 */
export class DataService {
  protected client = this.getClient()
  protected baseEndpoint = '/api/v1/data'

  constructor() {}

  /**
   * Get API client instance
   */
  private getClient() {
    // Import here to avoid circular dependency
    const { apiClient } = require('../client')
    return apiClient
  }

  /**
   * Get data page
   */
  async getDataPage(
    name: string, 
    params?: Record<string, any>, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<DataPage>> {
    try {
      const url = this.buildDataPageUrl(name, params)
      const response = await this.client.get<SingleResponse<DataPage>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug('DataService.getDataPage:', {
        url,
        name,
        params,
      })

      return response
    } catch (error) {
      logger.error('DataService.getDataPage failed:', error)
      throw error
    }
  }

  /**
   * Get reports
   */
  async getReports(
    params?: SearchParams, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Report>> {
    try {
      const url = this.buildReportsUrl(params)
      const response = await this.client.get<PaginatedResponse<Report>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug('DataService.getReports:', {
        url,
        params,
      })

      return response
    } catch (error) {
      logger.error('DataService.getReports failed:', error)
      throw error
    }
  }

  /**
   * Generate report
   */
  async generateReport(
    request: GenerateReportRequest, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Report>> {
    try {
      // Validate request data
      const validatedRequest = validateData(schemas.generateReport, request)
      
      const url = this.buildGenerateReportUrl()
      const response = await this.client.post<SingleResponse<Report>>(url, validatedRequest, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.generateReport:', {
        url,
        request: this.sanitizeData(validatedRequest),
      })

      return response
    } catch (error) {
      logger.error('DataService.generateReport failed:', error)
      throw error
    }
  }

  /**
   * Get report by ID
   */
  async getReport(id: string, options?: ApiRequestOptions): Promise<SingleResponse<Report>> {
    try {
      const url = this.buildGetReportUrl(id)
      const response = await this.client.get<SingleResponse<Report>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.getReport:', {
        url,
        id,
      })

      return response
    } catch (error) {
      logger.error('DataService.getReport failed:', error)
      throw error
    }
  }

  /**
   * Download report
   */
  async downloadReport(id: string, options?: ApiRequestOptions): Promise<Blob> {
    try {
      const url = this.buildDownloadReportUrl(id)
      const response = await this.client.get<Blob>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        responseType: 'blob',
      })

      logger.debug('DataService.downloadReport:', {
        url,
        id,
        size: response.size,
      })

      return response
    } catch (error) {
      logger.error('DataService.downloadReport failed:', error)
      throw error
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(
    type: string, 
    params?: Record<string, any>, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{
    type: string
    data: any[]
    metadata: Record<string, any>
    generatedAt: string
  }>> {
    try {
      const url = this.buildAnalyticsUrl(type, params)
      const response = await this.client.get<SingleResponse<{
        type: string
        data: any[]
        metadata: Record<string, any>
        generatedAt: string
      }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.getAnalytics:', {
        url,
        type,
        params,
      })

      return response
    } catch (error) {
      logger.error('DataService.getAnalytics failed:', error)
      throw error
    }
  }

  /**
   * Export data
   */
  async exportData(
    dataType: string, 
    format: 'csv' | 'excel' | 'json' = 'csv',
    filters?: Record<string, any>, 
    options?: ApiRequestOptions
  ): Promise<Blob> {
    try {
      const url = this.buildExportUrl(dataType, format, filters)
      const response = await this.client.get<Blob>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        responseType: 'blob',
      })

      logger.debug('DataService.exportData:', {
        url,
        dataType,
        format,
        filters,
        size: response.size,
      })

      return response
    } catch (error) {
      logger.error('DataService.exportData failed:', error)
      throw error
    }
  }

  /**
   * Import data
   */
  async importData(
    dataType: string, 
    file: File, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{
    imported: number
    failed: number
    errors: Array<{ row: number; error: string }>
  }>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('dataType', dataType)

      const url = this.buildImportUrl()
      const response = await this.client.post<SingleResponse<{
        imported: number
        failed: number
        errors: Array<{ row: number; error: string }>
      }>>(url, formData, {
        timeout: options?.timeout,
        headers: {
          ...options?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })

      logger.debug('DataService.importData:', {
        url,
        dataType,
        fileName: file.name,
        fileSize: file.size,
      })

      return response
    } catch (error) {
      logger.error('DataService.importData failed:', error)
      throw error
    }
  }

  /**
   * Validate data
   */
  async validateData(
    dataType: string, 
    data: any[], 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{
    valid: number
    invalid: number
    errors: Array<{ row: number; field: string; error: string }>
  }>> {
    try {
      const url = this.buildValidateUrl()
      const response = await this.client.post<SingleResponse<{
        valid: number
        invalid: number
        errors: Array<{ row: number; field: string; error: string }>
      }>>(url, { dataType, data }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.validateData:', {
        url,
        dataType,
        recordCount: data.length,
      })

      return response
    } catch (error) {
      logger.error('DataService.validateData failed:', error)
      throw error
    }
  }

  /**
   * Get available data pages
   */
  async getAvailableDataPages(options?: ApiRequestOptions): Promise<SingleResponse<Array<{
    name: string
    description: string
    parameters: Array<{
      name: string
      type: string
      required: boolean
      description: string
    }>
  }>>> {
    try {
      const url = this.buildAvailableDataPagesUrl()
      const response = await this.client.get<SingleResponse<Array<{
        name: string
        description: string
        parameters: Array<{
          name: string
          type: string
          required: boolean
          description: string
        }>
      }>>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.getAvailableDataPages:', { url })

      return response
    } catch (error) {
      logger.error('DataService.getAvailableDataPages failed:', error)
      throw error
    }
  }

  /**
   * Get available report types
   */
  async getAvailableReportTypes(options?: ApiRequestOptions): Promise<SingleResponse<Array<{
    type: string
    name: string
    description: string
    parameters: Array<{
      name: string
      type: string
      required: boolean
      description: string
      defaultValue?: any
    }>
    supportedFormats: string[]
  }>>> {
    try {
      const url = this.buildAvailableReportTypesUrl()
      const response = await this.client.get<SingleResponse<Array<{
        type: string
        name: string
        description: string
        parameters: Array<{
          name: string
          type: string
          required: boolean
          description: string
          defaultValue?: any
        }>
        supportedFormats: string[]
      }>>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.getAvailableReportTypes:', { url })

      return response
    } catch (error) {
      logger.error('DataService.getAvailableReportTypes failed:', error)
      throw error
    }
  }

  /**
   * Get data page metadata
   */
  async getDataPageMetadata(
    name: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{
    name: string
    description: string
    dataType: string
    parameters: Array<{
      name: string
      type: string
      required: boolean
      description: string
      defaultValue?: any
    }>
    columns: Array<{
      name: string
      type: string
      description: string
    }>
  }>> {
    try {
      const url = this.buildDataPageMetadataUrl(name)
      const response = await this.client.get<SingleResponse<{
        name: string
        description: string
        dataType: string
        parameters: Array<{
          name: string
          type: string
          required: boolean
          description: string
          defaultValue?: any
        }>
        columns: Array<{
          name: string
          type: string
          description: string
        }>
      }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('DataService.getDataPageMetadata:', {
        url,
        name,
      })

      return response
    } catch (error) {
      logger.error('DataService.getDataPageMetadata failed:', error)
      throw error
    }
  }

  /**
   * Build data page URL
   */
  private buildDataPageUrl(name: string, params?: Record<string, any>): string {
    let url = `${this.baseEndpoint}/pages/${name}`
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
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
   * Build reports URL
   */
  private buildReportsUrl(params?: SearchParams): string {
    let url = `${this.baseEndpoint}/reports`
    
    if (params) {
      const searchParams = new URLSearchParams()
      
      if (params.query) {
        searchParams.append('q', params.query)
      }
      
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          searchParams.append(`filter_${key}`, String(value))
        })
      }
      
      if (params.sort) {
        searchParams.append('sort', `${params.sort.field}:${params.sort.direction}`)
      }
      
      if (params.pagination) {
        searchParams.append('page', String(params.pagination.page))
        searchParams.append('limit', String(params.pagination.limit))
      }
      
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    return url
  }

  /**
   * Build generate report URL
   */
  private buildGenerateReportUrl(): string {
    return `${this.baseEndpoint}/reports/generate`
  }

  /**
   * Build get report URL
   */
  private buildGetReportUrl(id: string): string {
    return `${this.baseEndpoint}/reports/${id}`
  }

  /**
   * Build download report URL
   */
  private buildDownloadReportUrl(id: string): string {
    return `${this.baseEndpoint}/reports/${id}/download`
  }

  /**
   * Build analytics URL
   */
  private buildAnalyticsUrl(type: string, params?: Record<string, any>): string {
    let url = `${this.baseEndpoint}/analytics/${type}`
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
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
   * Build export URL
   */
  private buildExportUrl(
    dataType: string, 
    format: string, 
    filters?: Record<string, any>
  ): string {
    let url = `${this.baseEndpoint}/export/${dataType}/${format}`
    
    if (filters) {
      const searchParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
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
   * Build import URL
   */
  private buildImportUrl(): string {
    return `${this.baseEndpoint}/import`
  }

  /**
   * Build validate URL
   */
  private buildValidateUrl(): string {
    return `${this.baseEndpoint}/validate`
  }

  /**
   * Build available data pages URL
   */
  private buildAvailableDataPagesUrl(): string {
    return `${this.baseEndpoint}/pages/available`
  }

  /**
   * Build available report types URL
   */
  private buildAvailableReportTypesUrl(): string {
    return `${this.baseEndpoint}/reports/types`
  }

  /**
   * Build data page metadata URL
   */
  private buildDataPageMetadataUrl(name: string): string {
    return `${this.baseEndpoint}/pages/${name}/metadata`
  }

  /**
   * Sanitize data for logging
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization']
    const sanitized = { ...data }

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    })

    return sanitized
  }
}

/**
 * Default data service instance
 */
export const dataService = new DataService()

/**
 * Create data service instance
 */
export function createDataService(): DataService {
  return new DataService()
}
