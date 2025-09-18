import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isValid } from 'date-fns'
import { ThemeMode, ThemeConfig } from '@/types/theme'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date object to a readable format
 */
export function formatDate(
  date: string | Date,
  formatString: string = 'MMM dd, yyyy'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    if (!isValid(dateObj)) {
      throw new Error('Invalid date')
    }
    
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    if (!isValid(dateObj)) {
      throw new Error('Invalid date')
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
    }
    
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'Unknown time'
  }
}

/**
 * Debounce function to limit the rate of function execution
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
 * Throttle function to limit the rate of function execution
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
 * Generate a random ID string
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert a string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  
  return false
}

/**
 * Deep clone an object
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
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await sleep(delay)
      return retry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Check if the current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if the current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle an array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

// Theme-related utility functions

/**
 * Get CSS custom property value for theme colors
 */
export function getThemeColorValue(colorPath: string): string {
  const [color, shade] = colorPath.split('-')
  return `var(--color-${color}-${shade})`
}

/**
 * Generate CSS custom properties for theme
 */
export function generateThemeCSSVariables(theme: ThemeConfig): Record<string, string> {
  const variables: Record<string, string> = {}
  
  // Color variables
  Object.entries(theme.colors).forEach(([colorName, colorValues]) => {
    if (typeof colorValues === 'object' && colorValues !== null) {
      Object.entries(colorValues).forEach(([shade, value]) => {
        variables[`--color-${colorName}-${shade}`] = value
      })
    } else {
      variables[`--color-${colorName}`] = colorValues as string
    }
  })

  // Typography variables
  Object.entries(theme.typography.fontSize).forEach(([size, value]) => {
    variables[`--font-size-${size}`] = value
  })

  Object.entries(theme.typography.fontWeight).forEach(([weight, value]) => {
    variables[`--font-weight-${weight}`] = value.toString()
  })

  // Spacing variables
  Object.entries(theme.spacing).forEach(([space, value]) => {
    variables[`--spacing-${space}`] = value
  })

  // Border radius variables
  Object.entries(theme.borderRadius).forEach(([radius, value]) => {
    variables[`--border-radius-${radius}`] = value
  })

  // Shadow variables
  Object.entries(theme.shadows).forEach(([shadow, value]) => {
    variables[`--shadow-${shadow}`] = value
  })

  return variables
}

/**
 * Apply theme to document root
 */
export function applyThemeToDocument(theme: ThemeConfig, mode: ThemeMode = 'light'): void {
  const root = document.documentElement
  const variables = generateThemeCSSVariables(theme)
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  root.setAttribute('data-theme', mode)
  root.classList.toggle('dark', mode === 'dark')
}

/**
 * Get theme-aware CSS classes
 */
export function getThemeClasses(
  lightClasses: string,
  darkClasses: string,
  theme: ThemeMode = 'light'
): string {
  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  
  return effectiveTheme === 'dark' ? darkClasses : lightClasses
}

/**
 * Merge theme classes with conditional logic
 */
export function mergeThemeClasses(
  baseClasses: string,
  lightClasses?: string,
  darkClasses?: string,
  theme: ThemeMode = 'light'
): string {
  const themeClasses = getThemeClasses(lightClasses || '', darkClasses || '', theme)
  return cn(baseClasses, themeClasses)
}

/**
 * Get theme-specific color value
 */
export function getThemeColor(
  colorName: string,
  shade: string | number = '500'
): string {
  return `var(--color-${colorName}-${shade})`
}

/**
 * Check if theme is dark mode
 */
export function isDarkTheme(theme: ThemeMode): boolean {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme === 'dark'
}

/**
 * Get theme transition classes
 */
export function getThemeTransitionClasses(): string {
  return 'transition-colors duration-300 ease-in-out'
}

/**
 * Validate theme value
 */
export function isValidTheme(value: string): value is ThemeMode {
  return ['light', 'dark', 'system'].includes(value)
}

/**
 * Get theme display name
 */
export function getThemeDisplayName(theme: ThemeMode): string {
  switch (theme) {
    case 'light':
      return 'Light'
    case 'dark':
      return 'Dark'
    case 'system':
      return 'System'
    default:
      return 'Unknown'
  }
}

/**
 * Get theme icon/emoji
 */
export function getThemeIcon(theme: ThemeMode): string {
  switch (theme) {
    case 'light':
      return '☀️'
    case 'dark':
      return '🌙'
    case 'system':
      return '💻'
    default:
      return '🎨'
  }
}

/**
 * Create theme-aware style object
 */
export function createThemeStyles(
  lightStyles: Record<string, string>,
  darkStyles: Record<string, string>,
  theme: ThemeMode = 'light'
): Record<string, string> {
  const effectiveTheme = isDarkTheme(theme) ? 'dark' : 'light'
  return effectiveTheme === 'dark' ? darkStyles : lightStyles
}

/**
 * Get theme-specific CSS variable
 */
export function getCSSVariable(variableName: string): string {
  return `var(--${variableName})`
}

/**
 * Set CSS variable on element
 */
export function setCSSVariable(
  element: HTMLElement,
  variableName: string,
  value: string
): void {
  element.style.setProperty(`--${variableName}`, value)
}

/**
 * Get computed CSS variable value
 */
export function getComputedCSSVariable(
  element: HTMLElement,
  variableName: string
): string {
  return getComputedStyle(element).getPropertyValue(`--${variableName}`).trim()
}

/**
 * Theme-aware className builder
 */
export function buildThemeClassName(
  baseClasses: string,
  theme: ThemeMode,
  options: {
    lightClasses?: string
    darkClasses?: string
    systemClasses?: string
  } = {}
): string {
  const { lightClasses = '', darkClasses = '', systemClasses = '' } = options
  
  switch (theme) {
    case 'light':
      return cn(baseClasses, lightClasses)
    case 'dark':
      return cn(baseClasses, darkClasses)
    case 'system':
      return cn(baseClasses, systemClasses)
    default:
      return baseClasses
  }
}
