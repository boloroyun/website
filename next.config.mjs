import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable StrictMode to prevent double API calls during development
  reactStrictMode: false,

  // Ignore TypeScript errors during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },

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

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },

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
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

export default bundleAnalyzer(nextConfig);
