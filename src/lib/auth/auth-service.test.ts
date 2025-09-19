import { AuthService } from './auth-service'
import { authService as apiAuthService } from '@/lib/api/auth'
import { RBACService } from './rbac'
import { createSessionService } from './session'
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

// Mock dependencies
jest.mock('@/lib/api/auth', () => ({
  authService: {
    authenticate: jest.fn(),
    getUserInfo: jest.fn(),
    refreshToken: jest.fn(),
    getAccessToken: jest.fn(),
    logout: jest.fn(),
    getAuthState: jest.fn(),
  },
}))

jest.mock('./rbac', () => ({
  RBACService: {
    getUserPermissions: jest.fn(),
    hasPermission: jest.fn(),
    hasRole: jest.fn(),
    hasAnyRole: jest.fn(),
    hasAllRoles: jest.fn(),
    canAccess: jest.fn(),
  },
}))

jest.mock('./session', () => ({
  createSessionService: jest.fn(),
}))

jest.mock('./utils', () => ({
  validateCredentials: jest.fn(),
  createCommonAuthErrors: {
    validationError: jest.fn(),
    userNotFound: jest.fn(),
  },
  parseApiError: jest.fn(),
  getUserDisplayName: jest.fn(),
  getUserInitials: jest.fn(),
  generateSecureToken: jest.fn(),
  isTokenExpired: jest.fn(),
  isTokenExpiringSoon: jest.fn(),
}))

