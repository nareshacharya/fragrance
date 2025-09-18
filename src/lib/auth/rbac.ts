import { USER_ROLES, USER_ROLE_LABELS, USER_ROLE_HIERARCHY } from '@/config/constants'
import type { Role, Permission, User, PermissionCheck, UserRole, PermissionAction, PermissionResource } from './types'

/**
 * Permission definitions for the fragrance management system
 */
export const PERMISSIONS = {
  // User management permissions
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE: 'users:manage',
  
  // Perfume management permissions
  PERFUMES_CREATE: 'perfumes:create',
  PERFUMES_READ: 'perfumes:read',
  PERFUMES_UPDATE: 'perfumes:update',
  PERFUMES_DELETE: 'perfumes:delete',
  PERFUMES_MANAGE: 'perfumes:manage',
  PERFUMES_APPROVE: 'perfumes:approve',
  
  // Formula management permissions
  FORMULAS_CREATE: 'formulas:create',
  FORMULAS_READ: 'formulas:read',
  FORMULAS_UPDATE: 'formulas:update',
  FORMULAS_DELETE: 'formulas:delete',
  FORMULAS_MANAGE: 'formulas:manage',
  FORMULAS_VALIDATE: 'formulas:validate',
  
  // Project management permissions
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_READ: 'projects:read',
  PROJECTS_UPDATE: 'projects:update',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_MANAGE: 'projects:manage',
  PROJECTS_ASSIGN: 'projects:assign',
  
  // Case management permissions
  CASES_CREATE: 'cases:create',
  CASES_READ: 'cases:read',
  CASES_UPDATE: 'cases:update',
  CASES_DELETE: 'cases:delete',
  CASES_MANAGE: 'cases:manage',
  CASES_ASSIGN: 'cases:assign',
  CASES_RESOLVE: 'cases:resolve',
  
  // Ingredient management permissions
  INGREDIENTS_CREATE: 'ingredients:create',
  INGREDIENTS_READ: 'ingredients:read',
  INGREDIENTS_UPDATE: 'ingredients:update',
  INGREDIENTS_DELETE: 'ingredients:delete',
  INGREDIENTS_MANAGE: 'ingredients:manage',
  
  // Report permissions
  REPORTS_CREATE: 'reports:create',
  REPORTS_READ: 'reports:read',
  REPORTS_EXPORT: 'reports:export',
  REPORTS_MANAGE: 'reports:manage',
  
  // System permissions
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
  
  // Notification permissions
  NOTIFICATIONS_READ: 'notifications:read',
  NOTIFICATIONS_MANAGE: 'notifications:manage',
} as const

/**
 * Role definitions with permissions
 */
