/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable StrictMode to prevent double API calls during development
  reactStrictMode: false,

  // Note: i18n is not compatible with app directory
  // Remove experimental settings that might be causing issues

  // Improved static asset handling
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable gzip compression

  // SEO optimizations
  trailingSlash: false, // Avoid duplicate content issues

  // Configure asset optimization
  optimizeFonts: true,
  swcMinify: true,

  // Improve performance
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Improve image optimization
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configure logging - reduced but not silenced completely
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Improve development experience
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 60 * 60 * 1000,
    // Have more pages open at once
    pagesBufferLength: 5,
  },

  // Telemetry is disabled via NEXT_TELEMETRY_DISABLED environment variable
  // or by running: npx next telemetry disable
};

export default nextConfig;
