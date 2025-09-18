import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { authService } from './auth'
import { logger } from './logger'
import { transformAxiosError } from './errors'
import { createRetryInterceptor } from './retry'

/**
 * Interceptor configuration
 */
export interface InterceptorConfig {
  enableLogging: boolean
  enableRetry: boolean
  retries: number
  retryDelay: number
}

/**
 * Request interceptor configuration
 */
export interface RequestInterceptorConfig extends InterceptorConfig {
  enableAuth: boolean
  enableRequestId: boolean
  enableTimestamp: boolean
}

/**
 * Response interceptor configuration
 */
export interface ResponseInterceptorConfig extends InterceptorConfig {
  enableResponseLogging: boolean
  enableErrorTransformation: boolean
}

/**
 * Setup request interceptors
 */
export function setupRequestInterceptors(
  client: AxiosInstance,
  config: RequestInterceptorConfig
): void {
  // Authentication interceptor
  if (config.enableAuth) {
    client.interceptors.request.use(
      async (requestConfig: InternalAxiosRequestConfig) => {
        try {
          // Skip adding Authorization header for OAuth endpoints to prevent infinite auth loops
          const AUTH_PATHS = ['/oauth/token', '/oauth/refresh', '/oauth/revoke', '/oauth/userinfo']
          const path = requestConfig.url || ''
          
          if (!AUTH_PATHS.some(p => path.includes(p))) {
            const accessToken = await authService.getAccessToken()
            if (accessToken) {
              requestConfig.headers.Authorization = `Bearer ${accessToken}`
            }
          }
        } catch (error) {
          logger.warn('Failed to get access token:', error)
          // Don't fail the request, let it proceed without auth
        }

        return requestConfig
      },
      (error) => {
        logger.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )
  }

  // Request ID interceptor
  if (config.enableRequestId) {
    client.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        if (!requestConfig.headers['X-Request-ID']) {
          requestConfig.headers['X-Request-ID'] = generateRequestId()
        }
        return requestConfig
      },
      (error) => {
        logger.error('Request ID interceptor error:', error)
        return Promise.reject(error)
      }
    )
  }

  // Timestamp interceptor
  if (config.enableTimestamp) {
    client.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        requestConfig.metadata = {
          ...requestConfig.metadata,
          startTime: Date.now(),
        }
        return requestConfig
      },
      (error) => {
        logger.error('Timestamp interceptor error:', error)
        return Promise.reject(error)
      }
    )
  }

  // Request logging interceptor
  if (config.enableLogging) {
    client.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        logger.debug('API Request:', {
          method: requestConfig.method?.toUpperCase(),
          url: requestConfig.url,
          baseURL: requestConfig.baseURL,
          headers: sanitizeHeaders(requestConfig.headers),
          params: requestConfig.params,
          data: sanitizeData(requestConfig.data),
          timeout: requestConfig.timeout,
        })

        return requestConfig
      },
      (error) => {
        logger.error('Request logging interceptor error:', error)
        return Promise.reject(error)
      }
    )
  }
}

/**
 * Setup response interceptors
 */
export function setupResponseInterceptors(
  client: AxiosInstance,
  config: ResponseInterceptorConfig
): void {
  // Response logging interceptor
  if (config.enableResponseLogging) {
    client.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestConfig = response.config as InternalAxiosRequestConfig
        const duration = requestConfig.metadata?.startTime 
          ? Date.now() - requestConfig.metadata.startTime 
          : undefined

        logger.debug('API Response:', {
          status: response.status,
          statusText: response.statusText,
          method: requestConfig.method?.toUpperCase(),
          url: requestConfig.url,
          duration: duration ? `${duration}ms` : undefined,
          headers: sanitizeHeaders(response.headers),
          data: sanitizeData(response.data),
        })

        return response
      },
      (error) => {
        const requestConfig = error.config as InternalAxiosRequestConfig
        const duration = requestConfig?.metadata?.startTime 
          ? Date.now() - requestConfig.metadata.startTime 
          : undefined

        logger.error('API Error Response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          method: requestConfig?.method?.toUpperCase(),
          url: requestConfig?.url,
          duration: duration ? `${duration}ms` : undefined,
          message: error.message,
          data: error.response?.data,
        })

        return Promise.reject(error)
      }
    )
  }

  // Error transformation interceptor
  if (config.enableErrorTransformation) {
    client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const transformedError = transformAxiosError(error)
        return Promise.reject(transformedError)
      }
    )
  }
}

