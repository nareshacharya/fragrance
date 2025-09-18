import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FlaskConical,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Fragrance Management System Dashboard - Overview of your perfume development projects.',
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Active Formulas',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FlaskConical,
      color: 'blue'
    },
    {
      title: 'Projects in Progress',
      value: '8',
      change: '+3',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Team Members',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Pending Reviews',
      value: '5',
      change: '-2',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'orange'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'formula',
      title: 'Spring Breeze Formula Updated',
      description: 'Added jasmine notes to the base formula',
      time: '2 hours ago',
      status: 'completed',
      user: 'Sarah Chen'
    },
    {
      id: 2,
      type: 'project',
      title: 'Summer Collection Project',
      description: 'Project milestone reached - Phase 2 complete',
      time: '4 hours ago',
      status: 'completed',
      user: 'Mike Johnson'
    },
    {
      id: 3,
      type: 'review',
      title: 'Quality Review Required',
      description: 'New formula awaiting quality approval',
      time: '6 hours ago',
      status: 'pending',
      user: 'Emma Wilson'
    },
    {
      id: 4,
      type: 'team',
      title: 'New Team Member Added',
      description: 'Alex Rodriguez joined the Development team',
      time: '1 day ago',
      status: 'completed',
      user: 'HR Team'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Formula',
      description: 'Start a new perfume formula from scratch',
      icon: Plus,
      href: '/formulas/new',
      color: 'blue'
    },
    {
      title: 'Start New Project',
      description: 'Create a new fragrance development project',
      icon: TrendingUp,
      href: '/projects/new',
      color: 'green'
    },
    {
      title: 'Review Pending Items',
      description: 'Check items awaiting your approval',
      icon: CheckCircle,
      href: '/reviews',
      color: 'orange'
    },
    {
      title: 'View Analytics',
      description: 'Analyze project performance and metrics',
      icon: TrendingUp,
      href: '/analytics',
      color: 'purple'
    }
  ]

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening with your fragrance projects."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates from your team and projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {activity.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-400">{activity.time}</span>
                        <span className="text-xs text-gray-400 mx-2">•</span>
                        <span className="text-xs text-gray-400">{activity.user}</span>
                      </div>
                    </div>
                    <Badge variant={activity.status === 'completed' ? 'success' : 'warning'}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 hover:shadow-md transition-shadow"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${action.color}-100 mr-3`}>
                        <Icon className={`w-4 h-4 text-${action.color}-600`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Your current fragrance development projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Spring Collection 2024',
                  progress: 75,
                  status: 'In Progress',
                  team: 'Development Team',
                  deadline: 'Mar 15, 2024'
                },
                {
                  name: 'Luxury Line Expansion',
                  progress: 45,
                  status: 'Planning',
                  team: 'Research Team',
                  deadline: 'Apr 30, 2024'
                },
                {
                  name: 'Seasonal Fragrance Update',
                  progress: 90,
                  status: 'Review',
                  team: 'Quality Team',
                  deadline: 'Feb 28, 2024'
                }
              ].map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                    <Badge variant={project.status === 'Review' ? 'warning' : 'info'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{project.team}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Due: {project.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
