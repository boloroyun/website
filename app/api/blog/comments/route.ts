import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Get comments for a blog post
export async function GET(request: NextRequest) {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.blogComment.findMany({
      where: {
        postId,
        approved: true,
        parentId: null, // Only top-level comments
      },
      include: {
        replies: {
          where: { approved: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(request: NextRequest) {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const body = await request.json();
    const { postId, name, email, website, content, parentId } = body;

    // Validate required fields
    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate website URL if provided
    if (website) {
      try {
        new URL(website);
      } catch {
        return NextResponse.json(
          { error: 'Invalid website URL' },
          { status: 400 }
        );
      }
    }

    // Check if blog post exists
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: parentId },
        select: { id: true },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create the comment (unapproved by default)
    const newComment = await prisma.blogComment.create({
      data: {
        postId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        website: website?.trim() || null,
        content: content.trim(),
        parentId: parentId || null,
        approved: false, // Comments need to be approved
      },
    });

    // Send email notification to admin (you can implement this)
    // await sendCommentNotification(newComment);

    return NextResponse.json({
      success: true,
      message:
        'Comment submitted successfully. It will be reviewed before being published.',
      data: { id: newComment.id },
    });
  } catch (error) {
    console.error('Error creating blog comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
