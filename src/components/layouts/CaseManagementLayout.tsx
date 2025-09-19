/**
 * Main case management layout component that orchestrates all navigation and content areas
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { NavigationSidebar } from '@/components/navigation/sidebar'
import { NavigationHeader } from '@/components/navigation/nav-header'
import { ActionPanel } from '@/components/case-management/action-panel'
import { useNavigation } from '@/hooks/use-navigation'
import { useUserProfile } from '@/lib/auth/hooks'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import type { CaseManagementLayoutProps as BaseCaseManagementLayoutProps } from '@/types/navigation'

const layoutVariants = cva(
  'flex h-screen bg-background text-foreground',
  {
    variants: {
      sidebar: {
        visible: '',
        hidden: 'sidebar-hidden',
      },
      header: {
        visible: '',
        hidden: 'header-hidden',
      },
      actionPanel: {
        visible: '',
        hidden: 'action-panel-hidden',
      },
      responsive: {
        mobile: 'flex-col',
        tablet: 'flex-col',
        desktop: 'flex-row',
      },
    },
    defaultVariants: {
      sidebar: 'visible',
      header: 'visible',
      actionPanel: 'visible',
      responsive: 'desktop',
    },
  }
)

const contentAreaVariants = cva(
  'flex flex-1 flex-col overflow-hidden',
  {
    variants: {
      sidebar: {
        visible: '',
        hidden: 'ml-0',
      },
      header: {
        visible: '',
        hidden: '',
      },
      actionPanel: {
        visible: '',
        hidden: '',
      },
      responsive: {
        mobile: 'ml-0',
        tablet: 'ml-0',
        desktop: '',
      },
    },
    defaultVariants: {
      sidebar: 'visible',
      header: 'visible',
      actionPanel: 'visible',
      responsive: 'desktop',
    },
  }
)

const mainContentVariants = cva(
  'flex-1 overflow-auto',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  }
)

export interface CaseManagementLayoutProps extends Omit<BaseCaseManagementLayoutProps, 'className'> {
  config?: Partial<typeof CASE_MANAGEMENT_CONFIG.layout>
  variant?: VariantProps<typeof layoutVariants>['responsive']
  padding?: VariantProps<typeof mainContentVariants>['padding']
  sidebarConfig?: {
    collapsed?: boolean
    modules?: any[]
    userInfo?: any
  }
  headerConfig?: {
    title?: string
    subtitle?: string
    breadcrumbs?: any[]
    actions?: React.ReactNode
    userInfo?: any
  }
  actionPanelConfig?: {
    actions?: any[]
    selectedCases?: string[]
    caseStatus?: string
    title?: string
    description?: string
  }
  onSidebarToggle?: () => void
  onNavigate?: (href: string) => void
  onActionClick?: (action: any, caseIds?: string[]) => void
  className?: string
}

const CaseManagementLayout = React.forwardRef<HTMLDivElement, CaseManagementLayoutProps>(
  (
    {
      children,
      config = {},
      showSidebar = true,
      showHeader = true,
      showActionPanel = true,
      className,
      variant = 'desktop',
      padding = 'md',
      sidebarConfig = {},
      headerConfig = {},
      actionPanelConfig = {},
      onSidebarToggle,
      onNavigate,
      onActionClick,
      ...props
    },
    ref
  ) => {
    const { navigationState, sidebarState } = useNavigation()
    const userProfile = useUserProfile()
    
    // Centralized mobile sidebar state management
    const [mobileOpen, setMobileOpen] = React.useState(false)

    // Merge configuration
    const layoutConfig = React.useMemo(() => ({
      ...CASE_MANAGEMENT_CONFIG.layout,
      ...config,
    }), [config])

    // Get modules for sidebar
    const modules = React.useMemo(() => {
      return sidebarConfig.modules || Object.values(CASE_MANAGEMENT_CONFIG.modules)
    }, [sidebarConfig.modules])

    // Get user info for sidebar and header
    const userInfo = React.useMemo(() => {
      return sidebarConfig.userInfo || headerConfig.userInfo || (userProfile.user ? {
        name: userProfile.displayName,
        role: userProfile.roleLabel,
        avatar: userProfile.avatar,
      } : undefined)
    }, [sidebarConfig.userInfo, headerConfig.userInfo, userProfile])

    // Get breadcrumbs for header
    const breadcrumbs = React.useMemo(() => {
      return headerConfig.breadcrumbs || navigationState.breadcrumbs
    }, [headerConfig.breadcrumbs, navigationState.breadcrumbs])

    // Get actions for action panel
    const actions = React.useMemo(() => {
      return actionPanelConfig.actions || []
    }, [actionPanelConfig.actions])

    // Handle sidebar toggle
    const handleSidebarToggle = () => {
      if (onSidebarToggle) {
        onSidebarToggle()
      } else {
        // Handle mobile sidebar toggle
        if (responsiveVariant === 'mobile' || responsiveVariant === 'tablet') {
          setMobileOpen(!mobileOpen)
        }
      }
    }

    // Handle navigation
    const handleNavigate = (href: string) => {
      if (onNavigate) {
        onNavigate(href)
      }
    }

    // Handle action click
    const handleActionClick = (action: any, caseIds?: string[]) => {
      if (onActionClick) {
        onActionClick(action, caseIds)
      }
    }

    // Determine responsive variant
    const responsiveVariant = React.useMemo(() => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width < 768) return 'mobile'
        if (width < 1024) return 'tablet'
      }
      return variant
    }, [variant])

    return (
      <div
        ref={ref}
        className={cn(
          layoutVariants({
            sidebar: showSidebar ? 'visible' : 'hidden',
            header: showHeader ? 'visible' : 'hidden',
            actionPanel: showActionPanel ? 'visible' : 'hidden',
            responsive: responsiveVariant,
          }),
          className
        )}
        {...props}
      >
        {/* Sidebar */}
        {showSidebar && (
          <NavigationSidebar
            modules={modules}
            currentRoute={navigationState.activeRoute}
            collapsed={responsiveVariant === 'desktop' ? sidebarState.collapsed : false}
            mobileOpen={mobileOpen}
            onToggle={handleSidebarToggle}
            onNavigate={handleNavigate}
            userInfo={userInfo}
            className={cn(
              'transition-all duration-300 ease-in-out',
              responsiveVariant === 'mobile' && 'fixed inset-y-0 left-0 z-50',
              responsiveVariant === 'tablet' && 'fixed inset-y-0 left-0 z-50',
              responsiveVariant === 'desktop' && 'relative'
            )}
          />
        )}

        {/* Content Area */}
        <div
          className={cn(
            contentAreaVariants({
              sidebar: showSidebar ? 'visible' : 'hidden',
              header: showHeader ? 'visible' : 'hidden',
              actionPanel: showActionPanel ? 'visible' : 'hidden',
              responsive: responsiveVariant,
            }),
            'transition-all duration-300 ease-in-out'
          )}
          style={{
            marginLeft: showSidebar && responsiveVariant === 'desktop' 
              ? (sidebarState.collapsed 
                  ? CASE_MANAGEMENT_CONFIG.constants.SIDEBAR_COLLAPSED_WIDTH 
                  : CASE_MANAGEMENT_CONFIG.constants.SIDEBAR_WIDTH)
              : '0'
          }}
        >
          {/* Header */}
          {showHeader && (
            <NavigationHeader
              breadcrumbs={breadcrumbs}
              showSidebarToggle={showSidebar}
              onSidebarToggle={handleSidebarToggle}
              onNavigate={handleNavigate}
              title={headerConfig.title}
              subtitle={headerConfig.subtitle}
              actions={headerConfig.actions}
              userInfo={userInfo}
              className="sticky top-0 z-40"
            />
          )}

          {/* Action Panel */}
          {showActionPanel && actions.length > 0 && (
            <ActionPanel
              actions={actions}
              selectedCases={actionPanelConfig.selectedCases || []}
              caseStatus={actionPanelConfig.caseStatus}
              onActionClick={handleActionClick}
              title={actionPanelConfig.title}
              description={actionPanelConfig.description}
              className="sticky top-16 z-30"
            />
          )}

          {/* Main Content */}
          <main
            className={cn(
              mainContentVariants({ padding }),
              'relative'
            )}
          >
            {children}
          </main>
        </div>

        {/* Mobile overlay */}
        {showSidebar && (responsiveVariant === 'mobile' || responsiveVariant === 'tablet') && mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)

