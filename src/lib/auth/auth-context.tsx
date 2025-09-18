'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { authService } from './auth-service'
import { RBACService } from './rbac'
import type { 
  AuthState, 
  AuthContextType, 
  AuthCredentials, 
  User, 
  Session, 
  Permission,
  UserProfileUpdate,
  PasswordChange,
  AuthResponse,
  AuthError
} from './types'

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: ReactNode
  config?: {
    enableSessionPersistence?: boolean
    enableActivityTracking?: boolean
    sessionTimeout?: {
      warningTime?: number
      maxInactiveTime?: number
      extendOnActivity?: boolean
    }
  }
}

/**
 * Authentication provider component
 */
export function AuthProvider({ children, config }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
    permissions: [],
    lastActivity: null,
    error: null,
  })

  const [isInitialized, setIsInitialized] = useState(false)

  /**
   * Update authentication state
   */
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }))
  }, [])

  /**
   * Handle authentication success
   */
  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    updateAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: response.user,
      token: response.token,
      permissions: response.permissions,
      lastActivity: new Date(),
      error: null,
    })
  }, [updateAuthState])

  /**
   * Handle authentication error
   */
  const handleAuthError = useCallback((error: AuthError) => {
    updateAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      permissions: [],
      lastActivity: null,
      error: error.message,
    })
  }, [updateAuthState])

  /**
   * Login function
   */
  const login = useCallback(async (credentials: AuthCredentials): Promise<void> => {
    try {
      updateAuthState({ isLoading: true, error: null })
      
      const response = await authService.authenticate(credentials)
      handleAuthSuccess(response)
    } catch (error: any) {
      handleAuthError(error)
      throw error
    }
  }, [updateAuthState, handleAuthSuccess, handleAuthError])

  /**
   * Logout function
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true })
      await authService.logout()
      
      updateAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        permissions: [],
        lastActivity: null,
        error: null,
      })
    } catch (error: any) {
      console.error('Logout error:', error)
      // Still clear local state even if API logout fails
      updateAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        permissions: [],
        lastActivity: null,
        error: null,
      })
    }
  }, [updateAuthState])

  /**
   * Refresh token function
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const token = await authService.refreshToken()
      
      updateAuthState({
        token,
        lastActivity: new Date(),
        error: null,
      })
    } catch (error: any) {
      console.error('Token refresh error:', error)
      // If refresh fails, logout user
      await logout()
    }
  }, [updateAuthState, logout])

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates: UserProfileUpdate): Promise<void> => {
    try {
      updateAuthState({ isLoading: true, error: null })
      
      const updatedUser = await authService.updateProfile(updates)
      
      updateAuthState({
        user: updatedUser,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      handleAuthError(error)
      throw error
    }
  }, [updateAuthState, handleAuthError])

  /**
   * Change password function
   */
  const changePassword = useCallback(async (passwordChange: PasswordChange): Promise<void> => {
    try {
      updateAuthState({ isLoading: true, error: null })
      
      await authService.changePassword(passwordChange)
      
      updateAuthState({
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      handleAuthError(error)
      throw error
    }
  }, [updateAuthState, handleAuthError])

  /**
   * Check if user has permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    return RBACService.hasPermission(authState.user, permission)
  }, [authState.user])

  /**
   * Check if user has role
   */
  const hasRole = useCallback((role: string): boolean => {
    return RBACService.hasRole(authState.user, role)
  }, [authState.user])

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return RBACService.hasAnyRole(authState.user, roles)
  }, [authState.user])

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = useCallback((roles: string[]): boolean => {
    return RBACService.hasAllRoles(authState.user, roles)
  }, [authState.user])

  /**
   * Check if user can access resource with action
   */
  const canAccess = useCallback((resource: string, action: string): boolean => {
    return RBACService.canAccess(authState.user, resource, action)
  }, [authState.user])

  /**
   * Extend session
   */
  const extendSession = useCallback((): void => {
    authService.extendSession()
    updateAuthState({ lastActivity: new Date() })
  }, [updateAuthState])

  /**
   * Get session info
   */
  const getSessionInfo = useCallback((): Session | null => {
    return authService.getCurrentSession()
  }, [])

  /**
   * Check if session is valid
   */
  const isSessionValid = useCallback((): boolean => {
    return authService.isSessionValid()
  }, [])

  /**
   * Initialize authentication
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true })
      
      await authService.initialize()
      
      const currentUser = await authService.getCurrentUser()
      const session = authService.getCurrentSession()
      const isAuthenticated = authService.isAuthenticated()
      
      if (isAuthenticated && currentUser && session) {
        const permissions = RBACService.getUserPermissions(currentUser)
        
        // Get the real access token or leave it null
        const access = await authService.getAccessToken().catch(() => null)
        updateAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: currentUser,
          token: access ? { accessToken: access, tokenType: 'Bearer', expiresAt: session.expiresAt } : null,
          permissions,
          lastActivity: session.lastActivity,
          error: null,
        })
      } else {
        updateAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          token: null,
          permissions: [],
          lastActivity: null,
          error: null,
        })
      }
    } catch (error: any) {
      console.error('Auth initialization error:', error)
      updateAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        permissions: [],
        lastActivity: null,
        error: error.message || 'Authentication initialization failed',
      })
    } finally {
      setIsInitialized(true)
    }
  }, [updateAuthState])

  /**
   * Handle session expiry
   */
  const handleSessionExpiry = useCallback(() => {
    updateAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      permissions: [],
      lastActivity: null,
      error: 'Session expired. Please log in again.',
    })
  }, [updateAuthState])

  /**
   * Handle session warning
   */
  const handleSessionWarning = useCallback(() => {
    // Could emit an event or show a notification
    console.warn('Session will expire soon')
  }, [])

  /**
   * Initialize authentication on mount
   */
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  /**
   * Set up session listeners
   */
  useEffect(() => {
    if (!isInitialized) return
    
    const listener = () => {
      if (authService.isSessionExpiringSoon()) handleSessionWarning()
      if (!authService.isSessionValid()) handleSessionExpiry()
    }
    authService.addSessionListener(listener)
    return () => authService.removeSessionListener(listener)
  }, [isInitialized, handleSessionWarning, handleSessionExpiry])

  /**
   * Auto-refresh token when needed
   */
  useEffect(() => {
    if (!isInitialized || !authState.isAuthenticated) return

    const checkTokenRefresh = async () => {
      if (authService.needsTokenRefresh()) {
        try {
          await refreshToken()
        } catch (error) {
          console.error('Auto token refresh failed:', error)
        }
      }
    }

    // Check every minute
    const interval = setInterval(checkTokenRefresh, 60000)
    
    return () => clearInterval(interval)
  }, [isInitialized, authState.isAuthenticated, refreshToken])

  /**
   * Context value
   */
  const contextValue: AuthContextType = {
    // State
    authState,
    
    // Actions
    login,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    
    // Utilities
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    
    // Session management
    extendSession,
    getSessionInfo,
    isSessionValid,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { authState } = useAuth()
  return authState.isAuthenticated
}

