import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/auth/signin',
        '/auth/signup',
        '/auth/forgot-password',
        '/auth/reset-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
