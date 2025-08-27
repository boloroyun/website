import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all blog tags
export async function GET() {
  try {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  published: true,
                  status: 'published',
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      postCount: tag._count.posts,
    }));

    return NextResponse.json({
      success: true,
      data: formattedTags,
    });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog tags' },
      { status: 500 }
    );
  }
}

// Create a new blog tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, color } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTag = await prisma.blogTag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the tag
    const newTag = await prisma.blogTag.create({
      data: {
        name,
        slug,
        color,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog tag created successfully',
      data: newTag,
    });
  } catch (error) {
    console.error('Error creating blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to create blog tag' },
      { status: 500 }
    );
  }
}
