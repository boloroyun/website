import {
  getProductsByType,
  ProductTypeSection,
} from '@/actions/product-types.actions';
import { notFound } from 'next/navigation';
import ProductTypePageClient from '@/components/products/ProductTypePageClient';
import { Suspense } from 'react';
import ProductsPageSkeleton from '@/components/products/ProductsPageSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductTypePageProps {
  params: {
    type: 'cabinets' | 'stones' | 'other';
  };
}

export async function generateStaticParams() {
  return [{ type: 'cabinets' }, { type: 'stones' }, { type: 'other' }];
}

export async function generateMetadata({ params }: ProductTypePageProps) {
  const { type } = params;

  const titles = {
    cabinets: 'Cabinets & Furniture Collection',
    stones: 'Stones & Materials',
    other: 'Other Products',
  };

  const descriptions = {
    cabinets:
      'Discover our premium collection of cabinets, storage solutions, and furniture pieces.',
    stones:
      'Browse our exquisite selection of natural stones, tiles, and construction materials.',
    other: 'Additional products and miscellaneous items.',
  };

  return {
    title: `${titles[type]} | LUX Cabinets & Stones`,
    description: descriptions[type],
  };
}

export default async function ProductTypePage({
  params,
}: ProductTypePageProps) {
  const { type } = params;

  console.log(`🔍 Loading ${type} products page...`);

  const sectionResult = await getProductsByType(type);

  if (!sectionResult.success || !sectionResult.data) {
    notFound();
  }

  const section = sectionResult.data as ProductTypeSection;

  const typeIcons = {
    cabinets: '🏠',
    stones: '🏔️',
    other: '📦',
  };

  const typeColors = {
    cabinets: 'from-amber-500 to-orange-600',
    stones: 'from-gray-500 to-slate-600',
    other: 'from-blue-500 to-indigo-600',
  };

  const typeBgColors = {
    cabinets: 'bg-amber-50',
    stones: 'bg-gray-50',
    other: 'bg-blue-50',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className={`${typeBgColors[type]} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`bg-gradient-to-r ${typeColors[type]} p-6 rounded-full text-white shadow-xl`}
              >
                <span className="text-4xl">{typeIcons[type]}</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {section.description}
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
              <span className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <span
                  className={`w-2 h-2 bg-gradient-to-r ${typeColors[type]} rounded-full mr-2`}
                ></span>
                {section.categories.length} Categories
              </span>
              <span className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <span
                  className={`w-2 h-2 bg-gradient-to-r ${typeColors[type]} rounded-full mr-2`}
                ></span>
                {section.products.length} Products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Content with Filtering */}
      {section.categories.length > 0 ? (
        <Suspense fallback={<ProductsPageSkeleton />}>
          <ProductTypePageClient section={section} />
        </Suspense>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div
              className={`w-24 h-24 ${typeBgColors[type]} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <span className="text-3xl">{typeIcons[type]}</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No {section.title} Available
            </h3>
            <p className="text-gray-600 mb-6">
              We're currently updating our {type} inventory. Please check back
              soon!
            </p>
            <a
              href="/products"
              className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${typeColors[type]} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
            >
              Browse All Products
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