export const ROLES: Record<UserRole, Role> = {
  [USER_ROLES.ADMINISTRATOR]: {
    id: USER_ROLES.ADMINISTRATOR,
    name: USER_ROLES.ADMINISTRATOR,
    label: USER_ROLE_LABELS[USER_ROLES.ADMINISTRATOR],
    level: 5,
    permissions: [
      { id: PERMISSIONS.USERS_MANAGE, name: 'Manage Users', resource: 'users', action: 'manage' },
      { id: PERMISSIONS.PERFUMES_MANAGE, name: 'Manage Perfumes', resource: 'perfumes', action: 'manage' },
      { id: PERMISSIONS.FORMULAS_MANAGE, name: 'Manage Formulas', resource: 'formulas', action: 'manage' },
      { id: PERMISSIONS.PROJECTS_MANAGE, name: 'Manage Projects', resource: 'projects', action: 'manage' },
      { id: PERMISSIONS.CASES_MANAGE, name: 'Manage Cases', resource: 'cases', action: 'manage' },
      { id: PERMISSIONS.INGREDIENTS_MANAGE, name: 'Manage Ingredients', resource: 'ingredients', action: 'manage' },
      { id: PERMISSIONS.REPORTS_MANAGE, name: 'Manage Reports', resource: 'reports', action: 'manage' },
      { id: PERMISSIONS.SYSTEM_ADMIN, name: 'System Administration', resource: 'system', action: 'admin' },
      { id: PERMISSIONS.SYSTEM_SETTINGS, name: 'System Settings', resource: 'system', action: 'settings' },
      { id: PERMISSIONS.SYSTEM_LOGS, name: 'System Logs', resource: 'system', action: 'logs' },
      { id: PERMISSIONS.NOTIFICATIONS_MANAGE, name: 'Manage Notifications', resource: 'notifications', action: 'manage' },
    ],
  },
  
  [USER_ROLES.LAB_MANAGER]: {
    id: USER_ROLES.LAB_MANAGER,
    name: USER_ROLES.LAB_MANAGER,
    label: USER_ROLE_LABELS[USER_ROLES.LAB_MANAGER],
    level: 4,
    permissions: [
      { id: PERMISSIONS.USERS_READ, name: 'Read Users', resource: 'users', action: 'read' },
      { id: PERMISSIONS.PERFUMES_CREATE, name: 'Create Perfumes', resource: 'perfumes', action: 'create' },
      { id: PERMISSIONS.PERFUMES_READ, name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
      { id: PERMISSIONS.PERFUMES_UPDATE, name: 'Update Perfumes', resource: 'perfumes', action: 'update' },
      { id: PERMISSIONS.PERFUMES_APPROVE, name: 'Approve Perfumes', resource: 'perfumes', action: 'approve' },
      { id: PERMISSIONS.FORMULAS_CREATE, name: 'Create Formulas', resource: 'formulas', action: 'create' },
      { id: PERMISSIONS.FORMULAS_READ, name: 'Read Formulas', resource: 'formulas', action: 'read' },
      { id: PERMISSIONS.FORMULAS_UPDATE, name: 'Update Formulas', resource: 'formulas', action: 'update' },
      { id: PERMISSIONS.FORMULAS_VALIDATE, name: 'Validate Formulas', resource: 'formulas', action: 'validate' },
      { id: PERMISSIONS.PROJECTS_CREATE, name: 'Create Projects', resource: 'projects', action: 'create' },
      { id: PERMISSIONS.PROJECTS_READ, name: 'Read Projects', resource: 'projects', action: 'read' },
      { id: PERMISSIONS.PROJECTS_UPDATE, name: 'Update Projects', resource: 'projects', action: 'update' },
      { id: PERMISSIONS.PROJECTS_ASSIGN, name: 'Assign Projects', resource: 'projects', action: 'assign' },
      { id: PERMISSIONS.CASES_CREATE, name: 'Create Cases', resource: 'cases', action: 'create' },
      { id: PERMISSIONS.CASES_READ, name: 'Read Cases', resource: 'cases', action: 'read' },
      { id: PERMISSIONS.CASES_UPDATE, name: 'Update Cases', resource: 'cases', action: 'update' },
      { id: PERMISSIONS.CASES_ASSIGN, name: 'Assign Cases', resource: 'cases', action: 'assign' },
      { id: PERMISSIONS.CASES_RESOLVE, name: 'Resolve Cases', resource: 'cases', action: 'resolve' },
      { id: PERMISSIONS.INGREDIENTS_CREATE, name: 'Create Ingredients', resource: 'ingredients', action: 'create' },
      { id: PERMISSIONS.INGREDIENTS_READ, name: 'Read Ingredients', resource: 'ingredients', action: 'read' },
      { id: PERMISSIONS.INGREDIENTS_UPDATE, name: 'Update Ingredients', resource: 'ingredients', action: 'update' },
      { id: PERMISSIONS.REPORTS_CREATE, name: 'Create Reports', resource: 'reports', action: 'create' },
      { id: PERMISSIONS.REPORTS_READ, name: 'Read Reports', resource: 'reports', action: 'read' },
      { id: PERMISSIONS.REPORTS_EXPORT, name: 'Export Reports', resource: 'reports', action: 'export' },
      { id: PERMISSIONS.NOTIFICATIONS_READ, name: 'Read Notifications', resource: 'notifications', action: 'read' },
    ],
  },
  
  [USER_ROLES.PROJECT_MANAGER]: {
    id: USER_ROLES.PROJECT_MANAGER,
    name: USER_ROLES.PROJECT_MANAGER,
    label: USER_ROLE_LABELS[USER_ROLES.PROJECT_MANAGER],
    level: 3,
    permissions: [
      { id: PERMISSIONS.USERS_READ, name: 'Read Users', resource: 'users', action: 'read' },
      { id: PERMISSIONS.PERFUMES_READ, name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
      { id: PERMISSIONS.FORMULAS_READ, name: 'Read Formulas', resource: 'formulas', action: 'read' },
      { id: PERMISSIONS.PROJECTS_CREATE, name: 'Create Projects', resource: 'projects', action: 'create' },
      { id: PERMISSIONS.PROJECTS_READ, name: 'Read Projects', resource: 'projects', action: 'read' },
      { id: PERMISSIONS.PROJECTS_UPDATE, name: 'Update Projects', resource: 'projects', action: 'update' },
      { id: PERMISSIONS.PROJECTS_ASSIGN, name: 'Assign Projects', resource: 'projects', action: 'assign' },
      { id: PERMISSIONS.CASES_CREATE, name: 'Create Cases', resource: 'cases', action: 'create' },
      { id: PERMISSIONS.CASES_READ, name: 'Read Cases', resource: 'cases', action: 'read' },
      { id: PERMISSIONS.CASES_UPDATE, name: 'Update Cases', resource: 'cases', action: 'update' },
      { id: PERMISSIONS.CASES_ASSIGN, name: 'Assign Cases', resource: 'cases', action: 'assign' },
      { id: PERMISSIONS.INGREDIENTS_READ, name: 'Read Ingredients', resource: 'ingredients', action: 'read' },
      { id: PERMISSIONS.REPORTS_CREATE, name: 'Create Reports', resource: 'reports', action: 'create' },
      { id: PERMISSIONS.REPORTS_READ, name: 'Read Reports', resource: 'reports', action: 'read' },
      { id: PERMISSIONS.REPORTS_EXPORT, name: 'Export Reports', resource: 'reports', action: 'export' },
      { id: PERMISSIONS.NOTIFICATIONS_READ, name: 'Read Notifications', resource: 'notifications', action: 'read' },
    ],
  },
  
  [USER_ROLES.PALETTE_MANAGER]: {
    id: USER_ROLES.PALETTE_MANAGER,
    name: USER_ROLES.PALETTE_MANAGER,
    label: USER_ROLE_LABELS[USER_ROLES.PALETTE_MANAGER],
    level: 2,
    permissions: [
      { id: PERMISSIONS.PERFUMES_READ, name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
      { id: PERMISSIONS.FORMULAS_CREATE, name: 'Create Formulas', resource: 'formulas', action: 'create' },
      { id: PERMISSIONS.FORMULAS_READ, name: 'Read Formulas', resource: 'formulas', action: 'read' },
      { id: PERMISSIONS.FORMULAS_UPDATE, name: 'Update Formulas', resource: 'formulas', action: 'update' },
      { id: PERMISSIONS.PROJECTS_READ, name: 'Read Projects', resource: 'projects', action: 'read' },
      { id: PERMISSIONS.CASES_READ, name: 'Read Cases', resource: 'cases', action: 'read' },
      { id: PERMISSIONS.INGREDIENTS_CREATE, name: 'Create Ingredients', resource: 'ingredients', action: 'create' },
      { id: PERMISSIONS.INGREDIENTS_READ, name: 'Read Ingredients', resource: 'ingredients', action: 'read' },
      { id: PERMISSIONS.INGREDIENTS_UPDATE, name: 'Update Ingredients', resource: 'ingredients', action: 'update' },
      { id: PERMISSIONS.REPORTS_READ, name: 'Read Reports', resource: 'reports', action: 'read' },
      { id: PERMISSIONS.NOTIFICATIONS_READ, name: 'Read Notifications', resource: 'notifications', action: 'read' },
    ],
  },
  
  [USER_ROLES.PERFUMER]: {
    id: USER_ROLES.PERFUMER,
    name: USER_ROLES.PERFUMER,
    label: USER_ROLE_LABELS[USER_ROLES.PERFUMER],
    level: 1,
    permissions: [
      { id: PERMISSIONS.PERFUMES_READ, name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
      { id: PERMISSIONS.FORMULAS_CREATE, name: 'Create Formulas', resource: 'formulas', action: 'create' },
      { id: PERMISSIONS.FORMULAS_READ, name: 'Read Formulas', resource: 'formulas', action: 'read' },
      { id: PERMISSIONS.FORMULAS_UPDATE, name: 'Update Formulas', resource: 'formulas', action: 'update' },
      { id: PERMISSIONS.PROJECTS_READ, name: 'Read Projects', resource: 'projects', action: 'read' },
      { id: PERMISSIONS.CASES_READ, name: 'Read Cases', resource: 'cases', action: 'read' },
      { id: PERMISSIONS.INGREDIENTS_READ, name: 'Read Ingredients', resource: 'ingredients', action: 'read' },
      { id: PERMISSIONS.REPORTS_READ, name: 'Read Reports', resource: 'reports', action: 'read' },
      { id: PERMISSIONS.NOTIFICATIONS_READ, name: 'Read Notifications', resource: 'notifications', action: 'read' },
    ],
  },
}

/**
 * RBAC service class for role-based access control
 */
export class RBACService {
  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.permissions) {
      return false
    }
    
    return user.permissions.some(p => p.id === permission || p.name === permission)
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(user: User | null, role: string): boolean {
    if (!user || !user.roles) {
      return false
    }
    
    return user.roles.includes(role)
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: User | null, roles: string[]): boolean {
    if (!user || !user.roles) {
      return false
    }
    
    return roles.some(role => user.roles!.includes(role))
  }

  /**
   * Check if user has all of the specified roles
   */
  static hasAllRoles(user: User | null, roles: string[]): boolean {
    if (!user || !user.roles) {
      return false
    }
    
    return roles.every(role => user.roles!.includes(role))
  }

  /**
   * Check if user can access a resource with a specific action
   */
  static canAccess(user: User | null, resource: string, action: string): boolean {
    if (!user || !user.permissions) {
      return false
    }
    
    return user.permissions.some(p => 
      p.resource === resource && (p.action === action || p.action === 'manage')
    )
  }

  /**
   * Get user's role level (higher number = more privileges)
   */
  static getRoleLevel(user: User | null): number {
    if (!user || !user.roles || user.roles.length === 0) {
      return 0
    }
    
    const maxLevel = Math.max(
      ...user.roles.map(role => ROLES[role as UserRole]?.level || 0)
    )
    
    return maxLevel
  }

  /**
   * Check if user has higher or equal role level than required
   */
  static hasRoleLevel(user: User | null, requiredLevel: number): boolean {
    return this.getRoleLevel(user) >= requiredLevel
  }

  /**
   * Get all permissions for a user based on their roles
   */
  static getUserPermissions(user: User | null): Permission[] {
    if (!user || !user.roles) {
      return []
    }
    
    const permissions: Permission[] = []
    
    // Add permissions from each role
    user.roles.forEach(role => {
      const roleDef = ROLES[role as UserRole]
      if (roleDef) {
        permissions.push(...roleDef.permissions)
      }
    })
    
    // Remove duplicates
    return permissions.filter((permission, index, self) => 
      index === self.findIndex(p => p.id === permission.id)
    )
  }

  /**
   * Check permission with detailed result
   */
  static checkPermission(
    user: User | null,
    permission: string,
    resource?: string,
    action?: string
  ): PermissionCheck {
    if (!user) {
      return {
        allowed: false,
        reason: 'User not authenticated',
      }
    }

    if (!user.permissions || user.permissions.length === 0) {
      return {
        allowed: false,
        reason: 'No permissions assigned',
      }
    }

    // Check specific permission
    if (permission) {
      const hasPermission = this.hasPermission(user, permission)
      if (hasPermission) {
        return { allowed: true }
      }
    }

    // Check resource and action
    if (resource && action) {
      const canAccess = this.canAccess(user, resource, action)
      if (canAccess) {
        return { allowed: true }
      }
    }

    // Find required role for this permission
    const requiredRole = this.getRequiredRole(permission, resource, action)
    
    return {
      allowed: false,
      reason: 'Insufficient permissions',
      requiredRole,
      requiredPermission: permission,
    }
  }

  /**
   * Get required role for a permission
   */
  private static getRequiredRole(
    permission?: string,
    resource?: string,
    action?: string
  ): string | undefined {
    // Find the role that has this permission
    for (const [roleName, role] of Object.entries(ROLES)) {
      if (permission && role.permissions.some(p => p.id === permission)) {
        return roleName
      }
      
      if (resource && action && role.permissions.some(p => 
        p.resource === resource && (p.action === action || p.action === 'manage')
      )) {
        return roleName
      }
    }
    
    return undefined
  }

  /**
   * Get role hierarchy for a user
   */
  static getRoleHierarchy(user: User | null): string[] {
    if (!user || !user.roles) {
      return []
    }
    
    const hierarchy: string[] = []
    
    user.roles.forEach(role => {
      const roleDef = ROLES[role as UserRole]
      if (roleDef) {
        hierarchy.push(roleDef.name)
        
        // Add inherited roles
        if (roleDef.inherits) {
          hierarchy.push(...roleDef.inherits)
        }
      }
    })
    
    return [...new Set(hierarchy)] // Remove duplicates
  }

  /**
   * Check if user can perform action on specific resource
   */
  static canPerformAction(
    user: User | null,
    resource: PermissionResource,
    action: PermissionAction
  ): boolean {
    return this.canAccess(user, resource, action)
  }

  /**
   * Get user's effective permissions (including inherited)
   */
  static getEffectivePermissions(user: User | null): Permission[] {
    if (!user || !user.roles) {
      return []
    }
    
    const permissions: Permission[] = []
    
    user.roles.forEach(role => {
      const roleDef = ROLES[role as UserRole]
      if (roleDef) {
        permissions.push(...roleDef.permissions)
        
        // Add permissions from inherited roles
        if (roleDef.inherits) {
          roleDef.inherits.forEach(inheritedRole => {
            const inheritedRoleDef = ROLES[inheritedRole as UserRole]
            if (inheritedRoleDef) {
              permissions.push(...inheritedRoleDef.permissions)
            }
          })
        }
      }
    })
    
    // Remove duplicates
    return permissions.filter((permission, index, self) => 
      index === self.findIndex(p => p.id === permission.id)
    )
  }

  /**
   * Validate user permissions against required permissions
   */
  static validatePermissions(
    user: User | null,
    requiredPermissions: string[]
  ): { valid: boolean; missing: string[] } {
    if (!user || !user.permissions) {
      return {
        valid: false,
        missing: requiredPermissions,
      }
    }
    
    const userPermissionIds = user.permissions.map(p => p.id)
    const missing = requiredPermissions.filter(permission => 
      !userPermissionIds.includes(permission)
    )
    
    return {
      valid: missing.length === 0,
      missing,
    }
  }
}

/**
 * Permission constants for easy access
 */
export const PERMISSION_CONSTANTS = {
  // User permissions
  USERS: {
    CREATE: PERMISSIONS.USERS_CREATE,
    READ: PERMISSIONS.USERS_READ,
    UPDATE: PERMISSIONS.USERS_UPDATE,
    DELETE: PERMISSIONS.USERS_DELETE,
    MANAGE: PERMISSIONS.USERS_MANAGE,
  },
  
  // Perfume permissions
  PERFUMES: {
    CREATE: PERMISSIONS.PERFUMES_CREATE,
    READ: PERMISSIONS.PERFUMES_READ,
    UPDATE: PERMISSIONS.PERFUMES_UPDATE,
    DELETE: PERMISSIONS.PERFUMES_DELETE,
    MANAGE: PERMISSIONS.PERFUMES_MANAGE,
    APPROVE: PERMISSIONS.PERFUMES_APPROVE,
  },
  
  // Formula permissions
  FORMULAS: {
    CREATE: PERMISSIONS.FORMULAS_CREATE,
    READ: PERMISSIONS.FORMULAS_READ,
    UPDATE: PERMISSIONS.FORMULAS_UPDATE,
    DELETE: PERMISSIONS.FORMULAS_DELETE,
    MANAGE: PERMISSIONS.FORMULAS_MANAGE,
    VALIDATE: PERMISSIONS.FORMULAS_VALIDATE,
  },
  
  // Project permissions
  PROJECTS: {
    CREATE: PERMISSIONS.PROJECTS_CREATE,
    READ: PERMISSIONS.PROJECTS_READ,
    UPDATE: PERMISSIONS.PROJECTS_UPDATE,
    DELETE: PERMISSIONS.PROJECTS_DELETE,
    MANAGE: PERMISSIONS.PROJECTS_MANAGE,
    ASSIGN: PERMISSIONS.PROJECTS_ASSIGN,
  },
  
  // Case permissions
  CASES: {
    CREATE: PERMISSIONS.CASES_CREATE,
    READ: PERMISSIONS.CASES_READ,
    UPDATE: PERMISSIONS.CASES_UPDATE,
    DELETE: PERMISSIONS.CASES_DELETE,
    MANAGE: PERMISSIONS.CASES_MANAGE,
    ASSIGN: PERMISSIONS.CASES_ASSIGN,
    RESOLVE: PERMISSIONS.CASES_RESOLVE,
  },
  
  // Ingredient permissions
  INGREDIENTS: {
    CREATE: PERMISSIONS.INGREDIENTS_CREATE,
    READ: PERMISSIONS.INGREDIENTS_READ,
    UPDATE: PERMISSIONS.INGREDIENTS_UPDATE,
    DELETE: PERMISSIONS.INGREDIENTS_DELETE,
    MANAGE: PERMISSIONS.INGREDIENTS_MANAGE,
  },
  
  // Report permissions
  REPORTS: {
    CREATE: PERMISSIONS.REPORTS_CREATE,
    READ: PERMISSIONS.REPORTS_READ,
    EXPORT: PERMISSIONS.REPORTS_EXPORT,
    MANAGE: PERMISSIONS.REPORTS_MANAGE,
  },
  
  // System permissions
  SYSTEM: {
    ADMIN: PERMISSIONS.SYSTEM_ADMIN,
    SETTINGS: PERMISSIONS.SYSTEM_SETTINGS,
    LOGS: PERMISSIONS.SYSTEM_LOGS,
  },
  
  // Notification permissions
  NOTIFICATIONS: {
    READ: PERMISSIONS.NOTIFICATIONS_READ,
    MANAGE: PERMISSIONS.NOTIFICATIONS_MANAGE,
  },
} as const

/**
 * Default RBAC service instance
 */
export const rbacService = RBACService
