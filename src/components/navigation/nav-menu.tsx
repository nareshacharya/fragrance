/**
 * Navigation menu component with hierarchical structure and active state management
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NavigationMenuProps as BaseNavigationMenuProps, NavigationItem, ModuleConfig } from '@/types/navigation'

const menuVariants = cva(
  'w-full',
  {
    variants: {
      level: {
        0: '',
        1: 'ml-4',
        2: 'ml-8',
        3: 'ml-12',
      },
    },
    defaultVariants: {
      level: 0,
    },
  }
)

const menuItemVariants = cva(
  'group flex items-center w-full text-left transition-all duration-200 rounded-lg',
  {
    variants: {
      active: {
        true: 'bg-primary text-primary-foreground shadow-sm',
        false: 'hover:bg-accent hover:text-accent-foreground',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
      collapsed: {
        true: 'justify-center px-2',
        false: 'justify-start px-3',
      },
      level: {
        0: 'font-medium',
        1: 'text-sm font-normal',
        2: 'text-sm font-normal',
        3: 'text-xs font-normal',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
      collapsed: false,
      level: 0,
    },
  }
)

const menuItemContentVariants = cva(
  'flex items-center flex-1 min-w-0',
  {
    variants: {
      collapsed: {
        true: 'justify-center',
        false: 'justify-start',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

const menuItemIconVariants = cva(
  'flex-shrink-0 transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      active: {
        true: 'text-primary-foreground',
        false: 'text-muted-foreground group-hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  }
)

const menuItemLabelVariants = cva(
  'truncate transition-colors duration-200',
  {
    variants: {
      collapsed: {
        true: 'sr-only',
        false: 'ml-3',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

const menuItemBadgeVariants = cva(
  'flex-shrink-0 transition-colors duration-200',
  {
    variants: {
      collapsed: {
        true: 'sr-only',
        false: 'ml-auto',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

const submenuVariants = cva(
  'transition-all duration-200 ease-in-out overflow-hidden',
  {
    variants: {
      expanded: {
        true: 'max-h-96 opacity-100',
        false: 'max-h-0 opacity-0',
      },
    },
    defaultVariants: {
      expanded: false,
    },
  }
)

const expandButtonVariants = cva(
  'flex-shrink-0 transition-transform duration-200',
  {
    variants: {
      collapsed: {
        true: 'sr-only',
        false: 'ml-1',
      },
      expanded: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      collapsed: false,
      expanded: false,
    },
  }
)

export interface NavigationMenuProps extends Omit<BaseNavigationMenuProps, 'className'> {
  level?: number
  collapsed?: boolean
  module?: ModuleConfig
  className?: string
}

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  (
    {
      items,
      currentRoute,
      level = 0,
      collapsed = false,
      onNavigate,
      className,
      module,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

    // Auto-expand items that contain the current route
    React.useEffect(() => {
      const itemsToExpand = new Set<string>()
      
      const findExpandedItems = (items: NavigationItem[], parentIds: string[] = []) => {
        items.forEach(item => {
          const currentPath = [...parentIds, item.id]
          
          if (item.href === currentRoute) {
            // Expand all parent items
            parentIds.forEach(id => itemsToExpand.add(id))
          }
          
          if (item.children) {
            findExpandedItems(item.children, currentPath)
          }
        })
      }
      
      findExpandedItems(items)
      setExpandedItems(itemsToExpand)
    }, [items, currentRoute])

    // Handle item click
    const handleItemClick = (item: NavigationItem) => {
      if (item.disabled) return

      if (item.children && item.children.length > 0) {
        // Toggle submenu expansion
        setExpandedItems(prev => {
          const newSet = new Set(prev)
          if (newSet.has(item.id)) {
            newSet.delete(item.id)
          } else {
            newSet.add(item.id)
          }
          return newSet
        })
      } else if (item.href) {
        // Navigate to item
        if (onNavigate) {
          onNavigate(item.href)
        } else if (!item.external) {
          window.location.href = item.href
        } else {
          window.open(item.href, '_blank', 'noopener,noreferrer')
        }
      }
    }

    // Check if item is active
    const isItemActive = (item: NavigationItem): boolean => {
      if (item.href === currentRoute) return true
      
      // Check if any child is active
      if (item.children) {
        return item.children.some(child => isItemActive(child))
      }
      
      return false
    }

    // Render icon
    const renderIcon = (icon?: string, active: boolean = false) => {
      if (!icon) return null

      // Simple icon rendering - in a real app, you'd use a proper icon library
      return (
        <span
          className={cn(
            menuItemIconVariants({ size: 'md', active }),
            'text-center'
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )
    }

    // Render badge
    const renderBadge = (badge?: string | number) => {
      if (!badge) return null

      return (
        <Badge
          variant="secondary"
          className={cn(
            menuItemBadgeVariants({ collapsed }),
            'text-xs'
          )}
        >
          {badge}
        </Badge>
      )
    }

    // Render menu item
    const renderMenuItem = (item: NavigationItem) => {
      const isActive = isItemActive(item)
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems.has(item.id)

      return (
        <div key={item.id} className="w-full">
          <button
            type="button"
            className={cn(
              menuItemVariants({
                active: isActive,
                disabled: item.disabled,
                collapsed,
                level,
              })
            )}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={cn(menuItemContentVariants({ collapsed }))}>
              {renderIcon(item.icon, isActive)}
              
              {!collapsed && (
                <>
                  <span className={cn(menuItemLabelVariants({ collapsed }))}>
                    {item.label}
                  </span>
                  
                  {renderBadge(item.badge)}
                  
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        expandButtonVariants({ collapsed, expanded: isExpanded })
                      )}
                    />
                  )}
                </>
              )}
            </div>
          </button>

          {/* Submenu */}
          {hasChildren && (
            <div className={cn(submenuVariants({ expanded: isExpanded }))}>
              <div className="pt-1">
                <NavigationMenu
                  items={item.children!}
                  currentRoute={currentRoute}
                  level={level + 1}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          )}
        </div>
      )
    }

    // Render module header
    const renderModuleHeader = () => {
      if (!module || collapsed) return null

      return (
        <div className="mb-4">
          <div className="flex items-center space-x-2 px-3 py-2">
            {module.color && (
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: module.color }}
              />
            )}
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {module.label}
            </span>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(menuVariants({ level }), className)}
        {...props}
      >
        {level === 0 && renderModuleHeader()}
        
        <div className="space-y-1">
          {items.map(renderMenuItem)}
        </div>
      </div>
    )
  }
)

