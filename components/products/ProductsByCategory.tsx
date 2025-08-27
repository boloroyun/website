import React from 'react';
import ProductCard from '@/components/home/ProductCard';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  productCount: number;
  subCategories: Array<{
    id: string;
    name: string;
    slug: string;
    images: Array<{
      url: string;
      public_id: string;
    }>;
  }>;
}

interface CategorySection {
  category: Category;
  products: Product[];
}

interface ProductsByCategoryProps {
  sections: CategorySection[];
}

const ProductsByCategory: React.FC<ProductsByCategoryProps> = ({
  sections,
}) => {
  return (
    <div className="space-y-16">
      {sections.map((section, index) => (
        <div key={section.category.id} className="relative">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Category Image */}
              {section.category.images.length > 0 && (
                <div className="flex-shrink-0">
                  <img
                    src={section.category.images[0].url}
                    alt={section.category.name}
                    className="w-20 h-20 object-cover rounded-full shadow-lg"
                  />
                </div>
              )}

              {/* Category Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {section.category.name}
                </h2>
                <p className="text-gray-600 flex items-center space-x-4">
                  <span>{section.products.length} products</span>
                  {section.category.subCategories.length > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {section.category.subCategories.length} subcategories
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* View All Link */}
            <Link
              href={`/category/${section.category.slug}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              View All
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

          {/* Subcategories Navigation */}
          {section.category.subCategories.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {section.category.subCategories.slice(0, 5).map((subCat) => (
                  <Link
                    key={subCat.id}
                    href={`/category/${section.category.slug}/${subCat.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  >
                    {subCat.name}
                  </Link>
                ))}
                {section.category.subCategories.length > 5 && (
                  <Link
                    href={`/category/${section.category.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                  >
                    +{section.category.subCategories.length - 5} more
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <ProductCard
            heading=""
            products={section.products.slice(0, 8)} // Show first 8 products per category
          />

          {/* Show More Link if there are more products */}
          {section.products.length > 8 && (
            <div className="text-center mt-6">
              <Link
                href={`/category/${section.category.slug}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                View {section.products.length - 8} more{' '}
                {section.category.name.toLowerCase()} products
                <svg
                  className="ml-2 w-5 h-5"
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

          {/* Divider */}
          {index < sections.length - 1 && (
            <div className="mt-16">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-gray-50 text-sm text-gray-500">
                    {sections[index + 1]?.category.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsByCategory;
