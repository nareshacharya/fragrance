import { z } from 'zod'
import { pega } from '@/config/env'
import { apiClient } from './client'
import { AuthenticationError, ExternalApiError } from './errors'

/**
 * Token response schema for Pega DX OAuth2
 */
const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('Bearer'),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
})

/**
 * User info schema for Pega DX
 */
const userInfoSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  preferred_username: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  roles: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
})

/**
 * Token data interface
 */
export interface TokenData {
  accessToken: string
  tokenType: string
  expiresAt: Date
  refreshToken?: string | undefined
  scope?: string | undefined
}

/**
 * User info interface
 */
export interface UserInfo {
  sub: string
  name?: string | undefined
  email?: string | undefined
  preferredUsername?: string | undefined
  givenName?: string | undefined
  familyName?: string | undefined
  roles?: string[] | undefined
  groups?: string[] | undefined
}

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean
  token?: TokenData
  user?: UserInfo
  lastRefresh?: Date
}

/**
 * Token storage interface
 */
interface TokenStorage {
  getToken(): TokenData | null
  setToken(token: TokenData): void
  clearToken(): void
}

/**
 * Memory-based token storage (for server-side usage)
 */
class MemoryTokenStorage implements TokenStorage {
  private token: TokenData | null = null

  getToken(): TokenData | null {
    return this.token
  }

  setToken(token: TokenData): void {
    this.token = token
  }

  clearToken(): void {
    this.token = null
  }
}

/**
 * LocalStorage-based token storage (for client-side usage)
 */
class LocalStorageTokenStorage implements TokenStorage {
  private readonly TOKEN_KEY = 'pega_dx_token'

  getToken(): TokenData | null {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const tokenStr = localStorage.getItem(this.TOKEN_KEY)
      if (!tokenStr) {
        return null
      }

      const tokenData = JSON.parse(tokenStr)
      
      // Check if token is expired
      if (new Date(tokenData.expiresAt) <= new Date()) {
        this.clearToken()
        return null
      }

      return {
        ...tokenData,
        expiresAt: new Date(tokenData.expiresAt),
      }
    } catch (error) {
      console.error('Error parsing stored token:', error)
      this.clearToken()
      return null
    }
  }

  setToken(token: TokenData): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token))
    } catch (error) {
      console.error('Error storing token:', error)
    }
  }

  clearToken(): void {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.removeItem(this.TOKEN_KEY)
  }
}

/**
 * Authentication service for Pega DX integration
 */
export class AuthService {
  private tokenStorage: TokenStorage
  private refreshPromise: Promise<TokenData> | null = null

  constructor(useLocalStorage: boolean = false) {
    this.tokenStorage = useLocalStorage ? new LocalStorageTokenStorage() : new MemoryTokenStorage()
  }

  /**
   * Authenticate with Pega DX using client credentials or user credentials
   */
  async authenticate(credentials?: { email?: string; password?: string }): Promise<TokenData> {
    try {
      // Use password grant type if credentials are provided, otherwise use client credentials
      const grantType = credentials?.email && credentials?.password ? 'password' : 'client_credentials'
      
      const requestBody: any = {
        grant_type: grantType,
        client_id: pega.clientId,
        client_secret: pega.clientSecret,
        scope: 'api',
      }
      
      // Add user credentials for password grant type
      if (grantType === 'password' && credentials) {
        requestBody.username = credentials.email
        requestBody.password = credentials.password
      }
      
      const response = await apiClient.post('/oauth/token', requestBody)

      const tokenData = tokenResponseSchema.parse(response)
      
      const token: TokenData = {
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        refreshToken: tokenData.refresh_token,
        scope: tokenData.scope,
      }

      this.tokenStorage.setToken(token)
      return token
    } catch (error: any) {
      throw new AuthenticationError(
        'Failed to authenticate with Pega DX',
        {
          clientId: pega.clientId,
          error: error.message,
        }
      )
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<TokenData> {
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
    const currentToken = this.tokenStorage.getToken()
    
    if (!currentToken?.refreshToken) {
      // No refresh token available, need to re-authenticate
      return this.authenticate()
    }

    try {
      const response = await apiClient.post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: currentToken.refreshToken,
        client_id: pega.clientId,
        client_secret: pega.clientSecret,
      })

      const tokenData = tokenResponseSchema.parse(response)
      
      const token: TokenData = {
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        refreshToken: tokenData.refresh_token || currentToken.refreshToken,
        scope: tokenData.scope,
      }

      this.tokenStorage.setToken(token)
      return token
    } catch (error: any) {
      // Refresh failed, clear token and re-authenticate
      this.clearToken()
      return this.authenticate()
    }
  }

