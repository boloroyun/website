import { getBestSellers } from '@/actions/products.actions';
import ProductCardByCategory from '@/components/home/ProductCardByCategory';
import {
  organizeProductsByCategory,
  getFeaturedCategorySections,
} from '@/lib/organize-products';

export default async function BestSellersPage() {
  const bestSellersResult = await getBestSellers(48); // Get more for the dedicated page (8 products × 6 categories)
  const bestSellers = bestSellersResult.success
    ? bestSellersResult.data || []
    : [];

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