CaseManagementLayout.displayName = 'CaseManagementLayout'

// Compact layout variant
export interface CompactCaseManagementLayoutProps extends Omit<CaseManagementLayoutProps, 'variant' | 'padding'> {
  showBreadcrumbs?: boolean
}

const CompactCaseManagementLayout = React.forwardRef<HTMLDivElement, CompactCaseManagementLayoutProps>(
  ({ showBreadcrumbs = false, ...props }, ref) => {
    return (
      <CaseManagementLayout
        ref={ref}
        variant="mobile"
        padding="sm"
        headerConfig={{
          ...props.headerConfig,
          showBreadcrumbs,
        }}
        {...props}
      />
    )
  }
)

CompactCaseManagementLayout.displayName = 'CompactCaseManagementLayout'

// Full layout variant with all features
export interface FullCaseManagementLayoutProps extends Omit<CaseManagementLayoutProps, 'showSidebar' | 'showHeader' | 'showActionPanel'> {
  showAllFeatures?: boolean
}

const FullCaseManagementLayout = React.forwardRef<HTMLDivElement, FullCaseManagementLayoutProps>(
  ({ showAllFeatures = true, ...props }, ref) => {
    return (
      <CaseManagementLayout
        ref={ref}
        showSidebar={showAllFeatures}
        showHeader={showAllFeatures}
        showActionPanel={showAllFeatures}
        variant="desktop"
        padding="lg"
        {...props}
      />
    )
  }
)