NavigationMenu.displayName = 'NavigationMenu'

// Collapsible menu item component
export interface CollapsibleMenuItemProps {
  item: NavigationItem
  currentRoute: string
  collapsed?: boolean
  level?: number
  onNavigate?: (href: string) => void
  onToggle?: (itemId: string) => void
  isExpanded?: boolean
  className?: string
}

const CollapsibleMenuItem = React.forwardRef<HTMLDivElement, CollapsibleMenuItemProps>(
  (
    {
      item,
      currentRoute,
      collapsed = false,
      level = 0,
      onNavigate,
      onToggle,
      isExpanded = false,
      className,
      ...props
    },
    ref
  ) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = item.href === currentRoute

    const handleToggle = () => {
      if (hasChildren && onToggle) {
        onToggle(item.id)
      } else if (item.href && onNavigate) {
        onNavigate(item.href)
      }
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <button
          type="button"
          className={cn(
            menuItemVariants({
              active: isActive,
              disabled: item.disabled,
              collapsed,
              level,
            })
          )}
          onClick={handleToggle}
          disabled={item.disabled}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          <div className={cn(menuItemContentVariants({ collapsed }))}>
            <span className={cn(menuItemIconVariants({ size: 'md', active: isActive }))}>
              {item.icon || '•'}
            </span>
            
            {!collapsed && (
              <>
                <span className={cn(menuItemLabelVariants({ collapsed }))}>
                  {item.label}
                </span>
                
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(menuItemBadgeVariants({ collapsed }), 'text-xs')}
                  >
                    {item.badge}
                  </Badge>
                )}
                
                {hasChildren && (
                  <ChevronRight
                    className={cn(
                      expandButtonVariants({ collapsed, expanded: isExpanded })
                    )}
                  />
                )}
              </>
            )}
          </div>
        </button>

        {/* Submenu */}
        {hasChildren && (
          <div className={cn(submenuVariants({ expanded: isExpanded }))}>
            <div className="pt-1">
              <NavigationMenu
                items={item.children!}
                currentRoute={currentRoute}
                level={level + 1}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
)

CollapsibleMenuItem.displayName = 'CollapsibleMenuItem'

// Menu group component
export interface MenuGroupProps {
  title?: string
  items: NavigationItem[]
  currentRoute: string
  collapsed?: boolean
  onNavigate?: (href: string) => void
  className?: string
}

const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  (
    {
      title,
      items,
      currentRoute,
      collapsed = false,
      onNavigate,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {title && !collapsed && (
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        
        <NavigationMenu
          items={items}
          currentRoute={currentRoute}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </div>
    )
  }
)

MenuGroup.displayName = 'MenuGroup'

// Menu search component
export interface MenuSearchProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  className?: string
}

const MenuSearch = React.forwardRef<HTMLInputElement, MenuSearchProps>(
  (
    {
      placeholder = 'Search navigation...',
      value = '',
      onChange,
      onClear,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('px-3 py-2', className)} {...props}>
        <div className="relative">
          <input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
    )
  }
)

MenuSearch.displayName = 'MenuSearch'

export {
  NavigationMenu,
  CollapsibleMenuItem,
  MenuGroup,
  MenuSearch,
  menuVariants,
  menuItemVariants,
  menuItemContentVariants,
  menuItemIconVariants,
  menuItemLabelVariants,
  menuItemBadgeVariants,
  submenuVariants,
  expandButtonVariants,
}

// Export NavMenu as an alias
export { NavigationMenu as NavMenu }
