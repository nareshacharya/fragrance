/**
 * Navigation sidebar component with collapsible functionality and module-based organization
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NavMenu } from './nav-menu'
import { useSidebarState } from '@/hooks/use-navigation'
import { useResponsiveNavigation } from '@/hooks/use-navigation'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import type { NavigationSidebarProps as BaseNavigationSidebarProps, ModuleConfig } from '@/types/navigation'

const sidebarVariants = cva(
  'fixed left-0 top-0 z-40 h-full border-r border-border bg-background transition-all duration-300 ease-in-out',
  {
    variants: {
      collapsed: {
        true: 'w-16',
        false: 'w-64',
      },
      mobile: {
        true: 'w-full transform transition-transform duration-300 ease-in-out',
        false: '',
      },
      open: {
        true: 'translate-x-0',
        false: '-translate-x-full',
      },
    },
    defaultVariants: {
      collapsed: false,
      mobile: false,
      open: true,
    },
  }
)

const sidebarHeaderVariants = cva(
  'flex items-center justify-between p-4 border-b border-border',
  {
    variants: {
      collapsed: {
        true: 'justify-center',
        false: 'justify-between',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

const sidebarContentVariants = cva(
  'flex-1 overflow-y-auto overflow-x-hidden',
  {
    variants: {
      collapsed: {
        true: 'px-2',
        false: 'px-4',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

const sidebarFooterVariants = cva(
  'border-t border-border p-4',
  {
    variants: {
      collapsed: {
        true: 'px-2',
        false: 'px-4',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

export interface NavigationSidebarProps extends Omit<BaseNavigationSidebarProps, 'className'> {
  showToggle?: boolean
  showLogo?: boolean
  logoText?: string
  userInfo?: {
    name: string
    role: string
    avatar?: string
  }
  mobileOpen?: boolean
  onToggle?: () => void
  className?: string
}

const NavigationSidebar = React.forwardRef<HTMLElement, NavigationSidebarProps>(
  (
    {
      modules,
      currentRoute,
      collapsed: controlledCollapsed,
      mobileOpen: controlledMobileOpen,
      onToggle,
      onNavigate,
      className,
      showToggle = true,
      showLogo = true,
      logoText = 'Case Management',
      userInfo,
      ...props
    },
    ref
  ) => {
    const { sidebarState, toggleSidebar, setMobileOpen } = useSidebarState()
    const { isMobile } = useResponsiveNavigation()
    
    // Use controlled collapsed state if provided, otherwise use internal state
    const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : sidebarState.collapsed
    const mobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : sidebarState.mobileOpen

    // Handle toggle
    const handleToggle = () => {
      if (onToggle) {
        onToggle()
      } else {
        if (isMobile) {
          // Only use internal state if not controlled
          if (controlledMobileOpen === undefined) {
            setMobileOpen(!mobileOpen)
          }
        } else {
          toggleSidebar()
        }
      }
    }

    // Handle navigation
    const handleNavigate = (href: string) => {
      if (onNavigate) {
        onNavigate(href)
      }
      
      // Close mobile sidebar after navigation
      if (isMobile) {
        // Only use internal state if not controlled
        if (controlledMobileOpen === undefined) {
          setMobileOpen(false)
        }
      }
    }

    // Close mobile sidebar when clicking outside
    React.useEffect(() => {
      if (!isMobile || !mobileOpen) return

      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.querySelector('[data-navigation-sidebar]')
        if (sidebar && !sidebar.contains(event.target as Node)) {
          // Only use internal state if not controlled
          if (controlledMobileOpen === undefined) {
            setMobileOpen(false)
          }
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobile, mobileOpen, setMobileOpen, controlledMobileOpen])

    // Close mobile sidebar on escape key
    React.useEffect(() => {
      if (!isMobile || !mobileOpen) return

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // Only use internal state if not controlled
          if (controlledMobileOpen === undefined) {
            setMobileOpen(false)
          }
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isMobile, mobileOpen, setMobileOpen, controlledMobileOpen])

    // Render logo
    const renderLogo = () => {
      if (!showLogo) return null

      return (
        <div className={cn(
          'flex items-center space-x-2',
          collapsed && 'justify-center'
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">CM</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-foreground">
              {logoText}
            </span>
          )}
        </div>
      )
    }

    // Render toggle button
    const renderToggleButton = () => {
      if (!showToggle) return null

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="h-8 w-8"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isMobile ? (
            <X className="h-4 w-4" />
          ) : collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )
    }

    // Render user info
    const renderUserInfo = () => {
      if (!userInfo) return null

      return (
        <div className={cn(
          'flex items-center space-x-3 p-3 rounded-lg bg-muted/50',
          collapsed && 'justify-center p-2'
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              userInfo.name.charAt(0).toUpperCase()
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userInfo.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userInfo.role}
              </p>
            </div>
          )}
        </div>
      )
    }

    return (
      <>
        {/* Mobile overlay */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          ref={ref}
          data-navigation-sidebar
          className={cn(
            sidebarVariants({
              collapsed: isMobile ? false : collapsed,
              mobile: isMobile,
              open: isMobile ? mobileOpen : true,
            }),
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className={cn(sidebarHeaderVariants({ collapsed: isMobile ? false : collapsed }))}>
            {renderLogo()}
            {renderToggleButton()}
          </div>

          {/* Navigation Content */}
          <div className={cn(sidebarContentVariants({ collapsed: isMobile ? false : collapsed }))}>
            <nav className="space-y-2 py-4" aria-label="Main navigation">
              {modules.map((module) => (
                <NavMenu
                  key={module.id}
                  items={module.items}
                  currentRoute={currentRoute}
                  collapsed={isMobile ? false : collapsed}
                  onNavigate={handleNavigate}
                  module={module}
                />
              ))}
            </nav>
          </div>

          {/* Footer */}
          {userInfo && (
            <div className={cn(sidebarFooterVariants({ collapsed: isMobile ? false : collapsed }))}>
              {renderUserInfo()}
            </div>
          )}
        </aside>
      </>
    )
  }
)

