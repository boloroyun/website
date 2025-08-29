import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    console.log('🏆 Fetching best seller products (limit: 4)...');

    const bestSellers = await prisma.product.findMany({
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { sold: 'desc' },
        { numReviews: 'desc' },
        { rating: 'desc' },
      ],
      take: 4,
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
    const formattedProducts = bestSellers.map((product) => ({
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

    console.log(`🔗 Best sellers formatted: ${formattedProducts.length} products`);

    const result = {
      success: true,
      data: formattedProducts,
    };

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recommended products',
      },
      { status: 500 }
    );
  }
}