  /**
   * Get current access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    let token = this.tokenStorage.getToken()

    // If no token or token is expired, authenticate
    if (!token || this.isTokenExpired(token)) {
      token = await this.authenticate()
    }
    // If token expires soon (within 5 minutes), refresh it
    else if (this.isTokenExpiringSoon(token, 5)) {
      try {
        const refreshedToken = await this.refreshToken()
        token = refreshedToken
      } catch (error) {
        // If refresh fails, try to authenticate
        token = await this.authenticate()
      }
    }

    if (!token) {
      throw new AuthenticationError('Failed to obtain access token')
    }

    return token.accessToken
  }

  /**
   * Get user information from Pega DX
   */
  async getUserInfo(): Promise<UserInfo> {
    try {
      const accessToken = await this.getAccessToken()
      
      // Set authorization header for this request
      const response = await apiClient.get('/oauth/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return userInfoSchema.parse(response)
    } catch (error: any) {
      throw new ExternalApiError(
        'Failed to get user information',
        'Pega DX UserInfo API',
        undefined,
        { error: error.message }
      )
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: TokenData): boolean {
    return new Date() >= token.expiresAt
  }

  /**
   * Check if token is expiring soon
   */
  private isTokenExpiringSoon(token: TokenData, minutes: number): boolean {
    const expirationTime = new Date(token.expiresAt)
    const warningTime = new Date(Date.now() + minutes * 60 * 1000)
    return warningTime >= expirationTime
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    const token = this.tokenStorage.getToken()
    
    const authState: AuthState = {
      isAuthenticated: !!token && !this.isTokenExpired(token),
    }
    
    if (token) {
      authState.token = token
      authState.lastRefresh = new Date()
    }
    
    return authState
  }

  /**
   * Clear stored token
   */
  clearToken(): void {
    this.tokenStorage.clearToken()
  }

  /**
   * Logout and clear all authentication data
   */
  async logout(): Promise<void> {
    try {
      const token = this.tokenStorage.getToken()
      
      if (token?.accessToken) {
        // Revoke token on server if possible
        try {
          await apiClient.post('/oauth/revoke', {
            token: token.accessToken,
            client_id: pega.clientId,
            client_secret: pega.clientSecret,
          })
        } catch (error) {
          // Ignore revocation errors
          console.warn('Failed to revoke token:', error)
        }
      }
    } catch (error) {
      // Ignore logout errors
      console.warn('Error during logout:', error)
    } finally {
      this.clearToken()
    }
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role: string): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo()
      return (userInfo.roles || []).indexOf(role) !== -1
    } catch (error) {
      return false
    }
  }

  /**
   * Check if user has any of the specified roles
   */
  async hasAnyRole(roles: string[]): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo()
      return roles.some(role => (userInfo.roles || []).indexOf(role) !== -1)
    } catch (error) {
      return false
    }
  }

  /**
   * Check if user is in specific group
   */
  async isInGroup(group: string): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo()
      return (userInfo.groups || []).indexOf(group) !== -1
    } catch (error) {
      return false
    }
  }

  /**
   * Get user roles
   */
  async getUserRoles(): Promise<string[]> {
    try {
      const userInfo = await this.getUserInfo()
      return userInfo.roles || []
    } catch (error) {
      return []
    }
  }

  /**
   * Get user groups
   */
  async getUserGroups(): Promise<string[]> {
    try {
      const userInfo = await this.getUserInfo()
      return userInfo.groups || []
    } catch (error) {
      return []
    }
  }
}

/**
 * Default authentication service instance
 */
export const authService = new AuthService(typeof window !== 'undefined')

/**
 * Create authentication service with custom configuration
 */
export function createAuthService(useLocalStorage: boolean = false): AuthService {
  return new AuthService(useLocalStorage)
}

// Types are already exported above as interfaces
