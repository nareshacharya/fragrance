import { AxiosError, AxiosResponse } from 'axios'
import { ERROR_CODES, ERROR_MESSAGES } from '@/config/constants'

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly timestamp: Date
  public readonly details?: any
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    status: number = 500,
    details?: any,
    originalError?: Error
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.timestamp = new Date()
    this.details = details
    this.originalError = originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED, details?: any) {
    super(message, ERROR_CODES.AUTHENTICATION_ERROR, 401, details)
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN, details?: any) {
    super(message, ERROR_CODES.AUTHORIZATION_ERROR, 403, details)
    this.name = 'AuthorizationError'
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
  public readonly validationErrors: Record<string, string[]>

  constructor(
    message: string = ERROR_MESSAGES.VALIDATION_FAILED,
    validationErrors: Record<string, string[]> = {},
    details?: any
  ) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400, details)
    this.name = 'ValidationError'
    this.validationErrors = validationErrors
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, ERROR_CODES.NOT_FOUND, 404, details)
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, ERROR_CODES.CONFLICT, 409, details)
    this.name = 'ConflictError'
  }
}

/**
 * External API Error
 */
export class ExternalApiError extends ApiError {
  public readonly externalService: string
  public readonly externalStatus?: number

  constructor(
    message: string = ERROR_MESSAGES.EXTERNAL_API_ERROR,
    externalService: string,
    externalStatus?: number,
    details?: any
  ) {
    super(message, ERROR_CODES.EXTERNAL_API_ERROR, 502, details)
    this.name = 'ExternalApiError'
    this.externalService = externalService
    this.externalStatus = externalStatus
  }
}

/**
 * Network Error
 */
export class NetworkError extends ApiError {
  public readonly isRetryable: boolean

  constructor(message: string, isRetryable: boolean = true, details?: any) {
    super(message, ERROR_CODES.EXTERNAL_API_ERROR, 0, details)
    this.name = 'NetworkError'
    this.isRetryable = isRetryable
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends ApiError {
  public readonly timeout: number

  constructor(message: string, timeout: number, details?: any) {
    super(message, ERROR_CODES.EXTERNAL_API_ERROR, 408, details)
    this.name = 'TimeoutError'
    this.timeout = timeout
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter?: number
  public readonly limit?: number
  public readonly remaining?: number

  constructor(
    message: string,
    retryAfter?: number,
    limit?: number,
    remaining?: number,
    details?: any
  ) {
    super(message, ERROR_CODES.EXTERNAL_API_ERROR, 429, details)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
    this.limit = limit
    this.remaining = remaining
  }
}

/**
 * Configuration for retry logic
 */
export interface RetryConfig {
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
  maxRetryDelay: number
  retryableStatusCodes: number[]
  retryableErrorCodes: string[]
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  maxRetryDelay: 30000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrorCodes: [
    ERROR_CODES.EXTERNAL_API_ERROR,
    ERROR_CODES.DATABASE_ERROR,
  ],
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any, config: RetryConfig = defaultRetryConfig): boolean {
  // Network errors are always retryable
  if (error instanceof NetworkError) {
    return error.isRetryable
  }

  // Timeout errors are retryable
  if (error instanceof TimeoutError) {
    return true
  }

  // Rate limit errors are retryable if retryAfter is provided
  if (error instanceof RateLimitError) {
    return error.retryAfter !== undefined
  }

  // Check status codes
  if (error.status && config.retryableStatusCodes.includes(error.status)) {
    return true
  }

  // Check error codes
  if (error.code && config.retryableErrorCodes.includes(error.code)) {
    return true
  }

  // Axios errors
  if (error.isAxiosError) {
    const axiosError = error as AxiosError
    
    // Network errors
    if (!axiosError.response) {
      return true
    }

    // Specific status codes
    if (axiosError.response.status && config.retryableStatusCodes.includes(axiosError.response.status)) {
      return true
    }
  }

  return false
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = defaultRetryConfig
): number {
  const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt - 1)
  return Math.min(delay, config.maxRetryDelay)
}

/**
 * Transform axios error to API error
 */
export function transformAxiosError(error: AxiosError): ApiError {
  const response = error.response
  const request = error.request
  const config = error.config

  // Network error (no response received)
  if (!response && request) {
    return new NetworkError(
      'Network error - no response received from server',
      true,
      {
        url: config?.url,
        method: config?.method,
        timeout: config?.timeout,
      }
    )
  }

  // Request timeout
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return new TimeoutError(
      'Request timeout',
      config?.timeout || 0,
      {
        url: config?.url,
        method: config?.method,
      }
    )
  }

  // HTTP error response
  if (response) {
    const status = response.status
    const data = response.data
    const message = data?.message || data?.error || `HTTP ${status} Error`

    switch (status) {
      case 400:
        if (data?.validationErrors) {
          return new ValidationError(message, data.validationErrors, data)
        }
        return new ValidationError(message, {}, data)

      case 401:
        return new AuthenticationError(message, data)

      case 403:
        return new AuthorizationError(message, data)

      case 404:
        return new NotFoundError(message, data)

      case 409:
        return new ConflictError(message, data)

      case 408:
        return new TimeoutError(message, config?.timeout || 0, data)

      case 429:
        return new RateLimitError(
          message,
          response.headers['retry-after'] ? parseInt(response.headers['retry-after']) : undefined,
          data?.limit,
          data?.remaining,
          data
        )

      case 500:
      case 502:
      case 503:
      case 504:
        return new ExternalApiError(
          message,
          'Pega DX API',
          status,
          data
        )

      default:
        return new ApiError(message, ERROR_CODES.EXTERNAL_API_ERROR, status, data)
    }
  }

  // Unknown error
  return new ApiError(
    error.message || 'Unknown API error',
    ERROR_CODES.EXTERNAL_API_ERROR,
    0,
    {
      url: config?.url,
      method: config?.method,
    },
    error
  )
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error: any): {
  error: {
    code: string
    message: string
    status: number
    timestamp: string
    details?: any
    validationErrors?: Record<string, string[]>
  }
} {
  let apiError: ApiError

  if (error instanceof ApiError) {
    apiError = error
  } else if (error.isAxiosError) {
    apiError = transformAxiosError(error)
  } else {
    apiError = new ApiError(
      error.message || 'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    )
  }

  const response: any = {
    error: {
      code: apiError.code,
      message: apiError.message,
      status: apiError.status,
      timestamp: apiError.timestamp.toISOString(),
    },
  }

  if (apiError.details) {
    response.error.details = apiError.details
  }

  if (apiError instanceof ValidationError && apiError.validationErrors) {
    response.error.validationErrors = apiError.validationErrors
  }

  return response
}

/**
 * Check if error is of specific type
 */
export function isErrorType(error: any, errorType: new (...args: any[]) => ApiError): boolean {
  return error instanceof errorType
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: any): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error.isAxiosError) {
    const axiosError = error as AxiosError
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error
    }
  }

  return error.message || 'An unexpected error occurred'
}

/**
 * Extract error code from various error types
 */
export function getErrorCode(error: any): string {
  if (error instanceof ApiError) {
    return error.code
  }

  if (error.isAxiosError) {
    const axiosError = error as AxiosError
    if (axiosError.response?.data?.code) {
      return axiosError.response.data.code
    }
  }

  return ERROR_CODES.INTERNAL_ERROR
}

/**
 * Extract HTTP status from various error types
 */
export function getErrorStatus(error: any): number {
  if (error instanceof ApiError) {
    return error.status
  }

  if (error.isAxiosError) {
    const axiosError = error as AxiosError
    return axiosError.response?.status || 0
  }

  return 500
}
