import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useAnnouncement } from '@/lib/accessibility'
import { ARIA_ATTRIBUTES, ARIA_LABELS, FORM_DESCRIPTIONS } from '@/lib/accessibility/constants'

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
  required?: boolean
  describedBy?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  onValidationChange?: (isValid: boolean, error?: string) => void
  announceErrors?: boolean
  announceSuccess?: boolean
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
    required = false,
    describedBy,
    ariaLabel,
    ariaLabelledBy,
    onValidationChange,
    onChange,
    onBlur,
    id,
    announceErrors = true,
    announceSuccess = true,
    ...props 
  }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [validationError, setValidationError] = React.useState<string>('')
    const [isValid, setIsValid] = React.useState<boolean>(true)
    const { announceError, announceSuccess: announceSuccessHook } = useAnnouncement()

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!, [])

    // Generate unique IDs if not provided
    const inputId = id || `input-${React.useId()}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    // Determine variant based on error/success states
    const inputVariant = error || validationError ? 'error' : success ? 'success' : variant

    // Handle validation
    const validateInput = React.useCallback((value: string) => {
      let error = ''
      
      if (required && !value.trim()) {
        error = FORM_DESCRIPTIONS.REQUIRED_FIELD
      } else if (props.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = FORM_DESCRIPTIONS.INVALID_EMAIL
      } else if (props.type === 'url' && value) {
        try {
          new URL(value)
        } catch {
          error = FORM_DESCRIPTIONS.INVALID_URL
        }
      } else if (props.type === 'number' && value) {
        const num = parseFloat(value)
        const min = parseFloat(String(props.min || ''))
        const max = parseFloat(String(props.max || ''))

        if (isNaN(num)) {
          error = FORM_DESCRIPTIONS.INVALID_NUMBER
        } else if (!isNaN(min) && num < min) {
          error = `Value must be at least ${min}`
        } else if (!isNaN(max) && num > max) {
          error = `Value must be at most ${max}`
        }
      }

      const previousError = validationError
      setValidationError(error)
      setIsValid(!error)
      onValidationChange?.(!error, error)
      
      // Announce validation changes
      if (announceErrors && error && error !== previousError) {
        announceError(`${ariaLabel || 'Field'}: ${error}`)
      } else if (announceSuccess && !error && previousError) {
        announceSuccessHook(`${ariaLabel || 'Field'}: Valid`)
      }
      
      return !error
    }, [required, ariaLabel, props.type, props.min, props.max, onValidationChange, validationError, announceErrors, announceSuccess, announceError, announceSuccessHook])

    // Handle change
    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      validateInput(value)
      onChange?.(event)
    }, [validateInput, onChange])

    // Handle blur
    const handleBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      validateInput(event.target.value)
      onBlur?.(event)
    }, [validateInput, onBlur])

    // Build ARIA attributes
    const currentError = errorText || validationError
    const currentHelper = successText || helperText
    
    const ariaAttributes = {
      id: inputId,
      [ARIA_ATTRIBUTES.STATE_REQUIRED]: required,
      [ARIA_ATTRIBUTES.STATE_INVALID]: (!isValid || error || !!validationError),
      ...(ariaLabel && { [ARIA_ATTRIBUTES.PROP_LABEL]: ariaLabel }),
      ...(ariaLabelledBy && { [ARIA_ATTRIBUTES.PROP_LABELLEDBY]: ariaLabelledBy }),
      ...(describedBy && { [ARIA_ATTRIBUTES.PROP_DESCRIBEDBY]: describedBy }),
      ...(currentError && { [ARIA_ATTRIBUTES.PROP_DESCRIBEDBY]: errorId }),
      ...(currentHelper && !currentError && { [ARIA_ATTRIBUTES.PROP_DESCRIBEDBY]: helperId }),
    }

    return (
      <div className="w-full">
        <input
          ref={inputRef}
          className={cn(inputVariants({ variant: inputVariant, inputSize, className }))}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
          {...ariaAttributes}
        />
        
        {/* Error message */}
        {currentError && (
          <div 
            id={errorId} 
            className="error-message mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
            aria-live="assertive"
          >
            {currentError}
          </div>
        )}
        
        {/* Success message */}
        {successText && !currentError && (
          <div 
            id={helperId} 
            className="success-message mt-1 text-sm text-green-600 dark:text-green-400"
            role="status"
            aria-live="polite"
          >
            {successText}
          </div>
        )}
        
        {/* Helper text */}
        {helperText && !currentError && !successText && (
          <div 
            id={helperId} 
            className="info-message mt-1 text-sm text-neutral-600 dark:text-neutral-400"
          >
            {helperText}
          </div>
        )}
        
        {/* Required indicator */}
        {required && (
          <span className="sr-only" aria-label={ARIA_LABELS.REQUIRED_FIELD}>
            {ARIA_LABELS.REQUIRED_FIELD}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
