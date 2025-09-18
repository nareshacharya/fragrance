/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance and developer experience
  experimental: {
    // Enable typed routes for better type safety
    typedRoutes: true,
    // Enable server components logging for debugging
    serverComponentsExternalPackages: [],
  },

  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects configuration
  async redirects() {
    return [
      // Add redirects as needed for the application
    ]
  },

  // Rewrites configuration for API routes
  async rewrites() {
    return [
      // Add rewrites as needed for the application
    ]
  },

  // Webpack configuration for custom optimizations
  webpack: (config, { dev, isServer }) => {
    // Custom webpack configuration can be added here
    return config
  },

  // Output configuration
  output: 'standalone',

  // Power optimization
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minification
  swcMinify: true,
}

export default nextConfig
