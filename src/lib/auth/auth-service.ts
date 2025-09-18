import { authService as apiAuthService, TokenData, UserInfo } from '@/lib/api/auth'
import { USER_ROLES, USER_ROLE_LABELS } from '@/config/constants'
import { SessionService, createSessionService } from './session'
import { RBACService, ROLES } from './rbac'
import { 
  validateCredentials, 
  createCommonAuthErrors, 
  parseApiError,
  getUserDisplayName,
  getUserInitials,
  generateSecureToken,
  isTokenExpired,
  isTokenExpiringSoon
} from './utils'
import type { 
  AuthCredentials, 
  AuthResponse, 
  User, 
  Session, 
  Permission, 
  AuthError,
  UserProfileUpdate,
  PasswordChange,
  AuthConfig
} from './types'

/**
 * Enhanced authentication service that builds on the existing API auth service
 */
export class AuthService {
  private sessionService: SessionService
  private config: AuthConfig
  private refreshPromise: Promise<TokenData> | null = null
  private userCache: User | null = null
  private userCacheExpiry: Date | null = null

  constructor(config: Partial<AuthConfig> = {}) {
    this.config = {
      sessionTimeout: {
        warningTime: 5,
        maxInactiveTime: 30,
        extendOnActivity: true,
      },
      tokenRefreshThreshold: 5,
      enableSessionPersistence: true,
      enableCrossTabSync: true,
      enableActivityTracking: true,
      maxConcurrentSessions: 3,
      ...config,
    }
    
    this.sessionService = createSessionService(this.config)
  }