describe('AuthService', () => {
  let authService: AuthService
  let mockApiAuthService: jest.Mocked<typeof apiAuthService>
  let mockRBACService: jest.Mocked<typeof RBACService>
  let mockSessionService: any
  let mockUtils: any

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Mock session service
    mockSessionService = {
      createSession: jest.fn(),
      getCurrentSession: jest.fn(),
      updateSessionToken: jest.fn(),
      invalidateSession: jest.fn(),
      extendSession: jest.fn(),
      isSessionValid: jest.fn(),
      isSessionExpiringSoon: jest.fn(),
      getTimeRemaining: jest.fn(),
      getSessionInfo: jest.fn(),
      addActivityListener: jest.fn(),
      removeActivityListener: jest.fn(),
      needsRefresh: jest.fn(),
    }

    ;(createSessionService as jest.Mock).mockReturnValue(mockSessionService)

    // Get mocked services
    mockApiAuthService = apiAuthService as jest.Mocked<typeof apiAuthService>
    mockRBACService = RBACService as jest.Mocked<typeof RBACService>
    mockUtils = require('./utils')

    // Create auth service instance
    authService = new AuthService()
  })

  describe('Constructor', () => {
    it('should create auth service with default config', () => {
      const service = new AuthService()
      expect(createSessionService).toHaveBeenCalledWith(
        expect.objectContaining({
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
        })
      )
    })

    it('should create auth service with custom config', () => {
      const customConfig: Partial<AuthConfig> = {
        sessionTimeout: {
          warningTime: 10,
          maxInactiveTime: 60,
          extendOnActivity: false,
        },
        tokenRefreshThreshold: 10,
      }

      const service = new AuthService(customConfig)
      expect(createSessionService).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionTimeout: {
            warningTime: 10,
            maxInactiveTime: 60,
            extendOnActivity: false,
          },
          tokenRefreshThreshold: 10,
          enableSessionPersistence: true,
          enableCrossTabSync: true,
          enableActivityTracking: true,
          maxConcurrentSessions: 3,
        })
      )
    })
  })

  describe('Authentication', () => {
    describe('authenticate', () => {
      it('should authenticate user with valid credentials', async () => {
        const credentials: AuthCredentials = {
          email: 'test@example.com',
          password: 'password123',
        }

        const mockTokenData = {
          accessToken: 'access-token',
          tokenType: 'Bearer',
          expiresAt: new Date(Date.now() + 3600000),
          refreshToken: 'refresh-token',
          scope: 'read write',
        }

        const mockUserInfo = {
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
        }

        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: expect.any(Date),
          isActive: true,
        }

        const mockSession: Session = {
          id: 'session-123',
          userId: 'user-123',
          token: mockTokenData,
          createdAt: expect.any(Date),
          lastActivity: expect.any(Date),
          expiresAt: expect.any(Date),
          isActive: true,
          clientIP: undefined,
          userAgent: undefined,
        }

        const mockPermissions: Permission[] = [
          { id: 'perfumes:read', name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
        ]

        // Setup mocks
        mockUtils.validateCredentials.mockReturnValue({ isValid: true, errors: {} })
        mockApiAuthService.authenticate.mockResolvedValue(mockTokenData)
        mockApiAuthService.getUserInfo.mockResolvedValue(mockUserInfo)
        mockRBACService.getUserPermissions.mockReturnValue(mockPermissions)
        mockSessionService.createSession.mockReturnValue(mockSession)
        mockUtils.getUserDisplayName.mockReturnValue('Test User')
        mockUtils.generateSecureToken.mockReturnValue('secure-token')

        const result = await authService.authenticate(credentials)

        expect(mockUtils.validateCredentials).toHaveBeenCalledWith(credentials)
        expect(mockApiAuthService.authenticate).toHaveBeenCalledWith(credentials)
        expect(mockApiAuthService.getUserInfo).toHaveBeenCalled()
        expect(mockRBACService.getUserPermissions).toHaveBeenCalledWith(mockUser)
        expect(mockSessionService.createSession).toHaveBeenCalledWith(
          'user-123',
          'secure-token',
          mockTokenData,
          undefined,
          undefined
        )

        expect(result).toEqual({
          user: mockUser,
          token: mockTokenData,
          session: mockSession,
          permissions: mockPermissions,
        })
      })

      it('should handle invalid credentials', async () => {
        const credentials: AuthCredentials = {
          email: 'invalid@example.com',
          password: 'wrong',
        }

        const validationError = new Error('Invalid credentials')
        mockUtils.validateCredentials.mockReturnValue({ 
          isValid: false, 
          errors: { email: 'Invalid email format' } 
        })
        mockUtils.createCommonAuthErrors.validationError.mockReturnValue(validationError)

        await expect(authService.authenticate(credentials)).rejects.toThrow('Invalid credentials')
        expect(mockUtils.validateCredentials).toHaveBeenCalledWith(credentials)
        expect(mockUtils.createCommonAuthErrors.validationError).toHaveBeenCalledWith(
          'credentials',
          'Invalid email format'
        )
      })

      it('should handle demo mode authentication', async () => {
        const credentials: AuthCredentials = {
          email: 'demo@fragrance.com',
          password: 'DemoPassword123!',
        }

        mockUtils.validateCredentials.mockReturnValue({ isValid: true, errors: {} })
        mockUtils.generateSecureToken.mockReturnValue('demo-token')
        mockRBACService.getUserPermissions.mockReturnValue([])
        mockSessionService.createSession.mockReturnValue({
          id: 'demo-session',
          userId: 'demo-user-001',
          token: expect.any(Object),
          createdAt: expect.any(Date),
          lastActivity: expect.any(Date),
          expiresAt: expect.any(Date),
          isActive: true,
        })

        const result = await authService.authenticate(credentials)

        expect(result.user.email).toBe('demo@fragrance.com')
        expect(result.user.id).toBe('demo-user-001')
        expect(result.user.roles).toContain('user')
        expect(mockApiAuthService.authenticate).not.toHaveBeenCalled()
      })

      it('should handle API authentication errors', async () => {
        const credentials: AuthCredentials = {
          email: 'test@example.com',
          password: 'password123',
        }

        const apiError = new Error('API authentication failed')
        const parsedError = new Error('Authentication failed')

        mockUtils.validateCredentials.mockReturnValue({ isValid: true, errors: {} })
        mockApiAuthService.authenticate.mockRejectedValue(apiError)
        mockUtils.parseApiError.mockReturnValue(parsedError)

        await expect(authService.authenticate(credentials)).rejects.toThrow('Authentication failed')
        expect(mockUtils.parseApiError).toHaveBeenCalledWith(apiError)
      })
    })

    describe('refreshToken', () => {
      it('should refresh token successfully', async () => {
        const mockTokenData = {
          accessToken: 'new-access-token',
          tokenType: 'Bearer',
          expiresAt: new Date(Date.now() + 3600000),
          refreshToken: 'new-refresh-token',
          scope: 'read write',
        }

        const mockSession: Session = {
          id: 'session-123',
          userId: 'user-123',
          token: mockTokenData,
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        }

        mockSessionService.getCurrentSession.mockReturnValue(mockSession)
        mockApiAuthService.refreshToken.mockResolvedValue(mockTokenData)

        const result = await authService.refreshToken()

        expect(mockApiAuthService.refreshToken).toHaveBeenCalled()
        expect(mockSessionService.updateSessionToken).toHaveBeenCalledWith(mockTokenData)
        expect(result).toEqual(mockTokenData)
      })

      it('should handle demo session refresh', async () => {
        const mockSession: Session = {
          id: 'demo-session',
          userId: 'demo-user-001',
          token: {
            accessToken: 'demo-token',
            tokenType: 'Bearer',
            expiresAt: new Date(Date.now() + 3600000),
            refreshToken: 'demo-refresh',
            scope: 'read write',
          },
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        }

        mockSessionService.getCurrentSession.mockReturnValue(mockSession)

        const result = await authService.refreshToken()

        expect(result).toEqual(mockSession.token)
        expect(mockApiAuthService.refreshToken).not.toHaveBeenCalled()
      })

      it('should prevent multiple simultaneous refresh attempts', async () => {
        const mockTokenData = {
          accessToken: 'new-access-token',
          tokenType: 'Bearer',
          expiresAt: new Date(Date.now() + 3600000),
          refreshToken: 'new-refresh-token',
          scope: 'read write',
        }

        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: mockTokenData,
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })

        mockApiAuthService.refreshToken.mockResolvedValue(mockTokenData)

        // Start multiple refresh attempts
        const promise1 = authService.refreshToken()
        const promise2 = authService.refreshToken()
        const promise3 = authService.refreshToken()

        const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3])

        // All should return the same result
        expect(result1).toEqual(mockTokenData)
        expect(result2).toEqual(mockTokenData)
        expect(result3).toEqual(mockTokenData)

        // API should only be called once
        expect(mockApiAuthService.refreshToken).toHaveBeenCalledTimes(1)
      })

      it('should handle refresh token errors', async () => {
        const refreshError = new Error('Refresh token expired')
        const parsedError = new Error('Token refresh failed')

        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })

        mockApiAuthService.refreshToken.mockRejectedValue(refreshError)
        mockUtils.parseApiError.mockReturnValue(parsedError)

        await expect(authService.refreshToken()).rejects.toThrow('Token refresh failed')
        expect(mockSessionService.invalidateSession).toHaveBeenCalled()
        expect(mockUtils.parseApiError).toHaveBeenCalledWith(refreshError)
      })
    })

    describe('getAccessToken', () => {
      it('should get access token successfully', async () => {
        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })

        mockApiAuthService.getAccessToken.mockResolvedValue('access-token')

        const result = await authService.getAccessToken()

        expect(mockApiAuthService.getAccessToken).toHaveBeenCalled()
        expect(result).toBe('access-token')
      })

      it('should handle demo session access token', async () => {
        const mockSession: Session = {
          id: 'demo-session',
          userId: 'demo-user-001',
          token: {
            accessToken: 'demo-token',
            tokenType: 'Bearer',
            expiresAt: new Date(Date.now() + 3600000),
            refreshToken: 'demo-refresh',
            scope: 'read write',
          },
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        }

        mockSessionService.getCurrentSession.mockReturnValue(mockSession)

        const result = await authService.getAccessToken()

        expect(result).toBe('demo-token')
        expect(mockApiAuthService.getAccessToken).not.toHaveBeenCalled()
      })

      it('should handle access token errors', async () => {
        const tokenError = new Error('Token not found')
        const parsedError = new Error('Access token error')

        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })

        mockApiAuthService.getAccessToken.mockRejectedValue(tokenError)
        mockUtils.parseApiError.mockReturnValue(parsedError)

        await expect(authService.getAccessToken()).rejects.toThrow('Access token error')
        expect(mockUtils.parseApiError).toHaveBeenCalledWith(tokenError)
      })
    })
  })

  describe('User Management', () => {
    describe('getCurrentUser', () => {
      it('should return cached user if valid', async () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        // Set up cached user
        ;(authService as any).userCache = mockUser
        ;(authService as any).userCacheExpiry = new Date(Date.now() + 300000) // 5 minutes from now

        const result = await authService.getCurrentUser()

        expect(result).toEqual(mockUser)
        expect(mockApiAuthService.getUserInfo).not.toHaveBeenCalled()
      })

      it('should fetch user from API if not cached', async () => {
        const mockUserInfo = {
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
        }

        const mockTokenData = {
          accessToken: 'access-token',
          tokenType: 'Bearer',
          expiresAt: new Date(Date.now() + 3600000),
          refreshToken: 'refresh-token',
          scope: 'read write',
        }

        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: expect.any(Date),
          isActive: true,
        }

        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: mockTokenData,
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })

        mockApiAuthService.getUserInfo.mockResolvedValue(mockUserInfo)
        mockApiAuthService.getAuthState.mockReturnValue({ token: mockTokenData })
        mockRBACService.getUserPermissions.mockReturnValue([])
        mockUtils.getUserDisplayName.mockReturnValue('Test User')

        const result = await authService.getCurrentUser()

        expect(mockApiAuthService.getUserInfo).toHaveBeenCalled()
        expect(mockRBACService.getUserPermissions).toHaveBeenCalledWith(mockUser)
        expect(result).toEqual(mockUser)
      })

      it('should return null if no active session', async () => {
        mockSessionService.getCurrentSession.mockReturnValue(null)

        const result = await authService.getCurrentUser()

        expect(result).toBeNull()
        expect(mockApiAuthService.getUserInfo).not.toHaveBeenCalled()
      })

      it('should handle demo user from session', async () => {
        const mockSession: Session = {
          id: 'demo-session',
          userId: 'demo-user-001',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        }

        mockSessionService.getCurrentSession.mockReturnValue(mockSession)
        mockRBACService.getUserPermissions.mockReturnValue([])

        const result = await authService.getCurrentUser()

        expect(result).toEqual(expect.objectContaining({
          id: 'demo-user-001',
          email: 'demo@fragrance.com',
          name: 'Demo User',
          roles: ['user'],
        }))
        expect(mockApiAuthService.getUserInfo).not.toHaveBeenCalled()
      })

      it('should handle errors gracefully', async () => {
        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })

        mockApiAuthService.getUserInfo.mockRejectedValue(new Error('API Error'))

        const result = await authService.getCurrentUser()

        expect(result).toBeNull()
      })
    })

    describe('updateProfile', () => {
      it('should update user profile successfully', async () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        const updates: UserProfileUpdate = {
          displayName: 'Updated Name',
          avatar: 'avatar-url',
        }

        // Set up cached user
        ;(authService as any).userCache = mockUser

        const result = await authService.updateProfile(updates)

        expect(result).toEqual({
          ...mockUser,
          displayName: 'Updated Name',
          avatar: 'avatar-url',
        })
      })

      it('should throw error if user not found', async () => {
        const updates: UserProfileUpdate = {
          displayName: 'Updated Name',
        }

        const userNotFoundError = new Error('User not found')
        mockUtils.createCommonAuthErrors.userNotFound.mockReturnValue(userNotFoundError)

        await expect(authService.updateProfile(updates)).rejects.toThrow('User not found')
        expect(mockUtils.createCommonAuthErrors.userNotFound).toHaveBeenCalled()
      })

      it('should handle update errors', async () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        const updates: UserProfileUpdate = {
          displayName: 'Updated Name',
        }

        const updateError = new Error('Update failed')
        const parsedError = new Error('Profile update failed')

        ;(authService as any).userCache = mockUser
        mockUtils.parseApiError.mockReturnValue(parsedError)

        // Simulate an error during update
        jest.spyOn(authService, 'getCurrentUser').mockRejectedValue(updateError)

        await expect(authService.updateProfile(updates)).rejects.toThrow('Profile update failed')
        expect(mockUtils.parseApiError).toHaveBeenCalledWith(updateError)
      })
    })

    describe('changePassword', () => {
      it('should change password successfully', async () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        const passwordChange: PasswordChange = {
          currentPassword: 'oldPassword123!',
          newPassword: 'newPassword123!',
        }

        ;(authService as any).userCache = mockUser

        await expect(authService.changePassword(passwordChange)).resolves.not.toThrow()
      })

      it('should throw error if user not found', async () => {
        const passwordChange: PasswordChange = {
          currentPassword: 'oldPassword123!',
          newPassword: 'newPassword123!',
        }

        const userNotFoundError = new Error('User not found')
        mockUtils.createCommonAuthErrors.userNotFound.mockReturnValue(userNotFoundError)

        await expect(authService.changePassword(passwordChange)).rejects.toThrow('User not found')
      })

      it('should validate new password', async () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        const passwordChange: PasswordChange = {
          currentPassword: 'oldPassword123!',
          newPassword: 'weak',
        }

        const validationError = new Error('Password validation failed')
        mockUtils.createCommonAuthErrors.validationError.mockReturnValue(validationError)

        ;(authService as any).userCache = mockUser

        await expect(authService.changePassword(passwordChange)).rejects.toThrow('Password validation failed')
        expect(mockUtils.createCommonAuthErrors.validationError).toHaveBeenCalledWith(
          'password',
          expect.stringContaining('Password must be at least 8 characters long')
        )
      })
    })
  })

  describe('Session Management', () => {
    describe('logout', () => {
      it('should logout successfully', async () => {
        mockApiAuthService.logout.mockResolvedValue(undefined)

        await authService.logout()

        expect(mockApiAuthService.logout).toHaveBeenCalled()
        expect(mockSessionService.invalidateSession).toHaveBeenCalled()
      })

      it('should handle API logout errors gracefully', async () => {
        const logoutError = new Error('Logout failed')
        mockApiAuthService.logout.mockRejectedValue(logoutError)

        await authService.logout()

        expect(mockApiAuthService.logout).toHaveBeenCalled()
        expect(mockSessionService.invalidateSession).toHaveBeenCalled()
      })
    })

    describe('session validation', () => {
      it('should check if user is authenticated', () => {
        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })
        mockSessionService.isSessionValid.mockReturnValue(true)

        const result = authService.isAuthenticated()

        expect(result).toBe(true)
        expect(mockSessionService.getCurrentSession).toHaveBeenCalled()
        expect(mockSessionService.isSessionValid).toHaveBeenCalled()
      })

      it('should return false if session is inactive', () => {
        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: false,
        })

        const result = authService.isAuthenticated()

        expect(result).toBe(false)
      })

      it('should return false if no session', () => {
        mockSessionService.getCurrentSession.mockReturnValue(null)

        const result = authService.isAuthenticated()

        expect(result).toBe(false)
      })
    })

    describe('session operations', () => {
      it('should extend session', () => {
        authService.extendSession()
        expect(mockSessionService.extendSession).toHaveBeenCalled()
      })

      it('should check if session is valid', () => {
        mockSessionService.isSessionValid.mockReturnValue(true)
        const result = authService.isSessionValid()
        expect(result).toBe(true)
        expect(mockSessionService.isSessionValid).toHaveBeenCalled()
      })

      it('should check if session is expiring soon', () => {
        mockSessionService.isSessionExpiringSoon.mockReturnValue(true)
        const result = authService.isSessionExpiringSoon()
        expect(result).toBe(true)
        expect(mockSessionService.isSessionExpiringSoon).toHaveBeenCalled()
      })

      it('should get session time remaining', () => {
        mockSessionService.getTimeRemaining.mockReturnValue(30)
        const result = authService.getSessionTimeRemaining()
        expect(result).toBe(30)
        expect(mockSessionService.getTimeRemaining).toHaveBeenCalled()
      })

      it('should get session info', () => {
        const mockSessionInfo = {
          id: 'session-123',
          userId: 'user-123',
          isActive: true,
          timeRemaining: 30,
        }
        mockSessionService.getSessionInfo.mockReturnValue(mockSessionInfo)
        const result = authService.getSessionInfo()
        expect(result).toEqual(mockSessionInfo)
        expect(mockSessionService.getSessionInfo).toHaveBeenCalled()
      })
    })
  })

  describe('RBAC Integration', () => {
    describe('permission checks', () => {
      it('should check user permissions', () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        ;(authService as any).userCache = mockUser
        mockRBACService.hasPermission.mockReturnValue(true)

        const result = authService.hasPermission('perfumes:read')

        expect(result).toBe(true)
        expect(mockRBACService.hasPermission).toHaveBeenCalledWith(mockUser, 'perfumes:read')
      })

      it('should check user roles', () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        ;(authService as any).userCache = mockUser
        mockRBACService.hasRole.mockReturnValue(true)

        const result = authService.hasRole('user')

        expect(result).toBe(true)
        expect(mockRBACService.hasRole).toHaveBeenCalledWith(mockUser, 'user')
      })

      it('should check if user has any of the specified roles', () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        ;(authService as any).userCache = mockUser
        mockRBACService.hasAnyRole.mockReturnValue(true)

        const result = authService.hasAnyRole(['user', 'admin'])

        expect(result).toBe(true)
        expect(mockRBACService.hasAnyRole).toHaveBeenCalledWith(mockUser, ['user', 'admin'])
      })

      it('should check if user has all of the specified roles', () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        ;(authService as any).userCache = mockUser
        mockRBACService.hasAllRoles.mockReturnValue(false)

        const result = authService.hasAllRoles(['user', 'admin'])

        expect(result).toBe(false)
        expect(mockRBACService.hasAllRoles).toHaveBeenCalledWith(mockUser, ['user', 'admin'])
      })

      it('should check if user can access resource with action', () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        ;(authService as any).userCache = mockUser
        mockRBACService.canAccess.mockReturnValue(true)

        const result = authService.canAccess('perfumes', 'read')

        expect(result).toBe(true)
        expect(mockRBACService.canAccess).toHaveBeenCalledWith(mockUser, 'perfumes', 'read')
      })
    })
  })

  describe('Utility Methods', () => {
    describe('getAuthState', () => {
      it('should return authentication state', () => {
        const mockUser: User = {
          id: 'user-123',
          sub: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          preferredUsername: 'testuser',
          givenName: 'Test',
          familyName: 'User',
          roles: ['user'],
          groups: ['research-team'],
          displayName: 'Test User',
          avatar: undefined,
          department: 'Research',
          permissions: [],
          lastLogin: new Date(),
          isActive: true,
        }

        const mockSession: Session = {
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        }

        ;(authService as any).userCache = mockUser
        mockSessionService.getCurrentSession.mockReturnValue(mockSession)
        mockSessionService.isSessionValid.mockReturnValue(true)

        const result = authService.getAuthState()

        expect(result).toEqual({
          isAuthenticated: true,
          user: mockUser,
          session: mockSession,
          isLoading: false,
          error: null,
        })
      })
    })

    describe('needsTokenRefresh', () => {
      it('should check if token needs refresh', () => {
        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })
        mockSessionService.needsRefresh.mockReturnValue(true)

        const result = authService.needsTokenRefresh()

        expect(result).toBe(true)
        expect(mockSessionService.needsRefresh).toHaveBeenCalled()
      })

      it('should return false if no active session', () => {
        mockSessionService.getCurrentSession.mockReturnValue(null)

        const result = authService.needsTokenRefresh()

        expect(result).toBe(false)
      })
    })

    describe('initialize', () => {
      it('should initialize auth service successfully', async () => {
        const mockSession: Session = {
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        }

        mockSessionService.getCurrentSession.mockReturnValue(mockSession)
        mockSessionService.isSessionValid.mockReturnValue(true)
        jest.spyOn(authService, 'getCurrentUser').mockResolvedValue(null)

        await authService.initialize()

        expect(mockSessionService.getCurrentSession).toHaveBeenCalled()
        expect(mockSessionService.isSessionValid).toHaveBeenCalled()
        expect(authService.getCurrentUser).toHaveBeenCalled()
      })

      it('should handle initialization errors', async () => {
        mockSessionService.getCurrentSession.mockReturnValue({
          id: 'session-123',
          userId: 'user-123',
          token: expect.any(Object),
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 3600000),
          isActive: true,
        })
        mockSessionService.isSessionValid.mockReturnValue(true)
        jest.spyOn(authService, 'getCurrentUser').mockRejectedValue(new Error('Init error'))

        await authService.initialize()

        expect(mockSessionService.invalidateSession).toHaveBeenCalled()
      })
    })

    describe('cleanup', () => {
      it('should cleanup auth service', () => {
        authService.cleanup()

        expect(mockSessionService.invalidateSession).toHaveBeenCalled()
      })
    })

    describe('session listeners', () => {
      it('should add session activity listener', () => {
        const listener = jest.fn()
        authService.addSessionListener(listener)

        expect(mockSessionService.addActivityListener).toHaveBeenCalledWith(listener)
      })

      it('should remove session activity listener', () => {
        const listener = jest.fn()
        authService.removeSessionListener(listener)

        expect(mockSessionService.removeActivityListener).toHaveBeenCalledWith(listener)
      })
    })
  })

  describe('Password Validation', () => {
    it('should validate password requirements', () => {
      const authService = new AuthService()
      
      // Test valid password
      const validResult = (authService as any).validatePassword('ValidPass123!')
      expect(validResult.isValid).toBe(true)
      expect(validResult.errors).toHaveLength(0)

      // Test password too short
      const shortResult = (authService as any).validatePassword('short')
      expect(shortResult.isValid).toBe(false)
      expect(shortResult.errors).toContain('Password must be at least 8 characters long')

      // Test password without lowercase
      const noLowerResult = (authService as any).validatePassword('VALIDPASS123!')
      expect(noLowerResult.isValid).toBe(false)
      expect(noLowerResult.errors).toContain('Password must contain at least one lowercase letter')

      // Test password without uppercase
      const noUpperResult = (authService as any).validatePassword('validpass123!')
      expect(noUpperResult.isValid).toBe(false)
      expect(noUpperResult.errors).toContain('Password must contain at least one uppercase letter')

      // Test password without number
      const noNumberResult = (authService as any).validatePassword('ValidPass!')
      expect(noNumberResult.isValid).toBe(false)
      expect(noNumberResult.errors).toContain('Password must contain at least one number')

      // Test password without special character
      const noSpecialResult = (authService as any).validatePassword('ValidPass123')
      expect(noSpecialResult.isValid).toBe(false)
      expect(noSpecialResult.errors).toContain('Password must contain at least one special character')

      // Test empty password
      const emptyResult = (authService as any).validatePassword('')
      expect(emptyResult.isValid).toBe(false)
      expect(emptyResult.errors).toContain('Password is required')
    })
  })
})
