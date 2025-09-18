'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '../ui/modal'
import { 
  useUser, 
  useUserProfile, 
  usePermissions,
  useSessionTimeRemaining,
  useIsSessionExpiringSoon
} from '@/lib/auth'
import type { UserProfileProps, UserProfileUpdate } from '@/lib/auth'

/**
 * User profile component
 */
export function UserProfile({ 
  user: propUser, 
  showEditButton = true, 
  showPermissions = false,
  showSessionInfo = false,
  className = '' 
}: UserProfileProps) {
  const { user: contextUser, updateProfile } = useUser()
  const user = propUser || contextUser
  const userProfile = useUserProfile()
  const permissions = usePermissions()
  const timeRemaining = useSessionTimeRemaining()
  const isExpiringSoon = useIsSessionExpiringSoon()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UserProfileUpdate>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    department: user?.department || '',
  })
  const [isSaving, setIsSaving] = useState(false)

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-neutral-500 dark:text-neutral-400">
            No user information available
          </div>
        </CardContent>
      </Card>
    )
  }

  /**
   * Handle profile update
   */
  const handleUpdateProfile = async () => {
    setIsSaving(true)
    
    try {
      await updateProfile(editData)
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handle edit cancel
   */
  const handleCancelEdit = () => {
    setEditData({
      displayName: user.displayName || '',
      email: user.email || '',
      department: user.department || '',
    })
    setIsEditing(false)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                  {userProfile.initials}
                </span>
              )}
            </div>
            
            <div>
              <CardTitle className="text-lg">{userProfile.displayName}</CardTitle>
              <CardDescription>{userProfile.roleLabel}</CardDescription>
            </div>
          </div>
          
          {showEditButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </Label>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {user.email || 'Not provided'}
            </p>
          </div>
          
          {user.department && (
            <div>
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Department
              </Label>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {user.department}
              </p>
            </div>
          )}
          
          <div>
            <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Status
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant={user.isActive ? 'success' : 'destructive'}
                className="text-xs"
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge 
                variant="outline"
                style={{ backgroundColor: userProfile.roleColor + '20', color: userProfile.roleColor }}
                className="text-xs"
              >
                {userProfile.roleLabel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Session Information */}
        {showSessionInfo && timeRemaining !== null && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Session Status
            </Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Time remaining:</span>
                <span className={`font-medium ${isExpiringSoon ? 'text-warning-600 dark:text-warning-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                  {timeRemaining} minutes
                </span>
              </div>
              {isExpiringSoon && (
                <div className="text-xs text-warning-600 dark:text-warning-400">
                  Session will expire soon
                </div>
              )}
            </div>
          </div>
        )}

        {/* Permissions */}
        {showPermissions && permissions && permissions.length > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Permissions
            </Label>
            <div className="mt-2 flex flex-wrap gap-1">
              {permissions.slice(0, 10).map((permission) => (
                <Badge key={permission.id} variant="outline" className="text-xs">
                  {permission.name}
                </Badge>
              ))}
              {permissions.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{permissions.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Profile Modal */}
      <Modal open={isEditing} onOpenChange={setIsEditing}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Profile</ModalTitle>
            <ModalDescription>
              Update your profile information
            </ModalDescription>
          </ModalHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editData.displayName}
                onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Enter display name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={editData.department}
                onChange={(e) => setEditData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
            </div>
          </div>
          
          <ModalFooter>
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isSaving} loading={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  )
}

/**
 * Compact user profile for headers/sidebars
 */
export function CompactUserProfile(props: Omit<UserProfileProps, 'showEditButton' | 'showPermissions' | 'showSessionInfo'>) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
        <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
          {useUserProfile().initials}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
          {useUserProfile().displayName}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {useUserProfile().roleLabel}
        </p>
      </div>
    </div>
  )
}

/**
 * User profile summary card
 */
export function UserProfileSummary(props: Omit<UserProfileProps, 'showEditButton'>) {
  return (
    <UserProfile 
      {...props} 
      showEditButton={false}
      showPermissions={true}
      showSessionInfo={true}
    />
  )
}

/**
 * User profile with edit capabilities
 */
export function EditableUserProfile(props: Omit<UserProfileProps, 'showEditButton'>) {
  return (
    <UserProfile 
      {...props} 
      showEditButton={true}
      showPermissions={true}
      showSessionInfo={true}
    />
  )
}

export default UserProfile
