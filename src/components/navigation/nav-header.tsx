/**
 * Navigation header component with breadcrumbs, user info, and global actions
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Bell, Search, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { MobileSidebarTrigger } from './sidebar'
import { useResponsiveNavigation } from '@/hooks/use-navigation'
import { useUserProfile, useAuthStatus } from '@/lib/auth/hooks'
import type { BreadcrumbItem } from '@/types/navigation'

const headerVariants = cva(
  'sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  {
    variants: {
      size: {
        sm: 'h-12',
        md: 'h-16',
        lg: 'h-20',
      },
      variant: {
        default: '',
        elevated: 'shadow-sm',
        transparent: 'bg-transparent border-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

const headerContentVariants = cva(
  'flex items-center justify-between w-full h-full px-4',
  {
    variants: {
      size: {
        sm: 'px-3',
        md: 'px-4',
        lg: 'px-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const headerLeftVariants = cva(
  'flex items-center space-x-4',
  {
    variants: {
      size: {
        sm: 'space-x-2',
        md: 'space-x-4',
        lg: 'space-x-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const headerCenterVariants = cva(
  'flex-1 flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'px-2',
        md: 'px-4',
        lg: 'px-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const headerRightVariants = cva(
  'flex items-center space-x-2',
  {
    variants: {
      size: {
        sm: 'space-x-1',
        md: 'space-x-2',
        lg: 'space-x-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const breadcrumbContainerVariants = cva(
  'flex items-center',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const searchButtonVariants = cva(
  'relative inline-flex items-center justify-center transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground rounded-md',
        ghost: 'hover:bg-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

const notificationButtonVariants = cva(
  'relative inline-flex items-center justify-center transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground rounded-md',
        ghost: 'hover:bg-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface NavigationHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  showSidebarToggle?: boolean
  showBreadcrumbs?: boolean
  onSidebarToggle?: () => void
  onNavigate?: (href: string) => void
  className?: string
  size?: VariantProps<typeof headerVariants>['size']
  variant?: VariantProps<typeof headerVariants>['variant']
  showSearch?: boolean
  showNotifications?: boolean
  showSettings?: boolean
  showUserMenu?: boolean
  notificationCount?: number
  onSearchClick?: () => void
  onNotificationClick?: () => void
  onSettingsClick?: () => void
  onUserMenuClick?: () => void
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  userInfo?: {
    name: string
    role: string
    avatar?: string
  }
}

const NavigationHeader = React.forwardRef<HTMLElement, NavigationHeaderProps>(
  (
    {
      breadcrumbs,
      showSidebarToggle = true,
      showBreadcrumbs = true,
      onSidebarToggle,
      onNavigate,
      className,
      size = 'md',
      variant = 'default',
      showSearch = true,
      showNotifications = true,
      showSettings = true,
      showUserMenu = true,
      notificationCount = 0,
      onSearchClick,
      onNotificationClick,
      onSettingsClick,
      onUserMenuClick,
      title,
      subtitle,
      actions,
      userInfo,
      ...props
    },
    ref
  ) => {
    const { isMobile, isTablet } = useResponsiveNavigation()
    const authStatus = useAuthStatus()
    const userProfile = useUserProfile()

    // Use provided user info or fallback to auth context
    const displayUserInfo = userInfo || (authStatus.user ? {
      name: userProfile.displayName,
      role: userProfile.roleLabel,
      avatar: userProfile.avatar,
    } : undefined)

    // Render sidebar toggle
    const renderSidebarToggle = () => {
      if (!showSidebarToggle) return null

      return (
        <MobileSidebarTrigger onToggle={onSidebarToggle || (() => {})} />
      )
    }

    // Render page title
    const renderPageTitle = () => {
      if (!title) return null

      return (
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )
    }

    // Render breadcrumbs
    const renderBreadcrumbs = () => {
      if (breadcrumbs.length === 0) return null

      return (
        <div className={cn(breadcrumbContainerVariants({ size }))}>
          <Breadcrumb
            items={breadcrumbs}
            onNavigate={onNavigate || (() => {})}
            variant={size === 'sm' ? 'compact' : 'default'}
            maxItems={isMobile ? 3 : isTablet ? 4 : 5}
          />
        </div>
      )
    }

    // Render search button
    const renderSearchButton = () => {
      if (!showSearch) return null

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSearchClick}
          className={cn(searchButtonVariants({ size, variant: 'default' }))}
          aria-label="Search"
        >
          <Search className={cn(
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          )} />
        </Button>
      )
    }

    // Render notifications button
    const renderNotificationsButton = () => {
      if (!showNotifications) return null

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationClick}
          className={cn(notificationButtonVariants({ size, variant: 'default' }))}
          aria-label="Notifications"
        >
          <Bell className={cn(
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          )} />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
        </Button>
      )
    }

    // Render settings button
    const renderSettingsButton = () => {
      if (!showSettings) return null

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className={cn(searchButtonVariants({ size, variant: 'default' }))}
          aria-label="Settings"
        >
          <Settings className={cn(
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          )} />
        </Button>
      )
    }

    // Render user menu
    const renderUserMenu = () => {
      if (!showUserMenu || !displayUserInfo) return null

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={onUserMenuClick}
            className="flex items-center space-x-2 px-2 py-1 h-auto"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {displayUserInfo.avatar ? (
                <img
                  src={displayUserInfo.avatar}
                  alt={displayUserInfo.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                displayUserInfo.name.charAt(0).toUpperCase()
              )}
            </div>
            {!isMobile && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">
                  {displayUserInfo.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {displayUserInfo.role}
                </span>
              </div>
            )}
          </Button>
        </div>
      )
    }

    // Render custom actions
    const renderActions = () => {
      if (!actions) return null

      return (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )
    }

    // Determine content layout based on screen size and props
    const shouldShowBreadcrumbs = showBreadcrumbs && breadcrumbs.length > 0 && !isMobile
    const shouldShowTitle = title && (isMobile || breadcrumbs.length === 0 || !showBreadcrumbs)

    return (
      <header
        ref={ref}
        className={cn(headerVariants({ size, variant }), className)}
        {...props}
      >
        <div className={cn(headerContentVariants({ size }))}>
          {/* Left section */}
          <div className={cn(headerLeftVariants({ size }))}>
            {renderSidebarToggle()}
            {shouldShowTitle && renderPageTitle()}
          </div>

          {/* Center section */}
          <div className={cn(headerCenterVariants({ size }))}>
            {shouldShowBreadcrumbs && renderBreadcrumbs()}
          </div>

          {/* Right section */}
          <div className={cn(headerRightVariants({ size }))}>
            {renderSearchButton()}
            {renderNotificationsButton()}
            {renderSettingsButton()}
            {renderActions()}
            {renderUserMenu()}
          </div>
        </div>
      </header>
    )
  }
)

