/**
 * Case management layout provider for managing layout state and configuration
 */

import * as React from 'react'
import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { generateBreadcrumbs, filterNavigationByRole as filterNavigationByRoleUtil } from '@/lib/navigation'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import type { 
  CaseManagementContext, 
  NavigationState, 
  SidebarState, 
  LayoutConfig,
  BreadcrumbItem,
  UserRole
} from '@/types/navigation'

// Action types for reducer
type CaseManagementAction =
  | { type: 'SET_ACTIVE_ROUTE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_CURRENT_CASE'; payload: string | undefined }
  | { type: 'SET_SELECTED_CASES'; payload: string[] }
  | { type: 'UPDATE_BREADCRUMBS'; payload: BreadcrumbItem[] }
  | { type: 'SET_LAYOUT_CONFIG'; payload: Partial<LayoutConfig> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }

// State interface
interface CaseManagementState {
  navigationState: NavigationState
  sidebarState: SidebarState
  layoutConfig: LayoutConfig
  currentCase?: string
  selectedCases: string[]
}

// Initial state
const initialState: CaseManagementState = {
  navigationState: {
    activeRoute: '/',
    sidebarCollapsed: false,
    breadcrumbs: [],
    navigationTree: [],
    loading: false,
  },
  sidebarState: {
    collapsed: false,
    width: CASE_MANAGEMENT_CONFIG.constants.SIDEBAR_WIDTH,
    transitioning: false,
    mobileOpen: false,
  },
  layoutConfig: CASE_MANAGEMENT_CONFIG.layout,
  currentCase: undefined,
  selectedCases: [],
}

// Reducer function
function caseManagementReducer(
  state: CaseManagementState,
  action: CaseManagementAction
): CaseManagementState {
  switch (action.type) {
    case 'SET_ACTIVE_ROUTE':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          activeRoute: action.payload,
          breadcrumbs: generateBreadcrumbs(action.payload),
        },
      }

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarState: {
          ...state.sidebarState,
          collapsed: !state.sidebarState.collapsed,
          transitioning: true,
        },
      }

    case 'SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        sidebarState: {
          ...state.sidebarState,
          collapsed: action.payload,
          transitioning: true,
        },
      }

    case 'SET_CURRENT_CASE':
      return {
        ...state,
        currentCase: action.payload,
      }

    case 'SET_SELECTED_CASES':
      return {
        ...state,
        selectedCases: action.payload,
      }

    case 'UPDATE_BREADCRUMBS':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          breadcrumbs: action.payload,
        },
      }

    case 'SET_LAYOUT_CONFIG':
      return {
        ...state,
        layoutConfig: {
          ...state.layoutConfig,
          ...action.payload,
        },
      }

    case 'SET_LOADING':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          loading: action.payload,
        },
      }

    case 'SET_ERROR':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          error: action.payload,
        },
      }

    default:
      return state
  }
}

// Context
const CaseManagementContext = createContext<CaseManagementContext | null>(null)

// Provider props
interface CaseManagementProviderProps {
  children: React.ReactNode
  initialConfig?: Partial<LayoutConfig>
  defaultRoute?: string
}

