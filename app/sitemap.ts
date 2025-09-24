import { MetadataRoute } from 'next';

// This function generates the sitemap for your website
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com';

  // Define static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/shop',
    '/bestsellers',
    '/cart',
    '/checkout',
    '/quote',
    '/privacy',
    '/terms',
    '/blog',
    '/products',
    '/category/project-gallery',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Try to fetch dynamic routes from the database
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Import the PrismaClient dynamically to avoid issues during build time
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Fetch all products
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Fetch all blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Map products to sitemap entries
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Map categories to sitemap entries
    const categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Map blog posts to sitemap entries
    const blogRoutes = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    // Combine all dynamic routes
    dynamicRoutes = [...productRoutes, ...categoryRoutes, ...blogRoutes];

    // Close the Prisma client
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    // Continue with static routes if dynamic routes fail
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes];
}
