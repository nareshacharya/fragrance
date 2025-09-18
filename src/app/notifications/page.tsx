import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'View and manage your notifications.',
}

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Formula Approved',
      message: 'Your "Spring Breeze" formula has been approved by the quality team.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      title: 'Session Expiring Soon',
      message: 'Your session will expire in 15 minutes. Consider extending it.',
      time: '4 hours ago',
      read: false,
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'info',
      title: 'New Team Member',
      message: 'Alex Rodriguez has joined the Development team.',
      time: '1 day ago',
      read: true,
      icon: Info
    },
    {
      id: 4,
      type: 'success',
      title: 'Project Milestone',
      message: 'Summer Collection project has reached 75% completion.',
      time: '2 days ago',
      read: true,
      icon: CheckCircle
    },
    {
      id: 5,
      type: 'warning',
      title: 'Review Required',
      message: 'You have 3 formulas pending your review.',
      time: '3 days ago',
      read: true,
      icon: AlertCircle
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-orange-600 bg-orange-50'
      case 'info':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout 
      title="Notifications" 
      subtitle={`You have ${unreadCount} unread notifications`}
    >
      <div className="space-y-6">
        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  <p className="text-sm text-gray-500">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.type === 'success').length}</p>
                  <p className="text-sm text-gray-500">Success</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.type === 'warning').length}</p>
                  <p className="text-sm text-gray-500">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              Clear All
            </Button>
          </div>
          <Badge variant="outline">
            {notifications.length} total notifications
          </Badge>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Your latest notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-white border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button variant="ghost" size="sm" className="p-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