// Provider component
export function CaseManagementProvider({
  children,
  initialConfig,
  defaultRoute = '/',
}: CaseManagementProviderProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Initialize state with config
  const [state, dispatch] = useReducer(caseManagementReducer, {
    ...initialState,
    layoutConfig: {
      ...initialState.layoutConfig,
      ...initialConfig,
    },
    navigationState: {
      ...initialState.navigationState,
      activeRoute: defaultRoute,
      breadcrumbs: generateBreadcrumbs(defaultRoute),
    },
  })

  // Update active route when pathname changes
  React.useEffect(() => {
    if (pathname !== state.navigationState.activeRoute) {
      dispatch({ type: 'SET_ACTIVE_ROUTE', payload: pathname })
    }
  }, [pathname, state.navigationState.activeRoute])

  // Reset transitioning state after animation
  React.useEffect(() => {
    if (state.sidebarState.transitioning) {
      const timer = setTimeout(() => {
        dispatch({
          type: 'SET_SIDEBAR_COLLAPSED',
          payload: state.sidebarState.collapsed,
        })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [state.sidebarState.transitioning, state.sidebarState.collapsed])

  // Set active route
  const setActiveRoute = useCallback((route: string) => {
    dispatch({ type: 'SET_ACTIVE_ROUTE', payload: route })
    router.push(route)
  }, [router])

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }, [])

  // Set sidebar collapsed state
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed })
  }, [])

  // Set current case
  const setCurrentCase = useCallback((caseId?: string) => {
    dispatch({ type: 'SET_CURRENT_CASE', payload: caseId })
  }, [])

  // Set selected cases
  const setSelectedCases = useCallback((caseIds: string[]) => {
    dispatch({ type: 'SET_SELECTED_CASES', payload: caseIds })
  }, [])

  // Update breadcrumbs
  const updateBreadcrumbs = useCallback((breadcrumbs: BreadcrumbItem[]) => {
    dispatch({ type: 'UPDATE_BREADCRUMBS', payload: breadcrumbs })
  }, [])

  // Get available actions based on current context
  const getAvailableActions = useCallback((caseStatus?: string) => {
    // This would typically filter actions based on case status, user permissions, etc.
    // For now, return a basic set of actions
    return Object.values(CASE_MANAGEMENT_CONFIG.actions).filter(action => {
      if (caseStatus && action.conditions) {
        return action.conditions.every(condition => {
          if (condition.field === 'status') {
            switch (condition.operator) {
              case 'equals':
                return caseStatus === condition.value
              case 'in':
                return condition.value.includes(caseStatus)
              case 'not_equals':
                return caseStatus !== condition.value
              case 'not_in':
                return !condition.value.includes(caseStatus)
              default:
                return true
            }
          }
          return true
        })
      }
      return true
    })
  }, [])

  // Filter navigation by role and permissions
  const filterNavigationByRole = useCallback((role: UserRole, userPermissions: string[] = []) => {
    // Convert modules to navigation items format
    const navigationItems = Object.values(CASE_MANAGEMENT_CONFIG.modules).map(module => ({
      id: module.id,
      label: module.label,
      icon: module.icon,
      description: module.description,
      color: module.color,
      order: module.order,
      href: module.items?.[0]?.href,
      roles: module.roles,
      permissions: module.permissions,
      children: module.items?.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        href: item.href,
        order: item.order,
        roles: item.roles,
        permissions: item.permissions,
      }))
    }))
    
    // Use the actual filterNavigationByRole utility
    return filterNavigationByRoleUtil(navigationItems, role, userPermissions)
  }, [])

  // Generate breadcrumbs for a route
  const generateBreadcrumbsForRoute = useCallback((route: string): BreadcrumbItem[] => {
    return generateBreadcrumbs(route)
  }, [])

  // Context value
  const contextValue = useMemo(
    (): CaseManagementContext => ({
      // State
      navigationState: state.navigationState,
      sidebarState: state.sidebarState,
      layoutConfig: state.layoutConfig,
      currentCase: state.currentCase,
      selectedCases: state.selectedCases,

      // Actions
      setActiveRoute,
      toggleSidebar,
      setSidebarCollapsed,
      setCurrentCase,
      setSelectedCases,
      updateBreadcrumbs,

      // Utilities
      getAvailableActions,
      filterNavigationByRole,
      generateBreadcrumbs: generateBreadcrumbsForRoute,
    }),
    [
      state,
      setActiveRoute,
      toggleSidebar,
      setSidebarCollapsed,
      setCurrentCase,
      setSelectedCases,
      updateBreadcrumbs,
      getAvailableActions,
      filterNavigationByRole,
      generateBreadcrumbsForRoute,
    ]
  )

  return (
    <CaseManagementContext.Provider value={contextValue}>
      {children}
    </CaseManagementContext.Provider>
  )
}

// Hook to use case management context
export function useCaseManagement(): CaseManagementContext {
  const context = useContext(CaseManagementContext)
  if (!context) {
    throw new Error('useCaseManagement must be used within a CaseManagementProvider')
  }
  return context
}