FullCaseManagementLayout.displayName = 'FullCaseManagementLayout'

// Layout with custom sidebar
export interface CustomSidebarCaseManagementLayoutProps extends CaseManagementLayoutProps {
  customSidebar?: React.ReactNode
  sidebarWidth?: string
}

const CustomSidebarCaseManagementLayout = React.forwardRef<HTMLDivElement, CustomSidebarCaseManagementLayoutProps>(
  ({ customSidebar, sidebarWidth = '280px', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="flex h-screen bg-background text-foreground"
      >
        {/* Custom Sidebar */}
        {customSidebar && (
          <div
            className="fixed inset-y-0 left-0 z-40 border-r border-border bg-background"
            style={{ width: sidebarWidth }}
          >
            {customSidebar}
          </div>
        )}

        {/* Content Area */}
        <div
          className="flex flex-1 flex-col overflow-hidden"
          style={{ marginLeft: customSidebar ? sidebarWidth : '0' }}
        >
          {/* Header */}
          {props.showHeader && (
            <NavigationHeader
              breadcrumbs={props.headerConfig?.breadcrumbs || []}
              showSidebarToggle={!!customSidebar}
              onSidebarToggle={props.onSidebarToggle}
              onNavigate={props.onNavigate}
              title={props.headerConfig?.title}
              subtitle={props.headerConfig?.subtitle}
              actions={props.headerConfig?.actions}
              userInfo={props.headerConfig?.userInfo}
              className="sticky top-0 z-40"
            />
          )}

          {/* Action Panel */}
          {props.showActionPanel && props.actionPanelConfig?.actions && (
            <ActionPanel
              actions={props.actionPanelConfig.actions}
              selectedCases={props.actionPanelConfig.selectedCases || []}
              caseStatus={props.actionPanelConfig.caseStatus}
              onActionClick={props.onActionClick}
              title={props.actionPanelConfig.title}
              description={props.actionPanelConfig.description}
              className="sticky top-16 z-30"
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4">
            {props.children}
          </main>
        </div>
      </div>
    )
  }
)

CustomSidebarCaseManagementLayout.displayName = 'CustomSidebarCaseManagementLayout'

// Layout with floating action panel
export interface FloatingActionPanelCaseManagementLayoutProps extends CaseManagementLayoutProps {
  floatingActionPanel?: boolean
  actionPanelPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const FloatingActionPanelCaseManagementLayout = React.forwardRef<HTMLDivElement, FloatingActionPanelCaseManagementLayoutProps>(
  ({ 
    floatingActionPanel = false, 
    actionPanelPosition = 'bottom-right',
    ...props 
  }, ref) => {
    const actionPanel = props.actionPanelConfig?.actions && props.actionPanelConfig.actions.length > 0 ? (
      <ActionPanel
        actions={props.actionPanelConfig.actions}
        selectedCases={props.actionPanelConfig.selectedCases || []}
        caseStatus={props.actionPanelConfig.caseStatus}
        onActionClick={props.onActionClick}
        title={props.actionPanelConfig.title}
        description={props.actionPanelConfig.description}
        position="floating"
        className={cn(
          'fixed z-50',
          actionPanelPosition === 'bottom-right' && 'bottom-4 right-4',
          actionPanelPosition === 'bottom-left' && 'bottom-4 left-4',
          actionPanelPosition === 'top-right' && 'top-4 right-4',
          actionPanelPosition === 'top-left' && 'top-4 left-4'
        )}
      />
    ) : null

    return (
      <CaseManagementLayout
        ref={ref}
        showActionPanel={!floatingActionPanel}
        {...props}
      >
        {props.children}
        {floatingActionPanel && actionPanel}
      </CaseManagementLayout>
    )
  }
)

FloatingActionPanelCaseManagementLayout.displayName = 'FloatingActionPanelCaseManagementLayout'

export {
  CaseManagementLayout,
  CompactCaseManagementLayout,
  FullCaseManagementLayout,
  CustomSidebarCaseManagementLayout,
  FloatingActionPanelCaseManagementLayout,
  layoutVariants,
  contentAreaVariants,
  mainContentVariants,
}
