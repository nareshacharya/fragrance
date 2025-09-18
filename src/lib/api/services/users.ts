import { BaseService } from './base'
import { endpointBuilder } from '../config'
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  SingleResponse, 
  PaginatedResponse,
  SearchParams,
  ApiRequestOptions 
} from '../types'
import { schemas } from '../types'
import { validateData } from '../utils'
import { logger } from '../logger'

/**
 * User service for Pega DX user management
 */
export class UserService extends BaseService<User, CreateUserRequest, UpdateUserRequest> {
  constructor() {
    super('/api/v1/users')
  }

  /**
   * Get user profile
   */
  async getProfile(options?: ApiRequestOptions): Promise<SingleResponse<User>> {
    try {
      const url = this.buildCustomUrl('profile')
      const response = await this.client.get<SingleResponse<User>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.getProfile:', { url })

      return response
    } catch (error) {
      logger.error('UserService.getProfile failed:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    data: UpdateUserRequest, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<User>> {
    try {
      // Validate request data
      const validatedData = validateData(schemas.updateUser, data)
      
      const url = this.buildCustomUrl('profile')
      const response = await this.client.put<SingleResponse<User>>(url, validatedData, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.updateProfile:', {
        url,
        data: this.sanitizeData(validatedData),
      })

      return response
    } catch (error) {
      logger.error('UserService.updateProfile failed:', error)
      throw error
    }
  }

  /**
   * Get user roles
   */
  async getRoles(id: string, options?: ApiRequestOptions): Promise<SingleResponse<string[]>> {
    try {
      const url = this.buildCustomUrl(id, 'roles')
      const response = await this.client.get<SingleResponse<string[]>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.getRoles:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.getRoles failed:', error)
      throw error
    }
  }

  /**
   * Update user roles
   */
  async updateRoles(
    id: string, 
    roles: string[], 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<User>> {
    try {
      const url = this.buildCustomUrl(id, 'roles')
      const response = await this.client.put<SingleResponse<User>>(url, { roles }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.updateRoles:', {
        url,
        id,
        roles,
      })

      return response
    } catch (error) {
      logger.error('UserService.updateRoles failed:', error)
      throw error
    }
  }

  /**
   * Get user permissions
   */
  async getPermissions(id: string, options?: ApiRequestOptions): Promise<SingleResponse<string[]>> {
    try {
      const url = this.buildCustomUrl(id, 'permissions')
      const response = await this.client.get<SingleResponse<string[]>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.getPermissions:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.getPermissions failed:', error)
      throw error
    }
  }

  /**
   * Get user groups
   */
  async getGroups(id: string, options?: ApiRequestOptions): Promise<SingleResponse<string[]>> {
    try {
      const url = this.buildCustomUrl(id, 'groups')
      const response = await this.client.get<SingleResponse<string[]>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.getGroups:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.getGroups failed:', error)
      throw error
    }
  }

  /**
   * Update user groups
   */
  async updateGroups(
    id: string, 
    groups: string[], 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<User>> {
    try {
      const url = this.buildCustomUrl(id, 'groups')
      const response = await this.client.put<SingleResponse<User>>(url, { groups }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.updateGroups:', {
        url,
        id,
        groups,
      })

      return response
    } catch (error) {
      logger.error('UserService.updateGroups failed:', error)
      throw error
    }
  }

  /**
   * Search users by email
   */
  async searchByEmail(
    email: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        query: email,
        filters: { email },
        pagination: { page: 1, limit: 10 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.searchByEmail failed:', error)
      throw error
    }
  }

  /**
   * Search users by role
   */
  async searchByRole(
    role: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        filters: { roles: role },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.searchByRole failed:', error)
      throw error
    }
  }

  /**
   * Search users by department
   */
  async searchByDepartment(
    department: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        filters: { department },
        pagination: { page: 1, limit: 50 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.searchByDepartment failed:', error)
      throw error
    }
  }