// Hook to use navigation state
export function useCaseManagementNavigation() {
  const { navigationState, setActiveRoute, generateBreadcrumbs } = useCaseManagement()
  return {
    activeRoute: navigationState.activeRoute,
    breadcrumbs: navigationState.breadcrumbs,
    loading: navigationState.loading,
    error: navigationState.error,
    setActiveRoute,
    generateBreadcrumbs,
  }
}

// Hook to use sidebar state
export function useCaseManagementSidebar() {
  const { sidebarState, toggleSidebar, setSidebarCollapsed } = useCaseManagement()
  return {
    collapsed: sidebarState.collapsed,
    width: sidebarState.width,
    transitioning: sidebarState.transitioning,
    mobileOpen: sidebarState.mobileOpen,
    toggleSidebar,
    setSidebarCollapsed,
  }
}

// Hook to use case state
export function useCaseManagementCases() {
  const { currentCase, selectedCases, setCurrentCase, setSelectedCases } = useCaseManagement()
  return {
    currentCase,
    selectedCases,
    setCurrentCase,
    setSelectedCases,
  }
}

// Hook to use layout configuration
export function useCaseManagementLayout() {
  const { layoutConfig } = useCaseManagement()
  return layoutConfig
}

// Hook to use available actions
export function useCaseManagementActions() {
  const { getAvailableActions, currentCase } = useCaseManagement()
  
  const availableActions = useMemo(() => {
    return getAvailableActions()
  }, [getAvailableActions])

  return {
    actions: availableActions,
    currentCase,
  }
}

// Higher-order component for case management context
export function withCaseManagement<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function CaseManagementWrapper(props: P) {
    return (
      <CaseManagementProvider>
        <Component {...props} />
      </CaseManagementProvider>
    )
  }
}

// Provider with configuration
export function CaseManagementProviderWithConfig({
  children,
  config,
}: {
  children: React.ReactNode
  config: Partial<LayoutConfig>
}) {
  return (
    <CaseManagementProvider initialConfig={config}>
      {children}
    </CaseManagementProvider>
  )
}

// Provider for specific user roles
export function CaseManagementProviderForRole({
  children,
  userRole,
}: {
  children: React.ReactNode
  userRole: UserRole
}) {
  // Get role-specific configuration
  const roleConfig = useMemo(() => {
    const preset = CASE_MANAGEMENT_CONFIG.presets.find(p => 
      p.applicableRoles?.includes(userRole)
    )
    return preset?.config || CASE_MANAGEMENT_CONFIG.layout
  }, [userRole])

  return (
    <CaseManagementProvider initialConfig={roleConfig}>
      {children}
    </CaseManagementProvider>
  )
}

// Provider for mobile devices
export function CaseManagementProviderMobile({
  children,
}: {
  children: React.ReactNode
}) {
  const mobileConfig = useMemo(() => ({
    ...CASE_MANAGEMENT_CONFIG.layout,
    sidebar: {
      ...CASE_MANAGEMENT_CONFIG.layout.sidebar,
      collapsed: true,
      width: 0,
      collapsedWidth: 0,
    },
    header: {
      ...CASE_MANAGEMENT_CONFIG.layout.header,
      height: 56,
    },
    actionPanel: {
      ...CASE_MANAGEMENT_CONFIG.layout.actionPanel,
      position: 'bottom' as const,
    },
  }), [])

  return (
    <CaseManagementProvider initialConfig={mobileConfig}>
      {children}
    </CaseManagementProvider>
  )
}

// Provider for desktop devices
export function CaseManagementProviderDesktop({
  children,
}: {
  children: React.ReactNode
}) {
  const desktopConfig = useMemo(() => ({
    ...CASE_MANAGEMENT_CONFIG.layout,
    sidebar: {
      ...CASE_MANAGEMENT_CONFIG.layout.sidebar,
      collapsed: false,
      width: 280,
      collapsedWidth: 64,
    },
    header: {
      ...CASE_MANAGEMENT_CONFIG.layout.header,
      height: 64,
    },
    actionPanel: {
      ...CASE_MANAGEMENT_CONFIG.layout.actionPanel,
      position: 'top' as const,
    },
  }), [])

  return (
    <CaseManagementProvider initialConfig={desktopConfig}>
      {children}
    </CaseManagementProvider>
  )
}

export default CaseManagementProvider
