import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    console.log('🎨 Fetching popular colors from products...');

    // Get products that have colors and are popular
    const productsWithColors = await prisma.product.findMany({
      where: {
        colors: {
          isEmpty: false, // Only products that have colors
        },
        OR: [{ featured: true }, { bestSeller: true }, { sold: { gt: 0 } }],
      },
      select: {
        colors: true,
      },
      take: 50, // Limit to avoid processing too many products
    });

    // Extract and count colors
    const colorCount: { [key: string]: number } = {};
    
    productsWithColors.forEach((product) => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach((colorObj: any) => {
          if (colorObj && typeof colorObj === 'object' && colorObj.name) {
            const colorName = colorObj.name.toLowerCase();
            colorCount[colorName] = (colorCount[colorName] || 0) + 1;
          }
        });
      }
    });

    // Sort colors by popularity and get top 10
    const popularColors = Object.entries(colorCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
      }));

    console.log(`🎨 Found ${popularColors.length} popular colors`);

    const result = {
      success: true,
      data: popularColors,
    };

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch popular colors',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in popular colors API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
