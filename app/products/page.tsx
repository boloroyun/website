import { getAllProductsByType } from '@/actions/product-types.actions';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import ProductsByTypeSection from '@/components/products/ProductsByTypeSection';
import { Suspense } from 'react';
import ProductsPageSkeleton from '@/components/products/ProductsPageSkeleton';

export const metadata = {
  title: 'All Products | LUX Cabinets & Stones',
  description:
    'Browse our complete collection of products including beauty, cabinets, stones, and more - all organized by type and category.',
};

export default async function ProductsPage() {
  console.log('🛍️ Loading all products page organized by type...');

  // Fetch products organized by type sections
  const productTypesResult = await getAllProductsByType();
  const productSections = productTypesResult.success
    ? (productTypesResult.data ?? [])
    : [];

  console.log(
    `📦 Found ${productSections.length} product type sections with total products:`,
    productSections.reduce(
      (total, section) => total + section.products.length,
      0
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Products
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our diverse collection of products including premium
              cabinets & furniture, exquisite stones & materials, and more.
            </p>
            <div className="mt-6 flex justify-center items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {productSections.length} Product Types
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {productSections.reduce(
                  (total, section) => total + section.categories.length,
                  0
                )}{' '}
                Categories
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                {productSections.reduce(
                  (total, section) => total + section.products.length,
                  0
                )}{' '}
                Products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productSections.length > 0 ? (
          <Suspense fallback={<ProductsPageSkeleton />}>
            <ProductsByTypeSection sections={productSections} />
          </Suspense>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600 mb-6">
              We're currently updating our inventory. Please check back soon!
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Return to Homepage
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
