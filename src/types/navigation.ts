/**
 * Navigation types and interfaces for the Case Management Layout System
 */

import type React from 'react'
import { UserRole } from '@/lib/auth/types'
import { CASE_STATUS, PRIORITY } from '@/config/constants'

/**
 * Navigation item interface for sidebar and menu components
 */
export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: string
  badge?: string | number
  children?: NavigationItem[]
  disabled?: boolean
  external?: boolean
  permissions?: string[]
  roles?: UserRole[]
  description?: string
  order?: number
}

/**
 * Module configuration for case management navigation
 */
export interface ModuleConfig {
  id: string
  name: string
  label: string
  icon: string
  description?: string
  color?: string
  order: number
  permissions?: string[]
  roles?: UserRole[]
  items: NavigationItem[]
  collapsible?: boolean
  defaultExpanded?: boolean
}

/**
 * Case action interface for action panels
 */
export interface CaseAction {
  id: string
  label: string
  description?: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  permissions?: string[]
  roles?: UserRole[]
  conditions?: ActionCondition[]
  onClick?: (caseIds?: string[]) => void | Promise<void>
  requiresConfirmation?: boolean
  confirmationMessage?: string
  bulkAction?: boolean
}

/**
 * Action condition interface for conditional action display
 */
export interface ActionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than'
  value: any
  caseStatus?: keyof typeof CASE_STATUS
  priority?: keyof typeof PRIORITY
}

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
  disabled?: boolean
  current?: boolean
  separator?: string
  external?: boolean
}

/**
 * Layout configuration interface
 */
export interface LayoutConfig {
  sidebar: {
    collapsed: boolean
    width: number
    collapsedWidth: number
    defaultCollapsed?: boolean
    collapsible: boolean
  }
  header: {
    height: number
    showBreadcrumbs: boolean
    showUserMenu: boolean
    showNotifications: boolean
  }
  actionPanel: {
    visible: boolean
    position: 'top' | 'bottom' | 'floating'
    collapsible: boolean
    defaultCollapsed?: boolean
  }
  responsive: {
    mobileBreakpoint: string
    tabletBreakpoint: string
    desktopBreakpoint: string
  }
}

/**
 * Navigation state interface
 */
export interface NavigationState {
  activeRoute: string
  sidebarCollapsed: boolean
  breadcrumbs: BreadcrumbItem[]
  navigationTree: NavigationItem[]
  currentModule?: string
  loading: boolean
  error?: string
}

/**
 * Sidebar state interface
 */
export interface SidebarState {
  collapsed: boolean
  width: number
  transitioning: boolean
  mobileOpen: boolean
}

/**
 * Case management context interface
 */
export interface CaseManagementContext {
  // State
  navigationState: NavigationState
  sidebarState: SidebarState
  layoutConfig: LayoutConfig
  currentCase?: string
  selectedCases: string[]
  
  // Actions
  setActiveRoute: (route: string) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrentCase: (caseId?: string) => void
  setSelectedCases: (caseIds: string[]) => void
  updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  
  // Utilities
  getAvailableActions: (caseStatus?: string) => CaseAction[]
  filterNavigationByRole: (role: UserRole) => NavigationItem[]
  generateBreadcrumbs: (route: string) => BreadcrumbItem[]
}

/**
 * Navigation provider props
 */
export interface NavigationProviderProps {
  children: React.ReactNode
  initialConfig?: Partial<LayoutConfig>
  defaultRoute?: string
}

/**
 * Case management layout props
 */
export interface CaseManagementLayoutProps {
  children: React.ReactNode
  config?: Partial<LayoutConfig>
  showSidebar?: boolean
  showHeader?: boolean
  showActionPanel?: boolean
  className?: string
}

/**
 * Navigation sidebar props
 */
export interface NavigationSidebarProps {
  modules: ModuleConfig[]
  currentRoute: string
  collapsed?: boolean
  onToggle?: () => void
  onNavigate?: (href: string) => void
  className?: string
}

/**
 * Navigation menu props
 */
export interface NavigationMenuProps {
  items: NavigationItem[]
  currentRoute: string
  level?: number
  onNavigate?: (href: string) => void
  className?: string
}

/**
 * Navigation header props
 */
