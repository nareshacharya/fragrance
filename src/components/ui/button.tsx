import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useAnnouncement, useKeyboardNavigation } from '@/lib/accessibility'
import { ARIA_ATTRIBUTES, ARIA_LABELS } from '@/lib/accessibility/constants'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-ring',
        ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-ring',
        link: 'text-primary underline-offset-4 hover:underline focus:ring-ring',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-ring',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  pressed?: boolean
  expanded?: boolean
  controls?: string
  describedBy?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  onActivate?: () => void
  announceLoading?: boolean
  announceState?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    disabled, 
    children, 
    pressed,
    expanded,
    controls,
    describedBy,
    ariaLabel,
    ariaLabelledBy,
    onActivate,
    onClick,
    onKeyDown,
    announceLoading = true,
    announceState = true,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const { announce, announceLoading: announceLoadingHook, announceLoadingComplete: doAnnounceLoadingComplete } = useAnnouncement()
    const [isPressed, setIsPressed] = React.useState(pressed || false)
    const [isLoading, setIsLoading] = React.useState(loading)

    // Update loading state when prop changes
    React.useEffect(() => {
      if (loading !== isLoading) {
        setIsLoading(loading)
        if (announceLoading) {
          if (loading) {
            announceLoadingHook()
          } else {
            doAnnounceLoadingComplete()
          }
        }
      }
    }, [loading, isLoading, announceLoading, announceLoadingHook, doAnnounceLoadingComplete])

    // Update pressed state when prop changes
    React.useEffect(() => {
      setIsPressed(pressed || false)
    }, [pressed])

    // Build ARIA attributes
    const ariaAttributes = {
      ...(asChild && { role: ARIA_ATTRIBUTES.ROLE_BUTTON }),
      [ARIA_ATTRIBUTES.STATE_DISABLED]: (disabled || loading || isLoading).toString(),
      [ARIA_ATTRIBUTES.STATE_PRESSED]: isPressed ? 'true' : 'false',
      ...(expanded !== undefined && { [ARIA_ATTRIBUTES.STATE_EXPANDED]: expanded.toString() }),
      ...(controls && { [ARIA_ATTRIBUTES.PROP_CONTROLS]: controls }),
      ...(describedBy && { [ARIA_ATTRIBUTES.PROP_DESCRIBEDBY]: describedBy }),
      ...(ariaLabel && { [ARIA_ATTRIBUTES.PROP_LABEL]: ariaLabel }),
      ...(ariaLabelledBy && { [ARIA_ATTRIBUTES.PROP_LABELLEDBY]: ariaLabelledBy }),
      ...(loading || isLoading ? { 'aria-busy': 'true' } : {}),
    }

    const handleClickInternal = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (announceState && isPressed !== undefined) {
        const newPressedState = !isPressed
        setIsPressed(newPressedState)
        announce(`Button ${newPressedState ? 'pressed' : 'released'}`)
      }
      
      onActivate?.()
      onClick?.(event)
    }

    const handleKeyDownInternal = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleClickInternal(event as any)
      }
      onKeyDown?.(event)
    }

    const isDisabled = disabled || loading || isLoading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClickInternal}
        onKeyDown={handleKeyDownInternal}
        {...ariaAttributes}
        {...props}
      >
        {loading || isLoading ? (
          <>
            <span className="sr-only">{ARIA_LABELS.LOADING}</span>
            <span className="flex items-center" aria-hidden="true">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {children}
            </span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