/**
 * Setup all interceptors
 */
export function setupInterceptors(
  client: AxiosInstance,
  config: InterceptorConfig,
  enableAuth?: boolean
): void {
  const requestConfig: RequestInterceptorConfig = {
    ...config,
    enableAuth: enableAuth ?? true,
    enableRequestId: true,
    enableTimestamp: true,
  }

  const responseConfig: ResponseInterceptorConfig = {
    ...config,
    enableResponseLogging: true,
    enableErrorTransformation: true,
  }

  setupRequestInterceptors(client, requestConfig)
  
  // Add retry interceptor if enabled (before error transformation)
  // IMPORTANT: Retry interceptor must execute before error transformation
  // to ensure retries happen on original errors, not transformed ones
  if (config.enableRetry) {
    createRetryInterceptor({
      maxRetries: config.retries,
      retryDelay: config.retryDelay,
    })(client)
  }
  
  setupResponseInterceptors(client, responseConfig)
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sanitize headers to remove sensitive information
 */
function sanitizeHeaders(headers: any): any {
  if (!headers || typeof headers !== 'object') {
    return headers
  }

  const sensitiveHeaders = [
    'authorization',
    'x-api-key',
    'x-client-secret',
    'cookie',
    'set-cookie',
  ]

  const sanitized = { ...headers }

  sensitiveHeaders.forEach(header => {
    const lowerHeader = header.toLowerCase()
    Object.keys(sanitized).forEach(key => {
      if (key.toLowerCase() === lowerHeader) {
        sanitized[key] = '[REDACTED]'
      }
    })
  })

  return sanitized
}

/**
 * Sanitize request/response data to remove sensitive information
 */
function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data
  }

  const sensitiveFields = [
    'password',
    'client_secret',
    'refresh_token',
    'access_token',
    'authorization',
    'api_key',
    'secret',
    'token',
  ]

  const sanitized = JSON.parse(JSON.stringify(data))

  function sanitizeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject)
    }

    const result: any = {}
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase()
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        result[key] = '[REDACTED]'
      } else {
        result[key] = sanitizeObject(obj[key])
      }
    })

    return result
  }

  return sanitizeObject(sanitized)
}

/**
 * Request metadata interface for storing additional request information
 */
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number
      requestId?: string
      [key: string]: any
    }
  }
}

/**
 * Custom interceptor for adding custom headers
 */
export function addCustomHeaders(headers: Record<string, string>) {
  return (client: AxiosInstance) => {
    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        Object.assign(config.headers, headers)
        return config
      },
      (error) => Promise.reject(error)
    )
  }
}

/**
 * Custom interceptor for request/response transformation
 */
export function addTransformationInterceptor(
  requestTransform?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig,
  responseTransform?: (response: AxiosResponse) => AxiosResponse
) {
  return (client: AxiosInstance) => {
    if (requestTransform) {
      client.interceptors.request.use(
        requestTransform,
        (error) => Promise.reject(error)
      )
    }

    if (responseTransform) {
      client.interceptors.response.use(
        responseTransform,
        (error) => Promise.reject(error)
      )
    }
  }
}


/**
 * Custom interceptor for rate limiting
 */
export function addRateLimitInterceptor(
  rateLimitConfig: {
    maxRequests: number
    windowMs: number
    onRateLimit?: (retryAfter: number) => void
  }
) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>()
  
  return (client: AxiosInstance) => {
    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const key = config.baseURL || 'default'
        const now = Date.now()
        const windowStart = now - rateLimitConfig.windowMs
        
        const current = requestCounts.get(key)
        
        if (!current || current.resetTime < windowStart) {
          requestCounts.set(key, { count: 1, resetTime: now })
          return config
        }
        
        if (current.count >= rateLimitConfig.maxRequests) {
          const retryAfter = current.resetTime + rateLimitConfig.windowMs - now
          
          if (rateLimitConfig.onRateLimit) {
            rateLimitConfig.onRateLimit(retryAfter)
          }
          
          return Promise.reject(new Error(`Rate limit exceeded. Retry after ${retryAfter}ms`))
        }
        
        current.count++
        return config
      },
      (error) => Promise.reject(error)
    )
  }
}
