'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  useUser, 
  useSessionTimeRemaining, 
  useIsSessionExpiringSoon,
  usePermissions,
  useAuth
} from '@/lib/auth'
import { 
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Clock,
  Shield
} from 'lucide-react'

export function HeaderUserInfo() {
  const { user } = useUser()
  const timeRemaining = useSessionTimeRemaining()
  const isExpiringSoon = useIsSessionExpiringSoon()
  const { permissions } = usePermissions()
  const { logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handler functions
  const handleProfileSettings = () => {
    setShowDropdown(false)
    // Navigate to profile settings page
    window.location.href = '/profile'
  }

  const handlePreferences = () => {
    setShowDropdown(false)
    // Navigate to preferences page
    window.location.href = '/preferences'
  }

  const handleSignOut = async () => {
    setShowDropdown(false)
    try {
      await logout()
      // Redirect to home page after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button size="sm" variant="outline">
          Sign In
        </Button>
      </div>
    )
  }

  const userInitials = `${user.givenName?.[0] || ''}${user.familyName?.[0] || ''}`.toUpperCase()
  const primaryRole = user.roles?.[0] || 'user'

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      {/* Notifications - Hidden on mobile */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative p-2 hidden sm:flex hover:bg-gray-50"
        onClick={() => {
          // Navigate to notifications page
          window.location.href = '/notifications'
        }}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </Button>

      {/* Session Timer - Compact on mobile */}
      {timeRemaining !== null && (
        <div className={`flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-lg ${
          isExpiringSoon ? 'bg-orange-50 border border-orange-200' : ''
        }`}>
          <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          <span className={`text-xs md:text-sm font-medium ${
            isExpiringSoon ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {timeRemaining}m
          </span>
        </div>
      )}

      {/* User Info */}
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 md:space-x-3 p-1 md:p-2 hover:bg-gray-50"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {/* Avatar */}
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs md:text-sm font-medium text-white">
              {userInitials}
            </span>
          </div>
          
          {/* User Details - Hidden on small mobile */}
          <div className="hidden sm:block text-left">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 truncate max-w-24 md:max-w-none">
                {user.displayName}
              </span>
              <Badge 
                variant="outline" 
                className="text-xs px-1.5 py-0.5 hidden md:inline-flex"
              >
                {primaryRole}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 truncate max-w-20 md:max-w-none">
                {user.department}
              </span>
              {permissions && permissions.length > 0 && (
                <div className="flex items-center space-x-1 hidden lg:flex">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {permissions.length}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
        </Button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* User Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userInitials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            {timeRemaining !== null && (
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Session expires in:</span>
                  <span className={`text-xs font-medium ${
                    isExpiringSoon ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {timeRemaining} minutes
                  </span>
                </div>
                {isExpiringSoon && (
                  <p className="text-xs text-orange-600 mt-1">
                    Session will expire soon
                  </p>
                )}
              </div>
            )}

            {/* Role & Department */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {primaryRole}
                </Badge>
                <span className="text-xs text-gray-500">
                  {user.department}
                </span>
              </div>
              {permissions && permissions.length > 0 && (
                <div className="text-xs text-gray-500">
                  {permissions.length} permissions assigned
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm px-4 py-2 hover:bg-gray-50"
                onClick={handleProfileSettings}
              >
                <User className="w-4 h-4 mr-3" />
                Profile Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm px-4 py-2 hover:bg-gray-50"
                onClick={handlePreferences}
              >
                <Settings className="w-4 h-4 mr-3" />
                Preferences
              </Button>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
