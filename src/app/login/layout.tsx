import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Sign In',
    template: '%s | Fragrance Management System',
  },
  description: 'Sign in to your Fragrance Management System account.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
      
      {/* Main Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
