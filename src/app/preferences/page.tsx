import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Palette, Bell, Globe, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preferences',
  description: 'Customize your application preferences and settings.',
}

export default function PreferencesPage() {
  return (
    <DashboardLayout 
      title="Preferences" 
      subtitle="Customize your application experience"
    >
      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Theme</h4>
                  <p className="text-sm text-gray-500">Choose your preferred color scheme</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Light</Button>
                  <Button variant="outline" size="sm">Dark</Button>
                  <Button size="sm">Auto</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Language</h4>
                  <p className="text-sm text-gray-500">Select your preferred language</p>
                </div>
                <Badge variant="outline">English</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <Button variant="outline" size="sm">Disabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Project Updates</h4>
                  <p className="text-sm text-gray-500">Get notified about project changes</p>
                </div>
                <Button size="sm">Enabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your privacy and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-gray-500">Control who can see your profile</p>
                </div>
                <Badge variant="outline">Team Only</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Activity Tracking</h4>
                  <p className="text-sm text-gray-500">Allow activity tracking for analytics</p>
                </div>
                <Button size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-gray-500">Export your data</p>
                </div>
                <Button variant="outline" size="sm">Request Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Regional Settings
            </CardTitle>
            <CardDescription>
              Configure regional and localization settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Time Zone</h4>
                  <p className="text-sm text-gray-500">Set your local time zone</p>
                </div>
                <Badge variant="outline">UTC-8 (PST)</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Date Format</h4>
                  <p className="text-sm text-gray-500">Choose your preferred date format</p>
                </div>
                <Badge variant="outline">MM/DD/YYYY</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Currency</h4>
                  <p className="text-sm text-gray-500">Select your preferred currency</p>
                </div>
                <Badge variant="outline">USD ($)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Preferences</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
