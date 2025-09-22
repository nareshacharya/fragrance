'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth, validateCredentials, createCommonAuthErrors } from '@/lib/auth'
import type { LoginFormProps, AuthCredentials } from '@/lib/auth'
import { useAccessibleForm, useAnnouncement } from '../../lib/accessibility/hooks'
import { ScreenReaderAnnouncement } from '../ui/screen-reader-announcement'
import { ARIA_ROLES, STANDARD_LABELS } from '../../lib/accessibility/constants'

/**
 * Login form component with validation and error handling
 */
export function LoginForm({ 
  onSuccess, 
  onError, 
  redirectTo = '/', 
  showRememberMe = true,
  className = '' 
}: LoginFormProps) {
  const router = useRouter()
  const { login, authState } = useAuth()
  
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  
  // Accessibility form hook
  const formRef = React.useRef<HTMLFormElement>(null)
  const {
    errors: formErrors,
    successes: formSuccesses,
    hasErrors,
    hasSuccesses,
    setFieldError,
    setFieldSuccess,
    clearFieldError,
    clearFieldSuccess,
    clearAllErrors,
    clearAllSuccesses,
    getFieldError,
    getFieldSuccess,
    announceFormStatus,
    announceRequiredField
  } = useAccessibleForm({
    announceErrors: true,
    announceSuccess: true,
    announceRequired: true,
  })
  
  const { announce } = useAnnouncement()

  // Auto-fill with demo credentials for easier testing
  useEffect(() => {
    setFormData({
      email: 'demo@fragrance.com',
      password: 'DemoPassword123!',
      rememberMe: false,
    })
  }, [])

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: keyof AuthCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
      clearFieldError(field)
    }
  }

  /**
   * Handle field blur with validation
   */
  const handleFieldBlur = (fieldName: string) => {
    // Run validation for the specific field
    const validation = validateCredentials(formData)
    if (validation.errors[fieldName]) {
      setFieldError(fieldName, validation.errors[fieldName])
    } else {
      clearFieldError(fieldName)
    }
  }

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const validation = validateCredentials(formData)
    setErrors(validation.errors)
    
    // Update accessible form errors
    clearAllErrors()
    Object.entries(validation.errors).forEach(([field, error]) => {
      setFieldError(field, error)
    })
    
    return validation.isValid
  }

  /**
   * Handle form submission with accessibility features
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if account is locked
    if (isLocked) {
      announce('Account is locked. Please contact administrator.', {
        politeness: 'assertive',
        priority: 'high',
      })
      return
    }
    
    if (!validateForm()) {
      announceFormStatus('error', 'Please correct the errors and try again')
      return
    }

    setIsSubmitting(true)
    setErrors({})
    
    // Announce loading state
    announce('Signing in...')

    try {
      await login(formData)
      
      // Announce success
      announceFormStatus('success', 'Login successful. Redirecting...')
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess({} as any)
      }
      
      // Redirect to specified page or home
      router.push(redirectTo)
    } catch (error: any) {
      console.error('Login error:', error)
      
      setLoginAttempts(prev => prev + 1)
      
      // Lock account after 3 failed attempts
      if (loginAttempts >= 2) {
        setIsLocked(true)
        announce('Account locked due to multiple failed attempts. Please contact administrator.', {
          politeness: 'assertive',
          priority: 'high',
        })
        setErrors({ 
          email: 'Account locked due to multiple failed attempts. Please contact administrator.' 
        })
      } else {
        // Handle different types of errors
        let errorMessage = 'An error occurred during login'
        
        if (error.code === 'INVALID_CREDENTIALS') {
          errorMessage = 'Invalid email or password'
          setErrors({ 
            email: errorMessage,
            password: errorMessage 
          })
        } else if (error.code === 'ACCOUNT_LOCKED') {
          errorMessage = 'Account is locked. Please contact administrator.'
          setErrors({ 
            email: errorMessage 
          })
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error. Please check your connection and try again.'
          setErrors({ 
            email: errorMessage 
          })
        } else {
          errorMessage = error.message || 'An error occurred during login'
          setErrors({ 
            email: errorMessage 
          })
        }
        
        // Announce error to screen readers
        announceFormStatus('error', errorMessage)
      }
      
      // Call error callback if provided
      if (onError) {
        onError(error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h1 id="login-form-title" className="text-2xl font-bold text-gray-900">Sign In</h1>
        </div>
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-4"
          aria-labelledby="login-form-title"
          noValidate
        >
          {/* Live region for announcements */}
          <ScreenReaderAnnouncement />
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" required error={!!errors.email}>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange('email', e.target.value)
              }}
              onBlur={() => handleFieldBlur('email')}
              error={!!errors.email}
              errorText={errors.email}
              disabled={isSubmitting || isLocked}
              required
              autoComplete="email"
              autoFocus
              ariaLabel="Email address"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" required error={!!errors.password}>
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  handleInputChange('password', e.target.value)
                }}
                onBlur={() => handleFieldBlur('password')}
                error={!!errors.password}
                errorText={errors.password}
                disabled={isSubmitting || isLocked}
                required
                autoComplete="current-password"
                ariaLabel="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                onClick={() => {
                  setShowPassword(!showPassword)
                  announce(showPassword ? 'Password hidden' : 'Password visible')
                }}
                disabled={isSubmitting || isLocked}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          {showRememberMe && (
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                disabled={isSubmitting || isLocked}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                aria-describedby="rememberMe-description"
              />
              <Label htmlFor="rememberMe" className="text-sm text-neutral-600 dark:text-neutral-400">
                Remember me for 30 days
              </Label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLocked}
            loading={isSubmitting}
            ariaLabel={isSubmitting ? 'Signing in, please wait' : 'Sign in to your account'}
          >
            {isSubmitting ? 'Signing In...' : isLocked ? 'Account Locked' : 'Sign In'}
          </Button>
          
          {/* Account lock warning */}
          {isLocked && (
            <div 
              className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-md dark:bg-warning-950 dark:border-warning-800"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-warning-800 dark:text-warning-200">
                    Account locked due to multiple failed attempts. Please contact administrator.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Error Display */}
        {authState.error && (
          <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-md dark:bg-error-950 dark:border-error-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-error-800 dark:text-error-200">
                  {authState.error}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Login form with loading state
 */
export function LoginFormWithLoading() {
  const { authState } = useAuth()
  
  if (authState.isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-neutral-600 dark:text-neutral-400">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return <LoginForm />
}

/**
 * Compact login form for modals or sidebars
 */
export function CompactLoginForm(props: Omit<LoginFormProps, 'className'>) {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Sign In
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Access your account
        </p>
      </div>
      
      <LoginForm {...props} showRememberMe={false} />
    </div>
  )
}

export default LoginForm
