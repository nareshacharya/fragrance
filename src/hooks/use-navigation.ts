'use client'

/**
 * Navigation hooks for managing navigation state, active routes, and sidebar collapse state
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  generateBreadcrumbs, 
  filterNavigationByRole, 
  buildNavigationTree,
  NavigationStateManager,
  NavigationAnalytics,
  RouteValidator
} from '@/lib/navigation'
import { usePermissions, useUser } from '@/lib/auth/hooks'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import type { 
  NavigationState, 
  SidebarState, 
  BreadcrumbItem, 
  NavigationItem, 
  UseNavigationReturn, 
  UseSidebarStateReturn, 
  UseBreadcrumbsReturn,
  UserRole
} from '@/types'

/**
 * Main navigation hook
 */
export function useNavigation(): UseNavigationReturn {
  const pathname = usePathname()
  const router = useRouter()
  const { permissions } = usePermissions()
  const { user } = useUser()
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeRoute: pathname,
    sidebarCollapsed: false,
    breadcrumbs: [],
    navigationTree: [],
    loading: false,
  })
  
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    collapsed: false,
    width: CASE_MANAGEMENT_CONFIG.constants.SIDEBAR_WIDTH,
    transitioning: false,
    mobileOpen: false,
  })
  
  // Load saved state on mount
  useEffect(() => {
    const savedState = NavigationStateManager.loadState()
    if (savedState) {
      setSidebarState(prev => ({
        ...prev,
        collapsed: savedState.sidebarCollapsed,
      }))
    }
  }, [])
  
  // Update active route when pathname changes
  useEffect(() => {
    const newRoute = RouteValidator.sanitizeRoute(pathname)
    const from = navigationState.activeRoute
    
    setNavigationState(prev => ({
      ...prev,
      activeRoute: newRoute,
      breadcrumbs: generateBreadcrumbs(newRoute),
    }))
    
    // Track navigation
    NavigationAnalytics.trackNavigation(from, newRoute)
  }, [pathname, navigationState.activeRoute])
  
  // Build navigation tree based on user permissions
  const navigationTree = useMemo(() => {
    if (!user) return []
    
    const userRole = user.roles?.[0] as UserRole || 'perfumer'
    const userPermissions = permissions.map(p => p.name)
    
    return buildNavigationTree(
      Object.values(CASE_MANAGEMENT_CONFIG.modules),
      userRole,
      userPermissions
    )
  }, [user, permissions])
  
  // Update navigation tree when permissions change
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      navigationTree,
    }))
  }, [navigationTree])
  
  // Set active route
  const setActiveRoute = useCallback((route: string) => {
    const sanitizedRoute = RouteValidator.sanitizeRoute(route)
    
    if (RouteValidator.isExternalRoute(sanitizedRoute)) {
      window.open(sanitizedRoute, '_blank', 'noopener,noreferrer')
      return
    }
    
    router.push(sanitizedRoute)
  }, [router])
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarState(prev => {
      const newCollapsed = !prev.collapsed
      
      // Save state
      NavigationStateManager.saveState({
        sidebarCollapsed: newCollapsed,
        expandedItems: [],
        lastRoute: navigationState.activeRoute,
      })
      
      return {
        ...prev,
        collapsed: newCollapsed,
        transitioning: true,
      }
    })
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setSidebarState(prev => ({
        ...prev,
        transitioning: false,
      }))
    }, 300)
  }, [navigationState.activeRoute])
  
  // Generate breadcrumbs for a route
  const generateBreadcrumbsForRoute = useCallback((route: string): BreadcrumbItem[] => {
    return generateBreadcrumbs(route)
  }, [])
  
  // Filter navigation by role
  const filterNavigationByUserRole = useCallback((role: UserRole): NavigationItem[] => {
    if (!user) return []
    
    const userPermissions = permissions.map(p => p.name)
    return filterNavigationByRole(navigationTree, role, userPermissions)
  }, [user, permissions, navigationTree])
  
  return {
    navigationState,
    sidebarState,
    setActiveRoute,
    toggleSidebar,
    generateBreadcrumbs: generateBreadcrumbsForRoute,
    filterNavigationByRole: filterNavigationByUserRole,
  }
}

/**
 * Sidebar state hook
 */
