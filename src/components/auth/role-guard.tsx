'use client'

import React from 'react'
import { useHasRole, useHasAnyRole, useHasAllRoles, useAuth } from '@/lib/auth'
import type { RoleGuardProps } from '@/lib/auth'

/**
 * Role guard component that conditionally renders content based on user roles
 */
export function RoleGuard({
  children,
  roles,
  requireAll = false,
  fallbackComponent: FallbackComponent,
  showFallback = true
}: RoleGuardProps) {
  const hasAnyRole = useHasAnyRole(roles)
  const hasAllRoles = useHasAllRoles(roles)
  
  const hasRequiredRole = requireAll ? hasAllRoles : hasAnyRole
  
  if (!hasRequiredRole) {
    if (showFallback && FallbackComponent) {
      return <FallbackComponent />
    }
    
    if (showFallback) {
      return (
        <div className="text-center py-8">
          <div className="text-neutral-500 dark:text-neutral-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm">Access restricted</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Required role{requireAll ? 's' : ''}: {roles.join(requireAll ? ' and ' : ' or ')}
            </p>
          </div>
        </div>
      )
    }
    
    return null
  }
  
  return <>{children}</>
}

/**
 * Permission guard component
 */
export function PermissionGuard({
  children,
  permission,
  resource,
  action,
  fallbackComponent: FallbackComponent,
  showFallback = true
}: {
  children: React.ReactNode
  permission: string
  resource?: string
  action?: string
  fallbackComponent?: React.ComponentType
  showFallback?: boolean
}) {
  const { canAccess, hasPermission } = useAuth()
  
  const hasRequiredPermission = resource && action 
    ? canAccess(resource, action)
    : hasPermission(permission)
  
  if (!hasRequiredPermission) {
    if (showFallback && FallbackComponent) {
      return <FallbackComponent />
    }
    
    if (showFallback) {
      return (
        <div className="text-center py-8">
          <div className="text-neutral-500 dark:text-neutral-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-sm">Permission required</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Required: {permission}
              {resource && action && ` (${resource}:${action})`}
            </p>
          </div>
        </div>
      )
    }
    
    return null
  }
  
  return <>{children}</>
}

/**
 * Administrator role guard
 */
export function AdminGuard({ children, ...props }: Omit<RoleGuardProps, 'roles'>) {
  return (
    <RoleGuard roles={['administrator']} {...props}>
      {children}
    </RoleGuard>
  )
}

/**
 * Lab manager or higher role guard
 */
export function LabManagerGuard({ children, ...props }: Omit<RoleGuardProps, 'roles'>) {
  return (
    <RoleGuard roles={['administrator', 'lab_manager']} {...props}>
      {children}
    </RoleGuard>
  )
}

/**
 * Project manager or higher role guard
 */
export function ProjectManagerGuard({ children, ...props }: Omit<RoleGuardProps, 'roles'>) {
  return (
    <RoleGuard roles={['administrator', 'lab_manager', 'project_manager']} {...props}>
      {children}
    </RoleGuard>
  )
}

/**
 * Palette manager or higher role guard
 */
export function PaletteManagerGuard({ children, ...props }: Omit<RoleGuardProps, 'roles'>) {
  return (
    <RoleGuard roles={['administrator', 'lab_manager', 'project_manager', 'palette_manager']} {...props}>
      {children}
    </RoleGuard>
  )
}

/**
 * Perfumer or higher role guard
 */
export function PerfumerGuard({ children, ...props }: Omit<RoleGuardProps, 'roles'>) {
  return (
    <RoleGuard roles={['administrator', 'lab_manager', 'project_manager', 'palette_manager', 'perfumer']} {...props}>
      {children}
    </RoleGuard>
  )
}

/**
 * User management permission guard
 */
export function UserManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="users:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Perfume management permission guard
 */
export function PerfumeManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="perfumes:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Formula management permission guard
 */
export function FormulaManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="formulas:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Project management permission guard
 */
export function ProjectManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="projects:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Case management permission guard
 */
export function CaseManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="cases:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Ingredient management permission guard
 */
export function IngredientManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="ingredients:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Report management permission guard
 */
export function ReportManagementGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="reports:manage" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * System admin permission guard
 */
export function SystemAdminGuard({ children, ...props }: Omit<RoleGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="system:admin" {...props}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Higher-order component for role-based rendering
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  roles: string[],
  options: Omit<RoleGuardProps, 'children' | 'roles'> = {}
) {
  return function RoleGuardedComponent(props: P) {
    return (
      <RoleGuard roles={roles} {...options}>
        <Component {...props} />
      </RoleGuard>
    )
  }
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  permission: string,
  options: Omit<RoleGuardProps, 'children' | 'permission'> = {}
) {
  return function PermissionGuardedComponent(props: P) {
    return (
      <PermissionGuard permission={permission} {...options}>
        <Component {...props} />
      </PermissionGuard>
    )
  }
}

export default RoleGuard
