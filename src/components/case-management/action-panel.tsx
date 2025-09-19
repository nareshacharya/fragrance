/**
 * Action panel component for case-specific operations with role-based action filtering
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { MoreHorizontal, ChevronDown, Loader2 } from 'lucide-react'
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
import type { ActionPanelProps as BaseActionPanelProps, CaseAction } from '@/types/navigation'

const actionPanelVariants = cva(
  'flex items-center justify-between w-full border-b border-border bg-background',
  {
    variants: {
      position: {
        top: 'border-b',
        bottom: 'border-t',
        floating: 'border rounded-lg shadow-sm',
      },
      size: {
        sm: 'h-12 px-3',
        md: 'h-14 px-4',
        lg: 'h-16 px-6',
      },
      variant: {
        default: 'bg-background',
        elevated: 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        transparent: 'bg-transparent border-transparent',
      },
    },
    defaultVariants: {
      position: 'top',
      size: 'md',
      variant: 'default',
    },
  }
)

const actionGroupVariants = cva(
  'flex items-center',
  {
    variants: {
      spacing: {
        tight: 'space-x-1',
        normal: 'space-x-2',
        loose: 'space-x-4',
      },
    },
    defaultVariants: {
      spacing: 'normal',
    },
  }
)

const actionButtonVariants = cva(
  'inline-flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
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

const bulkActionsVariants = cva(
  'flex items-center space-x-2',
  {
    variants: {
      visible: {
        true: 'opacity-100 translate-y-0',
        false: 'opacity-0 -translate-y-2 pointer-events-none',
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
)

export interface ActionPanelProps extends Omit<BaseActionPanelProps, 'className'> {
  position?: VariantProps<typeof actionPanelVariants>['position']
  size?: VariantProps<typeof actionPanelVariants>['size']
  variant?: VariantProps<typeof actionPanelVariants>['variant']
  showBulkActions?: boolean
  showPrimaryActions?: boolean
  showSecondaryActions?: boolean
  maxPrimaryActions?: number
  loading?: boolean
  disabled?: boolean
  title?: string
  description?: string
  className?: string
}

const ActionPanel = React.forwardRef<HTMLDivElement, ActionPanelProps>(
  (
    {
      actions,
      selectedCases,
      caseStatus,
      onActionClick,
      className,
      position = 'top',
      size = 'md',
      variant = 'default',
      showBulkActions = true,
      showPrimaryActions = true,
      showSecondaryActions = true,
      maxPrimaryActions = 3,
      loading = false,
      disabled = false,
      title,
      description,
      ...props
    },
    ref
  ) => {
    const { permissions } = usePermissions()
    const [confirmAction, setConfirmAction] = React.useState<{
      action: CaseAction
      caseIds: string[]
    } | null>(null)

    // Filter actions based on permissions and conditions
    const filteredActions = React.useMemo(() => {
      return actions.filter(action => {
        // Check permissions
        if (action.permissions && !action.permissions.some(p => permissions.some(userP => userP.name === p))) {
          return false
        }

        // Check conditions
        if (action.conditions) {
          return action.conditions.every(condition => {
            switch (condition.field) {
              case 'status':
                return condition.operator === 'equals' 
                  ? caseStatus === condition.value
                  : condition.operator === 'in'
                  ? condition.value.includes(caseStatus)
                  : condition.operator === 'not_equals'
                  ? caseStatus !== condition.value
                  : condition.operator === 'not_in'
                  ? !condition.value.includes(caseStatus)
                  : true
              default:
                return true
            }
          })
        }

        return true
      })
    }, [actions, permissions, caseStatus])

    // Separate actions by type
    const primaryActions = filteredActions.filter(action => 
      action.variant === 'primary' || !action.variant
    ).slice(0, maxPrimaryActions)

    const secondaryActions = filteredActions.filter(action => 
      action.variant === 'secondary' || action.variant === 'outline' || action.variant === 'ghost'
    )

    const bulkActions = filteredActions.filter(action => action.bulkAction)

    const destructiveActions = filteredActions.filter(action => action.variant === 'destructive')

    // Handle action click
    const handleActionClick = (action: CaseAction) => {
      if (action.disabled || disabled || loading) return

      const caseIds = action.bulkAction ? selectedCases : []

      if (action.requiresConfirmation) {
        setConfirmAction({ action, caseIds })
      } else {
        onActionClick?.(action, caseIds)
      }
    }

    // Confirm action
    const handleConfirmAction = () => {
      if (confirmAction) {
        onActionClick?.(confirmAction.action, confirmAction.caseIds)
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
          <span>{action.label}</span>
          {action.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {action.badge}
            </Badge>
          )}
        </>
      )

      if (action.description) {
        return (
          <Button
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

      return (
        <Button
          variant={action.variant || 'primary'}
          size={action.size || 'md'}
          disabled={isDisabled}
          onClick={() => handleActionClick(action)}
          className={cn(actionButtonVariants({
            size: action.size || 'md',
            variant: action.variant || 'primary',
            disabled: isDisabled,
          }))}
        >
          {buttonContent}
        </Button>
      )
    }

    // Render dropdown menu for secondary actions
    const renderSecondaryActionsDropdown = () => {
      if (secondaryActions.length === 0) return null

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={disabled || loading}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {secondaryActions.map((action) => (
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

    // Render bulk actions
    const renderBulkActions = () => {
      if (!showBulkActions || selectedCases.length === 0 || bulkActions.length === 0) {
        return null
      }

      return (
        <div className={cn(bulkActionsVariants({ visible: selectedCases.length > 0 }))}>
          <span className="text-sm text-muted-foreground">
            {selectedCases.length} selected
          </span>
          
          {bulkActions.map((action) => renderActionButton(action))}
        </div>
      )
    }

    // Render destructive actions dropdown
    const renderDestructiveActionsDropdown = () => {
      if (destructiveActions.length === 0) return null

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive" size="sm" disabled={disabled || loading}>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Destructive Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {destructiveActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled || disabled || loading}
                className="flex items-center space-x-2 text-destructive focus:text-destructive"
              >
                {action.icon && (
                  <span className="text-sm" aria-hidden="true">
                    {action.icon}
                  </span>
                )}
                <span>{action.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <>
        <div
          ref={ref}
          className={cn(actionPanelVariants({ position, size, variant }), className)}
          {...props}
        >
          {/* Left section - Title and description */}
          <div className="flex flex-col">
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

          {/* Center section - Bulk actions */}
          {showBulkActions && renderBulkActions()}

          {/* Right section - Action buttons */}
          <div className={cn(actionGroupVariants({ spacing: 'normal' }))}>
            {/* Primary actions */}
            {showPrimaryActions && primaryActions.map((action) => (
              <div key={action.id}>
                {renderActionButton(action)}
              </div>
            ))}

            {/* Secondary actions dropdown */}
            {showSecondaryActions && renderSecondaryActionsDropdown()}

            {/* Destructive actions dropdown */}
            {renderDestructiveActionsDropdown()}
          </div>
        </div>

        {/* Confirmation dialog */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                {confirmAction?.action.confirmationMessage || 
                 `Are you sure you want to perform "${confirmAction?.action.label}"?`}
              </DialogDescription>
            </DialogHeader>
            
            {confirmAction && (
              <div className="py-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Action:</span>
                    <span className="text-sm">{confirmAction.action.label}</span>
                  </div>
                  
                  {confirmAction.action.description && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="text-sm text-muted-foreground">
                        {confirmAction.action.description}
                      </span>
                    </div>
                  )}
                  
                  {confirmAction.caseIds.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Cases:</span>
                      <span className="text-sm">{confirmAction.caseIds.length} selected</span>
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
                className={confirmAction?.action.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
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

ActionPanel.displayName = 'ActionPanel'

// Compact action panel for tight spaces
export interface CompactActionPanelProps extends Omit<ActionPanelProps, 'size'> {
  showLabels?: boolean
}

const CompactActionPanel = React.forwardRef<HTMLDivElement, CompactActionPanelProps>(
  ({ showLabels = false, ...props }, ref) => {
    return (
      <ActionPanel
        ref={ref}
        size="sm"
        maxPrimaryActions={2}
        {...props}
      />
    )
  }
)

CompactActionPanel.displayName = 'CompactActionPanel'

// Floating action panel
export interface FloatingActionPanelProps extends Omit<ActionPanelProps, 'position'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const FloatingActionPanel = React.forwardRef<HTMLDivElement, FloatingActionPanelProps>(
  ({ position = 'bottom-right', className, ...props }, ref) => {
    const positionClasses = {
      'bottom-right': 'fixed bottom-4 right-4',
      'bottom-left': 'fixed bottom-4 left-4',
      'top-right': 'fixed top-4 right-4',
      'top-left': 'fixed top-4 left-4',
    }

    return (
      <ActionPanel
        ref={ref}
        position="floating"
        className={cn(positionClasses[position], className)}
        {...props}
      />
    )
  }
)

FloatingActionPanel.displayName = 'FloatingActionPanel'

// Action panel with search
export interface SearchableActionPanelProps extends ActionPanelProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showSearch?: boolean
}

const SearchableActionPanel = React.forwardRef<HTMLDivElement, SearchableActionPanelProps>(
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
    return (
      <div className={cn('flex flex-col space-y-2', className)}>
        {/* Search bar */}
        {showSearch && (
          <div className="px-4 py-2 border-b border-border">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        )}
        
        {/* Action panel */}
        <ActionPanel ref={ref} {...props} />
      </div>
    )
  }
)

SearchableActionPanel.displayName = 'SearchableActionPanel'

export {
  ActionPanel,
  CompactActionPanel,
  FloatingActionPanel,
  SearchableActionPanel,
  actionPanelVariants,
  actionGroupVariants,
  actionButtonVariants,
  bulkActionsVariants,
}
