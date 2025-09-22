/**
 * Breadcrumb component with dynamic generation and custom configurations
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/types/navigation'
import { ARIA_ROLES } from '../../lib/accessibility/constants'

const breadcrumbVariants = cva(
  'flex items-center space-x-1 text-sm font-medium text-muted-foreground',
  {
    variants: {
      variant: {
        default: '',
        compact: 'text-xs space-x-0.5',
        large: 'text-base space-x-2',
      },
      separator: {
        slash: '',
        chevron: '',
        arrow: '',
        dot: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      separator: 'chevron',
    },
  }
)

const breadcrumbItemVariants = cva(
  'inline-flex items-center transition-colors duration-200',
  {
    variants: {
      state: {
        current: 'text-foreground font-semibold',
        link: 'text-muted-foreground hover:text-foreground cursor-pointer',
        disabled: 'text-muted-foreground/50 cursor-not-allowed',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      state: 'link',
      size: 'md',
    },
  }
)

const separatorVariants = cva(
  'flex-shrink-0 text-muted-foreground/50',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: BreadcrumbItem[]
  maxItems?: number
  onNavigate?: (href: string) => void
  showHome?: boolean
  homeHref?: string
  homeLabel?: string
  collapseFrom?: number
  className?: string
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      maxItems = 5,
      onNavigate,
      showHome = false,
      homeHref = '/',
      homeLabel = 'Home',
      collapseFrom = 2,
      variant = 'default',
      separator = 'chevron',
      className,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [expandedItems, setExpandedItems] = React.useState<number[]>([])

    // Handle item click
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      if (item.disabled || item.current) return

      if (onNavigate && item.href) {
        onNavigate(item.href)
      } else if (item.href && !item.external) {
        window.location.href = item.href
      } else if (item.href && item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer')
      }
    }

    // Get separator component
    const getSeparator = (index: number) => {
      const size = variant === 'compact' ? 'sm' : variant === 'large' ? 'lg' : 'md'
      
      switch (separator) {
        case 'slash':
          return <span className={cn(separatorVariants({ size }), 'mx-1')}>/</span>
        case 'chevron':
          return <ChevronRight className={cn(separatorVariants({ size }), 'mx-1')} />
        case 'arrow':
          return <span className={cn(separatorVariants({ size }), 'mx-1')}>→</span>
        case 'dot':
          return <span className={cn(separatorVariants({ size }), 'mx-1')}>•</span>
        default:
          return <ChevronRight className={cn(separatorVariants({ size }), 'mx-1')} />
      }
    }

    // Process items for display
    const processedItems = React.useMemo(() => {
      let displayItems = [...items]

      // Add home item if requested
      if (showHome) {
        displayItems = [
          {
            label: homeLabel,
            href: homeHref,
            icon: 'Home',
            current: false,
            disabled: false,
          },
          ...displayItems,
        ]
      }

      // Handle overflow with collapse
      if (displayItems.length > maxItems && !isCollapsed) {
        const shouldCollapse = displayItems.length > maxItems
        if (shouldCollapse) {
          const startItems = displayItems.slice(0, collapseFrom)
          const endItems = displayItems.slice(-(maxItems - collapseFrom - 1))
          
          return [
            ...startItems,
            {
              label: '...',
              disabled: true,
              current: false,
            },
            ...endItems,
          ]
        }
      }

      return displayItems
    }, [items, maxItems, isCollapsed, collapseFrom, showHome, homeHref, homeLabel])

    // Render breadcrumb item
    const renderItem = (item: BreadcrumbItem, index: number) => {
      const isLast = index === processedItems.length - 1
      const itemState = item.current || isLast ? 'current' : item.disabled ? 'disabled' : 'link'
      const size = variant === 'compact' ? 'sm' : variant === 'large' ? 'lg' : 'md'

      return (
        <React.Fragment key={`${item.label}-${index}`}>
          <span
            className={cn(breadcrumbItemVariants({ state: itemState, size }))}
            onClick={() => handleItemClick(item, index)}
            role={item.href && !item.disabled ? 'button' : undefined}
            tabIndex={item.href && !item.disabled ? 0 : -1}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && item.href && !item.disabled) {
                e.preventDefault()
                handleItemClick(item, index)
              }
            }}
            aria-current={item.current ? 'page' : undefined}
            aria-disabled={item.disabled}
          >
            {item.icon === 'Home' && <Home className="mr-1 h-3 w-3" />}
            {item.icon && item.icon !== 'Home' && (
              <span className="mr-1 text-xs" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </span>
          {!isLast && getSeparator(index)}
        </React.Fragment>
      )
    }

    return (
      <nav
        ref={ref}
        className={cn(breadcrumbVariants({ variant, separator }), className)}
        aria-label="Breadcrumb navigation"
        {...props}
      >
        <ol className="flex items-center space-x-1" role="list">
          {processedItems.map((item, index) => renderItem(item, index))}
        </ol>

        {/* Overflow indicator */}
        {items.length > maxItems && (
          <button
            type="button"
            className="ml-2 text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Show more breadcrumbs' : 'Show fewer breadcrumbs'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? 'Show more' : 'Show less'}
          </button>
        )}
        
        {/* Screen reader only current location */}
        <span className="sr-only">
          Current location: {processedItems[processedItems.length - 1]?.label || 'Unknown'}
        </span>
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'

