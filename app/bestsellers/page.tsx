import ProductCardByCategory from '@/components/home/ProductCardByCategory';
import {
  organizeProductsByCategory,
  getFeaturedCategorySections,
} from '@/lib/organize-products';

// Make this page dynamic to avoid build-time issues
export const dynamic = 'force-dynamic';

export default async function BestSellersPage() {
  // Lazy import Prisma inside the page component
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  console.log('🏆 Fetching best seller products (limit: 48)...');

  const bestSellersData = await prisma.product.findMany({
    orderBy: [
      { featured: 'desc' },
      { bestSeller: 'desc' },
      { sold: 'desc' },
      { numReviews: 'desc' },
      { rating: 'desc' },
    ],
    take: 48,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      productSubCategories: {
        include: {
          subCategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  // Transform data for frontend use
  const bestSellers = bestSellersData.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    slug: product.slug,
    brand: product.brand,
    rating: product.rating,
    numReviews: product.numReviews,
    sold: product.sold,
    discount: product.discount,
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
    subCategories:
      product.productSubCategories?.map((psc) => ({
        id: psc.subCategory.id,
        name: psc.subCategory.name,
        slug: psc.subCategory.slug,
      })) || [],
    featured: product.featured,
    bestSeller: product.bestSeller,
  }));

  console.log(`📈 Found ${bestSellers.length} best seller products`);

  // Transform null values to undefined for compatibility with Product interface
  const bestSellersFormatted = bestSellers.map((product) => ({
    ...product,
    brand: product.brand ?? undefined,
    sold: product.sold ?? undefined,
    discount: product.discount ?? undefined,
    colors: product.colors.map((color) => ({
      ...color,
      image: color.image ?? undefined,
    })),
  }));

  // Organize by categories with featured priority
  const bestSellersByCategory = organizeProductsByCategory(
    bestSellersFormatted,
    true // prioritize featured products for best sellers
  );

  // Get sections with more products per category for dedicated page
  const bestSellersBalanced = getFeaturedCategorySections(
    bestSellersByCategory,
    8, // 8 products per category for dedicated page
    6 // max 6 categories
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Best Sellers ⭐</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our most popular products across all categories. These
          top-rated items are loved by customers for their quality and
          performance.
        </p>

        {bestSellersBalanced.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No best sellers available at the moment.
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for popular products!
            </p>
          </div>
        ) : (
          <ProductCardByCategory
            heading=""
            sections={bestSellersBalanced}
            maxProductsPerCategory={8}
          />
        )}
      </div>
    </div>
  );
}
