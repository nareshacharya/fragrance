/**
 * Theme configuration for the fragrance management system
 * Provides comprehensive design tokens, color palettes, and theme utilities
 */

import { ThemeMode, ThemeConfig } from '../types/theme'

export const themeConfig: ThemeConfig = {
  colors: {
    primary: {
      50: 'hsl(240, 100%, 98%)',
      100: 'hsl(240, 100%, 95%)',
      200: 'hsl(240, 100%, 90%)',
      300: 'hsl(240, 100%, 80%)',
      400: 'hsl(240, 100%, 70%)',
      500: 'hsl(240, 100%, 60%)',
      600: 'hsl(240, 100%, 50%)',
      700: 'hsl(240, 100%, 40%)',
      800: 'hsl(240, 100%, 30%)',
      900: 'hsl(240, 100%, 20%)',
      950: 'hsl(240, 100%, 10%)',
    },
    secondary: {
      50: 'hsl(280, 100%, 98%)',
      100: 'hsl(280, 100%, 95%)',
      200: 'hsl(280, 100%, 90%)',
      300: 'hsl(280, 100%, 80%)',
      400: 'hsl(280, 100%, 70%)',
      500: 'hsl(280, 100%, 60%)',
      600: 'hsl(280, 100%, 50%)',
      700: 'hsl(280, 100%, 40%)',
      800: 'hsl(280, 100%, 30%)',
      900: 'hsl(280, 100%, 20%)',
      950: 'hsl(280, 100%, 10%)',
    },
    accent: {
      50: 'hsl(45, 100%, 98%)',
      100: 'hsl(45, 100%, 95%)',
      200: 'hsl(45, 100%, 90%)',
      300: 'hsl(45, 100%, 80%)',
      400: 'hsl(45, 100%, 70%)',
      500: 'hsl(45, 100%, 60%)',
      600: 'hsl(45, 100%, 50%)',
      700: 'hsl(45, 100%, 40%)',
      800: 'hsl(45, 100%, 30%)',
      900: 'hsl(45, 100%, 20%)',
      950: 'hsl(45, 100%, 10%)',
    },
    neutral: {
      50: 'hsl(0, 0%, 98%)',
      100: 'hsl(0, 0%, 95%)',
      200: 'hsl(0, 0%, 90%)',
      300: 'hsl(0, 0%, 80%)',
      400: 'hsl(0, 0%, 70%)',
      500: 'hsl(0, 0%, 50%)',
      600: 'hsl(0, 0%, 40%)',
      700: 'hsl(0, 0%, 30%)',
      800: 'hsl(0, 0%, 20%)',
      900: 'hsl(0, 0%, 10%)',
      950: 'hsl(0, 0%, 5%)',
    },
    semantic: {
      success: 'hsl(142, 76%, 36%)',
      warning: 'hsl(38, 92%, 50%)',
      error: 'hsl(0, 84%, 60%)',
      info: 'hsl(199, 89%, 48%)',
    },
    success: {
      50: 'hsl(142, 76%, 95%)',
      100: 'hsl(142, 76%, 90%)',
      200: 'hsl(142, 76%, 80%)',
      300: 'hsl(142, 76%, 70%)',
      400: 'hsl(142, 76%, 60%)',
      500: 'hsl(142, 76%, 50%)',
      600: 'hsl(142, 76%, 40%)',
      700: 'hsl(142, 76%, 30%)',
      800: 'hsl(142, 76%, 20%)',
      900: 'hsl(142, 76%, 10%)',
      950: 'hsl(142, 76%, 5%)',
    },
    warning: {
      50: 'hsl(38, 92%, 95%)',
      100: 'hsl(38, 92%, 90%)',
      200: 'hsl(38, 92%, 80%)',
      300: 'hsl(38, 92%, 70%)',
      400: 'hsl(38, 92%, 60%)',
      500: 'hsl(38, 92%, 50%)',
      600: 'hsl(38, 92%, 40%)',
      700: 'hsl(38, 92%, 30%)',
      800: 'hsl(38, 92%, 20%)',
      900: 'hsl(38, 92%, 10%)',
      950: 'hsl(38, 92%, 5%)',
    },
    error: {
      50: 'hsl(0, 84%, 95%)',
      100: 'hsl(0, 84%, 90%)',
      200: 'hsl(0, 84%, 80%)',
      300: 'hsl(0, 84%, 70%)',
      400: 'hsl(0, 84%, 60%)',
      500: 'hsl(0, 84%, 50%)',
      600: 'hsl(0, 84%, 40%)',
      700: 'hsl(0, 84%, 30%)',
      800: 'hsl(0, 84%, 20%)',
      900: 'hsl(0, 84%, 10%)',
      950: 'hsl(0, 84%, 5%)',
    },
    info: {
      50: 'hsl(199, 89%, 95%)',
      100: 'hsl(199, 89%, 90%)',
      200: 'hsl(199, 89%, 80%)',
      300: 'hsl(199, 89%, 70%)',
      400: 'hsl(199, 89%, 60%)',
      500: 'hsl(199, 89%, 50%)',
      600: 'hsl(199, 89%, 40%)',
      700: 'hsl(199, 89%, 30%)',
      800: 'hsl(199, 89%, 20%)',
      900: 'hsl(199, 89%, 10%)',
      950: 'hsl(199, 89%, 5%)',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'serif'],
      mono: ['Fira Code', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
}


export const themeUtils = {
  /**
   * Get CSS custom property value for theme colors
   */
  getColorValue: (colorPath: string): string => {
    const [color, shade] = colorPath.split('-')
    return `var(--color-${color}-${shade})`
  },

  /**
   * Generate CSS custom properties for theme
   */
  generateCSSVariables: (theme: ThemeConfig): Record<string, string> => {
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

    // Add aliases for globals.css compatibility
    variables['--primary'] = theme.colors.primary[500]
    variables['--primary-foreground'] = theme.colors.neutral[50]
    variables['--secondary'] = theme.colors.secondary[100]
    variables['--secondary-foreground'] = theme.colors.secondary[900]
    variables['--accent'] = theme.colors.accent[100]
    variables['--accent-foreground'] = theme.colors.accent[900]
    variables['--background'] = theme.colors.neutral[50]
    variables['--foreground'] = theme.colors.neutral[900]
    variables['--card'] = theme.colors.neutral[50]
    variables['--card-foreground'] = theme.colors.neutral[900]
    variables['--popover'] = theme.colors.neutral[50]
    variables['--popover-foreground'] = theme.colors.neutral[900]
    variables['--muted'] = theme.colors.neutral[100]
    variables['--muted-foreground'] = theme.colors.neutral[500]
    variables['--destructive'] = theme.colors.semantic.error
    variables['--destructive-foreground'] = theme.colors.neutral[50]
    variables['--border'] = theme.colors.neutral[200]
    variables['--input'] = theme.colors.neutral[200]
    variables['--ring'] = theme.colors.primary[500]

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
  },

  /**
   * Apply theme to document root
   */
  applyTheme: (theme: ThemeConfig, mode: ThemeMode = 'light'): void => {
    const root = document.documentElement
    const variables = themeUtils.generateCSSVariables(theme)
    
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    root.setAttribute('data-theme', mode)
    root.classList.toggle('dark', mode === 'dark')
  },
}

export default themeConfig
