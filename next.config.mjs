/** @type {import('next').NextConfig} */
const nextConfig = {
  // USA locale configuration
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
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
  },
};

export default nextConfig;
