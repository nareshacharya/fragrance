/**
 * TypeScript types for the theme system
 */

export type ThemeMode = 'light' | 'dark' | 'system'

export type ThemeColor = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export type SemanticColors = {
  success: string
  warning: string
  error: string
  info: string
}

export type ThemeColors = {
  primary: ThemeColor
  secondary: ThemeColor
  accent: ThemeColor
  neutral: ThemeColor
  semantic: SemanticColors
  success: ThemeColor
  warning: ThemeColor
  error: ThemeColor
  info: ThemeColor
}

export type TypographyScale = {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
}

export type FontWeight = {
  light: number
  normal: number
  medium: number
  semibold: number
  bold: number
}

export type LineHeight = {
  tight: number
  normal: number
  relaxed: number
}

export type Typography = {
  fontFamily: {
    sans: string[]
    serif: string[]
    mono: string[]
  }
  fontSize: TypographyScale
  fontWeight: FontWeight
  lineHeight: LineHeight
}

export type SpacingScale = {
  0: string
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  8: string
  10: string
  12: string
  16: string
  20: string
  24: string
  32: string
  40: string
  48: string
  56: string
  64: string
}

export type BorderRadius = {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full: string
}

export type Shadows = {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
}

export type Animations = {
  duration: {
    fast: string
    normal: string
    slow: string
  }
  easing: {
    linear: string
    ease: string
    easeIn: string
    easeOut: string
    easeInOut: string
  }
}

export interface ThemeConfig {
  colors: ThemeColors
  typography: Typography
  spacing: SpacingScale
  borderRadius: BorderRadius
  shadows: Shadows
  animations: Animations
}

// Component variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

export type InputVariant = 'default' | 'error' | 'success'
export type InputSize = 'sm' | 'md' | 'lg'

// Theme context types
export interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  isDark: boolean
}

// Theme provider props
export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeMode
  storageKey?: string
}

// CSS variable types
export type CSSVariable = string
export type CSSVariables = Record<string, CSSVariable>

// Theme utility types
export interface ThemeUtils {
  getColorValue: (colorPath: string) => string
  generateCSSVariables: (theme: ThemeConfig) => CSSVariables
  applyTheme: (theme: ThemeConfig, mode?: ThemeMode) => void
}

// Component prop types with theme integration
export interface ThemedComponentProps {
  className?: string
  theme?: ThemeMode
}

// Design token types
export type DesignToken = string | number
export type DesignTokens = Record<string, DesignToken>

// Breakpoint types
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type Breakpoints = Record<Breakpoint, string>

// Z-index types
export type ZIndexLayer = 'dropdown' | 'sticky' | 'fixed' | 'modal-backdrop' | 'modal' | 'popover' | 'tooltip'
export type ZIndex = Record<ZIndexLayer, number>

// Animation types
export type AnimationDuration = 'fast' | 'normal' | 'slow'
export type AnimationEasing = 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut'

// Theme hook return type
export interface UseThemeReturn {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

// Theme storage types
export interface ThemeStorage {
  get: (key: string) => ThemeMode | null
  set: (key: string, value: ThemeMode) => void
  remove: (key: string) => void
}

// Theme validation types
export interface ThemeValidator {
  isValidTheme: (theme: string) => theme is ThemeMode
  isValidColor: (color: string) => boolean
  isValidSpacing: (spacing: string) => boolean
}

// Theme customization types
export interface ThemeCustomization {
  colors?: Partial<ThemeColors>
  typography?: Partial<Typography>
  spacing?: Partial<SpacingScale>
  borderRadius?: Partial<BorderRadius>
  shadows?: Partial<Shadows>
  animations?: Partial<Animations>
}

// Theme merge types
export interface ThemeMerger {
  merge: (base: ThemeConfig, custom: ThemeCustomization) => ThemeConfig
  deepMerge: <T>(target: T, source: Partial<T>) => T
}

