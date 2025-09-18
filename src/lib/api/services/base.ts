import { apiClient } from '../client'
import { endpointBuilder } from '../config'
import { 
  BaseResponse, 
  PaginatedResponse, 
  SingleResponse, 
  SearchParams, 
  ApiRequestOptions,
  CrudService 
} from '../types'
import { createUrlBuilder, serializeSearchParams } from '../utils'
import { logger } from '../logger'

/**
 * Base service class providing common CRUD operations
 */
export abstract class BaseService<T, TCreate, TUpdate> implements CrudService<T, TCreate, TUpdate> {
  protected client = apiClient
  protected urlBuilder = createUrlBuilder()
  protected baseEndpoint: string

  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint
  }

  /**
   * List items with search parameters
   */
  async list(
    params?: SearchParams, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<T>> {
    try {
      const url = this.buildListUrl(params)
      const response = await this.client.get<PaginatedResponse<T>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug(`${this.constructor.name}.list:`, {
        url,
        params,
        resultCount: Array.isArray(response.data) ? response.data.length : 0,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.list failed:`, error)
      throw error
    }
  }

  /**
   * Get single item by ID
   */
  async get(id: string, options?: ApiRequestOptions): Promise<SingleResponse<T>> {
    try {
      const url = this.buildGetUrl(id)
      const response = await this.client.get<SingleResponse<T>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.get:`, {
        url,
        id,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.get failed:`, error)
      throw error
    }
  }

  /**
   * Create new item
   */
  async create(data: TCreate, options?: ApiRequestOptions): Promise<SingleResponse<T>> {
    try {
      const url = this.buildCreateUrl()
      const response = await this.client.post<SingleResponse<T>>(url, data, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.create:`, {
        url,
        data: this.sanitizeData(data),
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.create failed:`, error)
      throw error
    }
  }

  /**
   * Update item by ID
   */
  async update(id: string, data: TUpdate, options?: ApiRequestOptions): Promise<SingleResponse<T>> {
    try {
      const url = this.buildUpdateUrl(id)
      const response = await this.client.put<SingleResponse<T>>(url, data, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.update:`, {
        url,
        id,
        data: this.sanitizeData(data),
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.update failed:`, error)
      throw error
    }
  }

  /**
   * Delete item by ID
   */
  async delete(id: string, options?: ApiRequestOptions): Promise<BaseResponse> {
    try {
      const url = this.buildDeleteUrl(id)
      const response = await this.client.delete<BaseResponse>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.delete:`, {
        url,
        id,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.delete failed:`, error)
      throw error
    }
  }

  /**
   * Search items with custom query
   */
  async search(
    query: string,
    filters?: Record<string, any>,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<T>> {
    try {
      const searchParams: SearchParams = {
        query,
        filters,
        pagination: {
          page: 1,
          limit: 20,
        },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.search failed:`, error)
      throw error
    }
  }

  /**
   * Get items by IDs
   */
  async getByIds(ids: string[], options?: ApiRequestOptions): Promise<T[]> {
    try {
      const promises = ids.map(id => this.get(id, options))
      const responses = await Promise.allSettled(promises)
      
      return responses
        .filter((response): response is PromiseFulfilledResult<SingleResponse<T>> => 
          response.status === 'fulfilled'
        )
        .map(response => response.value.data)
    } catch (error) {
      logger.error(`${this.constructor.name}.getByIds failed:`, error)
      throw error
    }
  }

  /**
   * Check if item exists by ID
   */
  async exists(id: string, options?: ApiRequestOptions): Promise<boolean> {
    try {
      await this.get(id, options)
      return true
    } catch (error: any) {
      if (error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Get count of items
   */
  async count(filters?: Record<string, any>, options?: ApiRequestOptions): Promise<number> {
    try {
      const searchParams: SearchParams = {
        filters,
        pagination: {
          page: 1,
          limit: 1,
        },
      }

      const response = await this.list(searchParams, options)
      return response.pagination.total
    } catch (error) {
      logger.error(`${this.constructor.name}.count failed:`, error)
      throw error
    }
  }

  /**
   * Batch create items
   */
  async batchCreate(items: TCreate[], options?: ApiRequestOptions): Promise<SingleResponse<T>[]> {
    try {
      const promises = items.map(item => this.create(item, options))
      const responses = await Promise.allSettled(promises)
      
      return responses
        .filter((response): response is PromiseFulfilledResult<SingleResponse<T>> => 
          response.status === 'fulfilled'
        )
        .map(response => response.value)
    } catch (error) {
      logger.error(`${this.constructor.name}.batchCreate failed:`, error)
      throw error
    }
  }

  /**
   * Batch update items
   */
  async batchUpdate(
    updates: Array<{ id: string; data: TUpdate }>,
    options?: ApiRequestOptions
  ): Promise<SingleResponse<T>[]> {
    try {
      const promises = updates.map(({ id, data }) => this.update(id, data, options))
      const responses = await Promise.allSettled(promises)
      
      return responses
        .filter((response): response is PromiseFulfilledResult<SingleResponse<T>> => 
          response.status === 'fulfilled'
        )
        .map(response => response.value)
    } catch (error) {
      logger.error(`${this.constructor.name}.batchUpdate failed:`, error)
      throw error
    }
  }

  /**
   * Batch delete items
   */
  async batchDelete(ids: string[], options?: ApiRequestOptions): Promise<BaseResponse[]> {
    try {
      const promises = ids.map(id => this.delete(id, options))
      const responses = await Promise.allSettled(promises)
      
      return responses
        .filter((response): response is PromiseFulfilledResult<BaseResponse> => 
          response.status === 'fulfilled'
        )
        .map(response => response.value)
    } catch (error) {
      logger.error(`${this.constructor.name}.batchDelete failed:`, error)
      throw error
    }
  }

  /**
   * Build URL for list endpoint
   */
  protected buildListUrl(params?: SearchParams): string {
    const url = this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .build()

    if (params) {
      const queryParams = serializeSearchParams(params)
      return this.urlBuilder
        .reset()
        .addPath(this.baseEndpoint)
        .addQueries(queryParams)
        .build()
    }

    return url
  }

  /**
   * Build URL for get endpoint
   */
  protected buildGetUrl(id: string): string {
    return this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .addPath(id)
      .build()
  }

  /**
   * Build URL for create endpoint
   */
  protected buildCreateUrl(): string {
    return this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .build()
  }

  /**
   * Build URL for update endpoint
   */
  protected buildUpdateUrl(id: string): string {
    return this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .addPath(id)
      .build()
  }

  /**
   * Build URL for delete endpoint
   */
  protected buildDeleteUrl(id: string): string {
    return this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .addPath(id)
      .build()
  }

  /**
   * Build URL for custom endpoint
   */
  protected buildCustomUrl(...segments: string[]): string {
    return this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .addPaths(segments)
      .build()
  }

  /**
   * Build URL for custom endpoint with query parameters
   */
  protected buildCustomUrlWithQuery(
    segments: string[],
    queryParams?: Record<string, any>
  ): string {
    const builder = this.urlBuilder
      .reset()
      .addPath(this.baseEndpoint)
      .addPaths(segments)

    if (queryParams) {
      builder.addQueries(queryParams)
    }

    return builder.build()
  }

  /**
   * Sanitize data for logging (remove sensitive information)
   */
  protected sanitizeData(data: any): any {
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

  /**
   * Validate response data
   */
  protected validateResponse<TResponse>(response: TResponse): TResponse {
    if (!response) {
      throw new Error('Empty response received')
    }

    return response
  }

  /**
   * Handle pagination parameters
   */
  protected handlePagination(
    page?: number,
    limit?: number,
    maxLimit: number = 100
  ): { page: number; limit: number } {
    const validPage = Math.max(1, page || 1)
    const validLimit = Math.min(maxLimit, Math.max(1, limit || 20))

    return {
      page: validPage,
      limit: validLimit,
    }
  }

  /**
   * Handle sorting parameters
   */
  protected handleSorting(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): { sortBy: string; sortOrder: 'asc' | 'desc' } | undefined {
    if (!sortBy) {
      return undefined
    }

    return {
      sortBy,
      sortOrder: sortOrder || 'asc',
    }
  }

  /**
   * Handle filtering parameters
   */
  protected handleFiltering(filters?: Record<string, any>): Record<string, any> {
    if (!filters) {
      return {}
    }

    // Remove empty values
    const cleanFilters: Record<string, any> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanFilters[key] = value
      }
    })

    return cleanFilters
  }

  /**
   * Execute request with error handling
   */
  protected async executeRequest<TResponse>(
    request: () => Promise<TResponse>,
    operation: string
  ): Promise<TResponse> {
    try {
      return await request()
    } catch (error) {
      logger.error(`${this.constructor.name}.${operation} failed:`, error)
      throw error
    }
  }

  /**
   * Execute multiple requests in parallel
   */
  protected async executeParallelRequests<TResponse>(
    requests: Array<() => Promise<TResponse>>,
    operation: string
  ): Promise<TResponse[]> {
    try {
      const responses = await Promise.allSettled(requests.map(request => request()))
      
      const fulfilled = responses
        .filter((response): response is PromiseFulfilledResult<TResponse> => 
          response.status === 'fulfilled'
        )
        .map(response => response.value)

      const rejected = responses
        .filter((response): response is PromiseRejectedResult => 
          response.status === 'rejected'
        )

      if (rejected.length > 0) {
        logger.warn(`${this.constructor.name}.${operation} had ${rejected.length} failed requests:`, 
          rejected.map(r => r.reason)
        )
      }

      return fulfilled
    } catch (error) {
      logger.error(`${this.constructor.name}.${operation} failed:`, error)
      throw error
    }
  }
}
