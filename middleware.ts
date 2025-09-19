import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected routes that require authentication
 */
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/perfumes',
  '/formulas',
  '/projects',
  '/cases',
  '/ingredients',
  '/reports',
]

/**
 * Admin-only routes
 */
const adminRoutes = [
  '/admin',
  '/settings',
  '/users',
]

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
]

/**
 * Routes that should redirect to dashboard if user is already authenticated
 */
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Read cookies for token validation
  const access = request.cookies.get('access_token')?.value

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if route is auth-related (login, register, etc.)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // For public routes, allow access
  if (isPublicRoute && !isProtectedRoute) {
    // If user is authenticated and accessing root path, redirect to dashboard
    if (pathname === '/' && access) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // For auth routes, check if user is already authenticated
  if (isAuthRoute) {
    // In a real implementation, you would check the authentication state
    // For now, we'll allow access to auth routes
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    // In a real implementation, you would:
    // 1. Check for authentication token in cookies/headers
    // 2. Validate the token
    // 3. Check user permissions for admin routes
    
    // For now, we'll redirect to login for protected routes
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // For admin routes, check admin permissions
  if (isAdminRoute) {
    // In a real implementation, you would check if user has admin role
    // For now, we'll redirect to unauthorized page
    const unauthorizedUrl = new URL('/unauthorized', request.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
