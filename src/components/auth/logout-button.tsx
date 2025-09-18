'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '../ui/modal'
import { useAuth } from '@/lib/auth'
import type { LogoutButtonProps } from '@/lib/auth'

/**
 * Logout button component with confirmation dialog
 */
export function LogoutButton({ 
  onLogout, 
  showConfirmation = true, 
  confirmationMessage = 'Are you sure you want to sign out?',
  variant = 'button',
  className = ''
}: LogoutButtonProps) {
  const router = useRouter()
  const { logout, authState } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await logout()
      
      // Call custom logout callback if provided
      if (onLogout) {
        onLogout()
      }
      
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  /**
   * Handle logout without confirmation
   */
  const handleDirectLogout = () => {
    if (showConfirmation) {
      return // This shouldn't be called if confirmation is required
    }
    
    handleLogout()
  }

  // Render different variants
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={showConfirmation ? undefined : handleDirectLogout}
        disabled={isLoggingOut || authState.isLoading}
        className={`p-2 ${className}`}
        title="Sign out"
      >
        {isLoggingOut ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
      </Button>
    )
  }

  if (variant === 'link') {
    return (
      <button
        onClick={showConfirmation ? undefined : handleDirectLogout}
        disabled={isLoggingOut || authState.isLoading}
        className={`text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 disabled:opacity-50 ${className}`}
      >
        {isLoggingOut ? 'Signing out...' : 'Sign out'}
      </button>
    )
  }

  // Default button variant
  if (showConfirmation) {
    return (
      <Modal>
        <ModalTrigger asChild>
          <Button
            variant="outline"
            disabled={isLoggingOut || authState.isLoading}
            className={className}
          >
            {isLoggingOut ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Signing out...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </span>
            )}
          </Button>
        </ModalTrigger>
        
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Sign Out</ModalTitle>
            <ModalDescription>
              {confirmationMessage}
            </ModalDescription>
          </ModalHeader>
          
          <ModalFooter>
            <ModalTrigger asChild>
              <Button variant="outline" disabled={isLoggingOut}>
                Cancel
              </Button>
            </ModalTrigger>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              loading={isLoggingOut}
            >
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleDirectLogout}
      disabled={isLoggingOut || authState.isLoading}
      className={className}
      loading={isLoggingOut}
    >
      {isLoggingOut ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}

/**
 * Simple logout button without confirmation
 */
export function SimpleLogoutButton(props: Omit<LogoutButtonProps, 'showConfirmation'>) {
  return <LogoutButton {...props} showConfirmation={false} />
}

/**
 * Logout button with icon only
 */
export function LogoutIconButton(props: Omit<LogoutButtonProps, 'variant'>) {
  return <LogoutButton {...props} variant="icon" />
}

/**
 * Logout link
 */
export function LogoutLink(props: Omit<LogoutButtonProps, 'variant'>) {
  return <LogoutButton {...props} variant="link" />
}

/**
 * Logout button with custom confirmation message
 */
export function LogoutButtonWithMessage(
  message: string, 
  props: Omit<LogoutButtonProps, 'confirmationMessage'>
) {
  return <LogoutButton {...props} confirmationMessage={message} />
}

export default LogoutButton