NavigationSidebar.displayName = 'NavigationSidebar'

// Mobile sidebar trigger button
export interface MobileSidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onToggle?: () => void
}

const MobileSidebarTrigger = React.forwardRef<HTMLButtonElement, MobileSidebarTriggerProps>(
  ({ onToggle, className, ...props }, ref) => {
    const { setMobileOpen } = useSidebarState()
    const { isMobile } = useResponsiveNavigation()

    const handleClick = () => {
      if (onToggle) {
        onToggle()
      } else {
        setMobileOpen(true)
      }
    }

    if (!isMobile) return null

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={cn('lg:hidden', className)}
        aria-label="Open navigation menu"
        {...props}
      >
        <Menu className="h-5 w-5" />
      </Button>
    )
  }
)

MobileSidebarTrigger.displayName = 'MobileSidebarTrigger'

// Sidebar provider for context
interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export const SidebarProvider: React.FC<{
  children: React.ReactNode
  defaultCollapsed?: boolean
}> = ({ children, defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  const toggle = React.useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const value = React.useMemo(
    () => ({
      collapsed,
      toggle,
      setCollapsed,
    }),
    [collapsed, toggle]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

// Sidebar wrapper with responsive behavior
export interface ResponsiveSidebarProps extends NavigationSidebarProps {
  breakpoint?: 'sm' | 'md' | 'lg'
}

const ResponsiveSidebar = React.forwardRef<HTMLElement, ResponsiveSidebarProps>(
  ({ breakpoint = 'lg', ...props }, ref) => {
    const { isMobile, isTablet, isDesktop } = useResponsiveNavigation()
    
    // Determine if sidebar should be visible based on breakpoint
    const shouldShowSidebar = React.useMemo(() => {
      switch (breakpoint) {
        case 'sm':
          return isDesktop
        case 'md':
          return isTablet || isDesktop
        case 'lg':
          return true
        default:
          return true
      }
    }, [breakpoint, isMobile, isTablet, isDesktop])

    if (!shouldShowSidebar) return null

    return <NavigationSidebar ref={ref} {...props} />
  }
)

ResponsiveSidebar.displayName = 'ResponsiveSidebar'

export {
  NavigationSidebar,
  MobileSidebarTrigger,
  ResponsiveSidebar,
  sidebarVariants,
  sidebarHeaderVariants,
  sidebarContentVariants,
  sidebarFooterVariants,
}
