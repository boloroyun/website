import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Get all blog categories
export async function GET() {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true,
                status: 'published',
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      image: category.image,
      postCount: category._count.posts,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

// Create a new blog category
export async function POST(request: NextRequest) {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const body = await request.json();
    const { name, slug, description, color, image } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the category
    const newCategory = await prisma.blogCategory.create({
      data: {
        name,
        slug,
        description,
        color,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog category created successfully',
      data: newCategory,
    });
  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to create blog category' },
      { status: 500 }
    );
  }
}
