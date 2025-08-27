import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get blog posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      published: true,
      status: 'published',
    };

    if (category) {
      whereClause.category = { slug: category };
    }

    if (tag) {
      whereClause.tags = {
        some: {
          tag: { slug: tag },
        },
      };
    }

    if (featured) {
      whereClause.featured = true;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              color: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// Create a new blog post (for admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      images = [],
      categoryId,
      tagIds = [],
      status = 'draft',
      featured = false,
      published = false,
      publishedAt,
      readTime,
      metaTitle,
      metaDescription,
      metaKeywords,
      authorName,
      authorEmail,
      authorImage,
      authorBio,
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !categoryId || !authorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create the blog post
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage: featuredImage || undefined,
        images: images || [],
        status,
        featured,
        published,
        publishedAt: publishedAt
          ? new Date(publishedAt)
          : published
            ? new Date()
            : null,
        readTime,
        metaTitle,
        metaDescription,
        metaKeywords,
        authorName,
        authorEmail,
        authorImage,
        authorBio,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    // Create tag associations
    if (tagIds.length > 0) {
      await Promise.all(
        tagIds.map((tagId: string) =>
          prisma.blogPostTag.create({
            data: {
              postId: newPost.id,
              tagId,
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
