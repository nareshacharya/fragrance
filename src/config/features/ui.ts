import { z } from 'zod';

/**
 * UI/UX feature configuration schema
 */
export const uiConfigSchema = z.object({
  // Theme Configuration
  theme: z.object({
    defaultTheme: z.enum(['light', 'dark', 'system']).default('system'),
    enableThemeSwitching: z.boolean().default(true),
    customThemes: z.array(z.object({
      name: z.string(),
      colors: z.record(z.string()),
      fonts: z.record(z.string()).optional(),
    })).default([]),
    themePersistence: z.boolean().default(true),
  }),

  // Design System
  designSystem: z.object({
    primaryColor: z.string().default('#3b82f6'),
    secondaryColor: z.string().default('#64748b'),
    accentColor: z.string().default('#f59e0b'),
    successColor: z.string().default('#10b981'),
    warningColor: z.string().default('#f59e0b'),
    errorColor: z.string().default('#ef4444'),
    infoColor: z.string().default('#3b82f6'),
    neutralColors: z.object({
      50: z.string().default('#f8fafc'),
      100: z.string().default('#f1f5f9'),
      200: z.string().default('#e2e8f0'),
      300: z.string().default('#cbd5e1'),
      400: z.string().default('#94a3b8'),
      500: z.string().default('#64748b'),
      600: z.string().default('#475569'),
      700: z.string().default('#334155'),
      800: z.string().default('#1e293b'),
      900: z.string().default('#0f172a'),
    }),
    borderRadius: z.object({
      none: z.string().default('0'),
      sm: z.string().default('0.125rem'),
      md: z.string().default('0.375rem'),
      lg: z.string().default('0.5rem'),
      xl: z.string().default('0.75rem'),
      full: z.string().default('9999px'),
    }),
    spacing: z.object({
      xs: z.string().default('0.25rem'),
      sm: z.string().default('0.5rem'),
      md: z.string().default('1rem'),
      lg: z.string().default('1.5rem'),
      xl: z.string().default('2rem'),
      '2xl': z.string().default('3rem'),
    }),
  }),

  // Typography
  typography: z.object({
    fontFamily: z.object({
      sans: z.array(z.string()).default(['Inter', 'system-ui', 'sans-serif']),
      serif: z.array(z.string()).default(['Georgia', 'serif']),
      mono: z.array(z.string()).default(['JetBrains Mono', 'monospace']),
    }),
    fontSize: z.object({
      xs: z.string().default('0.75rem'),
      sm: z.string().default('0.875rem'),
      base: z.string().default('1rem'),
      lg: z.string().default('1.125rem'),
      xl: z.string().default('1.25rem'),
      '2xl': z.string().default('1.5rem'),
      '3xl': z.string().default('1.875rem'),
      '4xl': z.string().default('2.25rem'),
    }),
    fontWeight: z.object({
      light: z.number().default(300),
      normal: z.number().default(400),
      medium: z.number().default(500),
      semibold: z.number().default(600),
      bold: z.number().default(700),
    }),
    lineHeight: z.object({
      tight: z.number().default(1.25),
      normal: z.number().default(1.5),
      relaxed: z.number().default(1.75),
    }),
  }),

  // Layout Configuration
  layout: z.object({
    maxWidth: z.string().default('1280px'),
    containerPadding: z.string().default('1rem'),
    sidebarWidth: z.string().default('256px'),
    headerHeight: z.string().default('64px'),
    footerHeight: z.string().default('80px'),
    breakpoints: z.object({
      sm: z.string().default('640px'),
      md: z.string().default('768px'),
      lg: z.string().default('1024px'),
      xl: z.string().default('1280px'),
      '2xl': z.string().default('1536px'),
    }),
  }),

  // Animation Configuration
  animation: z.object({
    enabled: z.boolean().default(true),
    duration: z.object({
      fast: z.number().default(150),
      normal: z.number().default(300),
      slow: z.number().default(500),
    }),
    easing: z.object({
      linear: z.string().default('linear'),
      easeIn: z.string().default('cubic-bezier(0.4, 0, 1, 1)'),
      easeOut: z.string().default('cubic-bezier(0, 0, 0.2, 1)'),
      easeInOut: z.string().default('cubic-bezier(0.4, 0, 0.2, 1)'),
    }),
    reduceMotion: z.boolean().default(false),
  }),

  // Accessibility Configuration
  accessibility: z.object({
    enabled: z.boolean().default(true),
    highContrast: z.boolean().default(false),
    focusVisible: z.boolean().default(true),
    skipLinks: z.boolean().default(true),
    ariaLabels: z.boolean().default(true),
    keyboardNavigation: z.boolean().default(true),
    screenReaderSupport: z.boolean().default(true),
    colorContrastRatio: z.number().min(1).max(21).default(4.5),
  }),

  // Component Configuration
  components: z.object({
    button: z.object({
      variants: z.array(z.string()).default(['primary', 'secondary', 'outline', 'ghost', 'link']),
      sizes: z.array(z.string()).default(['sm', 'md', 'lg']),
      loadingStates: z.boolean().default(true),
    }),
    input: z.object({
      variants: z.array(z.string()).default(['default', 'filled', 'outline']),
      validationStates: z.boolean().default(true),
      autoComplete: z.boolean().default(true),
    }),
    modal: z.object({
      backdropBlur: z.boolean().default(true),
      closeOnEscape: z.boolean().default(true),
      closeOnBackdropClick: z.boolean().default(true),
      trapFocus: z.boolean().default(true),
    }),
    table: z.object({
      sorting: z.boolean().default(true),
      filtering: z.boolean().default(true),
      pagination: z.boolean().default(true),
      selection: z.boolean().default(false),
    }),
  }),

  // User Experience Features
  userExperience: z.object({
    onboarding: z.object({
      enabled: z.boolean().default(true),
      steps: z.array(z.string()).default([]),
      skipOption: z.boolean().default(true),
    }),
    tooltips: z.object({
      enabled: z.boolean().default(true),
      delay: z.number().default(500),
      duration: z.number().default(3000),
    }),
    notifications: z.object({
      position: z.enum(['top-right', 'top-left', 'bottom-right', 'bottom-left']).default('top-right'),
      duration: z.number().default(5000),
      maxVisible: z.number().default(5),
    }),
    breadcrumbs: z.object({
      enabled: z.boolean().default(true),
      separator: z.string().default('/'),
      maxItems: z.number().default(5),
    }),
  }),

  // Performance Configuration
  performance: z.object({
    lazyLoading: z.boolean().default(true),
    imageOptimization: z.boolean().default(true),
    codeSplitting: z.boolean().default(true),
    preloading: z.boolean().default(true),
    caching: z.boolean().default(true),
    compression: z.boolean().default(true),
  }),
});

