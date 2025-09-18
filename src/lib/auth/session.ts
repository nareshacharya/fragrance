import { TokenData } from '@/lib/api/auth'
import type { Session, UserActivityEvent, SessionTimeoutConfig, AuthConfig } from './types'

/**
 * Session storage interface
 */
interface SessionStorage {
  getSession(): Session | null
  setSession(session: Session): void
  clearSession(): void
  updateSession(updates: Partial<Session>): void
}

/**
 * LocalStorage-based session storage
 */
class LocalStorageSessionStorage implements SessionStorage {
  private readonly SESSION_KEY = 'fragrance_session'
  private readonly ACTIVITY_KEY = 'fragrance_activity'

  getSession(): Session | null {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY)
      if (!sessionStr) {
        return null
      }

      const sessionData = JSON.parse(sessionStr)
      
      // Check if session is expired
      if (new Date(sessionData.expiresAt) <= new Date()) {
        this.clearSession()
        return null
      }

      return {
        ...sessionData,
        createdAt: new Date(sessionData.createdAt),
        lastActivity: new Date(sessionData.lastActivity),
        expiresAt: new Date(sessionData.expiresAt),
      }
    } catch (error) {
      console.error('Error parsing stored session:', error)
      this.clearSession()
      return null
    }
  }

  setSession(session: Session): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Error storing session:', error)
    }
  }

  clearSession(): void {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.removeItem(this.SESSION_KEY)
    localStorage.removeItem(this.ACTIVITY_KEY)
  }

  updateSession(updates: Partial<Session>): void {
    const currentSession = this.getSession()
    if (currentSession) {
      const updatedSession = { ...currentSession, ...updates }
      this.setSession(updatedSession)
    }
  }

  getLastActivity(): Date | null {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const activityStr = localStorage.getItem(this.ACTIVITY_KEY)
      if (!activityStr) {
        return null
      }

      return new Date(JSON.parse(activityStr))
    } catch (error) {
      console.error('Error parsing last activity:', error)
      return null
    }
  }

  setLastActivity(date: Date): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(date))
    } catch (error) {
      console.error('Error storing last activity:', error)
    }
  }
}

/**
 * Session management service
 */
export class SessionService {
  private storage: SessionStorage
  private config: AuthConfig
  private activityListeners: Set<() => void> = new Set()
  private refreshTimer: NodeJS.Timeout | null = null
  private warningTimer: NodeJS.Timeout | null = null
  private activityTimer: NodeJS.Timeout | null = null
  private broadcastChannel: BroadcastChannel | null = null
  private storageListener: ((event: StorageEvent) => void) | null = null

  constructor(config: AuthConfig) {
    this.config = config
    this.storage = new LocalStorageSessionStorage()
    this.initializeActivityTracking()
    this.initializeCrossTabSync()
  }

  /**
   * Create a new session
   */
  createSession(
    userId: string,
    tokenId: string,
    tokenData: TokenData,
    ipAddress?: string,
    userAgent?: string
  ): Session {
    const now = new Date()
    const inactivityExpiry = new Date(now.getTime() + (this.config.sessionTimeout.maxInactiveTime * 60 * 1000))
    const expiresAt = new Date(Math.min(tokenData.expiresAt.getTime(), inactivityExpiry.getTime()))

    const session: Session = {
      id: this.generateSessionId(),
      userId,
      tokenId,
      createdAt: now,
      lastActivity: now,
      expiresAt,
      ipAddress,
      userAgent,
      isActive: true,
    }

    this.storage.setSession(session)
    this.startSessionTimers(session)
    
    return session
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.storage.getSession()
  }

  /**
   * Update session activity
   */
  updateActivity(): void {
    const session = this.getCurrentSession()
    if (!session || !session.isActive) {
      return
    }

    const now = new Date()
    const updatedSession = {
      ...session,
      lastActivity: now,
    }

    this.storage.setSession(updatedSession)
    this.storage.setLastActivity(now)
    this.startSessionTimers(updatedSession)
  }

  /**
   * Extend session
   */
  extendSession(): void {
    const session = this.getCurrentSession()
    if (!session || !session.isActive) {
      return
    }

    const now = new Date()
    const newExpiresAt = new Date(now.getTime() + (this.config.sessionTimeout.maxInactiveTime * 60 * 1000))

    const updatedSession = {
      ...session,
      lastActivity: now,
      expiresAt: newExpiresAt,
    }

    this.storage.setSession(updatedSession)
    this.storage.setLastActivity(now)
    this.startSessionTimers(updatedSession)
    this.broadcastToOtherTabs('SESSION_EXTEND')
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    const session = this.getCurrentSession()
    if (!session || !session.isActive) {
      return false
    }

    const now = new Date()
    return session.expiresAt > now
  }

