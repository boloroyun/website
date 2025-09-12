import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    // Use a known user ID with orders
    const userId = '68a13ec0703ecaee644cefc3';

    console.log(`📊 Direct Orders API: Fetching orders for user ID: ${userId}`);

    // Get the orders directly from the database
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📊 Direct Orders API: Found ${orders.length} orders`);

    // Return the orders
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('❌ Direct Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders directly' },
      { status: 500 }
    );
  } finally {
    // Important: Disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}