export type UiConfig = z.infer<typeof uiConfigSchema>;

/**
 * Default UI configuration
 */
export const defaultUiConfig: UiConfig = {
  theme: {
    defaultTheme: 'system',
    enableThemeSwitching: true,
    customThemes: [],
    themePersistence: true,
  },
  designSystem: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6',
    neutralColors: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['JetBrains Mono', 'monospace'],
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
  layout: {
    maxWidth: '1280px',
    containerPadding: '1rem',
    sidebarWidth: '256px',
    headerHeight: '64px',
    footerHeight: '80px',
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  animation: {
    enabled: true,
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    reduceMotion: false,
  },
  accessibility: {
    enabled: true,
    highContrast: false,
    focusVisible: true,
    skipLinks: true,
    ariaLabels: true,
    keyboardNavigation: true,
    screenReaderSupport: true,
    colorContrastRatio: 4.5,
  },
  components: {
    button: {
      variants: ['primary', 'secondary', 'outline', 'ghost', 'link'],
      sizes: ['sm', 'md', 'lg'],
      loadingStates: true,
    },
    input: {
      variants: ['default', 'filled', 'outline'],
      validationStates: true,
      autoComplete: true,
    },
    modal: {
      backdropBlur: true,
      closeOnEscape: true,
      closeOnBackdropClick: true,
      trapFocus: true,
    },
    table: {
      sorting: true,
      filtering: true,
      pagination: true,
      selection: false,
    },
  },
  userExperience: {
    onboarding: {
      enabled: true,
      steps: [],
      skipOption: true,
    },
    tooltips: {
      enabled: true,
      delay: 500,
      duration: 3000,
    },
    notifications: {
      position: 'top-right',
      duration: 5000,
      maxVisible: 5,
    },
    breadcrumbs: {
      enabled: true,
      separator: '/',
      maxItems: 5,
    },
  },
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    codeSplitting: true,
    preloading: true,
    caching: true,
    compression: true,
  },
};