  /**
   * Check if session is expiring soon
   */
  isSessionExpiringSoon(): boolean {
    const session = this.getCurrentSession()
    if (!session || !session.isActive) {
      return false
    }

    const now = new Date()
    const warningTime = new Date(now.getTime() + (this.config.sessionTimeout.warningTime * 60 * 1000))
    
    return session.expiresAt <= warningTime
  }

  /**
   * Get session time remaining in minutes
   */
  getTimeRemaining(): number | null {
    const session = this.getCurrentSession()
    if (!session || !session.isActive) {
      return null
    }

    const now = new Date()
    const timeRemaining = session.expiresAt.getTime() - now.getTime()
    
    return Math.max(0, Math.floor(timeRemaining / (1000 * 60)))
  }

  /**
   * Invalidate session
   */
  invalidateSession(): void {
    this.clearTimers()
    this.storage.clearSession()
    this.broadcastToOtherTabs('SESSION_LOGOUT')
  }

  /**
   * Clear session timers
   */
  private clearTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
    
    if (this.warningTimer) {
      clearTimeout(this.warningTimer)
      this.warningTimer = null
    }
    
    if (this.activityTimer) {
      clearTimeout(this.activityTimer)
      this.activityTimer = null
    }
  }

  /**
   * Start session timers
   */
  private startSessionTimers(session: Session): void {
    this.clearTimers()

    const now = new Date()
    const timeUntilExpiry = session.expiresAt.getTime() - now.getTime()
    const timeUntilWarning = timeUntilExpiry - (this.config.sessionTimeout.warningTime * 60 * 1000)

    // Check last activity for cross-tab sync
    const lastActivity = this.storage.getLastActivity()
    if (lastActivity && lastActivity > session.lastActivity) {
      // Another tab updated activity, sync the session
      const updatedSession = { ...session, lastActivity }
      this.storage.setSession(updatedSession)
    }

    // Set warning timer
    if (timeUntilWarning > 0) {
      this.warningTimer = setTimeout(() => {
        this.notifyActivityListeners()
      }, timeUntilWarning)
    }

    // Set expiry timer
    if (timeUntilExpiry > 0) {
      this.refreshTimer = setTimeout(() => {
        this.handleSessionExpiry()
      }, timeUntilExpiry)
    }
  }

  /**
   * Handle session expiry
   */
  private handleSessionExpiry(): void {
    this.invalidateSession()
    this.notifyActivityListeners()
  }

  /**
   * Initialize activity tracking
   */
  private initializeActivityTracking(): void {
    if (typeof window === 'undefined' || !this.config.enableActivityTracking) {
      return
    }

    const activityEvents: (keyof WindowEventMap)[] = [
      'click',
      'scroll',
      'keypress',
      'mousemove',
      'focus',
      'blur',
    ]

    const throttledUpdateActivity = this.throttle(() => {
      this.updateActivity()
    }, 1000)

    activityEvents.forEach(eventType => {
      window.addEventListener(eventType, throttledUpdateActivity, { passive: true })
    })

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      activityEvents.forEach(eventType => {
        window.removeEventListener(eventType, throttledUpdateActivity)
      })
    })
  }

  /**
   * Initialize cross-tab synchronization
   */
  private initializeCrossTabSync(): void {
    if (typeof window === 'undefined' || !this.config.enableCrossTabSync) {
      return
    }

    // Initialize BroadcastChannel for cross-tab communication
    if ('BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('fragrance-session-sync')
      this.broadcastChannel.addEventListener('message', (event) => {
        this.handleCrossTabMessage(event.data)
      })
    }

    // Listen to storage changes for cross-tab sync
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'fragrance_session' || event.key === 'fragrance_activity') {
        this.handleStorageChange(event)
      }
    }
    window.addEventListener('storage', this.storageListener)
  }

  /**
   * Handle cross-tab messages
   */
  private handleCrossTabMessage(data: any): void {
    switch (data.type) {
      case 'SESSION_LOGOUT':
        this.invalidateSession()
        this.notifyActivityListeners()
        break
      case 'SESSION_EXTEND':
        this.extendSession()
        break
      case 'SESSION_UPDATE':
        // Refresh session from storage
        const session = this.storage.getSession()
        if (session) {
          this.startSessionTimers(session)
        }
        break
    }
  }

  /**
   * Handle storage changes from other tabs
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'fragrance_session') {
      const session = this.storage.getSession()
      if (session) {
        this.startSessionTimers(session)
      } else {
        this.clearTimers()
        this.notifyActivityListeners()
      }
    } else if (event.key === 'fragrance_activity') {
      // Activity updated in another tab
      this.notifyActivityListeners()
    }
  }

  /**
   * Broadcast message to other tabs
   */
  private broadcastToOtherTabs(type: string, data?: any): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type, data })
    }
  }

  /**
   * Add activity listener
   */
  addActivityListener(listener: () => void): void {
    this.activityListeners.add(listener)
  }

  /**
   * Remove activity listener
   */
  removeActivityListener(listener: () => void): void {
    this.activityListeners.delete(listener)
  }

  /**
   * Notify activity listeners
   */
  private notifyActivityListeners(): void {
    this.activityListeners.forEach(listener => {
      try {
        listener()
      } catch (error) {
        console.error('Error in activity listener:', error)
      }
    })
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Throttle function
   */
  private throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    isActive: boolean
    timeRemaining: number | null
    isExpiringSoon: boolean
    lastActivity: Date | null
  } {
    const session = this.getCurrentSession()
    
    return {
      isActive: session?.isActive || false,
      timeRemaining: this.getTimeRemaining(),
      isExpiringSoon: this.isSessionExpiringSoon(),
      lastActivity: session?.lastActivity || null,
    }
  }

  /**
   * Check if session needs refresh
   */
  needsRefresh(): boolean {
    const session = this.getCurrentSession()
    if (!session || !session.isActive) {
      return false
    }

    const now = new Date()
    const refreshThreshold = new Date(now.getTime() + (this.config.tokenRefreshThreshold * 60 * 1000))
    
    return session.expiresAt <= refreshThreshold
  }

  /**
   * Update session with new token data
   */
  updateSessionToken(tokenData: TokenData): void {
    const session = this.getCurrentSession()
    if (!session) {
      return
    }

    const now = new Date()
    const inactivityExpiry = new Date(now.getTime() + (this.config.sessionTimeout.maxInactiveTime * 60 * 1000))
    const newExpiresAt = new Date(Math.min(tokenData.expiresAt.getTime(), inactivityExpiry.getTime()))

    const updatedSession = {
      ...session,
      lastActivity: now,
      expiresAt: newExpiresAt,
    }

    this.storage.setSession(updatedSession)
    this.startSessionTimers(updatedSession)
  }

  /**
   * Get session info for display
   */
  getSessionInfo(): {
    sessionId: string
    userId: string
    createdAt: Date
    lastActivity: Date
    expiresAt: Date
    timeRemaining: number
    isActive: boolean
  } | null {
    const session = this.getCurrentSession()
    if (!session) {
      return null
    }

    return {
      sessionId: session.id,
      userId: session.userId,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      expiresAt: session.expiresAt,
      timeRemaining: this.getTimeRemaining() || 0,
      isActive: session.isActive,
    }
  }

  /**
   * Cleanup cross-tab sync resources
   */
  cleanup(): void {
    this.clearTimers()
    
    if (this.broadcastChannel) {
      this.broadcastChannel.close()
      this.broadcastChannel = null
    }
    
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener)
      this.storageListener = null
    }
  }
}

/**
 * Default session configuration
 */
export const DEFAULT_SESSION_CONFIG: AuthConfig = {
  sessionTimeout: {
    warningTime: 5, // 5 minutes before expiry
    maxInactiveTime: 30, // 30 minutes of inactivity
    extendOnActivity: true,
  },
  tokenRefreshThreshold: 5, // 5 minutes before expiry
  enableSessionPersistence: true,
  enableCrossTabSync: true,
  enableActivityTracking: true,
  maxConcurrentSessions: 3,
}

/**
 * Create session service with default configuration
 */
export function createSessionService(config: Partial<AuthConfig> = {}): SessionService {
  const mergedConfig = { ...DEFAULT_SESSION_CONFIG, ...config }
  return new SessionService(mergedConfig)
}

/**
 * Default session service instance
 */
export const sessionService = createSessionService()
