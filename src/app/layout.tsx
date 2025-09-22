import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/providers/theme-provider'
import { AuthProvider } from '@/lib/auth'
import { SkipNav } from '../components/ui/skip-nav'
import { ScreenReaderAnnouncement } from '../components/ui/screen-reader-announcement'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Fragrance Management System',
    template: '%s | Fragrance Management System',
  },
  description: 'Enterprise perfume formula management system for comprehensive fragrance development and tracking.',
  keywords: [
    'perfume',
    'fragrance',
    'formula',
    'management',
    'enterprise',
    'cosmetics',
    'scent',
  ],
  authors: [{ name: 'Fragrance Management Team' }],
  creator: 'Fragrance Management Team',
  publisher: 'Fragrance Management System',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'Fragrance Management System',
    description: 'Enterprise perfume formula management system for comprehensive fragrance development and tracking.',
    siteName: 'Fragrance Management System',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fragrance Management System',
    description: 'Enterprise perfume formula management system for comprehensive fragrance development and tracking.',
    creator: '@fragrance_management',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="fragrance-theme">
          <AuthProvider>
            {/* Skip Navigation */}
            <SkipNav />
            
            {/* Global Screen Reader Announcements */}
            <ScreenReaderAnnouncement message="" />
            
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 dark:from-neutral-950 dark:to-neutral-900">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
                
                {/* Main Content */}
                <main id="main-content" className="relative">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
