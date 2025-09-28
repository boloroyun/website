'use client';

import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

interface FilterProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sortBy: string) => void;
  totalProducts: number;
}

export interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  featured: boolean;
  bestSeller: boolean;
  inStock: boolean;
}

const ProductsFilter= ({
  categories,
  onFilterChange,
  onSortChange,
  totalProducts,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    featured: false,
    bestSeller: false,
    inStock: false,
  });

  const [sortBy, setSortBy] = useState('featured');

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handleCategoryChange = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((cat) => cat !== categorySlug)
      : [...filters.categories, categorySlug];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterToggle = (filterKey: keyof FilterState) => {
    if (filterKey === 'categories' || filterKey === 'priceRange') return;

    const newFilters = { ...filters, [filterKey]: !filters[filterKey] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    onSortChange(newSortBy);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      featured: false,
      bestSeller: false,
      inStock: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount =
    filters.categories.length +
    (filters.featured ? 1 : 0) +
    (filters.bestSeller ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Results Count */}
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{totalProducts}</span> products
              found
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                Clear all ({activeFilterCount})
                <X className="ml-1 w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="border-t border-gray-200 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Categories Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.slug)}
                        onChange={() => handleCategoryChange(category.slug)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                        <span className="text-gray-400 ml-1">
                          ({category.productCount})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Type Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Product Type
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={() => handleFilterToggle('featured')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.bestSeller}
                      onChange={() => handleFilterToggle('bestSeller')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Best Seller
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={() => handleFilterToggle('inStock')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => {
                        const newFilters = {
                          ...filters,
                          priceRange: {
                            ...filters.priceRange,
                            min: Number(e.target.value),
                          },
                        };
                        setFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => {
                        const newFilters = {
                          ...filters,
                          priceRange: {
                            ...filters.priceRange,
                            max: Number(e.target.value),
                          },
                        };
                        setFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Quick Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const newFilters = { ...filters, bestSeller: true };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium hover:bg-yellow-200"
                  >
                    Best Sellers
                  </button>
                  <button
                    onClick={() => {
                      const newFilters = { ...filters, featured: true };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200"
                  >
                    Featured
                  </button>
                  <button
                    onClick={() => {
                      const newFilters = {
                        ...filters,
                        priceRange: { min: 0, max: 50 },
                      };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-green-200"
                  >
                    Under $50
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsFilter;