  /**
   * Get active users
   */
  async getActiveUsers(options?: ApiRequestOptions): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        filters: { isActive: true },
        pagination: { page: 1, limit: 100 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.getActiveUsers failed:', error)
      throw error
    }
  }

  /**
   * Get inactive users
   */
  async getInactiveUsers(options?: ApiRequestOptions): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        filters: { isActive: false },
        pagination: { page: 1, limit: 100 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.getInactiveUsers failed:', error)
      throw error
    }
  }

  /**
   * Activate user
   */
  async activateUser(id: string, options?: ApiRequestOptions): Promise<SingleResponse<User>> {
    try {
      const url = this.buildCustomUrl(id, 'activate')
      const response = await this.client.post<SingleResponse<User>>(url, {}, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.activateUser:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.activateUser failed:', error)
      throw error
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(id: string, options?: ApiRequestOptions): Promise<SingleResponse<User>> {
    try {
      const url = this.buildCustomUrl(id, 'deactivate')
      const response = await this.client.post<SingleResponse<User>>(url, {}, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug('UserService.deactivateUser:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.deactivateUser failed:', error)
      throw error
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(
    id: string, 
    newPassword: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{ success: boolean }>> {
    try {
      const url = this.buildCustomUrl(id, 'reset-password')
      const response = await this.client.post<SingleResponse<{ success: boolean }>>(
        url, 
        { newPassword }, 
        {
          timeout: options?.timeout,
          headers: options?.headers,
        }
      )

      logger.debug('UserService.resetPassword:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.resetPassword failed:', error)
      throw error
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string, 
    newPassword: string, 
    options?: ApiRequestOptions
  ): Promise<SingleResponse<{ success: boolean }>> {
    try {
      const url = this.buildCustomUrl('change-password')
      const response = await this.client.post<SingleResponse<{ success: boolean }>>(
        url, 
        { currentPassword, newPassword }, 
        {
          timeout: options?.timeout,
          headers: options?.headers,
        }
      )

      logger.debug('UserService.changePassword:', { url })

      return response
    } catch (error) {
      logger.error('UserService.changePassword failed:', error)
      throw error
    }
  }

  /**
   * Get user activity log
   */
  async getActivityLog(
    id: string, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<{
    id: string
    action: string
    timestamp: string
    details: Record<string, any>
  }>> {
    try {
      const url = this.buildCustomUrl(id, 'activity')
      const response = await this.client.get<PaginatedResponse<{
        id: string
        action: string
        timestamp: string
        details: Record<string, any>
      }>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: options?.params,
      })

      logger.debug('UserService.getActivityLog:', { url, id })

      return response
    } catch (error) {
      logger.error('UserService.getActivityLog failed:', error)
      throw error
    }
  }

  /**
   * Get users by multiple roles
   */
  async getUsersByRoles(
    roles: string[], 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        filters: { roles: { $in: roles } },
        pagination: { page: 1, limit: 100 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.getUsersByRoles failed:', error)
      throw error
    }
  }

  /**
   * Get users by multiple groups
   */
  async getUsersByGroups(
    groups: string[], 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<User>> {
    try {
      const searchParams: SearchParams = {
        filters: { groups: { $in: groups } },
        pagination: { page: 1, limit: 100 },
      }

      return this.list(searchParams, options)
    } catch (error) {
      logger.error('UserService.getUsersByGroups failed:', error)
      throw error
    }
  }

  /**
   * Validate user data before creation
   */
  protected validateCreateData(data: CreateUserRequest): CreateUserRequest {
    return validateData(schemas.createUser, data)
  }

  /**
   * Validate user data before update
   */
  protected validateUpdateData(data: UpdateUserRequest): UpdateUserRequest {
    return validateData(schemas.updateUser, data)
  }

  /**
   * Override create method to include validation
   */
  async create(data: CreateUserRequest, options?: ApiRequestOptions): Promise<SingleResponse<User>> {
    const validatedData = this.validateCreateData(data)
    return super.create(validatedData, options)
  }

  /**
   * Override update method to include validation
   */
  async update(id: string, data: UpdateUserRequest, options?: ApiRequestOptions): Promise<SingleResponse<User>> {
    const validatedData = this.validateUpdateData(data)
    return super.update(id, validatedData, options)
  }
}

/**
 * Default user service instance
 */
export const userService = new UserService()

/**
 * Create user service instance
 */
export function createUserService(): UserService {
  return new UserService()
}