// Breadcrumb item component for manual construction
export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  item: BreadcrumbItem
  onNavigate?: (href: string) => void
  variant?: VariantProps<typeof breadcrumbItemVariants>['variant']
  size?: VariantProps<typeof breadcrumbItemVariants>['size']
}

const BreadcrumbItemComponent = React.forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ item, onNavigate, variant = 'link', size = 'md', className, ...props }, ref) => {
    const handleClick = () => {
      if (item.disabled || item.current) return

      if (onNavigate && item.href) {
        onNavigate(item.href)
      } else if (item.href && !item.external) {
        window.location.href = item.href
      } else if (item.href && item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer')
      }
    }

    const state = item.current ? 'current' : item.disabled ? 'disabled' : variant

    return (
      <span
        ref={ref}
        className={cn(breadcrumbItemVariants({ state, size }), className)}
        onClick={handleClick}
        role={item.href && !item.disabled ? 'button' : undefined}
        tabIndex={item.href && !item.disabled ? 0 : -1}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && item.href && !item.disabled) {
            e.preventDefault()
            handleClick()
          }
        }}
        aria-current={item.current ? 'page' : undefined}
        aria-disabled={item.disabled}
        {...props}
      >
        {item.icon === 'Home' && <Home className="mr-1 h-3 w-3" />}
        {item.icon && item.icon !== 'Home' && (
          <span className="mr-1 text-xs" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="truncate">{item.label}</span>
      </span>
    )
  }
)

BreadcrumbItemComponent.displayName = 'BreadcrumbItem'

// Breadcrumb separator component
export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  separator?: VariantProps<typeof breadcrumbVariants>['separator']
  size?: VariantProps<typeof separatorVariants>['size']
}

const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ separator = 'chevron', size = 'md', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(separatorVariants({ size }), 'mx-1', className)}
        aria-hidden="true"
        {...props}
      >
        {separator === 'slash' && '/'}
        {separator === 'chevron' && <ChevronRight />}
        {separator === 'arrow' && '→'}
        {separator === 'dot' && '•'}
      </span>
    )
  }
)

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

// Breadcrumb root component with context
interface BreadcrumbContextValue {
  variant: VariantProps<typeof breadcrumbVariants>['variant']
  separator: VariantProps<typeof breadcrumbVariants>['separator']
  onNavigate?: (href: string) => void
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  variant: 'default',
  separator: 'chevron',
})

const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ variant = 'default', separator = 'chevron', onNavigate, ...props }, ref) => {
    const contextValue = React.useMemo(
      () => ({ variant, separator, onNavigate }),
      [variant, separator, onNavigate]
    )

    return (
      <BreadcrumbContext.Provider value={contextValue}>
        <Breadcrumb ref={ref} variant={variant} separator={separator} onNavigate={onNavigate} {...props} />
      </BreadcrumbContext.Provider>
    )
  }
)

BreadcrumbRoot.displayName = 'BreadcrumbRoot'

// Hook to use breadcrumb context
const useBreadcrumbContext = () => {
  const context = React.useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('Breadcrumb components must be used within a BreadcrumbRoot')
  }
  return context
}

// Compact breadcrumb for tight spaces
export interface CompactBreadcrumbProps extends Omit<BreadcrumbProps, 'variant'> {
  maxItems?: number
}

const CompactBreadcrumb = React.forwardRef<HTMLElement, CompactBreadcrumbProps>(
  ({ maxItems = 3, ...props }, ref) => {
    return (
      <Breadcrumb
        ref={ref}
        variant="compact"
        maxItems={maxItems}
        separator="slash"
        {...props}
      />
    )
  }
)

CompactBreadcrumb.displayName = 'CompactBreadcrumb'

// Large breadcrumb for prominent display
export interface LargeBreadcrumbProps extends Omit<BreadcrumbProps, 'variant'> {
  showHome?: boolean
}

const LargeBreadcrumb = React.forwardRef<HTMLElement, LargeBreadcrumbProps>(
  ({ showHome = true, ...props }, ref) => {
    return (
      <Breadcrumb
        ref={ref}
        variant="large"
        showHome={showHome}
        separator="chevron"
        {...props}
      />
    )
  }
)

LargeBreadcrumb.displayName = 'LargeBreadcrumb'

export {
  Breadcrumb,
  BreadcrumbRoot,
  BreadcrumbItemComponent as BreadcrumbItem,
  BreadcrumbSeparator,
  CompactBreadcrumb,
  LargeBreadcrumb,
  useBreadcrumbContext,
  breadcrumbVariants,
  breadcrumbItemVariants,
  separatorVariants,
}
