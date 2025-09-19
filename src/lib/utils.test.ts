import {
  cn,
  formatDate,
  formatRelativeTime,
  debounce,
  throttle,
  generateId,
  capitalize,
  toTitleCase,
  truncateText,
  isEmpty,
  deepClone,
  sleep,
  retry,
  formatFileSize,
  isValidEmail,
  isValidUrl,
  getInitials,
  camelToKebab,
  kebabToCamel,
  isDevelopment,
  isProduction,
  getRandomItem,
  shuffle,
  getThemeColorValue,
  generateThemeCSSVariables,
  applyThemeToDocument,
  getThemeClasses,
  mergeThemeClasses,
  getThemeColor,
  isDarkTheme,
  getThemeTransitionClasses,
  isValidTheme,
  getThemeDisplayName,
  getThemeIcon,
  createThemeStyles,
  getCSSVariable,
  setCSSVariable,
  getComputedCSSVariable,
  buildThemeClassName,
} from './utils'
import { ThemeMode, ThemeConfig } from '@/types/theme'

// Mock environment variables
const originalEnv = process.env.NODE_ENV

// Mock DOM methods (only if document is available)
if (typeof document !== 'undefined') {
  Object.defineProperty(document, 'documentElement', {
    value: {
      style: {
        setProperty: jest.fn(),
      },
      setAttribute: jest.fn(),
      classList: {
        toggle: jest.fn(),
      },
    },
  })
}

// Mock window.matchMedia (only if window is available)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  })
}