NavigationHeader.displayName = 'NavigationHeader'

// Compact header for mobile
export interface CompactNavigationHeaderProps extends Omit<NavigationHeaderProps, 'size'> {}

const CompactNavigationHeader = React.forwardRef<HTMLElement, CompactNavigationHeaderProps>(
  ({ showBreadcrumbs = false, ...props }, ref) => {
    return (
      <NavigationHeader
        ref={ref}
        size="sm"
        showBreadcrumbs={showBreadcrumbs}
        showSearch={false}
        showSettings={false}
        {...props}
      />
    )
  }
)

CompactNavigationHeader.displayName = 'CompactNavigationHeader'

// Large header for prominent display
export interface LargeNavigationHeaderProps extends Omit<NavigationHeaderProps, 'size'> {
  showAllFeatures?: boolean
}

const LargeNavigationHeader = React.forwardRef<HTMLElement, LargeNavigationHeaderProps>(
  ({ showAllFeatures = true, ...props }, ref) => {
    return (
      <NavigationHeader
        ref={ref}
        size="lg"
        showSearch={showAllFeatures}
        showNotifications={showAllFeatures}
        showSettings={showAllFeatures}
        showUserMenu={showAllFeatures}
        {...props}
      />
    )
  }
)

LargeNavigationHeader.displayName = 'LargeNavigationHeader'

// Header with search bar
export interface SearchableNavigationHeaderProps extends NavigationHeaderProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showSearchBar?: boolean
}

const SearchableNavigationHeader = React.forwardRef<HTMLElement, SearchableNavigationHeaderProps>(
  (
    {
      searchValue = '',
      onSearchChange,
      searchPlaceholder = 'Search...',
      showSearchBar = false,
      ...props
    },
    ref
  ) => {
    const [isSearchOpen, setIsSearchOpen] = React.useState(showSearchBar)

    const handleSearchClick = () => {
      setIsSearchOpen(!isSearchOpen)
    }

    return (
      <header ref={ref} className={cn(headerVariants(), props.className)}>
        <div className={cn(headerContentVariants())}>
          {/* Left section */}
          <div className={cn(headerLeftVariants())}>
            {props.showSidebarToggle && (
              <MobileSidebarTrigger onToggle={props.onSidebarToggle || (() => {})} />
            )}
            {props.title && (
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">
                  {props.title}
                </h1>
                {props.subtitle && (
                  <p className="text-sm text-muted-foreground">
                    {props.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center section - Search */}
          <div className={cn(headerCenterVariants())}>
            {isSearchOpen ? (
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ) : (
              props.breadcrumbs.length > 0 && (
                <div className={cn(breadcrumbContainerVariants())}>
                  <Breadcrumb
                    items={props.breadcrumbs}
                    onNavigate={props.onNavigate || (() => {})}
                    maxItems={4}
                  />
                </div>
              )
            )}
          </div>

          {/* Right section */}
          <div className={cn(headerRightVariants())}>
            {!isSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchClick}
                className={cn(searchButtonVariants())}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {props.showNotifications && (
              <Button
                variant="ghost"
                size="icon"
                onClick={props.onNotificationClick}
                className={cn(notificationButtonVariants())}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {props.notificationCount && props.notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {props.notificationCount > 99 ? '99+' : props.notificationCount}
                  </Badge>
                )}
              </Button>
            )}
            
            {props.showSettings && (
              <Button
                variant="ghost"
                size="icon"
                onClick={props.onSettingsClick}
                className={cn(searchButtonVariants())}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
            
            {props.actions}
            
            {props.showUserMenu && props.userInfo && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={props.onUserMenuClick}
                  className="flex items-center space-x-2 px-2 py-1 h-auto"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {props.userInfo.avatar ? (
                      <img
                        src={props.userInfo.avatar}
                        alt={props.userInfo.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      props.userInfo.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {props.userInfo.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {props.userInfo.role}
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }
)

SearchableNavigationHeader.displayName = 'SearchableNavigationHeader'

export {
  NavigationHeader,
  CompactNavigationHeader,
  LargeNavigationHeader,
  SearchableNavigationHeader,
  headerVariants,
  headerContentVariants,
  headerLeftVariants,
  headerCenterVariants,
  headerRightVariants,
  breadcrumbContainerVariants,
  searchButtonVariants,
  notificationButtonVariants,
}
