import React from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  brand?: string;
  rating: number;
  numReviews: number;
  sold?: number;
  discount?: number;
  pricingType: string;
  finish?: string;
  location?: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  sizes: Array<{
    size: string;
    qty: number;
    price: number;
    sold: number;
  }>;
  colors: Array<{
    name: string;
    color: string;
    image?: string;
  }>;
  category?: {
    name: string;
    slug: string;
  };
  subCategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featured: boolean;
  bestSeller: boolean;
}

interface CategorySection {
  categoryName: string;
  categorySlug: string;
  products: Product[];
}

interface ProductCardByCategoryProps {
  heading: string;
  sections: CategorySection[];
  maxProductsPerCategory?: number;
}

const ProductCardByCategory= ({
  heading,
  sections,
  maxProductsPerCategory = 4,
}) => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 mb-[40px]">
      {/* Main Section Heading */}
      <div className="heading my-[20px] ownContainer text-center uppercase sm:my-[40px]">
        {heading}
      </div>

      {/* Category Sections */}
      <div className="space-y-12">
        {sections.map((section, index) => (
          <div key={section.categorySlug} className="relative">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {section.categoryName}
                </h3>
                {/* Hide "4 products" but show other product counts */}
                {section.products.length !== 4 && (
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm border">
                    {section.products.length} products
                  </span>
                )}
              </div>

              {/* View All Link */}
              <Link
                href={`/category/${section.categorySlug}`}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 shadow-sm group"
              >
                View All
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Products for this category */}
            <ProductCard
              heading=""
              products={
                section.products
                  .filter((product) => product.category) // Only include products with category
                  .slice(0, maxProductsPerCategory) as any
              }
            />

            {/* Show More Link if there are more products */}
            {section.products.length > maxProductsPerCategory && (
              <div className="text-center mt-4">
                <Link
                  href={`/category/${section.categorySlug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  +{section.products.length - maxProductsPerCategory} more{' '}
                  {section.categoryName.toLowerCase()} products
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}

            {/* Divider between categories */}
            {index < sections.length - 1 && (
              <div className="mt-8 mb-4">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-sm text-gray-500">
                      {sections[index + 1]?.categoryName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall View All Link */}
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          View All Products
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProductCardByCategory;
