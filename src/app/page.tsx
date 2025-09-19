'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth'
import { useIsAuthenticated, useAuthLoading } from '@/lib/auth'
import { FlaskConical } from 'lucide-react'

export default function HomePage() {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 flex-col justify-center px-12">
          <div className="max-w-md">
            {/* Logo */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <FlaskConical className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Fragrance</h1>
              <p className="text-xl text-gray-600 mb-8">Management System</p>
              <p className="text-lg text-gray-500 leading-relaxed">
                Professional fragrance development and formula management platform
              </p>
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
            <LoginForm redirectTo="/dashboard" />

            {/* Mobile Footer */}
            <div className="lg:hidden text-center mt-8">
              <p className="text-xs text-gray-400">&copy; 2024 Fragrance Management System</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // This should never be reached due to the redirect above
  return null
}
