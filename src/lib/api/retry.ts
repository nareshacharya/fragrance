import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isRetryableError, calculateRetryDelay, RetryConfig, defaultRetryConfig } from './errors'
import { logger } from './logger'

/**
 * Retry strategy interface
 */
export interface RetryStrategy {
  shouldRetry(error: any, attempt: number, config: RetryConfig): boolean
  getDelay(attempt: number, config: RetryConfig): number
  getMaxRetries(config: RetryConfig): number
}

/**
 * Exponential backoff retry strategy
 */
export class ExponentialBackoffStrategy implements RetryStrategy {
  shouldRetry(error: any, attempt: number, config: RetryConfig): boolean {
    return attempt <= config.maxRetries && isRetryableError(error, config)
  }

  getDelay(attempt: number, config: RetryConfig): number {
    return calculateRetryDelay(attempt, config)
  }

  getMaxRetries(config: RetryConfig): number {
    return config.maxRetries
  }
}

/**
 * Linear backoff retry strategy
 */
export class LinearBackoffStrategy implements RetryStrategy {
  shouldRetry(error: any, attempt: number, config: RetryConfig): boolean {
    return attempt <= config.maxRetries && isRetryableError(error, config)
  }

  getDelay(attempt: number, config: RetryConfig): number {
    return config.retryDelay * attempt
  }

  getMaxRetries(config: RetryConfig): number {
    return config.maxRetries
  }
}

/**
 * Fixed delay retry strategy
 */
export class FixedDelayStrategy implements RetryStrategy {
  shouldRetry(error: any, _attempt: number, config: RetryConfig): boolean {
    return _attempt <= config.maxRetries && isRetryableError(error, config)
  }

  getDelay(_attempt: number, config: RetryConfig): number {
    return config.retryDelay
  }

  getMaxRetries(config: RetryConfig): number {
    return config.maxRetries
  }
}

/**
 * Circuit breaker retry strategy
 */
export class CircuitBreakerStrategy implements RetryStrategy {
  private failureCount = 0
  private lastFailureTime = 0
  private circuitOpen = false
  private readonly failureThreshold: number
  private readonly recoveryTimeout: number

  constructor(failureThreshold: number = 5, recoveryTimeout: number = 60000) {
    this.failureThreshold = failureThreshold
    this.recoveryTimeout = recoveryTimeout
  }

  shouldRetry(error: any, attempt: number, config: RetryConfig): boolean {
    const now = Date.now()
    
    // Check if circuit breaker should be opened
    if (this.failureCount >= this.failureThreshold) {
      this.circuitOpen = true
      this.lastFailureTime = now
    }

    // Check if circuit breaker should be closed
    if (this.circuitOpen && (now - this.lastFailureTime) > this.recoveryTimeout) {
      this.circuitOpen = false
      this.failureCount = 0
    }

    // Don't retry if circuit is open
    if (this.circuitOpen) {
      logger.warn('Circuit breaker is open, not retrying', {
        failureCount: this.failureCount,
        lastFailureTime: this.lastFailureTime,
        recoveryTimeout: this.recoveryTimeout,
      })
      return false
    }

    // Increment failure count
    if (error) {
      this.failureCount++
    }

    return attempt <= config.maxRetries && isRetryableError(error, config)
  }

  getDelay(attempt: number, config: RetryConfig): number {
    return calculateRetryDelay(attempt, config)
  }

  getMaxRetries(config: RetryConfig): number {
    return config.maxRetries
  }

  reset(): void {
    this.failureCount = 0
    this.lastFailureTime = 0
    this.circuitOpen = false
  }
}

/**
 * Retry options interface
 */
export interface RetryOptions {
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
  maxRetryDelay: number
  retryableStatusCodes: number[]
  retryableErrorCodes: string[]
  strategy?: RetryStrategy
  onRetry?: (attempt: number, error: any) => void
  onMaxRetries?: (error: any) => void
}

/**
 * Default retry options
 */
export const defaultRetryOptions: RetryOptions = {
  ...defaultRetryConfig,
  strategy: new ExponentialBackoffStrategy(),
}

/**
 * Retry utility class
 */
export class RetryUtil {
  private config: RetryConfig
  public strategy: RetryStrategy
  private onRetry?: ((attempt: number, error: any) => void) | undefined
  private onMaxRetries?: ((error: any) => void) | undefined

  constructor(options: Partial<RetryOptions> = {}) {
    const opts = { ...defaultRetryOptions, ...options }
    this.config = {
      maxRetries: opts.maxRetries,
      retryDelay: opts.retryDelay,
      backoffMultiplier: opts.backoffMultiplier,
      maxRetryDelay: opts.maxRetryDelay,
      retryableStatusCodes: opts.retryableStatusCodes,
      retryableErrorCodes: opts.retryableErrorCodes,
    }
    this.strategy = opts.strategy ?? new ExponentialBackoffStrategy()
    this.onRetry = opts.onRetry
    this.onMaxRetries = opts.onMaxRetries
  }

  /**
   * Retry a function with the configured strategy
   */
  async retry<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    let lastError: any
    const startTime = Date.now()

