import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { STANDARD_LABELS } from '../../lib/accessibility/constants'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      required?: boolean
      error?: boolean
      helperText?: string
    }
>(({ className, required = false, error = false, helperText, children, ...props }, ref) => {
  const labelId = React.useId()
  
  return (
    <>
      <LabelPrimitive.Root
        ref={ref}
        id={labelId}
        className={cn(
          labelVariants(),
          error && 'text-destructive',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive ml-1" aria-label={STANDARD_LABELS.REQUIRED_FIELD}>
            *
          </span>
        )}
      </LabelPrimitive.Root>
      {helperText && (
        <div 
          id={`${labelId}-helper`}
          className="text-sm text-muted-foreground mt-1"
          role="note"
        >
          {helperText}
        </div>
      )}
    </>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
