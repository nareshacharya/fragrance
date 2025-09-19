/**
 * Navigation utilities for route handling, breadcrumb generation, and navigation state management
 */

import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { 
  NavigationItem, 
  BreadcrumbItem, 
  ModuleConfig, 
  RouteMatch,
  NavigationPermissionCheck,
  UserRole
} from '@/types'
import { BREADCRUMB_TEMPLATES } from '@/config/case-management'
import { usePermissions } from '@/lib/auth/hooks'

/**
 * Generate breadcrumbs from current route
 */
export function generateBreadcrumbs(route: string, customTemplates?: Record<string, BreadcrumbItem[]>): BreadcrumbItem[] {
  // Check for exact template match first
  if (customTemplates && customTemplates[route]) {
    return customTemplates[route]
  }
  
  // Check built-in templates
  if (BREADCRUMB_TEMPLATES[route as keyof typeof BREADCRUMB_TEMPLATES]) {
    return BREADCRUMB_TEMPLATES[route as keyof typeof BREADCRUMB_TEMPLATES]
  }
  
  // Generate breadcrumbs from route segments
  const segments = route.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast,
    })
  })
  
  return breadcrumbs
}

/**
 * Filter navigation items by user role and permissions
 */
export function filterNavigationByRole(
  items: NavigationItem[], 
  userRole: UserRole, 
  userPermissions: string[]
): NavigationItem[] {
  return items
    .map(item => {
      // Check if user has required role
      if (item.roles && !item.roles.includes(userRole)) {
        return null
      }
      
      // Check if user has required permissions
      if (item.permissions && !item.permissions.some(permission => userPermissions.includes(permission))) {
        return null
      }
      
      // Recursively filter children
      const filteredChildren = item.children 
        ? filterNavigationByRole(item.children, userRole, userPermissions)
        : undefined
      
      return {
        ...item,
        children: filteredChildren,
      }
    })
    .filter((item): item is NavigationItem => item !== null)
}

/**
 * Get active route from current pathname
 */
export function getActiveRoute(pathname: string): string {
  return pathname
}

/**
 * Build navigation tree from modules
 */
export function buildNavigationTree(
  modules: ModuleConfig[], 
  userRole: UserRole, 
  userPermissions: string[]
): NavigationItem[] {
  return modules
    .filter(module => {
      // Check if user has required role for module
      if (module.roles && !module.roles.includes(userRole)) {
        return false
      }
      
      // Check if user has required permissions for module
      if (module.permissions && !module.permissions.some(permission => userPermissions.includes(permission))) {
        return false
      }
      
      return true
    })
    .map(module => ({
      id: module.id,
      label: module.label,
      icon: module.icon,
      description: module.description,
      color: module.color,
      order: module.order,
      children: filterNavigationByRole(module.items, userRole, userPermissions),
    }))
    .sort((a, b) => a.order - b.order)
}

/**
 * Check if route matches pattern
 */
export function matchRoute(route: string, pattern: string): RouteMatch | null {
  const routeSegments = route.split('/').filter(Boolean)
  const patternSegments = pattern.split('/').filter(Boolean)
  
  if (routeSegments.length !== patternSegments.length) {
    return null
  }
  
  const params: Record<string, string> = {}
  const query: Record<string, string> = {}
  
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i]
    const patternSegment = patternSegments[i]
    
    // Check for parameter placeholder
    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1)
      params[paramName] = routeSegment
    } else if (routeSegment !== patternSegment) {
      return null
    }
  }
  
  return {
    route,
    exact: true,
    params,
    query,
  }
}

/**
 * Check permissions for navigation item
 */
export function checkNavigationPermission(
  item: NavigationItem, 
  userRole: UserRole, 
  userPermissions: string[]
): NavigationPermissionCheck {
  // Check role requirements
  if (item.roles && !item.roles.includes(userRole)) {
    return {
      allowed: false,
      reason: 'Insufficient role',
      requiredRole: item.roles[0],
    }
  }
  
  // Check permission requirements
  if (item.permissions) {
    const hasPermission = item.permissions.some(permission => userPermissions.includes(permission))
    if (!hasPermission) {
      return {
        allowed: false,
        reason: 'Insufficient permissions',
        requiredPermission: item.permissions[0],
      }
    }
  }
  
  return { allowed: true }
}