    for (let attempt = 1; attempt <= this.config.maxRetries + 1; attempt++) {
      try {
        const result = await fn()
        
        // Log success if we had previous failures
        if (attempt > 1) {
          logger.info('Retry successful', {
            attempt,
            totalAttempts: attempt,
            duration: Date.now() - startTime,
            context,
          })
        }

        return result
      } catch (error) {
        lastError = error

        // Check if we should retry
        if (!this.strategy.shouldRetry(error, attempt, this.config)) {
          if (attempt === this.config.maxRetries + 1) {
            logger.error('Max retries exceeded', {
              maxRetries: this.config.maxRetries,
              totalAttempts: attempt,
              duration: Date.now() - startTime,
              context,
              error: this.sanitizeError(error),
            })

            if (this.onMaxRetries) {
              this.onMaxRetries(error)
            }
          }
          break
        }

        // Calculate delay for next attempt
        const delay = this.strategy.getDelay(attempt, this.config)
        
        logger.warn('Retrying after error', {
          attempt,
          maxRetries: this.config.maxRetries,
          delay,
          duration: Date.now() - startTime,
          context,
          error: this.sanitizeError(error),
        })

        // Call retry callback
        if (this.onRetry) {
          this.onRetry(attempt, error)
        }

        // Wait before retry
        if (attempt <= this.config.maxRetries) {
          await this.delay(delay)
        }
      }
    }

    throw lastError
  }

  /**
   * Retry an axios request
   */
  async retryRequest(
    client: any,
    config: AxiosRequestConfig,
    context?: string
  ): Promise<AxiosResponse> {
    return this.retry(async () => {
      return await client.request(config)
    }, context)
  }

  /**
   * Create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Sanitize error for logging
   */
  private sanitizeError(error: any): any {
    if (!error) {
      return error
    }

    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      return {
        name: 'AxiosError',
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        code: error.code,
      }
    }

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    return error
  }

  /**
   * Update retry configuration
   */
  updateConfig(config: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Update retry strategy
   */
  updateStrategy(strategy: RetryStrategy): void {
    this.strategy = strategy
  }

  /**
   * Get current configuration
   */
  getConfig(): RetryConfig {
    return { ...this.config }
  }

  /**
   * Reset strategy state (useful for circuit breaker)
   */
  reset(): void {
    if (this.strategy instanceof CircuitBreakerStrategy) {
      this.strategy.reset()
    }
  }
}

/**
 * Default retry utility instance
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const retryUtil = new RetryUtil()

/**
 * Create retry utility with custom configuration
 */
export function createRetryUtil(options: Partial<RetryOptions>): RetryUtil {
  return new RetryUtil(options)
}

/**
 * Retry function with default configuration
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options?: Partial<RetryOptions>,
  context?: string
): Promise<T> {
  const retryUtil = new RetryUtil(options)
  return retryUtil.retry(fn, context)
}

/**
 * Retry axios request with default configuration
 */
export async function retryRequest(
  client: any,
  config: AxiosRequestConfig,
  options?: Partial<RetryOptions>,
  context?: string
): Promise<AxiosResponse> {
  const retryUtil = new RetryUtil(options)
  return retryUtil.retryRequest(client, config, context)
}

/**
 * Create retry interceptor for axios
 */
export function createRetryInterceptor(options: Partial<RetryOptions> = {}) {
  const retryUtil = new RetryUtil(options)

  return (client: any) => {
    client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { __retryCount?: number }
        
        if (!config) {
          return Promise.reject(error)
        }

        config.__retryCount = config.__retryCount || 0

        // Check if we should retry
        if (!retryUtil.strategy.shouldRetry(error, config.__retryCount + 1, retryUtil.getConfig())) {
          return Promise.reject(error)
        }

        config.__retryCount += 1

        // Calculate delay
        const delay = retryUtil.strategy.getDelay(config.__retryCount, retryUtil.getConfig())

        logger.debug('Retrying request', {
          attempt: config.__retryCount,
          maxRetries: retryUtil.getConfig().maxRetries,
          delay,
          url: config.url,
          method: config.method,
        })

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay))

        // Retry the request
        return client.request(config)
      }
    )
  }
}

/**
 * Create retry middleware for express-like frameworks
 */
export function createRetryMiddleware(options: Partial<RetryOptions> = {}) {
  const retryUtil = new RetryUtil(options)

  return (req: any, res: any, next: any) => {
    const originalSend = res.send
    let retryCount = 0

    res.send = function(data: any) {
      if (retryCount === 0) {
        return originalSend.call(this, data)
      }

      logger.debug('Retrying middleware', {
        attempt: retryCount,
        url: req.url,
        method: req.method,
      })

      return originalSend.call(this, data)
    }

    next()
  }
}

/**
 * Retry strategies factory
 */
export const RetryStrategies = {
  exponentialBackoff: (_config?: Partial<RetryConfig>) => 
    new ExponentialBackoffStrategy(),
  
  linearBackoff: (_config?: Partial<RetryConfig>) => 
    new LinearBackoffStrategy(),
  
  fixedDelay: (_config?: Partial<RetryConfig>) => 
    new FixedDelayStrategy(),
  
  circuitBreaker: (failureThreshold?: number, recoveryTimeout?: number) => 
    new CircuitBreakerStrategy(failureThreshold, recoveryTimeout),
}

// Types are already exported above