export function useSidebarState(): UseSidebarStateReturn {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    collapsed: false,
    width: CASE_MANAGEMENT_CONFIG.constants.SIDEBAR_WIDTH,
    transitioning: false,
    mobileOpen: false,
  })
  
  // Load saved state on mount
  useEffect(() => {
    const savedState = NavigationStateManager.loadState()
    if (savedState) {
      setSidebarState(prev => ({
        ...prev,
        collapsed: savedState.sidebarCollapsed,
      }))
    }
  }, [])
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarState(prev => {
      const newCollapsed = !prev.collapsed
      
      // Save state
      NavigationStateManager.saveState({
        sidebarCollapsed: newCollapsed,
        expandedItems: [],
        lastRoute: window.location.pathname,
      })
      
      return {
        ...prev,
        collapsed: newCollapsed,
        transitioning: true,
      }
    })
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setSidebarState(prev => ({
        ...prev,
        transitioning: false,
      }))
    }, 300)
  }, [])
  
  // Set collapsed state
  const setCollapsed = useCallback((collapsed: boolean) => {
    setSidebarState(prev => {
      // Save state
      NavigationStateManager.saveState({
        sidebarCollapsed: collapsed,
        expandedItems: [],
        lastRoute: window.location.pathname,
      })
      
      return {
        ...prev,
        collapsed,
        transitioning: true,
      }
    })
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setSidebarState(prev => ({
        ...prev,
        transitioning: false,
      }))
    }, 300)
  }, [])
  
  // Set mobile open state
  const setMobileOpen = useCallback((open: boolean) => {
    setSidebarState(prev => ({
      ...prev,
      mobileOpen: open,
    }))
  }, [])
  
  return {
    sidebarState,
    toggleSidebar,
    setCollapsed,
    setMobileOpen,
  }
}

/**
 * Breadcrumbs hook
 */
export function useBreadcrumbs(): UseBreadcrumbsReturn {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  
  // Update breadcrumbs when route changes
  useEffect(() => {
    const newBreadcrumbs = generateBreadcrumbs(pathname)
    setBreadcrumbs(newBreadcrumbs)
  }, [pathname])
  
  // Update breadcrumbs manually
  const updateBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbs(newBreadcrumbs)
  }, [])
  
  // Generate breadcrumbs for a route
  const generateBreadcrumbsForRoute = useCallback((route: string): BreadcrumbItem[] => {
    return generateBreadcrumbs(route)
  }, [])
  
  // Add breadcrumb
  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, item])
  }, [])
  
  // Remove breadcrumb by index
  const removeBreadcrumb = useCallback((index: number) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index))
  }, [])
  
  return {
    breadcrumbs,
    updateBreadcrumbs,
    generateBreadcrumbs: generateBreadcrumbsForRoute,
    addBreadcrumb,
    removeBreadcrumb,
  }
}

/**
 * Navigation tree hook
 */
export function useNavigationTree() {
  const { user } = useUser()
  const { permissions } = usePermissions()
  
  const navigationTree = useMemo(() => {
    if (!user) return []
    
    const userRole = user.roles?.[0] as UserRole || 'perfumer'
    const userPermissions = permissions.map(p => p.name)
    
    return buildNavigationTree(
      Object.values(CASE_MANAGEMENT_CONFIG.modules),
      userRole,
      userPermissions
    )
  }, [user, permissions])
  
  return navigationTree
}

/**
 * Active route hook
 */
export function useActiveRoute() {
  const pathname = usePathname()
  const [activeRoute, setActiveRoute] = useState(pathname)
  
  useEffect(() => {
    const sanitizedRoute = RouteValidator.sanitizeRoute(pathname)
    setActiveRoute(sanitizedRoute)
  }, [pathname])
  
  return activeRoute
}

/**
 * Navigation search hook
 */
export function useNavigationSearch() {
  const navigationTree = useNavigationTree()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NavigationItem[]>([])
  
  // Search navigation items
  const search = useCallback((query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    // Simple search implementation
    const results: NavigationItem[] = []
    const searchTerm = query.toLowerCase().trim()
    
    function searchItems(items: NavigationItem[]) {
      for (const item of items) {
        const matches = 
          item.label.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.id.toLowerCase().includes(searchTerm)
        
        if (matches) {
          results.push(item)
        }
        
        if (item.children) {
          searchItems(item.children)
        }
      }
    }
    
    searchItems(navigationTree)
    setSearchResults(results)
  }, [navigationTree])
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [])
  
  return {
    searchQuery,
    searchResults,
    search,
    clearSearch,
    hasResults: searchResults.length > 0,
  }
}

