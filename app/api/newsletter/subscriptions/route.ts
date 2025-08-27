import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isActive = searchParams.get('active');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    // Get subscriptions with pagination
    const [subscriptions, total] = await Promise.all([
      prisma.newsletterSubscription.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          subscribedAt: true,
          isActive: true,
          source: true,
          unsubscribedAt: true,
        },
      }),
      prisma.newsletterSubscription.count({ where }),
    ]);

    // Get stats
    const stats = await prisma.newsletterSubscription.groupBy({
      by: ['isActive'],
      _count: {
        id: true,
      },
    });

    const activeCount = stats.find((s) => s.isActive)?._count.id || 0;
    const inactiveCount = stats.find((s) => !s.isActive)?._count.id || 0;

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        active: activeCount,
        inactive: inactiveCount,
      },
    });
  } catch (error) {
    console.error('Newsletter subscriptions fetch error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