export interface NavigationHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  showSidebarToggle?: boolean
  onSidebarToggle?: () => void
  onNavigate?: (href: string) => void
  className?: string
}

/**
 * Action panel props
 */
export interface ActionPanelProps {
  actions: CaseAction[]
  selectedCases: string[]
  caseStatus?: string
  onActionClick?: (action: CaseAction, caseIds?: string[]) => void
  className?: string
}

/**
 * Case status props
 */
export interface CaseStatusProps {
  status: keyof typeof CASE_STATUS
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

/**
 * Quick actions props
 */
export interface QuickActionsProps {
  actions: CaseAction[]
  selectedCases: string[]
  onActionClick?: (action: CaseAction) => void
  className?: string
}

/**
 * Breadcrumb props
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
  maxItems?: number
  onNavigate?: (href: string) => void
  className?: string
}

/**
 * Navigation hook return types
 */
export interface UseNavigationReturn {
  navigationState: NavigationState
  sidebarState: SidebarState
  setActiveRoute: (route: string) => void
  toggleSidebar: () => void
  generateBreadcrumbs: (route: string) => BreadcrumbItem[]
  filterNavigationByRole: (role: UserRole) => NavigationItem[]
}

export interface UseSidebarStateReturn {
  sidebarState: SidebarState
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
  setMobileOpen: (open: boolean) => void
}

export interface UseBreadcrumbsReturn {
  breadcrumbs: BreadcrumbItem[]
  updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  generateBreadcrumbs: (route: string) => BreadcrumbItem[]
  addBreadcrumb: (item: BreadcrumbItem) => void
  removeBreadcrumb: (index: number) => void
}

/**
 * Route matching interface
 */
export interface RouteMatch {
  route: string
  exact: boolean
  params?: Record<string, string>
  query?: Record<string, string>
}

/**
 * Navigation tree interface
 */
export interface NavigationTree {
  modules: ModuleConfig[]
  flatItems: NavigationItem[]
  activePath: string[]
  expandedItems: string[]
}

/**
 * Permission check interface for navigation
 */
export interface NavigationPermissionCheck {
  allowed: boolean
  reason?: string
  requiredRole?: UserRole
  requiredPermission?: string
}

/**
 * Navigation event interface
 */
export interface NavigationEvent {
  type: 'navigate' | 'sidebar_toggle' | 'breadcrumb_click' | 'action_click'
  timestamp: Date
  route?: string
  action?: string
  caseIds?: string[]
}

/**
 * Case management layout configuration presets
 */
export interface LayoutPreset {
  id: string
  name: string
  description: string
  config: LayoutConfig
  applicableRoles?: UserRole[]
}

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  mobile: {
    breakpoint: string
    sidebarCollapsed: boolean
    showActionPanel: boolean
  }
  tablet: {
    breakpoint: string
    sidebarCollapsed: boolean
    showActionPanel: boolean
  }
  desktop: {
    breakpoint: string
    sidebarCollapsed: boolean
    showActionPanel: boolean
  }
}

/**
 * Navigation animation configuration
 */
export interface NavigationAnimationConfig {
  sidebar: {
    duration: number
    easing: string
    properties: string[]
  }
  breadcrumb: {
    duration: number
    easing: string
    properties: string[]
  }
  actionPanel: {
    duration: number
    easing: string
    properties: string[]
  }
}

/**
 * Navigation accessibility configuration
 */
export interface NavigationAccessibilityConfig {
  skipLinks: boolean
  keyboardNavigation: boolean
  screenReaderSupport: boolean
  focusManagement: boolean
  ariaLabels: Record<string, string>
}

/**
 * Navigation theme configuration
 */
export interface NavigationThemeConfig {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    border: string
    hover: string
    active: string
    disabled: string
  }
  typography: {
    fontFamily: string
    fontSize: string
    fontWeight: string
    lineHeight: string
  }
  spacing: {
    padding: string
    margin: string
    gap: string
  }
  borderRadius: string
  shadows: string[]
}

/**
 * Navigation configuration interface
 */
export interface NavigationConfig {
  layout: LayoutConfig
  responsive: ResponsiveConfig
  animation: NavigationAnimationConfig
  accessibility: NavigationAccessibilityConfig
  theme: NavigationThemeConfig
  presets: LayoutPreset[]
}
