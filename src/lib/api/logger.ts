import { isDevelopment, logging } from '@/config/env'

/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * Log entry interface
 */
export interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
  context?: string | undefined
  requestId?: string | undefined
  userId?: string | undefined
}

/**
 * Logger configuration interface
 */
export interface LoggerConfig {
  level: LogLevel
  format: 'json' | 'simple' | 'pretty'
  enableConsole: boolean
  enableFile: boolean
  enableRemote: boolean
  remoteUrl?: string
  sanitizeData: boolean
  excludeFields: string[]
  maxDataSize: number
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: logging.level as LogLevel,
  format: logging.format as 'json' | 'simple' | 'pretty',
  enableConsole: isDevelopment,
  enableFile: false,
  enableRemote: false,
  sanitizeData: true,
  excludeFields: ['password', 'token', 'secret', 'authorization', 'apiKey'],
  maxDataSize: 10000, // 10KB
}

/**
 * Logger class for API operations
 */
export class Logger {
  private config: LoggerConfig
  private logBuffer: LogEntry[] = []
  private maxBufferSize = 100

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: any, context?: string): void {
    this.log('debug', message, data, context)
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any, context?: string): void {
    this.log('info', message, data, context)
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any, context?: string): void {
    this.log('warn', message, data, context)
  }

  /**
   * Error level logging
   */
  error(message: string, data?: any, context?: string): void {
    this.log('error', message, data, context)
  }

  /**
   * Log API request
   */
  logRequest(
    method: string,
    url: string,
    headers?: Record<string, any>,
    data?: any,
    requestId?: string
  ): void {
    this.debug('API Request', {
      method,
      url,
      headers: this.sanitizeHeaders(headers),
      data: this.sanitizeData(data),
      requestId,
    }, 'API_REQUEST')
  }

  /**
   * Log API response
   */
  logResponse(
    method: string,
    url: string,
    status: number,
    headers?: Record<string, any>,
    data?: any,
    duration?: number,
    requestId?: string
  ): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'debug'
    
    this.log(level, 'API Response', {
      method,
      url,
      status,
      headers: this.sanitizeHeaders(headers),
      data: this.sanitizeData(data),
      duration: duration ? `${duration}ms` : undefined,
      requestId,
    }, 'API_RESPONSE')
  }

  /**
   * Log API error
   */
  logError(
    method: string,
    url: string,
    error: any,
    requestId?: string,
    context?: string
  ): void {
    this.error('API Error', {
      method,
      url,
      error: this.sanitizeError(error),
      requestId,
    }, context || 'API_ERROR')
  }

  /**
   * Log authentication events
   */
  logAuth(
    event: 'login' | 'logout' | 'token_refresh' | 'token_expired',
    userId?: string,
    details?: any
  ): void {
    this.info(`Auth: ${event}`, {
      userId,
      details: this.sanitizeData(details),
    }, 'AUTH')
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    const level = duration > 5000 ? 'warn' : duration > 2000 ? 'info' : 'debug'
    
    this.log(level, 'Performance', {
      operation,
      duration: `${duration}ms`,
      metadata: this.sanitizeData(metadata),
    }, 'PERFORMANCE')
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    // Check if we should log this level
    if (!this.shouldLog(level)) {
      return
    }

    const logEntry: LogEntry = {
      level,
      message,
      data: this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      context: context || undefined,
    }

    // Add to buffer
    this.addToBuffer(logEntry)

    // Output to console if enabled
    if (this.config.enableConsole) {
      this.outputToConsole(logEntry)
    }

    // Output to file if enabled
    if (this.config.enableFile) {
      this.outputToFile(logEntry)
    }

    // Send to remote if enabled
    if (this.config.enableRemote) {
      this.sendToRemote(logEntry)
    }
  }

  /**
   * Check if we should log this level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.config.level)
    const messageLevelIndex = levels.indexOf(level)
    
    return messageLevelIndex >= currentLevelIndex
  }

  /**
   * Add log entry to buffer
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry)
    
    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift()
    }
  }

  /**
   * Output log entry to console
   */
  private outputToConsole(entry: LogEntry): void {
    const formatted = this.formatLogEntry(entry)
    
    switch (entry.level) {
      case 'debug':
        console.debug(formatted)
        break
      case 'info':
        console.info(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
        console.error(formatted)
        break
    }
  }

  /**
   * Output log entry to file (placeholder for future implementation)
   */
  private outputToFile(_entry: LogEntry): void {
    // TODO: Implement file logging
    // This would typically write to a log file or use a logging service
  }

  /**
   * Send log entry to remote service (placeholder for future implementation)
   */
  private sendToRemote(_entry: LogEntry): void {
    // TODO: Implement remote logging
    // This would typically send logs to a centralized logging service
    if (this.config.remoteUrl) {
      // Implementation would go here
    }
  }

  /**
   * Format log entry based on configuration
   */
  private formatLogEntry(entry: LogEntry): string {
    switch (this.config.format) {
      case 'json':
        return JSON.stringify(entry)
      
      case 'simple':
        return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`
      
      case 'pretty':
        return this.formatPretty(entry)
      
      default:
        return JSON.stringify(entry)
    }
  }

  /**
   * Format log entry in a pretty format
   */
  private formatPretty(entry: LogEntry): string {
    let output = `[${entry.timestamp}] ${entry.level.toUpperCase()}`
    
    if (entry.context) {
      output += ` [${entry.context}]`
    }
    
    output += `: ${entry.message}`
    
    if (entry.data) {
      output += '\n' + JSON.stringify(entry.data, null, 2)
    }
    
    return output
  }

  /**
   * Sanitize data for logging
   */
  private sanitizeData(data: any): any {
    if (!this.config.sanitizeData || !data || typeof data !== 'object') {
      return this.truncateData(data)
    }

    const sanitized = JSON.parse(JSON.stringify(data))
    
    // Remove sensitive fields
    this.config.excludeFields.forEach(field => {
      this.removeField(sanitized, field)
    })

    return this.truncateData(sanitized)
  }

  /**
   * Remove field from object recursively
   */
  private removeField(obj: any, fieldName: string): void {
    if (Array.isArray(obj)) {
      obj.forEach(item => this.removeField(item, fieldName))
      return
    }

    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (key.toLowerCase().includes(fieldName.toLowerCase())) {
          obj[key] = '[REDACTED]'
        } else {
          this.removeField(obj[key], fieldName)
        }
      })
    }
  }

  /**
   * Sanitize headers
   */
  private sanitizeHeaders(headers?: Record<string, any>): Record<string, any> | undefined {
    if (!headers) {
      return headers
    }

    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token']
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
   * Sanitize error object
   */
  private sanitizeError(error: any): any {
    if (!error) {
      return error
    }

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    return this.sanitizeData(error)
  }

  /**
   * Truncate data if it's too large
   */
  private truncateData(data: any): any {
    if (!data) {
      return data
    }

    const dataStr = JSON.stringify(data)
    if (dataStr.length <= this.config.maxDataSize) {
      return data
    }

    return {
      ...(data as Record<string, any>),
      _truncated: true,
      _originalSize: dataStr.length,
      _message: 'Data truncated for logging',
    }
  }

  /**
   * Get recent log entries
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count)
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.logBuffer = []
  }

  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config }
  }

  /**
   * Create child logger with additional context
   */
  child(context: string): Logger {
    const childLogger = new Logger(this.config)
    
    // Override log method to include context
    const originalLog = childLogger['log'].bind(childLogger)
    childLogger['log'] = (level: LogLevel, message: string, data?: any, contextOverride?: string) => {
      originalLog(level, message, data, contextOverride || context)
    }

    return childLogger
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger()

/**
 * Create logger with custom configuration
 */
export function createLogger(config: Partial<LoggerConfig>): Logger {
  return new Logger(config)
}

/**
 * Create child logger with context
 */
export function createChildLogger(context: string): Logger {
  return logger.child(context)
}

/**
 * Performance timing utility
 */
export class PerformanceTimer {
  private startTime: number
  private operation: string
  private metadata?: Record<string, any>

  constructor(operation: string, metadata?: Record<string, any>) {
    this.operation = operation
    this.metadata = metadata
    this.startTime = Date.now()
  }

  /**
   * End timing and log performance
   */
  end(): number {
    const duration = Date.now() - this.startTime
    logger.logPerformance(this.operation, duration, this.metadata)
    return duration
  }

  /**
   * Get current duration without ending
   */
  getDuration(): number {
    return Date.now() - this.startTime
  }
}

/**
 * Create performance timer
 */
export function createTimer(operation: string, metadata?: Record<string, any>): PerformanceTimer {
  return new PerformanceTimer(operation, metadata)
}

/**
 * Time a function execution
 */
export async function timeExecution<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const timer = createTimer(operation, metadata)
  try {
    const result = await fn()
    timer.end()
    return result
  } catch (error) {
    timer.end()
    throw error
  }
}

// Types are already exported above
