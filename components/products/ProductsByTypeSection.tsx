import React from 'react';
import ProductCard from '@/components/home/ProductCard';
import Link from 'next/link';
import { Sparkles, Home, Mountain, Package } from 'lucide-react';

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

interface ProductTypeSection {
  type: 'beauty' | 'cabinets' | 'stones' | 'other';
  title: string;
  description: string;
  categories: Category[];
  products: Product[];
}

interface ProductsByTypeSectionProps {
  sections: ProductTypeSection[];
}

const ProductsByTypeSection: React.FC<ProductsByTypeSectionProps> = ({
  sections,
}) => {
  const getTypeIcon = (type: ProductTypeSection['type']) => {
    switch (type) {
      case 'beauty':
        return <Sparkles className="w-8 h-8" />;
      case 'cabinets':
        return <Home className="w-8 h-8" />;
      case 'stones':
        return <Mountain className="w-8 h-8" />;
      default:
        return <Package className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type: ProductTypeSection['type']) => {
    switch (type) {
      case 'beauty':
        return 'from-pink-500 to-purple-600';
      case 'cabinets':
        return 'from-amber-500 to-orange-600';
      case 'stones':
        return 'from-gray-500 to-slate-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const getTypeBgColor = (type: ProductTypeSection['type']) => {
    switch (type) {
      case 'beauty':
        return 'bg-pink-50';
      case 'cabinets':
        return 'bg-amber-50';
      case 'stones':
        return 'bg-gray-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="space-y-20">
      {sections.map((section, sectionIndex) => (
        <div key={section.type} className="relative">
          {/* Section Header */}
          <div
            className={`${getTypeBgColor(section.type)} rounded-2xl p-8 mb-12`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Type Icon */}
                <div
                  className={`bg-gradient-to-r ${getTypeColor(section.type)} p-4 rounded-full text-white shadow-lg`}
                >
                  {getTypeIcon(section.type)}
                </div>

                {/* Type Info */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    {section.description}
                  </p>
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span
                        className={`w-2 h-2 bg-gradient-to-r ${getTypeColor(section.type)} rounded-full mr-2`}
                      ></span>
                      {section.categories.length} Categories
                    </span>
                    <span className="flex items-center">
                      <span
                        className={`w-2 h-2 bg-gradient-to-r ${getTypeColor(section.type)} rounded-full mr-2`}
                      ></span>
                      {section.products.length} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* View All Types Link */}
              <Link
                href={`/products/${section.type}`}
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${getTypeColor(section.type)} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                Explore All
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
          </div>

          {/* Categories Navigation */}
          {section.categories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Browse by Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {section.categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    {category.images.length > 0 && (
                      <img
                        src={category.images[0].url}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform duration-200"
                      />
                    )}
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.productCount} items
                    </p>
                  </Link>
                ))}
                {section.categories.length > 6 && (
                  <Link
                    href={`/products/${section.type}`}
                    className="group text-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                  >
                    <div>
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-gray-400 transition-colors duration-200">
                        <span className="text-gray-600 font-bold">
                          +{section.categories.length - 6}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        More Categories
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Featured Products */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Featured {section.title}
              </h3>
              <Link
                href={`/products/${section.type}`}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                View all products
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

            {/* Products Grid */}
            <ProductCard
              heading=""
              products={section.products.slice(0, 8)} // Show first 8 products per type
            />
          </div>

          {/* Section Divider */}
          {sectionIndex < sections.length - 1 && (
            <div className="pt-12">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${getTypeColor(sections[sectionIndex + 1]?.type || 'other')} text-white rounded-full text-sm font-medium shadow-lg`}
                  >
                    {sections[sectionIndex + 1]?.title}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsByTypeSection;