/**
 * Find navigation item by href
 */
export function findNavigationItemByHref(
  items: NavigationItem[], 
  href: string
): NavigationItem | null {
  for (const item of items) {
    if (item.href === href) {
      return item
    }
    
    if (item.children) {
      const found = findNavigationItemByHref(item.children, href)
      if (found) {
        return found
      }
    }
  }
  
  return null
}

/**
 * Get active navigation path
 */
export function getActiveNavigationPath(
  items: NavigationItem[], 
  currentRoute: string
): string[] {
  const path: string[] = []
  
  function findPath(items: NavigationItem[], route: string): boolean {
    for (const item of items) {
      path.push(item.id)
      
      if (item.href === route) {
        return true
      }
      
      if (item.children && findPath(item.children, route)) {
        return true
      }
      
      path.pop()
    }
    
    return false
  }
  
  findPath(items, currentRoute)
  return path
}

/**
 * Expand navigation items based on active route
 */
export function getExpandedNavigationItems(
  items: NavigationItem[], 
  currentRoute: string
): string[] {
  const expanded: string[] = []
  
  function findExpanded(items: NavigationItem[], route: string): boolean {
    for (const item of items) {
      if (item.href === route) {
        return true
      }
      
      if (item.children) {
        if (findExpanded(item.children, route)) {
          expanded.push(item.id)
          return true
        }
      }
    }
    
    return false
  }
  
  findExpanded(items, currentRoute)
  return expanded
}

/**
 * Sort navigation items by order
 */
export function sortNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return items
    .map(item => ({
      ...item,
      children: item.children ? sortNavigationItems(item.children) : undefined,
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Get navigation item depth
 */
export function getNavigationItemDepth(item: NavigationItem, currentDepth = 0): number {
  if (!item.children || item.children.length === 0) {
    return currentDepth
  }
  
  const maxChildDepth = Math.max(
    ...item.children.map(child => getNavigationItemDepth(child, currentDepth + 1))
  )
  
  return maxChildDepth
}

/**
 * Flatten navigation tree
 */
export function flattenNavigationTree(items: NavigationItem[]): NavigationItem[] {
  const flattened: NavigationItem[] = []
  
  function flatten(items: NavigationItem[]) {
    for (const item of items) {
      flattened.push(item)
      if (item.children) {
        flatten(item.children)
      }
    }
  }
  
  flatten(items)
  return flattened
}

/**
 * Get navigation statistics
 */
export function getNavigationStats(items: NavigationItem[]): {
  totalItems: number
  totalDepth: number
  moduleCount: number
  itemCount: number
} {
  const flattened = flattenNavigationTree(items)
  const maxDepth = Math.max(...items.map(item => getNavigationItemDepth(item)))
  
  return {
    totalItems: flattened.length,
    totalDepth: maxDepth,
    moduleCount: items.length,
    itemCount: flattened.length - items.length,
  }
}

/**
 * Navigation state persistence utilities
 */
export class NavigationStateManager {
  private static readonly STORAGE_KEY = 'case-management-navigation-state'
  
  static saveState(state: {
    sidebarCollapsed: boolean
    expandedItems: string[]
    lastRoute: string
  }): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.warn('Failed to save navigation state:', error)
    }
  }
  
  static loadState(): {
    sidebarCollapsed: boolean
    expandedItems: string[]
    lastRoute: string
  } | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to load navigation state:', error)
      return null
    }
  }
  
  static clearState(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear navigation state:', error)
    }
  }
}

/**
 * Route validation utilities
 */
