import { useAuth as useAuthContext } from './auth-context'
import { RBACService, ROLES } from './rbac'
import type { 
  UseAuthReturn, 
  UseUserReturn, 
  UsePermissionsReturn, 
  UseSessionReturn,
  User,
  Permission,
  Session,
  UserProfileUpdate,
  PasswordChange,
  AuthCredentials
} from './types'

/**
 * Main authentication hook
 */
export function useAuth(): UseAuthReturn {
  const authContext = useAuthContext()
  return authContext
}

/**
 * Hook to get current user with additional utilities
 */
export function useUser(): UseUserReturn {
  const { authState, updateProfile } = useAuthContext()
  
  const refreshUser = async (): Promise<void> => {
    // This would typically refresh user data from the server
    // For now, we'll just return the current user
    return Promise.resolve()
  }
  
  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    updateProfile,
    refreshUser,
  }
}

/**
 * Hook to get user permissions with utilities
 */
export function usePermissions(): UsePermissionsReturn {
  const { authState, hasPermission, hasRole, hasAnyRole, hasAllRoles, canAccess } = useAuthContext()
  
  return {
    permissions: authState.permissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    isLoading: authState.isLoading,
    error: authState.error,
  }
}

/**
 * Hook to get session information
 */
export function useSession(): UseSessionReturn {
  const { authState, extendSession, logout, getSessionInfo, isSessionValid } = useAuthContext()
  
  const session = getSessionInfo()
  const isActive = isSessionValid()
  
  // Calculate time remaining
  const timeRemaining = session ? Math.max(0, Math.floor((session.expiresAt.getTime() - new Date().getTime()) / (1000 * 60))) : null
  
  return {
    session,
    isActive,
    timeRemaining,
    extendSession,
    logout,
    isLoading: authState.isLoading,
    error: authState.error,
  }
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { authState } = useAuthContext()
  return authState.isAuthenticated
}

/**
 * Hook to check if authentication is loading
 */
export function useAuthLoading(): boolean {
  const { authState } = useAuthContext()
  return authState.isLoading
}

/**
 * Hook to get authentication error
 */
export function useAuthError(): string | null {
  const { authState } = useAuthContext()
  return authState.error
}

/**
 * Hook to check if user has specific permission
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission } = useAuthContext()
  return hasPermission(permission)
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: string): boolean {
  const { hasRole } = useAuthContext()
  return hasRole(role)
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(roles: string[]): boolean {
  const { hasAnyRole } = useAuthContext()
  return hasAnyRole(roles)
}

/**
 * Hook to check if user has all of the specified roles
 */
export function useHasAllRoles(roles: string[]): boolean {
  const { hasAllRoles } = useAuthContext()
  return hasAllRoles(roles)
}

/**
 * Hook to check if user can access resource with action
 */
export function useCanAccess(resource: string, action: string): boolean {
  const { canAccess } = useAuthContext()
  return canAccess(resource, action)
}

/**
 * Hook to get current session
 */
export function useCurrentSession(): Session | null {
  const { getSessionInfo } = useAuthContext()
  return getSessionInfo()
}

/**
 * Hook to check if session is valid
 */
export function useIsSessionValid(): boolean {
  const { isSessionValid } = useAuthContext()
  return isSessionValid()
}

/**
 * Hook to get session time remaining
 */
export function useSessionTimeRemaining(): number | null {
  const session = useCurrentSession()
  if (!session) return null
  
  const timeRemaining = Math.max(0, Math.floor((session.expiresAt.getTime() - new Date().getTime()) / (1000 * 60)))
  return timeRemaining
}

/**
 * Hook to check if session is expiring soon
 */
export function useIsSessionExpiringSoon(): boolean {
  const session = useCurrentSession()
  if (!session) return false
  
  const now = new Date()
  const warningTime = new Date(now.getTime() + (5 * 60 * 1000)) // 5 minutes warning
  
  return session.expiresAt <= warningTime
}

/**
 * Hook to get user role level
 */
export function useUserRoleLevel(): number {
  const { authState } = useAuthContext()
  return RBACService.getRoleLevel(authState.user)
}

/**
 * Hook to check if user has role level or higher
 */
export function useHasRoleLevel(requiredLevel: number): boolean {
  const userLevel = useUserRoleLevel()
  return userLevel >= requiredLevel
}

/**
 * Hook to get user's effective permissions
 */
export function useEffectivePermissions(): Permission[] {
  const { authState } = useAuthContext()
  return RBACService.getEffectivePermissions(authState.user)
}

/**
 * Hook to validate user permissions against required permissions
 */
export function useValidatePermissions(requiredPermissions: string[]): { valid: boolean; missing: string[] } {
  const { authState } = useAuthContext()
  return RBACService.validatePermissions(authState.user, requiredPermissions)
}

