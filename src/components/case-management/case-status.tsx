/**
 * Case status indicator component with visual status representation and color coding
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { 
  Circle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Pause,
  Play
} from 'lucide-react'
import { CASE_STATUS, CASE_STATUS_COLORS, CASE_STATUS_LABELS } from '@/config/constants'
import type { CaseStatusProps as BaseCaseStatusProps } from '@/types/navigation'

const statusVariants = cva(
  'inline-flex items-center font-medium transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'text-xs px-2 py-1 rounded-md',
        md: 'text-sm px-3 py-1.5 rounded-lg',
        lg: 'text-base px-4 py-2 rounded-lg',
      },
      variant: {
        badge: 'rounded-full',
        pill: 'rounded-full',
        square: 'rounded-md',
        outline: 'border bg-transparent',
        solid: 'text-white',
        subtle: 'bg-opacity-10',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'badge',
    },
  }
)

const statusIconVariants = cva(
  'flex-shrink-0',
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

const statusLabelVariants = cva(
  'font-medium',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const pulseVariants = cva(
  'animate-pulse',
  {
    variants: {
      enabled: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      enabled: false,
    },
  }
)

export interface CaseStatusProps extends Omit<BaseCaseStatusProps, 'className'> {
  variant?: VariantProps<typeof statusVariants>['variant']
  showLabel?: boolean
  showPulse?: boolean
  onClick?: () => void
  disabled?: boolean
  customLabel?: string
  customColor?: string
  className?: string
}

const CaseStatus = React.forwardRef<HTMLDivElement, CaseStatusProps>(
  (
    {
      status,
      size = 'md',
      variant = 'badge',
      showIcon = true,
      showLabel = true,
      showPulse = false,
      className,
      onClick,
      disabled = false,
      customLabel,
      customColor,
      ...props
    },
    ref
  ) => {
    // Get status configuration
    const statusLabel = customLabel || CASE_STATUS_LABELS[status]
    const statusColor = customColor || CASE_STATUS_COLORS[status]
    
    // Get status icon
    const getStatusIcon = () => {
      if (!showIcon) return null

      const iconProps = {
        className: cn(statusIconVariants({ size })),
      }

      switch (status) {
        case CASE_STATUS.OPEN:
          return <Circle {...iconProps} />
        case CASE_STATUS.IN_PROGRESS:
          return <Play {...iconProps} />
        case CASE_STATUS.PENDING_REVIEW:
          return <Clock {...iconProps} />
        case CASE_STATUS.RESOLVED:
          return <CheckCircle {...iconProps} />
        case CASE_STATUS.CLOSED:
          return <XCircle {...iconProps} />
        default:
          return <AlertCircle {...iconProps} />
      }
    }

    // Get status styles based on variant
    const getStatusStyles = () => {
      const baseStyles = {
        color: statusColor,
        borderColor: statusColor,
      }

      switch (variant) {
        case 'badge':
          return {
            ...baseStyles,
            backgroundColor: `${statusColor}20`,
          }
        case 'pill':
          return {
            ...baseStyles,
            backgroundColor: `${statusColor}15`,
          }
        case 'square':
          return {
            ...baseStyles,
            backgroundColor: `${statusColor}10`,
          }
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            border: `1px solid ${statusColor}`,
          }
        case 'solid':
          return {
            color: 'white',
            backgroundColor: statusColor,
            borderColor: statusColor,
          }
        case 'subtle':
          return {
            ...baseStyles,
            backgroundColor: `${statusColor}08`,
          }
        default:
          return baseStyles
      }
    }

    // Handle click
    const handleClick = () => {
      if (!disabled && onClick) {
        onClick()
      }
    }

    const Component = onClick ? 'button' : 'div'

    return (
      <Component
        ref={ref}
        className={cn(
          statusVariants({ size, variant }),
          pulseVariants({ enabled: showPulse }),
          onClick && !disabled && 'cursor-pointer hover:opacity-80',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={getStatusStyles()}
        onClick={handleClick}
        disabled={disabled}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-label={`Case status: ${statusLabel}`}
        {...props}
      >
        {getStatusIcon()}
        {showLabel && (
          <span className={cn(statusLabelVariants({ size }), showIcon && 'ml-2')}>
            {statusLabel}
          </span>
        )}
      </Component>
    )
  }
)

CaseStatus.displayName = 'CaseStatus'

// Status badge variant using the Badge component
export interface CaseStatusBadgeProps extends Omit<CaseStatusProps, 'variant'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const CaseStatusBadge = React.forwardRef<HTMLDivElement, CaseStatusBadgeProps>(
  (
    {
      status,
      size = 'md',
      variant = 'default',
      showIcon = true,
      showLabel = true,
      className,
      ...props
    },
    ref
  ) => {
    const statusLabel = CASE_STATUS_LABELS[status]
    const statusColor = CASE_STATUS_COLORS[status]

    // Map status to badge variant
    const getBadgeVariant = () => {
      switch (status) {
        case CASE_STATUS.RESOLVED:
          return 'default'
        case CASE_STATUS.CLOSED:
          return 'destructive'
        case CASE_STATUS.PENDING_REVIEW:
          return 'secondary'
        default:
          return variant
      }
    }

    const getStatusIcon = () => {
      if (!showIcon) return null

      const iconProps = {
        className: cn(statusIconVariants({ size })),
      }

      switch (status) {
        case CASE_STATUS.OPEN:
          return <Circle {...iconProps} />
        case CASE_STATUS.IN_PROGRESS:
          return <Play {...iconProps} />
        case CASE_STATUS.PENDING_REVIEW:
          return <Clock {...iconProps} />
        case CASE_STATUS.RESOLVED:
          return <CheckCircle {...iconProps} />
        case CASE_STATUS.CLOSED:
          return <XCircle {...iconProps} />
        default:
          return <AlertCircle {...iconProps} />
      }
    }

    return (
      <Badge
        ref={ref}
        variant={getBadgeVariant()}
        className={cn(
          'inline-flex items-center',
          size === 'sm' && 'text-xs px-2 py-1',
          size === 'md' && 'text-sm px-3 py-1.5',
          size === 'lg' && 'text-base px-4 py-2',
          className
        )}
        style={{
          backgroundColor: variant === 'outline' ? 'transparent' : `${statusColor}20`,
          color: variant === 'outline' ? statusColor : 'inherit',
          borderColor: variant === 'outline' ? statusColor : 'transparent',
        }}
        {...props}
      >
        {getStatusIcon()}
        {showLabel && (
          <span className={cn(statusLabelVariants({ size }), showIcon && 'ml-2')}>
            {statusLabel}
          </span>
        )}
      </Badge>
    )
  }
)

CaseStatusBadge.displayName = 'CaseStatusBadge'

// Status indicator (icon only)
export interface CaseStatusIndicatorProps extends Omit<CaseStatusProps, 'showLabel' | 'variant'> {
  showTooltip?: boolean
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

const CaseStatusIndicator = React.forwardRef<HTMLDivElement, CaseStatusIndicatorProps>(
  (
    {
      status,
      size = 'md',
      showIcon = true,
      showTooltip = true,
      tooltipPosition = 'top',
      className,
      ...props
    },
    ref
  ) => {
    const statusLabel = CASE_STATUS_LABELS[status]
    const statusColor = CASE_STATUS_COLORS[status]

    const getStatusIcon = () => {
      if (!showIcon) return null

      const iconProps = {
        className: cn(statusIconVariants({ size })),
      }

      switch (status) {
        case CASE_STATUS.OPEN:
          return <Circle {...iconProps} />
        case CASE_STATUS.IN_PROGRESS:
          return <Play {...iconProps} />
        case CASE_STATUS.PENDING_REVIEW:
          return <Clock {...iconProps} />
        case CASE_STATUS.RESOLVED:
          return <CheckCircle {...iconProps} />
        case CASE_STATUS.CLOSED:
          return <XCircle {...iconProps} />
        default:
          return <AlertCircle {...iconProps} />
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          size === 'sm' && 'h-6 w-6',
          size === 'md' && 'h-8 w-8',
          size === 'lg' && 'h-10 w-10',
          className
        )}
        style={{
          backgroundColor: `${statusColor}20`,
          color: statusColor,
        }}
        title={showTooltip ? statusLabel : undefined}
        aria-label={`Case status: ${statusLabel}`}
        {...props}
      >
        {getStatusIcon()}
      </div>
    )
  }
)

CaseStatusIndicator.displayName = 'CaseStatusIndicator'

// Status list for displaying multiple statuses
export interface CaseStatusListProps {
  statuses: Array<{
    status: keyof typeof CASE_STATUS
    count: number
    label?: string
  }>
  size?: VariantProps<typeof statusVariants>['size']
  variant?: VariantProps<typeof statusVariants>['variant']
  showCounts?: boolean
  className?: string
}

const CaseStatusList = React.forwardRef<HTMLDivElement, CaseStatusListProps>(
  (
    {
      statuses,
      size = 'md',
      variant = 'badge',
      showCounts = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        {...props}
      >
        {statuses.map(({ status, count, label }) => (
          <CaseStatus
            key={status}
            status={status}
            size={size}
            variant={variant}
            customLabel={label}
            showIcon={false}
          >
            {showCounts && (
              <span className="ml-1 text-xs opacity-75">
                ({count})
              </span>
            )}
          </CaseStatus>
        ))}
      </div>
    )
  }
)

CaseStatusList.displayName = 'CaseStatusList'

// Status progress indicator
export interface CaseStatusProgressProps {
  currentStatus: keyof typeof CASE_STATUS
  size?: VariantProps<typeof statusVariants>['size']
  showLabels?: boolean
  className?: string
}

const CaseStatusProgress = React.forwardRef<HTMLDivElement, CaseStatusProgressProps>(
  (
    {
      currentStatus,
      size = 'md',
      showLabels = true,
      className,
      ...props
    },
    ref
  ) => {
    const statusOrder = [
      CASE_STATUS.OPEN,
      CASE_STATUS.IN_PROGRESS,
      CASE_STATUS.PENDING_REVIEW,
      CASE_STATUS.RESOLVED,
      CASE_STATUS.CLOSED,
    ]

    const currentIndex = statusOrder.indexOf(currentStatus)
    const progress = (currentIndex / (statusOrder.length - 1)) * 100

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status labels */}
        {showLabels && (
          <div className="flex justify-between text-xs text-gray-600">
            {statusOrder.map((status, index) => (
              <span
                key={status}
                className={cn(
                  index <= currentIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
                )}
              >
                {CASE_STATUS_LABELS[status]}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
)

CaseStatusProgress.displayName = 'CaseStatusProgress'

export {
  CaseStatus,
  CaseStatusBadge,
  CaseStatusIndicator,
  CaseStatusList,
  CaseStatusProgress,
  statusVariants,
  statusIconVariants,
  statusLabelVariants,
  pulseVariants,
}
