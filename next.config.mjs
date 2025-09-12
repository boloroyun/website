/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable StrictMode to prevent double API calls during development
  reactStrictMode: false,

  // Note: i18n is not compatible with app directory
  // Remove experimental settings that might be causing issues

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
  },

  // Configure logging - reduced but not silenced completely
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Telemetry is disabled via NEXT_TELEMETRY_DISABLED environment variable
  // or by running: npx next telemetry disable
};

export default nextConfig;