  /**
   * Authenticate user with credentials
   */
  async authenticate(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials
      const validation = validateCredentials(credentials)
      if (!validation.isValid) {
        throw createCommonAuthErrors.validationError('credentials', Object.values(validation.errors).join(', '))
      }

      // Check for demo mode
      if (this.isDemoMode(credentials)) {
        return this.createDemoAuthResponse(credentials)
      }

      // Authenticate with Pega DX
      const tokenData = await apiAuthService.authenticate(credentials)
      
      // Get user information
      const userInfo = await apiAuthService.getUserInfo()
      
      // Transform user info to our User type
      const user = await this.transformUserInfo(userInfo, tokenData)
      
      // Create session
      const session = this.sessionService.createSession(
        user.id,
        generateSecureToken(),
        tokenData,
        this.getClientIP(),
        this.getUserAgent()
      )
      
      // Get user permissions
      const permissions = RBACService.getUserPermissions(user)
      
      // Cache user data
      this.cacheUser(user)
      
      return {
        user,
        token: tokenData,
        session,
        permissions,
      }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<TokenData> {
    const session = this.sessionService.getCurrentSession()
    if (session && this.isDemoSession(session)) {
      // For demo sessions, just return the existing token
      return session.token
    }

    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performRefresh()

    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Perform actual token refresh
   */
  private async performRefresh(): Promise<TokenData> {
    try {
      const tokenData = await apiAuthService.refreshToken()
      
      // Update session with new token
      const session = this.sessionService.getCurrentSession()
      if (session) {
        this.sessionService.updateSessionToken(tokenData)
      }
      
      return tokenData
    } catch (error) {
      // If refresh fails, clear session and throw error
      this.sessionService.invalidateSession()
      this.clearUserCache()
      throw parseApiError(error)
    }
  }

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string> {
    try {
      const session = this.sessionService.getCurrentSession()
      if (session && this.isDemoSession(session)) {
        // For demo sessions, return the demo token
        return session.token.accessToken
      }
      
      return await apiAuthService.getAccessToken()
    } catch (error) {
      throw parseApiError(error)
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Check cache first
      if (this.userCache && this.userCacheExpiry && this.userCacheExpiry > new Date()) {
        return this.userCache
      }

      const session = this.sessionService.getCurrentSession()
      if (!session || !session.isActive) {
        return null
      }

      // Check if this is a demo session by looking at the user ID pattern
      if (this.isDemoSession(session)) {
        // For demo sessions, return the cached user or create a demo user
        if (this.userCache) {
          return this.userCache
        }
        
        // If no cached user, try to recreate from session data
        const demoUser = this.getDemoUserFromSession(session)
        if (demoUser) {
          this.cacheUser(demoUser)
          return demoUser
        }
        
        return null
      }

      // Get user info from API (only for non-demo sessions)
      const userInfo = await apiAuthService.getUserInfo()
      const tokenData = await this.getTokenData()
      
      if (!tokenData) {
        return null
      }

      const user = await this.transformUserInfo(userInfo, tokenData)
      this.cacheUser(user)
      
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.sessionService.getCurrentSession()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.sessionService.getCurrentSession()
    return session?.isActive && this.sessionService.isSessionValid()
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Logout from API service
      await apiAuthService.logout()
    } catch (error) {
      console.warn('Error during API logout:', error)
    } finally {
      // Clear local session and cache
      this.sessionService.invalidateSession()
      this.clearUserCache()
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UserProfileUpdate): Promise<User> {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw createCommonAuthErrors.userNotFound()
      }

      // Update user profile (this would typically call an API endpoint)
      const updatedUser: User = {
        ...currentUser,
        ...updates,
        displayName: updates.displayName || currentUser.displayName,
      }

      // Cache updated user
      this.cacheUser(updatedUser)
      
      return updatedUser
    } catch (error) {
      throw parseApiError(error)
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordChange: PasswordChange): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw createCommonAuthErrors.userNotFound()
      }

      // Validate new password
      const passwordValidation = this.validatePassword(passwordChange.newPassword)
      if (!passwordValidation.isValid) {
        throw createCommonAuthErrors.validationError('password', passwordValidation.errors.join(', '))
      }

      // Verify current password (this would typically call an API endpoint)
      // For now, we'll just simulate success
      
    } catch (error) {
      throw parseApiError(error)
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    const user = this.userCache
    return RBACService.hasPermission(user, permission)
  }

  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    const user = this.userCache
    return RBACService.hasRole(user, role)
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.userCache
    return RBACService.hasAnyRole(user, roles)
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    const user = this.userCache
    return RBACService.hasAllRoles(user, roles)
  }

  /**
   * Check if user can access resource with action
   */
  canAccess(resource: string, action: string): boolean {
    const user = this.userCache
    return RBACService.canAccess(user, resource, action)
  }

  /**
   * Extend current session
   */
  extendSession(): void {
    this.sessionService.extendSession()
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    return this.sessionService.isSessionValid()
  }

  /**
   * Check if session is expiring soon
   */
  isSessionExpiringSoon(): boolean {
    return this.sessionService.isSessionExpiringSoon()
  }

  /**
   * Get session time remaining in minutes
   */
  getSessionTimeRemaining(): number | null {
    return this.sessionService.getTimeRemaining()
  }

  /**
   * Get session info
   */
  getSessionInfo() {
    return this.sessionService.getSessionInfo()
  }

  /**
   * Transform API user info to our User type
   */
  private async transformUserInfo(userInfo: UserInfo, tokenData: TokenData): Promise<User> {
    const user: User = {
      id: userInfo.sub,
      sub: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      preferredUsername: userInfo.preferredUsername,
      givenName: userInfo.givenName,
      familyName: userInfo.familyName,
      roles: userInfo.roles || [],
      groups: userInfo.groups || [],
      displayName: getUserDisplayName(userInfo as User),
      avatar: undefined,
      department: this.getDepartmentFromGroups(userInfo.groups || []),
      permissions: [],
      lastLogin: new Date(),
      isActive: true,
    }

    // Get permissions based on roles
    user.permissions = RBACService.getUserPermissions(user)

    return user
  }

  /**
   * Get department from user groups
   */
  private getDepartmentFromGroups(groups: string[]): string | undefined {
    // Map groups to departments (this would be configured based on your organization)
    const groupToDepartment: Record<string, string> = {
      'research-team': 'Research',
      'development-team': 'Development',
      'quality-team': 'Quality',
      'marketing-team': 'Marketing',
      'sales-team': 'Sales',
      'management-team': 'Management',
    }

    for (const group of groups) {
      if (groupToDepartment[group]) {
        return groupToDepartment[group]
      }
    }

    return undefined
  }

  /**
   * Cache user data
   */
  private cacheUser(user: User): void {
    this.userCache = user
    this.userCacheExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  }

  /**
   * Clear user cache
   */
  private clearUserCache(): void {
    this.userCache = null
    this.userCacheExpiry = null
  }

  /**
   * Get token data from API service
   */
  private async getTokenData(): Promise<TokenData | null> {
    try {
      const authState = apiAuthService.getAuthState()
      return authState.token || null
    } catch (error) {
      return null
    }
  }

  /**
   * Validate password
   */
  private validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!password) {
      errors.push('Password is required')
      return { isValid: false, errors }
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(): string | undefined {
    if (typeof window === 'undefined') {
      return undefined
    }
    
    return (window as any).clientIP || undefined
  }

  /**
   * Get user agent string
   */
  private getUserAgent(): string | undefined {
    if (typeof window === 'undefined') {
      return undefined
    }
    
    return window.navigator.userAgent
  }

  /**
   * Add session activity listener
   */
  addSessionListener(listener: () => void): void {
    this.sessionService.addActivityListener(listener)
  }

  /**
   * Remove session activity listener
   */
  removeSessionListener(listener: () => void): void {
    this.sessionService.removeActivityListener(listener)
  }

  /**
   * Get authentication state
   */
  getAuthState(): {
    isAuthenticated: boolean
    user: User | null
    session: Session | null
    isLoading: boolean
    error: string | null
  } {
    const session = this.sessionService.getCurrentSession()
    const isAuthenticated = this.isAuthenticated()
    
    return {
      isAuthenticated,
      user: this.userCache,
      session,
      isLoading: false,
      error: null,
    }
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(): boolean {
    const session = this.sessionService.getCurrentSession()
    if (!session || !session.isActive) {
      return false
    }

    return this.sessionService.needsRefresh()
  }

  /**
   * Initialize authentication service
   */
  async initialize(): Promise<void> {
    try {
      // Check for existing session
      const session = this.sessionService.getCurrentSession()
      if (session && session.isActive && this.sessionService.isSessionValid()) {
        // Try to get current user
        await this.getCurrentUser()
      }
    } catch (error) {
      console.warn('Error initializing auth service:', error)
      // Clear invalid session
      this.sessionService.invalidateSession()
      this.clearUserCache()
    }
  }

  /**
   * Cleanup authentication service
   */
  cleanup(): void {
    this.sessionService.invalidateSession()
    this.clearUserCache()
  }

  /**
   * Check if credentials are for demo mode
   */
  private isDemoMode(credentials: AuthCredentials): boolean {
    const demoCredentials = [
      { email: 'demo@fragrance.com', password: 'DemoPassword123!' },
      { email: 'admin@fragrance.com', password: 'AdminPassword123!' },
      { email: 'user@fragrance.com', password: 'UserPassword123!' },
    ]
    
    return demoCredentials.some(
      demo => demo.email === credentials.email && demo.password === credentials.password
    )
  }

  /**
   * Check if the current session is a demo session
   */
  private isDemoSession(session: Session): boolean {
    // Demo sessions have user IDs that start with 'demo-', 'admin-', or 'regular-'
    return session.userId.startsWith('demo-') || 
           session.userId.startsWith('admin-') || 
           session.userId.startsWith('regular-')
  }

  /**
   * Get demo user from session data
   */
  private getDemoUserFromSession(session: Session): User | null {
    const demoUsers = {
      'demo-user-001': {
        id: 'demo-user-001',
        sub: 'demo-user-001',
        name: 'Demo User',
        email: 'demo@fragrance.com',
        preferredUsername: 'demo',
        givenName: 'Demo',
        familyName: 'User',
        roles: ['user'],
        groups: ['research-team'],
        displayName: 'Demo User',
        avatar: undefined,
        department: 'Research',
        permissions: [],
        lastLogin: new Date(),
        isActive: true,
      },
      'admin-user-001': {
        id: 'admin-user-001',
        sub: 'admin-user-001',
        name: 'Admin User',
        email: 'admin@fragrance.com',
        preferredUsername: 'admin',
        givenName: 'Admin',
        familyName: 'User',
        roles: ['admin', 'user'],
        groups: ['management-team'],
        displayName: 'Admin User',
        avatar: undefined,
        department: 'Management',
        permissions: [],
        lastLogin: new Date(),
        isActive: true,
      },
      'regular-user-001': {
        id: 'regular-user-001',
        sub: 'regular-user-001',
        name: 'Regular User',
        email: 'user@fragrance.com',
        preferredUsername: 'user',
        givenName: 'Regular',
        familyName: 'User',
        roles: ['user'],
        groups: ['development-team'],
        displayName: 'Regular User',
        avatar: undefined,
        department: 'Development',
        permissions: [],
        lastLogin: new Date(),
        isActive: true,
      },
    }

    const user = demoUsers[session.userId as keyof typeof demoUsers]
    if (user) {
      user.permissions = RBACService.getUserPermissions(user)
      return user
    }

    return null
  }

  /**
   * Create demo authentication response
   */
  private createDemoAuthResponse(credentials: AuthCredentials): AuthResponse {
    const demoUsers = {
      'demo@fragrance.com': {
        id: 'demo-user-001',
        sub: 'demo-user-001',
        name: 'Demo User',
        email: 'demo@fragrance.com',
        preferredUsername: 'demo',
        givenName: 'Demo',
        familyName: 'User',
        roles: ['user'],
        groups: ['research-team'],
        displayName: 'Demo User',
        avatar: undefined,
        department: 'Research',
        permissions: [],
        lastLogin: new Date(),
        isActive: true,
      },
      'admin@fragrance.com': {
        id: 'admin-user-001',
        sub: 'admin-user-001',
        name: 'Admin User',
        email: 'admin@fragrance.com',
        preferredUsername: 'admin',
        givenName: 'Admin',
        familyName: 'User',
        roles: ['admin', 'user'],
        groups: ['management-team'],
        displayName: 'Admin User',
        avatar: undefined,
        department: 'Management',
        permissions: [],
        lastLogin: new Date(),
        isActive: true,
      },
      'user@fragrance.com': {
        id: 'regular-user-001',
        sub: 'regular-user-001',
        name: 'Regular User',
        email: 'user@fragrance.com',
        preferredUsername: 'user',
        givenName: 'Regular',
        familyName: 'User',
        roles: ['user'],
        groups: ['development-team'],
        displayName: 'Regular User',
        avatar: undefined,
        department: 'Development',
        permissions: [],
        lastLogin: new Date(),
        isActive: true,
      },
    }

    const user = demoUsers[credentials.email as keyof typeof demoUsers] || demoUsers['demo@fragrance.com']
    
    // Get permissions based on roles
    user.permissions = RBACService.getUserPermissions(user)

    // Create demo token data
    const tokenData: TokenData = {
      accessToken: generateSecureToken(),
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      refreshToken: generateSecureToken(),
      scope: 'read write',
    }

    // Create session
    const session = this.sessionService.createSession(
      user.id,
      generateSecureToken(),
      tokenData,
      this.getClientIP(),
      this.getUserAgent()
    )

    // Cache user data
    this.cacheUser(user)

    return {
      user,
      token: tokenData,
      session,
      permissions: user.permissions,
    }
  }
}

/**
 * Default authentication service instance
 */
export const authService = new AuthService()

/**
 * Create authentication service with custom configuration
 */
export function createAuthService(config: Partial<AuthConfig> = {}): AuthService {
  return new AuthService(config)
}
