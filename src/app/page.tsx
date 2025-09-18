'use client'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LoginForm } from '@/components/auth'
import { useIsAuthenticated } from '@/lib/auth'
import { HeaderUserInfo } from '@/components/layout/header-user-info'
import { 
  FlaskConical,
  BarChart3,
  Users,
  Shield,
  Zap,
  Link,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const isAuthenticated = useIsAuthenticated()

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left Column - Application Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 flex-col justify-center px-12">
          <div className="max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <FlaskConical className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Fragrance</h1>
              <p className="text-lg text-gray-600">Management System</p>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FlaskConical className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Formula Management</h3>
                  <p className="text-sm text-gray-600">Create, edit, and manage complex perfume formulas with precision and accuracy.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Analytics & Reporting</h3>
                  <p className="text-sm text-gray-600">Track performance metrics and generate comprehensive reports for your fragrances.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Team Collaboration</h3>
                  <p className="text-sm text-gray-600">Collaborate seamlessly with your team members on fragrance development projects.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-xs text-gray-600">Active Formulas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-xs text-gray-600">Enterprise Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500">
              <p>&copy; 2024 Fragrance Management System</p>
              <p className="mt-1">Enterprise-grade perfume formula management</p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Fragrance</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>

            {/* Login Form */}
            <div className="mb-6">
              <LoginForm redirectTo="/dashboard" />
            </div>

            {/* Demo Accounts */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Quick demo access</p>
              <div className="flex justify-center space-x-2">
                <button 
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-xs font-medium text-blue-700"
                  onClick={() => {
                    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
                    if (emailInput && passwordInput) {
                      emailInput.value = 'demo@fragrance.com'
                      passwordInput.value = 'DemoPassword123!'
                      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
                      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
                    }
                  }}
                >
                  Demo
                </button>
                
                <button 
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-xs font-medium text-green-700"
                  onClick={() => {
                    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
                    if (emailInput && passwordInput) {
                      emailInput.value = 'user@fragrance.com'
                      passwordInput.value = 'UserPassword123!'
                      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
                      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
                    }
                  }}
                >
                  User
                </button>
                
                <button 
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-xs font-medium text-purple-700"
                  onClick={() => {
                    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
                    if (emailInput && passwordInput) {
                      emailInput.value = 'admin@fragrance.com'
                      passwordInput.value = 'AdminPassword123!'
                      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
                      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
                    }
                  }}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden text-center mt-8">
              <p className="text-xs text-gray-400">&copy; 2024 Fragrance Management System</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show landing page if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Fragrance</span>
            </div>
            <HeaderUserInfo />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Craft the Perfect
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Fragrance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Enterprise-grade perfume formula management system for comprehensive fragrance development, 
              tracking, and collaboration across your entire organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Perfume Development
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and collaborate on fragrance projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FlaskConical,
                title: 'Formula Management',
                description: 'Create, edit, and manage complex perfume formulas with precision and accuracy.',
                color: 'blue'
              },
              {
                icon: BarChart3,
                title: 'Analytics & Reporting',
                description: 'Track performance metrics and generate comprehensive reports for your fragrances.',
                color: 'green'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Collaborate seamlessly with your team members on fragrance development projects.',
                color: 'purple'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-level security with role-based access control and data encryption.',
                color: 'red'
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                description: 'Stay synchronized with live updates and notifications across all devices.',
                color: 'yellow'
              },
              {
                icon: Link,
                title: 'API Integration',
                description: 'Seamless integration with Pega DX and other enterprise systems.',
                color: 'indigo'
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access your dashboard and start managing your fragrance projects
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Quick Access</CardTitle>
                <CardDescription>
                  Jump to your dashboard or explore the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => window.location.href = '/formulas'}
                >
                  View Formulas
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => window.location.href = '/projects'}
                >
                  Manage Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Active Formulas' },
              { number: '50+', label: 'Enterprise Clients' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Access all the tools you need to create, manage, and collaborate on fragrance development projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-gray-50 border-white"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
              onClick={() => window.location.href = '/formulas'}
            >
              Create Formula
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">Fragrance</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade perfume formula management system for comprehensive fragrance development.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fragrance Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
