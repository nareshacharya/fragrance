import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { ARIA_ROLES } from '../../lib/accessibility/constants'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-success-100 text-success-900 hover:bg-success-200 dark:bg-success-800 dark:text-success-50 dark:hover:bg-success-700',
        warning: 'border-transparent bg-warning-100 text-warning-900 hover:bg-warning-200 dark:bg-warning-800 dark:text-warning-50 dark:hover:bg-warning-700',
        info: 'border-transparent bg-info-100 text-info-900 hover:bg-info-200 dark:bg-info-800 dark:text-info-50 dark:hover:bg-info-700',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1.5 text-sm',
        lg: 'px-3 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: 'success' | 'error' | 'warning' | 'info' | 'default'
  ariaLabel?: string
  role?: string
}

function Badge({ className, variant, size, status, ariaLabel, role, children, ...props }: BadgeProps) {
  // Determine variant based on status if not explicitly provided
  const badgeVariant = variant || (status ? status : 'default')
  
  // Generate accessible label
  const accessibleLabel = ariaLabel || (typeof children === 'string' ? children : undefined)
  
  return (
    <div 
      className={cn(badgeVariants({ variant: badgeVariant, size }), className)} 
      role={role || ARIA_ROLES.STATUS}
      aria-label={accessibleLabel}
      {...props}
    >
      {children}
      {status && !ariaLabel && (
        <span className="sr-only">
          Status: {status}
        </span>
      )}
    </div>
  )
}

export { Badge, badgeVariants }