/**
 * Hook to get current user
 */
export function useCurrentUser(): User | null {
  const { authState } = useAuth()
  return authState.user
}

/**
 * Hook to check if authentication is loading
 */
export function useAuthLoading(): boolean {
  const { authState } = useAuth()
  return authState.isLoading
}

/**
 * Hook to get authentication error
 */
export function useAuthError(): string | null {
  const { authState } = useAuth()
  return authState.error
}

/**
 * Hook to get user permissions
 */
export function usePermissions(): Permission[] {
  const { authState } = useAuth()
  return authState.permissions
}

/**
 * Hook to check if user has permission
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

/**
 * Hook to check if user has role
 */
export function useHasRole(role: string): boolean {
  const { hasRole } = useAuth()
  return hasRole(role)
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(roles: string[]): boolean {
  const { hasAnyRole } = useAuth()
  return hasAnyRole(roles)
}

/**
 * Hook to check if user has all of the specified roles
 */
export function useHasAllRoles(roles: string[]): boolean {
  const { hasAllRoles } = useAuth()
  return hasAllRoles(roles)
}

/**
 * Hook to check if user can access resource with action
 */
export function useCanAccess(resource: string, action: string): boolean {
  const { canAccess } = useAuth()
  return canAccess(resource, action)
}

/**
 * Hook to get session information
 */
export function useSession(): Session | null {
  const { getSessionInfo } = useAuth()
  return getSessionInfo()
}

/**
 * Hook to check if session is valid
 */
export function useIsSessionValid(): boolean {
  const { isSessionValid } = useAuth()
  return isSessionValid()
}

/**
 * Higher-order component to require authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string
    fallbackComponent?: React.ComponentType
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { authState } = useAuth()
    
    if (authState.isLoading) {
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Loading...</div>
    }
    
    if (!authState.isAuthenticated) {
      if (options.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo
        return null
      }
      
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Authentication required</div>
    }
    
    return <Component {...props} />
  }
}

/**
 * Higher-order component to require specific role
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[],
  options: {
    requireAll?: boolean
    redirectTo?: string
    fallbackComponent?: React.ComponentType
  } = {}
) {
  return function RoleProtectedComponent(props: P) {
    const { authState, hasAnyRole, hasAllRoles } = useAuth()
    
    if (authState.isLoading) {
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Loading...</div>
    }
    
    if (!authState.isAuthenticated) {
      if (options.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo
        return null
      }
      
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Authentication required</div>
    }
    
    const hasRequiredRole = options.requireAll 
      ? hasAllRoles(requiredRoles)
      : hasAnyRole(requiredRoles)
    
    if (!hasRequiredRole) {
      if (options.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo
        return null
      }
      
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Insufficient permissions</div>
    }
    
    return <Component {...props} />
  }
}

/**
 * Higher-order component to require specific permission
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  options: {
    redirectTo?: string
    fallbackComponent?: React.ComponentType
  } = {}
) {
  return function PermissionProtectedComponent(props: P) {
    const { authState, hasPermission } = useAuth()
    
    if (authState.isLoading) {
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Loading...</div>
    }
    
    if (!authState.isAuthenticated) {
      if (options.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo
        return null
      }
      
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Authentication required</div>
    }
    
    if (!hasPermission(requiredPermission)) {
      if (options.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo
        return null
      }
      
      return options.fallbackComponent ? <options.fallbackComponent /> : <div>Insufficient permissions</div>
    }
    
    return <Component {...props} />
  }
}