export class RouteValidator {
  /**
   * Validate route format
   */
  static isValidRoute(route: string): boolean {
    try {
      new URL(route, 'http://localhost')
      return true
    } catch {
      return route.startsWith('/') && !route.includes('//')
    }
  }
  
  /**
   * Sanitize route
   */
  static sanitizeRoute(route: string): string {
    return route
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
      .replace(/^\/+/, '/')
  }
  
  /**
   * Check if route is external
   */
  static isExternalRoute(route: string): boolean {
    return route.startsWith('http://') || route.startsWith('https://') || route.startsWith('//')
  }
  
  /**
   * Extract route parameters
   */
  static extractRouteParams(route: string, pattern: string): Record<string, string> {
    const match = matchRoute(route, pattern)
    return match?.params || {}
  }
}

/**
 * Navigation analytics utilities
 */
export class NavigationAnalytics {
  private static readonly ANALYTICS_KEY = 'case-management-navigation-analytics'
  
  /**
   * Track navigation event
   */
  static trackNavigation(from: string, to: string, timestamp: Date = new Date()): void {
    if (typeof window === 'undefined') return
    
    try {
      const analytics = this.getAnalytics()
      const event = { from, to, timestamp: timestamp.toISOString() }
      analytics.events.push(event)
      
      // Keep only last 100 events
      if (analytics.events.length > 100) {
        analytics.events = analytics.events.slice(-100)
      }
      
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics))
    } catch (error) {
      console.warn('Failed to track navigation:', error)
    }
  }
  
  /**
   * Get navigation analytics
   */
  static getAnalytics(): {
    events: Array<{ from: string; to: string; timestamp: string }>
    totalNavigations: number
    mostVisitedRoutes: Record<string, number>
  } {
    if (typeof window === 'undefined') {
      return { events: [], totalNavigations: 0, mostVisitedRoutes: {} }
    }
    
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY)
      return stored ? JSON.parse(stored) : { events: [], totalNavigations: 0, mostVisitedRoutes: {} }
    } catch (error) {
      console.warn('Failed to get navigation analytics:', error)
      return { events: [], totalNavigations: 0, mostVisitedRoutes: {} }
    }
  }
  
  /**
   * Clear analytics
   */
  static clearAnalytics(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.ANALYTICS_KEY)
    } catch (error) {
      console.warn('Failed to clear navigation analytics:', error)
    }
  }
  
  /**
   * Get most visited routes
   */
  static getMostVisitedRoutes(limit = 10): Array<{ route: string; count: number }> {
    const analytics = this.getAnalytics()
    const routeCounts: Record<string, number> = {}
    
    analytics.events.forEach(event => {
      routeCounts[event.to] = (routeCounts[event.to] || 0) + 1
    })
    
    return Object.entries(routeCounts)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }
}

/**
 * Navigation search utilities
 */
export class NavigationSearch {
  /**
   * Search navigation items
   */
  static searchItems(
    items: NavigationItem[], 
    query: string
  ): NavigationItem[] {
    if (!query.trim()) return items
    
    const searchTerm = query.toLowerCase().trim()
    const results: NavigationItem[] = []
    
    function search(items: NavigationItem[]) {
      for (const item of items) {
        const matches = 
          item.label.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.id.toLowerCase().includes(searchTerm)
        
        if (matches) {
          results.push(item)
        }
        
        if (item.children) {
          search(item.children)
        }
      }
    }
    
    search(items)
    return results
  }
  
  /**
   * Highlight search terms in text
   */
  static highlightSearchTerm(text: string, term: string): string {
    if (!term.trim()) return text
    
    const regex = new RegExp(`(${term})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
  
  /**
   * Get search suggestions
   */
  static getSearchSuggestions(
    items: NavigationItem[], 
    query: string, 
    limit = 5
  ): Array<{ label: string; href: string; description?: string }> {
    const results = this.searchItems(items, query)
    
    return results
      .slice(0, limit)
      .map(item => ({
        label: item.label,
        href: item.href || '#',
        description: item.description,
      }))
  }
}
