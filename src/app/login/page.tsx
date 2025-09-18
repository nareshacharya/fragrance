import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Fragrance Management System account to access your perfume formulas and projects.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Fragrance Management
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <LoginForm redirectTo="/" />
      </div>
    </div>
  )
}
