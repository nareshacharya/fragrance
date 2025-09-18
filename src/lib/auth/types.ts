import { TokenData, UserInfo } from '@/lib/api/auth'
import { USER_ROLES } from '@/config/constants'

/**
 * Authentication state interface for React context
 */
export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  token: TokenData | null
  permissions: Permission[]
  lastActivity: Date | null
  error: string | null
}

/**
 * Extended user interface with role-based information
 */
export interface User extends UserInfo {
  id: string
  displayName: string
  avatar?: string
  department?: string
  permissions: Permission[]
  lastLogin?: Date
  isActive: boolean
}

/**
 * Permission interface for RBAC
 */
export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

/**
 * Role interface with permissions
 */
export interface Role {
  id: string
  name: string
  label: string
  level: number
  permissions: Permission[]
  inherits?: string[]
}

/**
 * Session interface for session management
 */
export interface Session {
  id: string
  userId: string
  tokenId: string
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  isActive: boolean
}

/**
 * Authentication credentials interface
 */
export interface AuthCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User
  token: TokenData
  session: Session
  permissions: Permission[]
}

/**
 * Login form state interface
 */
export interface LoginFormState {
  email: string
  password: string
  rememberMe: boolean
  isLoading: boolean
  error: string | null
}

/**
 * User profile update interface
 */
export interface UserProfileUpdate {
  displayName?: string
  email?: string
  avatar?: string
  department?: string
}

/**
 * Password change interface
 */
export interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  // State
  authState: AuthState
  
  // Actions
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (updates: UserProfileUpdate) => Promise<void>
  changePassword: (passwordChange: PasswordChange) => Promise<void>
  
  // Utilities
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAllRoles: (roles: string[]) => boolean
  canAccess: (resource: string, action: string) => boolean
  
  // Session management
  extendSession: () => void
  getSessionInfo: () => Session | null
  isSessionValid: () => boolean
}

/**
 * Permission check result interface
 */
export interface PermissionCheck {
  allowed: boolean
  reason?: string
  requiredRole?: string
  requiredPermission?: string
}

/**
 * Route protection configuration
 */
export interface RouteProtection {
  requireAuth: boolean
  allowedRoles?: string[]
  allowedPermissions?: string[]
  redirectTo?: string
  fallbackComponent?: React.ComponentType
}

/**
 * Component protection configuration
 */
export interface ComponentProtection {
  requireAuth?: boolean
  allowedRoles?: string[]
  allowedPermissions?: string[]
  fallbackComponent?: React.ComponentType
  showFallback?: boolean
}

/**
 * Authentication error interface
 */
export interface AuthError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

/**
 * Session timeout configuration
 */
export interface SessionTimeoutConfig {
  warningTime: number // minutes before expiry to show warning
  maxInactiveTime: number // minutes of inactivity before logout
  extendOnActivity: boolean // whether to extend session on user activity
}

/**
 * Authentication configuration interface
 */
export interface AuthConfig {
  sessionTimeout: SessionTimeoutConfig
  tokenRefreshThreshold: number // minutes before expiry to refresh
  enableSessionPersistence: boolean
  enableCrossTabSync: boolean
  enableActivityTracking: boolean
  maxConcurrentSessions: number
}

/**
 * User activity event interface
 */
export interface UserActivityEvent {
  type: 'click' | 'scroll' | 'keypress' | 'mousemove' | 'focus' | 'blur'
  timestamp: Date
  element?: string
  url?: string
}

/**
 * Authentication hook return types
 */
export interface UseAuthReturn extends AuthContextType {}

export interface UseUserReturn {
  user: User | null
  isLoading: boolean
  error: string | null
  updateProfile: (updates: UserProfileUpdate) => Promise<void>
  refreshUser: () => Promise<void>
}

export interface UsePermissionsReturn {
  permissions: Permission[]
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAllRoles: (roles: string[]) => boolean
  canAccess: (resource: string, action: string) => boolean
  isLoading: boolean
  error: string | null
}

export interface UseSessionReturn {
  session: Session | null
  isActive: boolean
  timeRemaining: number | null
  extendSession: () => void
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * Role hierarchy type
 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

/**
 * Permission action types
 */
export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'assign'
  | 'export'
  | 'import'

/**
 * Resource types for permissions
 */
export type PermissionResource =
  | 'users'
  | 'perfumes'
  | 'formulas'
  | 'projects'
  | 'cases'
  | 'ingredients'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'system'

/**
 * Authentication event types
 */
export type AuthEventType =
  | 'login'
  | 'logout'
  | 'token_refresh'
  | 'session_extend'
  | 'session_expire'
  | 'permission_denied'
  | 'profile_update'
  | 'password_change'

/**
 * Authentication event interface
 */
export interface AuthEvent {
  type: AuthEventType
  userId?: string
  timestamp: Date
  details?: Record<string, any>
}

/**
 * Authentication middleware context
 */
export interface AuthMiddlewareContext {
  isAuthenticated: boolean
  user: User | null
  token: TokenData | null
  permissions: Permission[]
  session: Session | null
}

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
  allowedPermissions?: string[]
  redirectTo?: string
  fallbackComponent?: React.ComponentType
  loadingComponent?: React.ComponentType
}

/**
 * Role guard props
 */
export interface RoleGuardProps {
  children: React.ReactNode
  roles: string[]
  requireAll?: boolean
  fallbackComponent?: React.ComponentType
  showFallback?: boolean
}

/**
 * Permission guard props
 */
export interface PermissionGuardProps {
  children: React.ReactNode
  permission: string
  resource?: string
  action?: string
  fallbackComponent?: React.ComponentType
  showFallback?: boolean
}

/**
 * Authentication status props
 */
export interface AuthStatusProps {
  showUserInfo?: boolean
  showRole?: boolean
  showPermissions?: boolean
  showSessionInfo?: boolean
  className?: string
}

/**
 * User profile props
 */
export interface UserProfileProps {
  user?: User
  showEditButton?: boolean
  showPermissions?: boolean
  showSessionInfo?: boolean
  className?: string
}

/**
 * Login form props
 */
export interface LoginFormProps {
  onSuccess?: (response: AuthResponse) => void
  onError?: (error: AuthError) => void
  redirectTo?: string
  showRememberMe?: boolean
  className?: string
}

/**
 * Logout button props
 */
export interface LogoutButtonProps {
  onLogout?: () => void
  showConfirmation?: boolean
  confirmationMessage?: string
  variant?: 'button' | 'link' | 'icon'
  className?: string
}