/**
 * Navigation analytics hook
 */
export function useNavigationAnalytics() {
  const [analytics, setAnalytics] = useState(NavigationAnalytics.getAnalytics())
  
  // Update analytics
  const updateAnalytics = useCallback(() => {
    setAnalytics(NavigationAnalytics.getAnalytics())
  }, [])
  
  // Get most visited routes
  const getMostVisitedRoutes = useCallback((limit = 10) => {
    return NavigationAnalytics.getMostVisitedRoutes(limit)
  }, [])
  
  // Clear analytics
  const clearAnalytics = useCallback(() => {
    NavigationAnalytics.clearAnalytics()
    setAnalytics(NavigationAnalytics.getAnalytics())
  }, [])
  
  return {
    analytics,
    updateAnalytics,
    getMostVisitedRoutes,
    clearAnalytics,
  }
}

/**
 * Responsive navigation hook
 */
export function useResponsiveNavigation() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      const mobileBreakpoint = parseInt(CASE_MANAGEMENT_CONFIG.responsive.mobile.breakpoint)
      const tabletBreakpoint = parseInt(CASE_MANAGEMENT_CONFIG.responsive.tablet.breakpoint)
      
      setIsMobile(width < mobileBreakpoint)
      setIsTablet(width >= mobileBreakpoint && width < tabletBreakpoint)
      setIsDesktop(width >= tabletBreakpoint)
    }
    
    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)
    
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  }
}

/**
 * Navigation keyboard shortcuts hook
 */
export function useNavigationKeyboardShortcuts() {
  const { toggleSidebar } = useSidebarState()
  const { setActiveRoute } = useNavigation()
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + B: Toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault()
        toggleSidebar()
      }
      
      // Ctrl/Cmd + K: Focus search (if available)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('[data-navigation-search]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      
      // Escape: Close mobile sidebar
      if (event.key === 'Escape') {
        const mobileSidebar = document.querySelector('[data-mobile-sidebar]')
        if (mobileSidebar && !mobileSidebar.classList.contains('hidden')) {
          // Close mobile sidebar logic here
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])
}

/**
 * Navigation focus management hook
 */
export function useNavigationFocusManagement() {
  const [focusedItem, setFocusedItemState] = useState<string | null>(null)
  
  // Set focused item
  const setFocusedItem = useCallback((itemId: string | null) => {
    setFocusedItemState(itemId)
  }, [])
  
  // Focus next item
  const focusNextItem = useCallback((currentId: string, items: NavigationItem[]) => {
    const flatItems = items.flatMap(item => [
      item,
      ...(item.children || [])
    ])
    
    const currentIndex = flatItems.findIndex(item => item.id === currentId)
    const nextIndex = (currentIndex + 1) % flatItems.length
    
    setFocusedItemState(flatItems[nextIndex]?.id || null)
  }, [])
  
  // Focus previous item
  const focusPreviousItem = useCallback((currentId: string, items: NavigationItem[]) => {
    const flatItems = items.flatMap(item => [
      item,
      ...(item.children || [])
    ])
    
    const currentIndex = flatItems.findIndex(item => item.id === currentId)
    const prevIndex = currentIndex === 0 ? flatItems.length - 1 : currentIndex - 1
    
    setFocusedItemState(flatItems[prevIndex]?.id || null)
  }, [])
  
  return {
    focusedItem,
    setFocusedItem,
    focusNextItem,
    focusPreviousItem,
  }
}

/**
 * Navigation state persistence hook
 */
export function useNavigationStatePersistence() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const savedState = NavigationStateManager.loadState()
    if (savedState) {
      // Apply saved state logic here
    }
    setIsLoaded(true)
  }, [])
  
  // Save current state
  const saveState = useCallback((state: {
    sidebarCollapsed: boolean
    expandedItems: string[]
    lastRoute: string
  }) => {
    NavigationStateManager.saveState(state)
  }, [])
  
  // Clear saved state
  const clearState = useCallback(() => {
    NavigationStateManager.clearState()
  }, [])
  
  return {
    isLoaded,
    saveState,
    clearState,
  }
}
