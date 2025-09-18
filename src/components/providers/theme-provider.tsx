'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { themeConfig, themeUtils } from '../../config/theme'
import { ThemeMode, ThemeContextType, ThemeProviderProps } from '../../types/theme'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'fragrance-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get theme from localStorage on mount
    const storedTheme = localStorage.getItem(storageKey) as ThemeMode
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const effectiveTheme = theme === 'system' ? systemTheme : theme

    // Apply theme to document
    root.setAttribute('data-theme', effectiveTheme)
    root.classList.toggle('dark', effectiveTheme === 'dark')
    
    // Apply theme tokens to CSS variables
    themeUtils.applyTheme(themeConfig, effectiveTheme as ThemeMode)

    // Store theme preference
    localStorage.setItem(storageKey, theme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.setAttribute('data-theme', newSystemTheme)
        root.classList.toggle('dark', newSystemTheme === 'dark')
        themeUtils.applyTheme(themeConfig, newSystemTheme as ThemeMode)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme, mounted, storageKey])

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'system'
        case 'system':
          return 'light'
        default:
          return 'light'
      }
    })
  }

  const isDark = mounted && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeProvider
