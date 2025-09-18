import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-400',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-700',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500 dark:border-green-500',
      },
      inputSize: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  success?: boolean
  helperText?: string
  errorText?: string
  successText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    inputSize, 
    error = false, 
    success = false, 
    helperText, 
    errorText, 
    successText,
    ...props 
  }, ref) => {
    // Determine variant based on error/success states
    const inputVariant = error ? 'error' : success ? 'success' : variant

    return (
      <div className="w-full">
        <input
          className={cn(inputVariants({ variant: inputVariant, inputSize, className }))}
          ref={ref}
          {...props}
        />
        {(helperText || errorText || successText) && (
          <p className={cn(
            'mt-1 text-sm',
            errorText ? 'text-red-600 dark:text-red-400' : 
            successText ? 'text-green-600 dark:text-green-400' : 
            'text-neutral-600 dark:text-neutral-400'
          )}>
            {errorText || successText || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
