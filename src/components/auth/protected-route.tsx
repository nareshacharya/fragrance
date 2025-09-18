'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import type { ProtectedRouteProps } from '@/lib/auth'

/**
 * Protected route wrapper component
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
  allowedPermissions = [],
  redirectTo = '/login',
  fallbackComponent: FallbackComponent,
  loadingComponent: LoadingComponent
}: ProtectedRouteProps) {
  const router = useRouter()
  const { authState, hasAnyRole, hasPermission } = useAuth()

  // Show loading state
  if (authState.isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-neutral-600 dark:text-neutral-400">Loading...</span>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !authState.isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push(redirectTo)
      return null
    }
    
    if (FallbackComponent) {
      return <FallbackComponent />
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Authentication Required
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Please sign in to access this page.
          </p>
          <button
            onClick={() => router.push(redirectTo)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Check role requirements
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    if (typeof window !== 'undefined') {
      router.push('/unauthorized')
      return null
    }
    
    if (FallbackComponent) {
      return <FallbackComponent />
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">
            Required roles: {allowedRoles.join(', ')}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Check permission requirements
  if (allowedPermissions.length > 0) {
    const hasRequiredPermission = allowedPermissions.some(permission => 
      hasPermission(permission)
    )
    
    if (!hasRequiredPermission) {
      if (typeof window !== 'undefined') {
        router.push('/unauthorized')
        return null
      }
      
      if (FallbackComponent) {
        return <FallbackComponent />
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Permission Denied
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You don't have the required permissions to access this page.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">
              Required permissions: {allowedPermissions.join(', ')}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }
  }

  // Render children if all checks pass
  return <>{children}</>
}

/**
 * Higher-order component for protecting routes
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

/**
 * Route protection for specific roles
 */
export function RoleProtectedRoute({
  children,
  roles,
  requireAll = false,
  ...props
}: ProtectedRouteProps & { roles: string[]; requireAll?: boolean }) {
  const { hasAnyRole, hasAllRoles } = useAuth()
  
  const hasRequiredRole = requireAll ? hasAllRoles(roles) : hasAnyRole(roles)
  
  return (
    <ProtectedRoute
      {...props}
      allowedRoles={roles}
      fallbackComponent={() => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Access Denied
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You don't have the required role{requireAll ? 's' : ''} to access this page.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">
              Required role{requireAll ? 's' : ''}: {roles.join(requireAll ? ' and ' : ' or ')}
            </p>
          </div>
        </div>
      )}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * Route protection for specific permissions
 */
export function PermissionProtectedRoute({
  children,
  permission,
  resource,
  action,
  ...props
}: ProtectedRouteProps & { 
  permission: string
  resource?: string
  action?: string
}) {
  const { hasPermission, canAccess } = useAuth()
  
  const hasRequiredPermission = resource && action 
    ? canAccess(resource, action)
    : hasPermission(permission)
  
  return (
    <ProtectedRoute
      {...props}
      allowedPermissions={[permission]}
      fallbackComponent={() => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Permission Denied
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You don't have the required permission to access this page.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">
              Required permission: {permission}
              {resource && action && ` (${resource}:${action})`}
            </p>
          </div>
        </div>
      )}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * Admin-only route protection
 */
export function AdminProtectedRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <RoleProtectedRoute roles={['administrator']} {...props}>
      {children}
    </RoleProtectedRoute>
  )
}

/**
 * Lab manager or higher route protection
 */
export function LabManagerProtectedRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <RoleProtectedRoute 
      roles={['administrator', 'lab_manager']} 
      {...props}
    >
      {children}
    </RoleProtectedRoute>
  )
}

/**
 * Project manager or higher route protection
 */
export function ProjectManagerProtectedRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <RoleProtectedRoute 
      roles={['administrator', 'lab_manager', 'project_manager']} 
      {...props}
    >
      {children}
    </RoleProtectedRoute>
  )
}

export default ProtectedRoute
