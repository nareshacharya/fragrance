import { VALIDATION } from '@/config/constants'
import type { AuthCredentials, User, Permission, AuthError } from './types'

/**
 * Validate email format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!password) {
    errors.push('Password is required')
    return { isValid: false, errors }
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`)
  }

  if (!VALIDATION.PASSWORD_REGEX.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate authentication credentials
 */
export function validateCredentials(credentials: AuthCredentials): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  // Validate email
  const emailValidation = validateEmail(credentials.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!
  }

  // Validate password
  const passwordValidation = validatePassword(credentials.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors.join(', ')
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * chars.length)
    }
  }
  
  return Array.from(array, byte => chars[byte % chars.length]).join('')
}

/**
 * Hash a password (client-side hashing for additional security)
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto) {
    // Fallback for server-side or environments without crypto
    return btoa(password) // Simple base64 encoding (not secure, just for demo)
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .substring(0, 1000) // Limit length
}

/**
 * Check if token is expired
 */
export function isTokenExpired(tokenExpiry: Date): boolean {
  return new Date() >= tokenExpiry
}

/**
 * Check if token expires soon
 */
export function isTokenExpiringSoon(tokenExpiry: Date, minutesThreshold: number = 5): boolean {
  const now = new Date()
  const threshold = new Date(now.getTime() + minutesThreshold * 60 * 1000)
  return tokenExpiry <= threshold
}

/**
 * Format token expiry time
 */
export function formatTokenExpiry(expiry: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60))
  
  if (diffInMinutes <= 0) {
    return 'Expired'
  }
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} remaining`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} remaining`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} remaining`
}

/**
 * Create authentication error
 */
export function createAuthError(
  code: string,
  message: string,
  details?: Record<string, any>
): AuthError {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
  }
}

/**
 * Common authentication error codes
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

/**
 * Create common authentication errors
 */
export const createCommonAuthErrors = {
  invalidCredentials: () => createAuthError(
    AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    'Invalid email or password'
  ),
  
  userNotFound: () => createAuthError(
    AUTH_ERROR_CODES.USER_NOT_FOUND,
    'User not found'
  ),
  
  accountLocked: () => createAuthError(
    AUTH_ERROR_CODES.ACCOUNT_LOCKED,
    'Account is locked. Please contact administrator.'
  ),
  
  tokenExpired: () => createAuthError(
    AUTH_ERROR_CODES.TOKEN_EXPIRED,
    'Authentication token has expired'
  ),
  
  tokenInvalid: () => createAuthError(
    AUTH_ERROR_CODES.TOKEN_INVALID,
    'Invalid authentication token'
  ),
  
  sessionExpired: () => createAuthError(
    AUTH_ERROR_CODES.SESSION_EXPIRED,
    'Session has expired. Please log in again.'
  ),
  
  permissionDenied: (resource?: string, action?: string) => createAuthError(
    AUTH_ERROR_CODES.PERMISSION_DENIED,
    `Access denied${resource ? ` to ${resource}` : ''}${action ? ` (${action})` : ''}`
  ),
  
  networkError: () => createAuthError(
    AUTH_ERROR_CODES.NETWORK_ERROR,
    'Network error. Please check your connection and try again.'
  ),
  
  validationError: (field: string, message: string) => createAuthError(
    AUTH_ERROR_CODES.VALIDATION_ERROR,
    `Validation error: ${field} - ${message}`
  ),
  
  unknownError: (message?: string) => createAuthError(
    AUTH_ERROR_CODES.UNKNOWN_ERROR,
    message || 'An unknown error occurred'
  ),
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: any): error is AuthError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error && 'timestamp' in error
}

/**
 * Format authentication error for display
 */
export function formatAuthError(error: AuthError): string {
  return error.message
}

/**
 * Get user initials from name
 */
export function getUserInitials(user: User): string {
  if (user.displayName) {
    return user.displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }
  
  if (user.name) {
    return user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase()
  }
  
  return 'U'
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User): string {
  if (user.displayName) {
    return user.displayName
  }
  
  if (user.name) {
    return user.name
  }
  
  if (user.preferredUsername) {
    return user.preferredUsername
  }
  
  if (user.email) {
    return user.email.split('@')[0]
  }
  
  return 'Unknown User'
}

/**
 * Check if user has permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.permissions) {
    return false
  }
  
  return user.permissions.some(p => p.id === permission || p.name === permission)
}

/**
 * Check if user has role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user || !user.roles) {
    return false
  }
  
  return user.roles.includes(role)
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user || !user.roles) {
    return false
  }
  
  return roles.some(role => user.roles!.includes(role))
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roles: string[]): boolean {
  if (!user || !user.roles) {
    return false
  }
  
  return roles.every(role => user.roles!.includes(role))
}

/**
 * Check if user can access resource with action
 */
export function canAccess(user: User | null, resource: string, action: string): boolean {
  if (!user || !user.permissions) {
    return false
  }
  
  return user.permissions.some(p => 
    p.resource === resource && (p.action === action || p.action === 'manage')
  )
}

/**
 * Debounce function for input validation
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
 * Throttle function for API calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32)
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Check if running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Get client IP address (for session tracking)
 */
export function getClientIP(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  // This would typically be set by the server
  return (window as any).clientIP || null
}

/**
 * Get user agent string
 */
export function getUserAgent(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  return window.navigator.userAgent
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  )
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  return /iPad|Android(?=.*\bMobile\b)/i.test(window.navigator.userAgent)
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet()
}

/**
 * Format file size for uploads
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate file type for uploads
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size for uploads
 */
export function validateFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes
}

/**
 * Create form data for file upload
 */
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (value instanceof FileList) {
      Array.from(value).forEach(file => {
        formData.append(key, file)
      })
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value))
    }
  })
  
  return formData
}

/**
 * Parse error response from API
 */
export function parseApiError(error: any): AuthError {
  if (isAuthError(error)) {
    return error
  }
  
  if (error?.response?.data) {
    const { code, message, details } = error.response.data
    return createAuthError(
      code || AUTH_ERROR_CODES.UNKNOWN_ERROR,
      message || 'An error occurred',
      details
    )
  }
  
  if (error?.message) {
    return createAuthError(
      AUTH_ERROR_CODES.NETWORK_ERROR,
      error.message
    )
  }
  
  return createCommonAuthErrors.unknownError()
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        break
      }
      
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Create a promise that rejects after timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    }),
  ])
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj)
  } catch {
    return fallback
  }
}
