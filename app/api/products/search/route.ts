import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search keyword is required',
        },
        { status: 400 }
      );
    }

    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    console.log(
      `🔍 Searching products with keyword: "${keyword}" (limit: ${limit})`
    );

    if (!keyword || keyword.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search keyword must be at least 2 characters',
        },
        { status: 400 }
      );
    }

    const searchResults = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword.trim(),
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            brand: {
              contains: keyword.trim(),
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: keyword.trim(),
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            colors: {
              some: {
                name: {
                  contains: keyword.trim(),
                  mode: 'insensitive', // Case-insensitive search
                },
              },
            },
          },
        ],
      },
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { rating: 'desc' },
        { sold: 'desc' },
      ],
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Format the products
    const formattedProducts = searchResults.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      slug: product.slug,
      brand: product.brand || undefined,
      rating: product.rating,
      numReviews: product.numReviews,
      sold: product.sold || undefined,
      discount: product.discount || undefined,
      pricingType: product.pricingType,
      images: product.images
        .map((image: any) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image: any) => image.url),
      sizes: product.sizes,
      colors: product.colors,
      category: product.category,
      featured: product.featured,
      bestSeller: product.bestSeller,
    }));

    console.log(`🔍 Found ${formattedProducts.length} products matching "${keyword}"`);

    const result = {
      success: true,
      data: formattedProducts,
    };

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
      },
      { status: 500 }
    );
  }
}
