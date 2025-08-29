import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Get top brands from best-selling products
    const topBrands = await prisma.product.findMany({
      where: {
        brand: {
          not: null,
        },
        OR: [{ bestSeller: true }, { featured: true }, { sold: { gt: 0 } }],
      },
      select: {
        brand: true,
        sold: true,
        bestSeller: true,
        featured: true,
      },
      orderBy: [{ bestSeller: 'desc' }, { featured: 'desc' }, { sold: 'desc' }],
      take: 30,
    });

    // Extract unique brands and count their popularity
    const brandCount: { [key: string]: number } = {};
    
    topBrands.forEach((product) => {
      if (product.brand) {
        const brand = product.brand.toLowerCase();
        let score = 1;
        if (product.bestSeller) score += 3;
        if (product.featured) score += 2;
        if (product.sold && product.sold > 0) score += Math.min(product.sold / 10, 5);
        
        brandCount[brand] = (brandCount[brand] || 0) + score;
      }
    });

    // Get top categories
    const topCategories = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            products: {
              where: {
                OR: [{ bestSeller: true }, { featured: true }, { sold: { gt: 0 } }],
              },
            },
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Combine trending searches
    const trendingBrands = Object.entries(brandCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));

    const trendingCategories = topCategories
      .filter((cat) => cat._count.products > 0)
      .slice(0, 6)
      .map((cat) => cat.name);

    const trendingSearches = [
      ...trendingBrands,
      ...trendingCategories,
      'Kitchen Cabinets',
      'Bathroom Vanities',
      'Countertops',
      'Custom Design',
    ].slice(0, 12);

    const result = {
      success: true,
      data: trendingSearches,
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
          message: 'Failed to fetch trending searches',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in trending searches API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