/**
 * Hook to get user's role hierarchy
 */
export function useRoleHierarchy(): string[] {
  const { authState } = useAuthContext()
  return RBACService.getRoleHierarchy(authState.user)
}

/**
 * Hook to check if user can perform action on specific resource
 */
export function useCanPerformAction(resource: string, action: string): boolean {
  const { authState } = useAuthContext()
  return RBACService.canPerformAction(authState.user, resource as any, action as any)
}

/**
 * Hook to get user display name
 */
export function useUserDisplayName(): string {
  const { authState } = useAuthContext()
  
  if (!authState.user) {
    return 'Guest'
  }
  
  if (authState.user.displayName) {
    return authState.user.displayName
  }
  
  if (authState.user.name) {
    return authState.user.name
  }
  
  if (authState.user.preferredUsername) {
    return authState.user.preferredUsername
  }
  
  if (authState.user.email) {
    return authState.user.email.split('@')[0]
  }
  
  return 'Unknown User'
}

/**
 * Hook to get user initials
 */
export function useUserInitials(): string {
  const { authState } = useAuthContext()
  
  if (!authState.user) {
    return 'G'
  }
  
  if (authState.user.displayName) {
    return authState.user.displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }
  
  if (authState.user.name) {
    return authState.user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }
  
  if (authState.user.email) {
    return authState.user.email.charAt(0).toUpperCase()
  }
  
  return 'U'
}

/**
 * Hook to get user avatar URL
 */
export function useUserAvatar(): string | undefined {
  const { authState } = useAuthContext()
  return authState.user?.avatar
}

/**
 * Hook to get user department
 */
export function useUserDepartment(): string | undefined {
  const { authState } = useAuthContext()
  return authState.user?.department
}

/**
 * Hook to get user roles
 */
export function useUserRoles(): string[] {
  const { authState } = useAuthContext()
  return authState.user?.roles || []
}

/**
 * Hook to get user groups
 */
export function useUserGroups(): string[] {
  const { authState } = useAuthContext()
  return authState.user?.groups || []
}

/**
 * Hook to check if user is active
 */
export function useIsUserActive(): boolean {
  const { authState } = useAuthContext()
  return authState.user?.isActive || false
}

/**
 * Hook to get user's last login
 */
export function useUserLastLogin(): Date | undefined {
  const { authState } = useAuthContext()
  return authState.user?.lastLogin
}

/**
 * Hook to get user's last activity
 */
export function useUserLastActivity(): Date | null {
  const { authState } = useAuthContext()
  return authState.lastActivity
}

/**
 * Hook to check if user has specific group
 */
export function useIsInGroup(group: string): boolean {
  const groups = useUserGroups()
  return groups.includes(group)
}

/**
 * Hook to check if user has any of the specified groups
 */
export function useIsInAnyGroup(groups: string[]): boolean {
  const userGroups = useUserGroups()
  return groups.some(group => userGroups.includes(group))
}

/**
 * Hook to check if user has all of the specified groups
 */
export function useIsInAllGroups(groups: string[]): boolean {
  const userGroups = useUserGroups()
  return groups.every(group => userGroups.includes(group))
}

/**
 * Hook to get user's primary role (highest level)
 */
export function usePrimaryRole(): string | null {
  const roles = useUserRoles()
  if (roles.length === 0) return null
  
  // Return the role with the highest level
  const roleLevels = roles.map(role => RBACService.getRoleLevel({ roles: [role] } as User))
  const maxLevel = Math.max(...roleLevels)
  const primaryRoleIndex = roleLevels.indexOf(maxLevel)
  
  return roles[primaryRoleIndex] || null
}

/**
 * Hook to get user's role label
 */
export function useRoleLabel(role?: string): string {
  const targetRole = role || usePrimaryRole()
  if (!targetRole) return 'No Role'
  
  const roleDef = Object.values(ROLES).find(r => r.name === targetRole)
  return roleDef?.label || targetRole
}

/**
 * Hook to get user's role color (for UI)
 */
export function useRoleColor(role?: string): string {
  const targetRole = role || usePrimaryRole()
  if (!targetRole) return '#6b7280'
  
  // Define role colors
  const roleColors: Record<string, string> = {
    administrator: '#dc2626',
    lab_manager: '#f59e0b',
    project_manager: '#3b82f6',
    palette_manager: '#8b5cf6',
    perfumer: '#10b981',
  }
  
  return roleColors[targetRole] || '#6b7280'
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  return useHasRole('administrator')
}

/**
 * Hook to check if user is lab manager
 */
export function useIsLabManager(): boolean {
  return useHasRole('lab_manager')
}

/**
 * Hook to check if user is project manager
 */
