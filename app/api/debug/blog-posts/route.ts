import { NextRequest, NextResponse } from 'next/server';

// Debug endpoint to check all blog posts in database
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Lazy import Prisma to avoid build-time instantiation
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      // Get all blog posts regardless of status
      const allBlogPosts = await prisma.blogPost.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get published blog posts (what should show on the website)
      const publishedBlogPosts = await prisma.blogPost.findMany({
        where: {
          published: true,
          status: 'published',
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get counts by status
      const statusCounts = await prisma.blogPost.groupBy({
        by: ['status', 'published'],
        _count: {
          _all: true,
        },
      });

      const debugInfo = {
        totalBlogPosts: allBlogPosts.length,
        publishedBlogPosts: publishedBlogPosts.length,
        statusBreakdown: statusCounts,
        allPosts: allBlogPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post.status,
          published: post.published,
          publishedAt: post.publishedAt,
          featured: post.featured,
          categoryName: post.category.name,
          createdAt: post.createdAt,
        })),
        publishedPostsOnly: publishedBlogPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          categoryName: post.category.name,
          publishedAt: post.publishedAt,
          featured: post.featured,
        })),
      };

      return NextResponse.json({
        success: true,
        data: debugInfo,
        message: 'Blog posts debug info retrieved successfully',
        timestamp: new Date().toISOString(),
      });

    } finally {
      // Always disconnect Prisma client
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Blog posts debug error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve blog posts debug info',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
