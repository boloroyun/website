'use client';

import React, { useState, useMemo } from 'react';
import ProductsFilter, { FilterState } from './ProductsFilter';
import ProductsByCategory from './ProductsByCategory';
import { Suspense } from 'react';
import ProductsPageSkeleton from './ProductsPageSkeleton';

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

interface ProductTypePageClientProps {
  section: ProductTypeSection;
}

const ProductTypePageClient= ({
  section,
}) => {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    featured: false,
    bestSeller: false,
    inStock: false,
  } as FilterState);
  const [sortBy, setSortBy] = useState('featured');

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let products = [...section.products];

    // Category filter
    if (filters.categories.length > 0) {
      products = products.filter((product) =>
        filters.categories.includes(product.category?.slug || '')
      );
    }

    // Price range filter
    products = products.filter((product) => {
      // Skip price filter for products without sizes or with quote pricing
      if (product.sizes.length === 0 || product.pricingType === 'quote') {
        return true;
      }

      const minPrice = Math.min(...product.sizes.map((size) => size.price));
      return (
        minPrice >= filters.priceRange.min && minPrice <= filters.priceRange.max
      );
    });

    // Feature filters
    if (filters.featured) {
      products = products.filter((product) => product.featured);
    }

    if (filters.bestSeller) {
      products = products.filter((product) => product.bestSeller);
    }

    if (filters.inStock) {
      products = products.filter((product) => {
        // For products without sizes or quote pricing, consider them always "in stock"
        if (product.sizes.length === 0 || product.pricingType === 'quote') {
          return true;
        }
        return product.sizes.some((size) => size.qty > 0);
      });
    }

    return products;
  }, [section.products, filters]);

  // Sort products based on sort criteria
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (sortBy) {
      case 'newest':
        return products.sort((a, b) => b.id.localeCompare(a.id));

      case 'price-low':
        return products.sort((a, b) => {
          const aMinPrice = Math.min(...a.sizes.map((size) => size.price));
          const bMinPrice = Math.min(...b.sizes.map((size) => size.price));
          return aMinPrice - bMinPrice;
        });

      case 'price-high':
        return products.sort((a, b) => {
          const aMinPrice = Math.min(...a.sizes.map((size) => size.price));
          const bMinPrice = Math.min(...b.sizes.map((size) => size.price));
          return bMinPrice - aMinPrice;
        });

      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);

      case 'popular':
        return products.sort((a, b) => (b.sold || 0) - (a.sold || 0));

      case 'featured':
      default:
        return products.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredProducts, sortBy]);

  // Group filtered and sorted products by category
  const filteredSections = useMemo(() => {
    const sectionsMap = new Map();

    section.categories.forEach((category) => {
      const categoryProducts = sortedProducts.filter(
        (product) => product.category?.slug === category.slug
      );

      if (categoryProducts.length > 0) {
        sectionsMap.set(category.slug, {
          category,
          products: categoryProducts,
        });
      }
    });

    return Array.from(sectionsMap.values());
  }, [section.categories, sortedProducts]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div>
      {/* Filter Section */}
      <ProductsFilter
        categories={section.categories}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        totalProducts={sortedProducts.length}
      />

      {/* Products Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSections.length > 0 ? (
          <Suspense fallback={<ProductsPageSkeleton />}>
            <ProductsByCategory sections={filteredSections} />
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setFilters({
                  categories: [],
                  priceRange: { min: 0, max: 1000 },
                  featured: false,
                  bestSeller: false,
                  inStock: false,
                });
                setSortBy('featured');
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTypePageClient;