// Mock window.getComputedStyle (only if window is available)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'getComputedStyle', {
    value: jest.fn(() => ({
      getPropertyValue: jest.fn(() => ''),
    })),
  })
}

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toBeDefined()
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', { 'conditional-class': true, 'hidden-class': false })
      expect(result).toBeDefined()
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBeDefined()
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2023-01-01T00:00:00Z')
      expect(result).toBeDefined()
      expect(result).not.toBe('Invalid Date')
    })

    it('should format Date object correctly', () => {
      const date = new Date('2023-01-01T00:00:00Z')
      const result = formatDate(date)
      expect(result).toBeDefined()
      expect(result).not.toBe('Invalid Date')
    })

    it('should use custom format string', () => {
      const result = formatDate('2023-01-01T00:00:00Z', 'yyyy-MM-dd')
      expect(result).toBeDefined()
      expect(result).not.toBe('Invalid Date')
    })

    it('should handle invalid date', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('Invalid Date')
    })

    it('should handle null/undefined', () => {
      const result1 = formatDate(null as any)
      const result2 = formatDate(undefined as any)
      expect(result1).toBe('Invalid Date')
      expect(result2).toBe('Invalid Date')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-01-01T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should format "just now" for recent times', () => {
      const recentTime = new Date('2023-01-01T11:59:30Z')
      const result = formatRelativeTime(recentTime)
      expect(result).toBe('Just now')
    })

    it('should format minutes ago', () => {
      const time = new Date('2023-01-01T11:30:00Z')
      const result = formatRelativeTime(time)
      expect(result).toBe('30 minutes ago')
    })

    it('should format hours ago', () => {
      const time = new Date('2023-01-01T10:00:00Z')
      const result = formatRelativeTime(time)
      expect(result).toBe('2 hours ago')
    })

    it('should format days ago', () => {
      const time = new Date('2022-12-30T12:00:00Z')
      const result = formatRelativeTime(time)
      expect(result).toBe('2 days ago')
    })

    it('should format weeks ago', () => {
      const time = new Date('2022-12-18T12:00:00Z')
      const result = formatRelativeTime(time)
      expect(result).toBe('2 weeks ago')
    })

    it('should format months ago', () => {
      const time = new Date('2022-11-01T12:00:00Z')
      const result = formatRelativeTime(time)
      expect(result).toBe('2 months ago')
    })

    it('should format years ago', () => {
      const time = new Date('2021-01-01T12:00:00Z')
      const result = formatRelativeTime(time)
      expect(result).toBe('1 year ago')
    })

    it('should handle invalid date', () => {
      const result = formatRelativeTime('invalid-date')
      expect(result).toBe('Unknown time')
    })

    it('should handle plural forms correctly', () => {
      const time1 = new Date('2023-01-01T11:59:00Z')
      const time2 = new Date('2023-01-01T11:58:00Z')
      
      const result1 = formatRelativeTime(time1)
      const result2 = formatRelativeTime(time2)
      
      expect(result1).toBe('1 minute ago')
      expect(result2).toBe('2 minutes ago')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg3')
    })

    it('should clear previous timeout on new calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      jest.advanceTimersByTime(50)
      debouncedFn('arg2')
      jest.advanceTimersByTime(50)

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(50)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg2')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should throttle function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('arg1')
      throttledFn('arg2')
      throttledFn('arg3')

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg1')

      jest.advanceTimersByTime(100)

      throttledFn('arg4')
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenCalledWith('arg4')
    })
  })

  describe('generateId', () => {
    it('should generate ID with default length', () => {
      const id = generateId()
      expect(id).toHaveLength(8)
      expect(/^[A-Za-z0-9]+$/.test(id)).toBe(true)
    })

    it('should generate ID with custom length', () => {
      const id = generateId(12)
      expect(id).toHaveLength(12)
      expect(/^[A-Za-z0-9]+$/.test(id)).toBe(true)
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
      expect(capitalize('hELLo')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
      expect(capitalize('A')).toBe('A')
    })
  })

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World')
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
      expect(toTitleCase('hELLo WoRLd')).toBe('Hello World')
    })

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('')
    })

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated'
      const result = truncateText(text, 20)
      expect(result).toBe('This is a very long...')
    })

    it('should not truncate short text', () => {
      const text = 'Short text'
      const result = truncateText(text, 20)
      expect(result).toBe('Short text')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      const result = truncateText(text, 20)
      expect(result).toBe('Exactly twenty chars')
    })

    it('should handle empty string', () => {
      const result = truncateText('', 10)
      expect(result).toBe('')
    })
  })

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false)
    })

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('should return false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false)
    })

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty object', () => {
      expect(isEmpty({ key: 'value' })).toBe(false)
    })

    it('should return false for numbers', () => {
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(42)).toBe(false)
    })

    it('should return false for booleans', () => {
      expect(isEmpty(false)).toBe(false)
      expect(isEmpty(true)).toBe(false)
    })
  })

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(null)).toBe(null)
    })

    it('should clone arrays', () => {
      const original = [1, 2, 3]
      const cloned = deepClone(original)
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })

    it('should clone objects', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = deepClone(original)
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
    })

    it('should clone nested structures', () => {
      const original = {
        a: 1,
        b: [2, 3, { c: 4 }],
        d: { e: { f: 5 } }
      }
      const cloned = deepClone(original)
      expect(cloned).toEqual(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.b[2]).not.toBe(original.b[2])
      expect(cloned.d.e).not.toBe(original.d.e)
    })

    it('should clone dates', () => {
      const original = new Date('2023-01-01')
      const cloned = deepClone(original)
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned instanceof Date).toBe(true)
    })
  })

  describe('sleep', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should sleep for specified time', async () => {
      const promise = sleep(1000)
      jest.advanceTimersByTime(1000)
      await expect(promise).resolves.toBeUndefined()
    })
  })

  describe('retry', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should retry failed operations', async () => {
      let attempts = 0
      const mockFn = jest.fn().mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          throw new Error('Failed')
        }
        return 'success'
      })

      const promise = retry(mockFn, 3, 100)
      jest.advanceTimersByTime(300)
      const result = await promise

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should throw error after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'))

      const promise = retry(mockFn, 2, 100)
      jest.advanceTimersByTime(200)
      
      await expect(promise).rejects.toThrow('Always fails')
      expect(mockFn).toHaveBeenCalledTimes(3) // initial + 2 retries
    })

    it('should succeed on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue('success')

      const result = await retry(mockFn, 3, 100)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB')
    })

    it('should format decimal sizes', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('test.example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true)
      expect(isValidUrl('https://example.com:8080/path?query=value')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('invalid-url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Jane Smith Wilson')).toBe('JS')
      expect(getInitials('A')).toBe('A')
      expect(getInitials('')).toBe('')
    })

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('should handle multiple spaces', () => {
      expect(getInitials('John   Doe')).toBe('JD')
    })
  })

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('camelCase')).toBe('camel-case')
      expect(camelToKebab('myVariableName')).toBe('my-variable-name')
      expect(camelToKebab('XMLHttpRequest')).toBe('x-m-l-http-request')
    })

    it('should handle already kebab-case', () => {
      expect(camelToKebab('already-kebab')).toBe('already-kebab')
    })
  })

  describe('kebabToCamel', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(kebabToCamel('kebab-case')).toBe('kebabCase')
      expect(kebabToCamel('my-variable-name')).toBe('myVariableName')
      expect(kebabToCamel('xml-http-request')).toBe('xmlHttpRequest')
    })

    it('should handle already camelCase', () => {
      expect(kebabToCamel('alreadyCamel')).toBe('alreadyCamel')
    })
  })

  describe('Environment checks', () => {
    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development'
      expect(isDevelopment()).toBe(true)
      expect(isProduction()).toBe(false)
    })

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production'
      expect(isDevelopment()).toBe(false)
      expect(isProduction()).toBe(true)
    })
  })

  describe('getRandomItem', () => {
    it('should return random item from array', () => {
      const array = [1, 2, 3, 4, 5]
      const item = getRandomItem(array)
      expect(array).toContain(item)
    })

    it('should return undefined for empty array', () => {
      expect(getRandomItem([])).toBeUndefined()
    })
  })

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffle(original)
      
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled).not.toBe(original)
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('should not mutate original array', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffle(original)
      
      expect(original).toEqual([1, 2, 3, 4, 5])
      expect(shuffled).not.toBe(original)
    })

    it('should handle empty array', () => {
      expect(shuffle([])).toEqual([])
    })
  })

  describe('Theme utilities', () => {
    const mockTheme: ThemeConfig = {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: '#6b7280',
      },
      typography: {
        fontSize: {
          sm: '14px',
          lg: '18px',
        },
        fontWeight: {
          normal: 400,
          bold: 700,
        },
      },
      spacing: {
        sm: '8px',
        lg: '32px',
      },
      borderRadius: {
        sm: '4px',
        lg: '12px',
      },
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    }

    describe('getThemeColorValue', () => {
      it('should generate CSS variable for color', () => {
        expect(getThemeColorValue('primary-500')).toBe('var(--color-primary-500)')
        expect(getThemeColorValue('secondary')).toBe('var(--color-secondary)')
      })
    })

    describe('generateThemeCSSVariables', () => {
      it('should generate CSS variables from theme config', () => {
        const variables = generateThemeCSSVariables(mockTheme)
        
        expect(variables['--color-primary-50']).toBe('#f0f9ff')
        expect(variables['--color-primary-500']).toBe('#3b82f6')
        expect(variables['--color-secondary']).toBe('#6b7280')
        expect(variables['--font-size-sm']).toBe('14px')
        expect(variables['--font-weight-normal']).toBe('400')
        expect(variables['--spacing-sm']).toBe('8px')
        expect(variables['--border-radius-sm']).toBe('4px')
        expect(variables['--shadow-sm']).toBe('0 1px 2px rgba(0, 0, 0, 0.05)')
      })
    })

    describe('applyThemeToDocument', () => {
      it('should apply theme to document', () => {
        applyThemeToDocument(mockTheme, 'dark')
        
        expect(document.documentElement.style.setProperty).toHaveBeenCalled()
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
        expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true)
      })
    })

    describe('getThemeClasses', () => {
      it('should return light classes for light theme', () => {
        const result = getThemeClasses('light-class', 'dark-class', 'light')
        expect(result).toBe('light-class')
      })

      it('should return dark classes for dark theme', () => {
        const result = getThemeClasses('light-class', 'dark-class', 'dark')
        expect(result).toBe('dark-class')
      })

      it('should handle system theme', () => {
        const result = getThemeClasses('light-class', 'dark-class', 'system')
        expect(result).toBe('light-class') // default to light when system preference is light
      })
    })

    describe('mergeThemeClasses', () => {
      it('should merge theme classes', () => {
        const result = mergeThemeClasses('base', 'light', 'dark', 'light')
        expect(result).toBeDefined()
      })
    })

    describe('getThemeColor', () => {
      it('should get theme color CSS variable', () => {
        expect(getThemeColor('primary', '500')).toBe('var(--color-primary-500)')
        expect(getThemeColor('primary')).toBe('var(--color-primary-500)')
      })
    })

    describe('isDarkTheme', () => {
      it('should detect dark theme', () => {
        expect(isDarkTheme('dark')).toBe(true)
        expect(isDarkTheme('light')).toBe(false)
      })

      it('should handle system theme', () => {
        expect(isDarkTheme('system')).toBe(false) // default to light
      })
    })

    describe('getThemeTransitionClasses', () => {
      it('should return transition classes', () => {
        const result = getThemeTransitionClasses()
        expect(result).toBe('transition-colors duration-300 ease-in-out')
      })
    })

    describe('isValidTheme', () => {
      it('should validate theme values', () => {
        expect(isValidTheme('light')).toBe(true)
        expect(isValidTheme('dark')).toBe(true)
        expect(isValidTheme('system')).toBe(true)
        expect(isValidTheme('invalid')).toBe(false)
      })
    })

    describe('getThemeDisplayName', () => {
      it('should return theme display names', () => {
        expect(getThemeDisplayName('light')).toBe('Light')
        expect(getThemeDisplayName('dark')).toBe('Dark')
        expect(getThemeDisplayName('system')).toBe('System')
        expect(getThemeDisplayName('invalid' as any)).toBe('Unknown')
      })
    })

    describe('getThemeIcon', () => {
      it('should return theme icons', () => {
        expect(getThemeIcon('light')).toBe('☀️')
        expect(getThemeIcon('dark')).toBe('🌙')
        expect(getThemeIcon('system')).toBe('💻')
        expect(getThemeIcon('invalid' as any)).toBe('🎨')
      })
    })

    describe('createThemeStyles', () => {
      it('should create theme-aware styles', () => {
        const lightStyles = { color: 'black', background: 'white' }
        const darkStyles = { color: 'white', background: 'black' }
        
        const result = createThemeStyles(lightStyles, darkStyles, 'light')
        expect(result).toBe(lightStyles)
        
        const darkResult = createThemeStyles(lightStyles, darkStyles, 'dark')
        expect(darkResult).toBe(darkStyles)
      })
    })

    describe('CSS Variable utilities', () => {
      it('should get CSS variable', () => {
        expect(getCSSVariable('primary-color')).toBe('var(--primary-color)')
      })

      it('should set CSS variable on element', () => {
        const mockElement = {
          style: {
            setProperty: jest.fn(),
          },
        } as any

        setCSSVariable(mockElement, 'primary-color', '#3b82f6')
        expect(mockElement.style.setProperty).toHaveBeenCalledWith('--primary-color', '#3b82f6')
      })

      it('should get computed CSS variable', () => {
        const mockElement = {} as HTMLElement
        const result = getComputedCSSVariable(mockElement, 'primary-color')
        expect(result).toBe('')
      })
    })

    describe('buildThemeClassName', () => {
      it('should build theme-aware class names', () => {
        const result = buildThemeClassName('base', 'light', {
          lightClasses: 'light-class',
          darkClasses: 'dark-class',
          systemClasses: 'system-class',
        })
        expect(result).toBeDefined()
      })
    })
  })
})
