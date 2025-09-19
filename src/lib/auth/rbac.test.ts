import { RBACService, ROLES, PERMISSIONS, PERMISSION_CONSTANTS } from './rbac'
import { USER_ROLES } from '@/config/constants'
import type { User, Permission, UserRole } from './types'

// Mock the constants
jest.mock('@/config/constants', () => ({
  USER_ROLES: {
    ADMINISTRATOR: 'administrator',
    LAB_MANAGER: 'lab_manager',
    PROJECT_MANAGER: 'project_manager',
    PALETTE_MANAGER: 'palette_manager',
    PERFUMER: 'perfumer',
  },
  USER_ROLE_LABELS: {
    administrator: 'Administrator',
    lab_manager: 'Lab Manager',
    project_manager: 'Project Manager',
    palette_manager: 'Palette Manager',
    perfumer: 'Perfumer',
  },
  USER_ROLE_HIERARCHY: {
    administrator: 5,
    lab_manager: 4,
    project_manager: 3,
    palette_manager: 2,
    perfumer: 1,
  },
}))

describe('RBACService', () => {
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
    permissions: [
      { id: 'perfumes:read', name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
      { id: 'formulas:create', name: 'Create Formulas', resource: 'formulas', action: 'create' },
    ],
    lastLogin: new Date(),
    isActive: true,
  }

  const adminUser: User = {
    id: 'admin-123',
    sub: 'admin-123',
    name: 'Admin User',
    email: 'admin@example.com',
    preferredUsername: 'admin',
    givenName: 'Admin',
    familyName: 'User',
    roles: ['administrator'],
    groups: ['management-team'],
    displayName: 'Admin User',
    avatar: undefined,
    department: 'Management',
    permissions: [],
    lastLogin: new Date(),
    isActive: true,
  }

  const labManagerUser: User = {
    id: 'lab-manager-123',
    sub: 'lab-manager-123',
    name: 'Lab Manager',
    email: 'labmanager@example.com',
    preferredUsername: 'labmanager',
    givenName: 'Lab',
    familyName: 'Manager',
    roles: ['lab_manager'],
    groups: ['research-team'],
    displayName: 'Lab Manager',
    avatar: undefined,
    department: 'Research',
    permissions: [],
    lastLogin: new Date(),
    isActive: true,
  }

  describe('Permission Checks', () => {
    describe('hasPermission', () => {
      it('should return true if user has specific permission by ID', () => {
        const result = RBACService.hasPermission(mockUser, 'perfumes:read')
        expect(result).toBe(true)
      })

      it('should return true if user has specific permission by name', () => {
        const result = RBACService.hasPermission(mockUser, 'Read Perfumes')
        expect(result).toBe(true)
      })

      it('should return false if user does not have permission', () => {
        const result = RBACService.hasPermission(mockUser, 'perfumes:delete')
        expect(result).toBe(false)
      })

      it('should return false if user is null', () => {
        const result = RBACService.hasPermission(null, 'perfumes:read')
        expect(result).toBe(false)
      })

      it('should return false if user has no permissions', () => {
        const userWithoutPermissions = { ...mockUser, permissions: [] }
        const result = RBACService.hasPermission(userWithoutPermissions, 'perfumes:read')
        expect(result).toBe(false)
      })

      it('should return false if user permissions is undefined', () => {
        const userWithoutPermissions = { ...mockUser, permissions: undefined }
        const result = RBACService.hasPermission(userWithoutPermissions, 'perfumes:read')
        expect(result).toBe(false)
      })
    })

    describe('hasRole', () => {
      it('should return true if user has specific role', () => {
        const result = RBACService.hasRole(mockUser, 'user')
        expect(result).toBe(true)
      })

      it('should return false if user does not have role', () => {
        const result = RBACService.hasRole(mockUser, 'admin')
        expect(result).toBe(false)
      })

      it('should return false if user is null', () => {
        const result = RBACService.hasRole(null, 'user')
        expect(result).toBe(false)
      })

      it('should return false if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.hasRole(userWithoutRoles, 'user')
        expect(result).toBe(false)
      })

      it('should return false if user roles is undefined', () => {
        const userWithoutRoles = { ...mockUser, roles: undefined }
        const result = RBACService.hasRole(userWithoutRoles, 'user')
        expect(result).toBe(false)
      })
    })

    describe('hasAnyRole', () => {
      it('should return true if user has any of the specified roles', () => {
        const result = RBACService.hasAnyRole(mockUser, ['user', 'admin'])
        expect(result).toBe(true)
      })

      it('should return false if user has none of the specified roles', () => {
        const result = RBACService.hasAnyRole(mockUser, ['admin', 'manager'])
        expect(result).toBe(false)
      })

      it('should return false if user is null', () => {
        const result = RBACService.hasAnyRole(null, ['user', 'admin'])
        expect(result).toBe(false)
      })

      it('should return false if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.hasAnyRole(userWithoutRoles, ['user', 'admin'])
        expect(result).toBe(false)
      })
    })

    describe('hasAllRoles', () => {
      it('should return true if user has all specified roles', () => {
        const userWithMultipleRoles = { ...mockUser, roles: ['user', 'admin'] }
        const result = RBACService.hasAllRoles(userWithMultipleRoles, ['user', 'admin'])
        expect(result).toBe(true)
      })

      it('should return false if user has only some of the specified roles', () => {
        const result = RBACService.hasAllRoles(mockUser, ['user', 'admin'])
        expect(result).toBe(false)
      })

      it('should return false if user is null', () => {
        const result = RBACService.hasAllRoles(null, ['user', 'admin'])
        expect(result).toBe(false)
      })

      it('should return false if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.hasAllRoles(userWithoutRoles, ['user', 'admin'])
        expect(result).toBe(false)
      })
    })

    describe('canAccess', () => {
      it('should return true if user can access resource with specific action', () => {
        const result = RBACService.canAccess(mockUser, 'perfumes', 'read')
        expect(result).toBe(true)
      })

      it('should return true if user has manage permission for resource', () => {
        const userWithManagePermission = {
          ...mockUser,
          permissions: [
            { id: 'perfumes:manage', name: 'Manage Perfumes', resource: 'perfumes', action: 'manage' },
          ],
        }
        const result = RBACService.canAccess(userWithManagePermission, 'perfumes', 'read')
        expect(result).toBe(true)
      })

      it('should return false if user cannot access resource', () => {
        const result = RBACService.canAccess(mockUser, 'users', 'create')
        expect(result).toBe(false)
      })

      it('should return false if user is null', () => {
        const result = RBACService.canAccess(null, 'perfumes', 'read')
        expect(result).toBe(false)
      })

      it('should return false if user has no permissions', () => {
        const userWithoutPermissions = { ...mockUser, permissions: [] }
        const result = RBACService.canAccess(userWithoutPermissions, 'perfumes', 'read')
        expect(result).toBe(false)
      })
    })
  })

  describe('Role Level Management', () => {
    describe('getRoleLevel', () => {
      it('should return highest role level for user with multiple roles', () => {
        const userWithMultipleRoles = { ...adminUser, roles: ['perfumer', 'lab_manager'] }
        const result = RBACService.getRoleLevel(userWithMultipleRoles)
        expect(result).toBe(4) // lab_manager level
      })

      it('should return role level for single role', () => {
        const result = RBACService.getRoleLevel(labManagerUser)
        expect(result).toBe(4) // lab_manager level
      })

      it('should return 0 if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.getRoleLevel(userWithoutRoles)
        expect(result).toBe(0)
      })

      it('should return 0 if user is null', () => {
        const result = RBACService.getRoleLevel(null)
        expect(result).toBe(0)
      })

      it('should return 0 if user roles is undefined', () => {
        const userWithoutRoles = { ...mockUser, roles: undefined }
        const result = RBACService.getRoleLevel(userWithoutRoles)
        expect(result).toBe(0)
      })

      it('should return 0 for unknown role', () => {
        const userWithUnknownRole = { ...mockUser, roles: ['unknown_role'] }
        const result = RBACService.getRoleLevel(userWithUnknownRole)
        expect(result).toBe(0)
      })
    })

    describe('hasRoleLevel', () => {
      it('should return true if user has higher or equal role level', () => {
        const result = RBACService.hasRoleLevel(labManagerUser, 3)
        expect(result).toBe(true) // lab_manager level 4 >= 3
      })

      it('should return true if user has equal role level', () => {
        const result = RBACService.hasRoleLevel(labManagerUser, 4)
        expect(result).toBe(true) // lab_manager level 4 = 4
      })

      it('should return false if user has lower role level', () => {
        const result = RBACService.hasRoleLevel(labManagerUser, 5)
        expect(result).toBe(false) // lab_manager level 4 < 5
      })

      it('should return false if user is null', () => {
        const result = RBACService.hasRoleLevel(null, 1)
        expect(result).toBe(false)
      })
    })
  })

  describe('Permission Management', () => {
    describe('getUserPermissions', () => {
      it('should return permissions for user with single role', () => {
        const result = RBACService.getUserPermissions(labManagerUser)
        expect(result).toBeInstanceOf(Array)
        expect(result.length).toBeGreaterThan(0)
        expect(result.every(p => p.id && p.name && p.resource && p.action)).toBe(true)
      })

      it('should return permissions for user with multiple roles', () => {
        const userWithMultipleRoles = { ...adminUser, roles: ['administrator', 'lab_manager'] }
        const result = RBACService.getUserPermissions(userWithMultipleRoles)
        expect(result).toBeInstanceOf(Array)
        expect(result.length).toBeGreaterThan(0)
      })

      it('should remove duplicate permissions', () => {
        const userWithMultipleRoles = { ...adminUser, roles: ['administrator', 'lab_manager'] }
        const result = RBACService.getUserPermissions(userWithMultipleRoles)
        const permissionIds = result.map(p => p.id)
        const uniqueIds = [...new Set(permissionIds)]
        expect(permissionIds.length).toBe(uniqueIds.length)
      })

      it('should return empty array if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.getUserPermissions(userWithoutRoles)
        expect(result).toEqual([])
      })

      it('should return empty array if user is null', () => {
        const result = RBACService.getUserPermissions(null)
        expect(result).toEqual([])
      })

      it('should return empty array if user roles is undefined', () => {
        const userWithoutRoles = { ...mockUser, roles: undefined }
        const result = RBACService.getUserPermissions(userWithoutRoles)
        expect(result).toEqual([])
      })

      it('should return empty array for unknown role', () => {
        const userWithUnknownRole = { ...mockUser, roles: ['unknown_role'] }
        const result = RBACService.getUserPermissions(userWithUnknownRole)
        expect(result).toEqual([])
      })
    })

    describe('checkPermission', () => {
      it('should return allowed true for valid permission', () => {
        const result = RBACService.checkPermission(mockUser, 'perfumes:read')
        expect(result.allowed).toBe(true)
        expect(result.reason).toBeUndefined()
      })

      it('should return allowed true for valid resource and action', () => {
        const result = RBACService.checkPermission(mockUser, undefined, 'perfumes', 'read')
        expect(result.allowed).toBe(true)
        expect(result.reason).toBeUndefined()
      })

      it('should return allowed false with reason for unauthenticated user', () => {
        const result = RBACService.checkPermission(null, 'perfumes:read')
        expect(result.allowed).toBe(false)
        expect(result.reason).toBe('User not authenticated')
      })

      it('should return allowed false with reason for user without permissions', () => {
        const userWithoutPermissions = { ...mockUser, permissions: [] }
        const result = RBACService.checkPermission(userWithoutPermissions, 'perfumes:read')
        expect(result.allowed).toBe(false)
        expect(result.reason).toBe('No permissions assigned')
      })

      it('should return allowed false with insufficient permissions reason', () => {
        const result = RBACService.checkPermission(mockUser, 'users:delete')
        expect(result.allowed).toBe(false)
        expect(result.reason).toBe('Insufficient permissions')
        expect(result.requiredPermission).toBe('users:delete')
      })

      it('should include required role information', () => {
        const result = RBACService.checkPermission(mockUser, 'users:delete')
        expect(result.allowed).toBe(false)
        expect(result.requiredRole).toBeDefined()
      })
    })

    describe('validatePermissions', () => {
      it('should return valid true if user has all required permissions', () => {
        const userWithPermissions = {
          ...mockUser,
          permissions: [
            { id: 'perfumes:read', name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
            { id: 'formulas:create', name: 'Create Formulas', resource: 'formulas', action: 'create' },
          ],
        }
        const result = RBACService.validatePermissions(userWithPermissions, ['perfumes:read', 'formulas:create'])
        expect(result.valid).toBe(true)
        expect(result.missing).toEqual([])
      })

      it('should return valid false with missing permissions', () => {
        const result = RBACService.validatePermissions(mockUser, ['perfumes:read', 'users:delete'])
        expect(result.valid).toBe(false)
        expect(result.missing).toContain('users:delete')
      })

      it('should return valid false for user without permissions', () => {
        const userWithoutPermissions = { ...mockUser, permissions: [] }
        const result = RBACService.validatePermissions(userWithoutPermissions, ['perfumes:read'])
        expect(result.valid).toBe(false)
        expect(result.missing).toEqual(['perfumes:read'])
      })

      it('should return valid false for null user', () => {
        const result = RBACService.validatePermissions(null, ['perfumes:read'])
        expect(result.valid).toBe(false)
        expect(result.missing).toEqual(['perfumes:read'])
      })
    })
  })

  describe('Role Hierarchy', () => {
    describe('getRoleHierarchy', () => {
      it('should return role hierarchy for user with single role', () => {
        const result = RBACService.getRoleHierarchy(labManagerUser)
        expect(result).toContain('lab_manager')
        expect(result.length).toBeGreaterThan(0)
      })

      it('should return role hierarchy for user with multiple roles', () => {
        const userWithMultipleRoles = { ...adminUser, roles: ['administrator', 'lab_manager'] }
        const result = RBACService.getRoleHierarchy(userWithMultipleRoles)
        expect(result).toContain('administrator')
        expect(result).toContain('lab_manager')
      })

      it('should remove duplicate roles', () => {
        const userWithMultipleRoles = { ...adminUser, roles: ['administrator', 'lab_manager'] }
        const result = RBACService.getRoleHierarchy(userWithMultipleRoles)
        const uniqueRoles = [...new Set(result)]
        expect(result.length).toBe(uniqueRoles.length)
      })

      it('should return empty array if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.getRoleHierarchy(userWithoutRoles)
        expect(result).toEqual([])
      })

      it('should return empty array if user is null', () => {
        const result = RBACService.getRoleHierarchy(null)
        expect(result).toEqual([])
      })
    })
  })

  describe('Action Performance', () => {
    describe('canPerformAction', () => {
      it('should return true if user can perform action on resource', () => {
        const result = RBACService.canPerformAction(mockUser, 'perfumes', 'read')
        expect(result).toBe(true)
      })

      it('should return false if user cannot perform action on resource', () => {
        const result = RBACService.canPerformAction(mockUser, 'users', 'delete')
        expect(result).toBe(false)
      })

      it('should return false if user is null', () => {
        const result = RBACService.canPerformAction(null, 'perfumes', 'read')
        expect(result).toBe(false)
      })
    })

    describe('getEffectivePermissions', () => {
      it('should return effective permissions for user', () => {
        const result = RBACService.getEffectivePermissions(labManagerUser)
        expect(result).toBeInstanceOf(Array)
        expect(result.length).toBeGreaterThan(0)
        expect(result.every(p => p.id && p.name && p.resource && p.action)).toBe(true)
      })

      it('should return empty array if user has no roles', () => {
        const userWithoutRoles = { ...mockUser, roles: [] }
        const result = RBACService.getEffectivePermissions(userWithoutRoles)
        expect(result).toEqual([])
      })

      it('should return empty array if user is null', () => {
        const result = RBACService.getEffectivePermissions(null)
        expect(result).toEqual([])
      })

      it('should remove duplicate permissions', () => {
        const result = RBACService.getEffectivePermissions(labManagerUser)
        const permissionIds = result.map(p => p.id)
        const uniqueIds = [...new Set(permissionIds)]
        expect(permissionIds.length).toBe(uniqueIds.length)
      })
    })
  })

  describe('Role Definitions', () => {
    describe('ROLES', () => {
      it('should have all required roles defined', () => {
        expect(ROLES).toHaveProperty(USER_ROLES.ADMINISTRATOR)
        expect(ROLES).toHaveProperty(USER_ROLES.LAB_MANAGER)
        expect(ROLES).toHaveProperty(USER_ROLES.PROJECT_MANAGER)
        expect(ROLES).toHaveProperty(USER_ROLES.PALETTE_MANAGER)
        expect(ROLES).toHaveProperty(USER_ROLES.PERFUMER)
      })

      it('should have correct role levels', () => {
        expect(ROLES[USER_ROLES.ADMINISTRATOR].level).toBe(5)
        expect(ROLES[USER_ROLES.LAB_MANAGER].level).toBe(4)
        expect(ROLES[USER_ROLES.PROJECT_MANAGER].level).toBe(3)
        expect(ROLES[USER_ROLES.PALETTE_MANAGER].level).toBe(2)
        expect(ROLES[USER_ROLES.PERFUMER].level).toBe(1)
      })

      it('should have permissions for each role', () => {
        Object.values(ROLES).forEach(role => {
          expect(role.permissions).toBeInstanceOf(Array)
          expect(role.permissions.length).toBeGreaterThan(0)
          role.permissions.forEach(permission => {
            expect(permission).toHaveProperty('id')
            expect(permission).toHaveProperty('name')
            expect(permission).toHaveProperty('resource')
            expect(permission).toHaveProperty('action')
          })
        })
      })
    })

    describe('PERMISSIONS', () => {
      it('should have all required permission constants', () => {
        expect(PERMISSIONS).toHaveProperty('USERS_CREATE')
        expect(PERMISSIONS).toHaveProperty('USERS_READ')
        expect(PERMISSIONS).toHaveProperty('USERS_UPDATE')
        expect(PERMISSIONS).toHaveProperty('USERS_DELETE')
        expect(PERMISSIONS).toHaveProperty('PERFUMES_CREATE')
        expect(PERMISSIONS).toHaveProperty('PERFUMES_READ')
        expect(PERMISSIONS).toHaveProperty('FORMULAS_CREATE')
        expect(PERMISSIONS).toHaveProperty('FORMULAS_READ')
        expect(PERMISSIONS).toHaveProperty('INGREDIENTS_CREATE')
        expect(PERMISSIONS).toHaveProperty('INGREDIENTS_READ')
        expect(PERMISSIONS).toHaveProperty('SYSTEM_ADMIN')
      })

      it('should have correct permission format', () => {
        Object.values(PERMISSIONS).forEach(permission => {
          expect(typeof permission).toBe('string')
          expect(permission).toMatch(/^[a-z_]+:[a-z_]+$/)
        })
      })
    })

    describe('PERMISSION_CONSTANTS', () => {
      it('should have organized permission constants', () => {
        expect(PERMISSION_CONSTANTS).toHaveProperty('USERS')
        expect(PERMISSION_CONSTANTS).toHaveProperty('PERFUMES')
        expect(PERMISSION_CONSTANTS).toHaveProperty('FORMULAS')
        expect(PERMISSION_CONSTANTS).toHaveProperty('PROJECTS')
        expect(PERMISSION_CONSTANTS).toHaveProperty('CASES')
        expect(PERMISSION_CONSTANTS).toHaveProperty('INGREDIENTS')
        expect(PERMISSION_CONSTANTS).toHaveProperty('REPORTS')
        expect(PERMISSION_CONSTANTS).toHaveProperty('SYSTEM')
        expect(PERMISSION_CONSTANTS).toHaveProperty('NOTIFICATIONS')
      })

      it('should have correct permission constants for each category', () => {
        expect(PERMISSION_CONSTANTS.USERS).toHaveProperty('CREATE')
        expect(PERMISSION_CONSTANTS.USERS).toHaveProperty('READ')
        expect(PERMISSION_CONSTANTS.USERS).toHaveProperty('UPDATE')
        expect(PERMISSION_CONSTANTS.USERS).toHaveProperty('DELETE')
        expect(PERMISSION_CONSTANTS.USERS).toHaveProperty('MANAGE')

        expect(PERMISSION_CONSTANTS.PERFUMES).toHaveProperty('CREATE')
        expect(PERMISSION_CONSTANTS.PERFUMES).toHaveProperty('READ')
        expect(PERMISSION_CONSTANTS.PERFUMES).toHaveProperty('UPDATE')
        expect(PERMISSION_CONSTANTS.PERFUMES).toHaveProperty('DELETE')
        expect(PERMISSION_CONSTANTS.PERFUMES).toHaveProperty('MANAGE')
        expect(PERMISSION_CONSTANTS.PERFUMES).toHaveProperty('APPROVE')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle user with undefined roles gracefully', () => {
      const userWithUndefinedRoles = { ...mockUser, roles: undefined }
      expect(RBACService.hasRole(userWithUndefinedRoles, 'user')).toBe(false)
      expect(RBACService.hasAnyRole(userWithUndefinedRoles, ['user'])).toBe(false)
      expect(RBACService.hasAllRoles(userWithUndefinedRoles, ['user'])).toBe(false)
      expect(RBACService.getRoleLevel(userWithUndefinedRoles)).toBe(0)
      expect(RBACService.getUserPermissions(userWithUndefinedRoles)).toEqual([])
      expect(RBACService.getRoleHierarchy(userWithUndefinedRoles)).toEqual([])
    })

    it('should handle user with undefined permissions gracefully', () => {
      const userWithUndefinedPermissions = { ...mockUser, permissions: undefined }
      expect(RBACService.hasPermission(userWithUndefinedPermissions, 'perfumes:read')).toBe(false)
      expect(RBACService.canAccess(userWithUndefinedPermissions, 'perfumes', 'read')).toBe(false)
    })

    it('should handle empty arrays gracefully', () => {
      const userWithEmptyArrays = { ...mockUser, roles: [], permissions: [] }
      expect(RBACService.hasRole(userWithEmptyArrays, 'user')).toBe(false)
      expect(RBACService.hasPermission(userWithEmptyArrays, 'perfumes:read')).toBe(false)
      expect(RBACService.getUserPermissions(userWithEmptyArrays)).toEqual([])
      expect(RBACService.getRoleHierarchy(userWithEmptyArrays)).toEqual([])
    })

    it('should handle null user gracefully in all methods', () => {
      expect(RBACService.hasPermission(null, 'perfumes:read')).toBe(false)
      expect(RBACService.hasRole(null, 'user')).toBe(false)
      expect(RBACService.hasAnyRole(null, ['user'])).toBe(false)
      expect(RBACService.hasAllRoles(null, ['user'])).toBe(false)
      expect(RBACService.canAccess(null, 'perfumes', 'read')).toBe(false)
      expect(RBACService.getRoleLevel(null)).toBe(0)
      expect(RBACService.hasRoleLevel(null, 1)).toBe(false)
      expect(RBACService.getUserPermissions(null)).toEqual([])
      expect(RBACService.getRoleHierarchy(null)).toEqual([])
      expect(RBACService.canPerformAction(null, 'perfumes', 'read')).toBe(false)
      expect(RBACService.getEffectivePermissions(null)).toEqual([])
      expect(RBACService.validatePermissions(null, ['perfumes:read'])).toEqual({
        valid: false,
        missing: ['perfumes:read'],
      })
    })

    it('should handle unknown roles gracefully', () => {
      const userWithUnknownRole = { ...mockUser, roles: ['unknown_role'] }
      expect(RBACService.getRoleLevel(userWithUnknownRole)).toBe(0)
      expect(RBACService.getUserPermissions(userWithUnknownRole)).toEqual([])
      expect(RBACService.getRoleHierarchy(userWithUnknownRole)).toEqual([])
    })
  })
})
