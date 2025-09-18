import { z } from 'zod'
import { SearchParams, FilterOptions, SortOptions } from './types'

/**
 * URL construction utilities
 */
export class UrlBuilder {
  private baseUrl: string
  private pathSegments: string[] = []
  private queryParams: Record<string, any> = {}

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  /**
   * Add path segment
   */
  addPath(segment: string): UrlBuilder {
    this.pathSegments.push(segment)
    return this
  }

  /**
   * Add multiple path segments
   */
  addPaths(segments: string[]): UrlBuilder {
    this.pathSegments.push(...segments)
    return this
  }

  /**
   * Add query parameter
   */
  addQuery(key: string, value: any): UrlBuilder {
    if (value !== undefined && value !== null) {
      this.queryParams[key] = value
    }
    return this
  }

  /**
   * Add multiple query parameters
   */
  addQueries(params: Record<string, any>): UrlBuilder {
    Object.entries(params).forEach(([key, value]) => {
      this.addQuery(key, value)
    })
    return this
  }

  /**
   * Build the final URL
   */
  build(): string {
    let url = this.baseUrl

    // Add path segments
    if (this.pathSegments.length > 0) {
      const path = this.pathSegments
        .map(segment => segment.replace(/^\/+|\/+$/g, ''))
        .filter(segment => segment.length > 0)
        .join('/')
      
      if (path) {
        url += (url.endsWith('/') ? '' : '/') + path
      }
    }

    // Add query parameters
    if (Object.keys(this.queryParams).length > 0) {
      const searchParams = new URLSearchParams()
      
      Object.entries(this.queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item !== undefined && item !== null) {
              searchParams.append(key, String(item))
            }
          })
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })

      const queryString = searchParams.toString()
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString
      }
    }

    return url
  }

  /**
   * Reset the builder
   */
  reset(): UrlBuilder {
    this.pathSegments = []
    this.queryParams = {}
    return this
  }
}

/**
 * Create URL builder instance
 */
export function createUrlBuilder(baseUrl?: string): UrlBuilder {
  return new UrlBuilder(baseUrl)
}

/**
 * Serialize search parameters to query string
 */
export function serializeSearchParams(params: SearchParams): Record<string, any> {
  const query: Record<string, any> = {}

  // Add query string
  if (params.query) {
    query.q = params.query
  }

  // Add filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query[`filter_${key}`] = value
      }
    })
  }

  // Add sort
  if (params.sort) {
    query.sort = `${params.sort.field}:${params.sort.direction}`
  }

  // Add pagination
  if (params.pagination) {
    query.page = params.pagination.page
    query.limit = params.pagination.limit
  }

  return query
}

/**
 * Deserialize query string to search parameters
 */
export function deserializeSearchParams(query: Record<string, any>): SearchParams {
  const params: SearchParams = {}

  // Extract query string
  if (query.q) {
    params.query = query.q
  }

  // Extract filters
  const filters: Record<string, any> = {}
  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('filter_')) {
      const filterKey = key.replace('filter_', '')
      filters[filterKey] = value
    }
  })
  
  if (Object.keys(filters).length > 0) {
    params.filters = filters
  }

  // Extract sort
  if (query.sort) {
    const [field, direction] = query.sort.split(':')
    if (field && direction) {
      params.sort = {
        field,
        direction: direction as 'asc' | 'desc',
      }
    }
  }

  // Extract pagination
  if (query.page || query.limit) {
    params.pagination = {
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    }
  }

  return params
}

/**
 * Build filter query string
 */
export function buildFilterQuery(filters: FilterOptions[]): Record<string, any> {
  const query: Record<string, any> = {}

  filters.forEach((filter, index) => {
    const prefix = `filter_${index}`
    query[`${prefix}_field`] = filter.field
    query[`${prefix}_operator`] = filter.operator
    query[`${prefix}_value`] = filter.value
  })

  return query
}

/**
 * Parse filter query string
 */
export function parseFilterQuery(query: Record<string, any>): FilterOptions[] {
  const filters: FilterOptions[] = []
  const filterIndices = new Set<number>()

  // Find all filter indices
  Object.keys(query).forEach(key => {
    const match = key.match(/^filter_(\d+)_/)
    if (match) {
      filterIndices.add(parseInt(match[1]))
    }
  })

  // Build filter objects
  filterIndices.forEach(index => {
    const field = query[`filter_${index}_field`]
    const operator = query[`filter_${index}_operator`]
    const value = query[`filter_${index}_value`]

    if (field && operator && value !== undefined) {
      filters.push({
        field,
        operator: operator as FilterOptions['operator'],
        value,
      })
    }
  })

  return filters
}

/**
 * Validate data against Zod schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: Record<string, string[]> = {}
      
      error.errors.forEach(err => {
        const path = err.path.join('.')
        if (!validationErrors[path]) {
          validationErrors[path] = []
        }
        validationErrors[path].push(err.message)
      })

      throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`)
    }
    
    throw error
  }
}

/**
 * Safe validate data against Zod schema (returns null on error)
 */
export function safeValidateData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return validateData(schema, data)
  } catch (error) {
    return null
  }
}

/**
 * Transform response data
 */
export function transformResponseData<T>(
  data: any,
  transformer?: (data: any) => T
): T {
  if (transformer) {
    return transformer(data)
  }
  
  return data as T
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key])
    })
    return cloned
  }

  return obj
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) {
    return target
  }

  const source = sources.shift()
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        }
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
  }

  return deepMerge(target, ...sources)
}

/**
 * Check if value is object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Convert object to FormData
 */
export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData()
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (value instanceof FileList) {
      Array.from(value).forEach(file => {
        formData.append(key, file)
      })
    } else if (Array.isArray(value)) {
      value.forEach(item => {
        formData.append(`${key}[]`, String(item))
      })
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  
  return formData
}

/**
 * Convert FormData to object
 */
export function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {}
  
  formData.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value)
      } else {
        obj[key] = [obj[key], value]
      }
    } else {
      obj[key] = value
    }
  })
  
  return obj
}

/**
 * Create delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
    backoffMultiplier?: number
    retryCondition?: (error: any) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    retryCondition = () => true,
  } = options

  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error
      }
      
      const delayMs = Math.min(
        baseDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      )
      
      await delay(delayMs)
    }
  }
  
  throw lastError
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Format duration to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  
  if (ms < 3600000) {
    return `${(ms / 60000).toFixed(1)}m`
  }
  
  return `${(ms / 3600000).toFixed(1)}h`
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  
  if (Array.isArray(value)) {
    return value.length === 0
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  
  return false
}

/**
 * Check if value is not empty
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value)
}

/**
 * Sanitize string for URL usage
 */
export function sanitizeForUrl(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Create query string from object
 */
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          searchParams.append(key, String(item))
        })
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  return searchParams.toString()
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, any> {
  const params: Record<string, any> = {}
  const searchParams = new URLSearchParams(queryString)
  
  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value)
      } else {
        params[key] = [params[key], value]
      }
    } else {
      params[key] = value
    }
  })
  
  return params
}
