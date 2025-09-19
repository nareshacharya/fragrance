/**
 * Quick actions component for common case operations with proper permission checking
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { MoreHorizontal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { usePermissions } from '@/lib/auth/hooks'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import type { QuickActionsProps as BaseQuickActionsProps, CaseAction } from '@/types/navigation'

const quickActionsVariants = cva(
  'flex items-center space-x-2',
  {
    variants: {
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col space-y-2',
        grid: 'grid grid-cols-2 gap-2',
        wrap: 'flex-wrap',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      spacing: {
        tight: 'space-x-1',
        normal: 'space-x-2',
        loose: 'space-x-4',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      size: 'md',
      spacing: 'normal',
    },
  }
)

const actionButtonVariants = cva(
  'inline-flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-base',
      },
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      disabled: false,
    },
  }
)

const dropdownButtonVariants = cva(
  'inline-flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-9 w-9',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface QuickActionsProps extends Omit<BaseQuickActionsProps, 'className'> {
  layout?: VariantProps<typeof quickActionsVariants>['layout']
  size?: VariantProps<typeof quickActionsVariants>['size']
  spacing?: VariantProps<typeof quickActionsVariants>['spacing']
  maxVisible?: number
  showDropdown?: boolean
  showLabels?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  description?: string
  className?: string
}

const QuickActions = React.forwardRef<HTMLDivElement, QuickActionsProps>(
  (
    {
      actions,
      selectedCases,
      onActionClick,
      className,
      layout = 'horizontal',
      size = 'md',
      spacing = 'normal',
      maxVisible = 3,
      showDropdown = true,
      showLabels = true,
      loading = false,
      disabled = false,
      title,
      description,
      ...props
    },
    ref
  ) => {
    const { permissions } = usePermissions()
    const [confirmAction, setConfirmAction] = React.useState<CaseAction | null>(null)

    // Filter actions based on permissions and conditions
    const filteredActions = React.useMemo(() => {
      return actions.filter(action => {
        // Check permissions
        if (action.permissions && !action.permissions.some(p => permissions.some(userP => userP.name === p))) {
          return false
        }

        // Check if action is disabled
        if (action.disabled) {
          return false
        }

        return true
      })
    }, [actions, permissions])

    // Separate visible and dropdown actions
    const visibleActions = filteredActions.slice(0, maxVisible)
    const dropdownActions = filteredActions.slice(maxVisible)

    // Handle action click
    const handleActionClick = (action: CaseAction) => {
      if (action.disabled || disabled || loading) return

      if (action.requiresConfirmation) {
        setConfirmAction(action)
      } else {
        onActionClick?.(action)
      }
    }

    // Confirm action
    const handleConfirmAction = () => {
      if (confirmAction) {
        onActionClick?.(confirmAction)
        setConfirmAction(null)
      }
    }

    // Cancel confirmation
    const handleCancelAction = () => {
      setConfirmAction(null)
    }

    // Render action button
    const renderActionButton = (action: CaseAction, showIcon = true) => {
      const isDisabled = action.disabled || disabled || loading
      const isLoading = action.loading || loading

      const buttonContent = (
        <>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && showIcon && action.icon && (
            <span className="mr-2 text-sm" aria-hidden="true">
              {action.icon}
            </span>
          )}
          {showLabels && <span>{action.label}</span>}
          {action.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {action.badge}
            </Badge>
          )}
        </>
      )

      return (
        <Button
          key={action.id}
          variant={action.variant || 'primary'}
          size={action.size || 'md'}
          disabled={isDisabled}
          onClick={() => handleActionClick(action)}
          className={cn(actionButtonVariants({
            size: action.size || 'md',
            variant: action.variant || 'primary',
            disabled: isDisabled,
          }))}
          title={action.description}
        >
          {buttonContent}
        </Button>
      )
    }

    // Render dropdown menu
    const renderDropdownMenu = () => {
      if (!showDropdown || dropdownActions.length === 0) return null

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={disabled || loading}
              className={cn(dropdownButtonVariants({ size }))}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {dropdownActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled || disabled || loading}
                className="flex items-center space-x-2"
              >
                {action.icon && (
                  <span className="text-sm" aria-hidden="true">
                    {action.icon}
                  </span>
                )}
                <span>{action.label}</span>
                {action.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {action.badge}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // Render selected cases indicator
    const renderSelectedIndicator = () => {
      if (selectedCases.length === 0) return null

      return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{selectedCases.length} selected</span>
          <Badge variant="outline" className="text-xs">
            {selectedCases.length}
          </Badge>
        </div>
      )
    }

    return (
      <>
        <div
          ref={ref}
          className={cn(
            quickActionsVariants({ layout, size, spacing }),
            className
          )}
          {...props}
        >
          {/* Title and description */}
          {(title || description) && (
            <div className="flex flex-col space-y-1">
              {title && (
                <h3 className="text-sm font-medium text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Selected cases indicator */}
          {renderSelectedIndicator()}

          {/* Action buttons */}
          <div className={cn(
            quickActionsVariants({ layout, spacing }),
            'flex-1'
          )}>
            {visibleActions.map((action) => renderActionButton(action))}
            {renderDropdownMenu()}
          </div>
        </div>

        {/* Confirmation dialog */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                {confirmAction?.confirmationMessage || 
                 `Are you sure you want to perform "${confirmAction?.label}"?`}
              </DialogDescription>
            </DialogHeader>
            
            {confirmAction && (
              <div className="py-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Action:</span>
                    <span className="text-sm">{confirmAction.label}</span>
                  </div>
                  
                  {confirmAction.description && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="text-sm text-muted-foreground">
                        {confirmAction.description}
                      </span>
                    </div>
                  )}
                  
                  {selectedCases.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Selected Cases:</span>
                      <span className="text-sm">{selectedCases.length}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelAction}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirmAction}
                className={confirmAction?.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

QuickActions.displayName = 'QuickActions'

// Compact quick actions for tight spaces
export interface CompactQuickActionsProps extends Omit<QuickActionsProps, 'layout' | 'showLabels'> {
  maxVisible?: number
}

const CompactQuickActions = React.forwardRef<HTMLDivElement, CompactQuickActionsProps>(
  ({ maxVisible = 2, ...props }, ref) => {
    return (
      <QuickActions
        ref={ref}
        layout="horizontal"
        showLabels={false}
        maxVisible={maxVisible}
        size="sm"
        {...props}
      />
    )
  }
)

CompactQuickActions.displayName = 'CompactQuickActions'

// Vertical quick actions for sidebar
export interface VerticalQuickActionsProps extends Omit<QuickActionsProps, 'layout'> {
  showLabels?: boolean
}

const VerticalQuickActions = React.forwardRef<HTMLDivElement, VerticalQuickActionsProps>(
  ({ showLabels = true, ...props }, ref) => {
    return (
      <QuickActions
        ref={ref}
        layout="vertical"
        showLabels={showLabels}
        spacing="tight"
        {...props}
      />
    )
  }
)

VerticalQuickActions.displayName = 'VerticalQuickActions'

// Grid quick actions for dashboard
export interface GridQuickActionsProps extends Omit<QuickActionsProps, 'layout'> {
  columns?: number
}

const GridQuickActions = React.forwardRef<HTMLDivElement, GridQuickActionsProps>(
  ({ columns = 2, className, ...props }, ref) => {
    return (
      <QuickActions
        ref={ref}
        layout="grid"
        className={cn(
          `grid-cols-${columns}`,
          className
        )}
        {...props}
      />
    )
  }
)

GridQuickActions.displayName = 'GridQuickActions'

// Floating quick actions
export interface FloatingQuickActionsProps extends Omit<QuickActionsProps, 'layout'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const FloatingQuickActions = React.forwardRef<HTMLDivElement, FloatingQuickActionsProps>(
  ({ position = 'bottom-right', className, ...props }, ref) => {
    const positionClasses = {
      'bottom-right': 'fixed bottom-4 right-4',
      'bottom-left': 'fixed bottom-4 left-4',
      'top-right': 'fixed top-4 right-4',
      'top-left': 'fixed top-4 left-4',
    }

    return (
      <QuickActions
        ref={ref}
        layout="vertical"
        className={cn(
          positionClasses[position],
          'bg-background border border-border rounded-lg shadow-lg p-4',
          className
        )}
        {...props}
      />
    )
  }
)

FloatingQuickActions.displayName = 'FloatingQuickActions'

// Quick actions with search
export interface SearchableQuickActionsProps extends QuickActionsProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showSearch?: boolean
}

const SearchableQuickActions = React.forwardRef<HTMLDivElement, SearchableQuickActionsProps>(
  (
    {
      searchValue = '',
      onSearchChange,
      searchPlaceholder = 'Search actions...',
      showSearch = false,
      className,
      ...props
    },
    ref
  ) => {
    const [filteredActions, setFilteredActions] = React.useState(props.actions)

    React.useEffect(() => {
      if (!searchValue.trim()) {
        setFilteredActions(props.actions)
        return
      }

      const filtered = props.actions.filter(action =>
        action.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        action.description?.toLowerCase().includes(searchValue.toLowerCase())
      )
      setFilteredActions(filtered)
    }, [props.actions, searchValue])

    return (
      <div className={cn('space-y-3', className)}>
        {/* Search bar */}
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        )}
        
        {/* Quick actions */}
        <QuickActions
          ref={ref}
          actions={filteredActions}
          {...props}
        />
      </div>
    )
  }
)

SearchableQuickActions.displayName = 'SearchableQuickActions'

export {
  QuickActions,
  CompactQuickActions,
  VerticalQuickActions,
  GridQuickActions,
  FloatingQuickActions,
  SearchableQuickActions,
  quickActionsVariants,
  actionButtonVariants,
  dropdownButtonVariants,
}