export function useIsProjectManager(): boolean {
  return useHasRole('project_manager')
}

/**
 * Hook to check if user is palette manager
 */
export function useIsPaletteManager(): boolean {
  return useHasRole('palette_manager')
}

/**
 * Hook to check if user is perfumer
 */
export function useIsPerfumer(): boolean {
  return useHasRole('perfumer')
}

/**
 * Hook to check if user can manage users
 */
export function useCanManageUsers(): boolean {
  return useHasPermission('users:manage')
}

/**
 * Hook to check if user can manage perfumes
 */
export function useCanManagePerfumes(): boolean {
  return useHasPermission('perfumes:manage')
}

/**
 * Hook to check if user can manage formulas
 */
export function useCanManageFormulas(): boolean {
  return useHasPermission('formulas:manage')
}

/**
 * Hook to check if user can manage projects
 */
export function useCanManageProjects(): boolean {
  return useHasPermission('projects:manage')
}

/**
 * Hook to check if user can manage cases
 */
export function useCanManageCases(): boolean {
  return useHasPermission('cases:manage')
}

/**
 * Hook to check if user can manage ingredients
 */
export function useCanManageIngredients(): boolean {
  return useHasPermission('ingredients:manage')
}

/**
 * Hook to check if user can manage reports
 */
export function useCanManageReports(): boolean {
  return useHasPermission('reports:manage')
}

/**
 * Hook to check if user can access system admin
 */
export function useCanAccessSystemAdmin(): boolean {
  return useHasPermission('system:admin')
}

/**
 * Hook to check if user can access system settings
 */
export function useCanAccessSystemSettings(): boolean {
  return useHasPermission('system:settings')
}

/**
 * Hook to check if user can view system logs
 */
export function useCanViewSystemLogs(): boolean {
  return useHasPermission('system:logs')
}

/**
 * Hook to get authentication status summary
 */
export function useAuthStatus(): {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  error: string | null
  sessionValid: boolean
  timeRemaining: number | null
  isExpiringSoon: boolean
} {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const user = useUser().user
  const error = useAuthError()
  const sessionValid = useIsSessionValid()
  const timeRemaining = useSessionTimeRemaining()
  const isExpiringSoon = useIsSessionExpiringSoon()
  
  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    sessionValid,
    timeRemaining,
    isExpiringSoon,
  }
}

/**
 * Hook to get user profile summary
 */
export function useUserProfile(): {
  user: User | null
  displayName: string
  initials: string
  avatar: string | undefined
  department: string | undefined
  primaryRole: string | null
  roleLabel: string
  roleColor: string
  isActive: boolean
  lastLogin: Date | undefined
  lastActivity: Date | null
} {
  const user = useUser().user
  const displayName = useUserDisplayName()
  const initials = useUserInitials()
  const avatar = useUserAvatar()
  const department = useUserDepartment()
  const primaryRole = usePrimaryRole()
  const roleLabel = useRoleLabel()
  const roleColor = useRoleColor()
  const isActive = useIsUserActive()
  const lastLogin = useUserLastLogin()
  const lastActivity = useUserLastActivity()
  
  return {
    user,
    displayName,
    initials,
    avatar,
    department,
    primaryRole,
    roleLabel,
    roleColor,
    isActive,
    lastLogin,
    lastActivity,
  }
}

/**
 * Hook to get permission summary
 */
export function usePermissionSummary(): {
  permissions: Permission[]
  effectivePermissions: Permission[]
  canManageUsers: boolean
  canManagePerfumes: boolean
  canManageFormulas: boolean
  canManageProjects: boolean
  canManageCases: boolean
  canManageIngredients: boolean
  canManageReports: boolean
  canAccessSystemAdmin: boolean
  canAccessSystemSettings: boolean
  canViewSystemLogs: boolean
} {
  const permissions = usePermissions().permissions
  const effectivePermissions = useEffectivePermissions()
  const canManageUsers = useCanManageUsers()
  const canManagePerfumes = useCanManagePerfumes()
  const canManageFormulas = useCanManageFormulas()
  const canManageProjects = useCanManageProjects()
  const canManageCases = useCanManageCases()
  const canManageIngredients = useCanManageIngredients()
  const canManageReports = useCanManageReports()
  const canAccessSystemAdmin = useCanAccessSystemAdmin()
  const canAccessSystemSettings = useCanAccessSystemSettings()
  const canViewSystemLogs = useCanViewSystemLogs()
  
  return {
    permissions,
    effectivePermissions,
    canManageUsers,
    canManagePerfumes,
    canManageFormulas,
    canManageProjects,
    canManageCases,
    canManageIngredients,
    canManageReports,
    canAccessSystemAdmin,
    canAccessSystemSettings,
    canViewSystemLogs,
  }
}
