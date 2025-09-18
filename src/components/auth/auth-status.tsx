'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { 
  useAuthStatus, 
  useUserProfile, 
  useSessionTimeRemaining,
  useIsSessionExpiringSoon,
  usePermissions
} from '@/lib/auth'
import { LogoutButton } from './logout-button'
import type { AuthStatusProps } from '@/lib/auth'

/**
 * Authentication status component
 */
export function AuthStatus({ 
  showUserInfo = true, 
  showRole = true, 
  showPermissions = false,
  showSessionInfo = false,
  className = '' 
}: AuthStatusProps) {
  const authStatus = useAuthStatus()
  const userProfile = useUserProfile()
  const timeRemaining = useSessionTimeRemaining()
  const isExpiringSoon = useIsSessionExpiringSoon()
  const permissions = usePermissions()

  if (authStatus.isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Loading...</span>
      </div>
    )
  }

  if (!authStatus.isAuthenticated) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Not signed in</span>
        <Button size="sm" variant="outline" asChild>
          <a href="/login">Sign In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-success-600 dark:text-success-400">
            Signed in
          </span>
        </div>
        
        <LogoutButton variant="icon" />
      </div>

      {/* User Information */}
      {showUserInfo && authStatus.user && (
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                {userProfile.initials}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {userProfile.displayName}
            </p>
            {showRole && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline"
                  style={{ backgroundColor: userProfile.roleColor + '20', color: userProfile.roleColor }}
                  className="text-xs"
                >
                  {userProfile.roleLabel}
                </Badge>
                {authStatus.user.department && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {authStatus.user.department}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session Information */}
      {showSessionInfo && timeRemaining !== null && (
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center justify-between">
            <span>Session expires in:</span>
            <span className={`font-medium ${isExpiringSoon ? 'text-warning-600 dark:text-warning-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
              {timeRemaining} min
            </span>
          </div>
          {isExpiringSoon && (
            <div className="mt-1 text-warning-600 dark:text-warning-400">
              Session will expire soon
            </div>
          )}
        </div>
      )}

      {/* Permissions Summary */}
      {showPermissions && permissions && permissions.length > 0 && (
        <div className="text-xs">
          <div className="text-neutral-600 dark:text-neutral-400 mb-1">
            Permissions ({permissions.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 5).map((permission) => (
              <Badge key={permission.id} variant="outline" className="text-xs">
                {permission.name}
              </Badge>
            ))}
            {permissions.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{permissions.length - 5}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {authStatus.error && (
        <div className="p-2 bg-error-50 border border-error-200 rounded text-xs text-error-800 dark:bg-error-950 dark:border-error-800 dark:text-error-200">
          {authStatus.error}
        </div>
      )}
    </div>
  )
}

/**
 * Compact authentication status for headers
 */
export function CompactAuthStatus(props: Omit<AuthStatusProps, 'showUserInfo' | 'showRole' | 'showPermissions' | 'showSessionInfo'>) {
  return (
    <AuthStatus 
      {...props}
      showUserInfo={true}
      showRole={false}
      showPermissions={false}
      showSessionInfo={false}
    />
  )
}

/**
 * Detailed authentication status card
 */
export function DetailedAuthStatus(props: Omit<AuthStatusProps, 'className'>) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Authentication Status</CardTitle>
        <CardDescription>Current session and user information</CardDescription>
      </CardHeader>
      
      <CardContent>
        <AuthStatus 
          {...props}
          showUserInfo={true}
          showRole={true}
          showPermissions={true}
          showSessionInfo={true}
        />
      </CardContent>
    </Card>
  )
}

/**
 * Authentication status badge
 */
export function AuthStatusBadge() {
  const authStatus = useAuthStatus()
  
  if (authStatus.isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Loading...
      </Badge>
    )
  }
  
  if (!authStatus.isAuthenticated) {
    return (
      <Badge variant="destructive">
        Not Signed In
      </Badge>
    )
  }
  
  return (
    <Badge variant="success">
      Signed In
    </Badge>
  )
}

/**
 * Session timer component
 */
export function SessionTimer() {
  const timeRemaining = useSessionTimeRemaining()
  const isExpiringSoon = useIsSessionExpiringSoon()
  
  if (timeRemaining === null) {
    return null
  }
  
  return (
    <div className={`text-xs ${isExpiringSoon ? 'text-warning-600 dark:text-warning-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
      {timeRemaining > 0 ? (
        <>
          <span className="font-medium">{timeRemaining}</span> min remaining
          {isExpiringSoon && (
            <span className="ml-1 animate-pulse">⚠️</span>
          )}
        </>
      ) : (
        <span className="text-error-600 dark:text-error-400">Session expired</span>
      )}
    </div>
  )
}

/**
 * User role indicator
 */
export function UserRoleIndicator() {
  const userProfile = useUserProfile()
  
  if (!userProfile.user) {
    return null
  }
  
  return (
    <Badge 
      variant="outline"
      style={{ backgroundColor: userProfile.roleColor + '20', color: userProfile.roleColor }}
      className="text-xs"
    >
      {userProfile.roleLabel}
    </Badge>
  )
}

export default AuthStatus
