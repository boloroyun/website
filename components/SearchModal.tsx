'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductSearchResult {
  id: string;
  title: string;
  slug: string;
  images: Array<{ url: string; public_id: string }>;
  sizes: Array<{ price: number }>;
  discount?: number;
  category: { name: string };
}

interface PopularColor {
  name: string;
  color: string;
  count: number;
}

const SearchModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([] as ProductSearchResult[]);
  const [recommendedProducts, setRecommendedProducts] = useState(
    [] as ProductSearchResult[]
  );
  const [trendingSearches, setTrendingSearches] = useState([] as string[]);
  const [popularColors, setPopularColors] = useState([] as PopularColor[]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch recommended products (best sellers) and trending searches on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch recommended products
        const recommendedResponse = await fetch('/api/products/recommended');
        const recommendedResult = await recommendedResponse.json();

        if (recommendedResult.success && recommendedResult.data) {
          setRecommendedProducts(
            recommendedResult.data as ProductSearchResult[]
          );
        }

        // Fetch trending searches
        const trendingResponse = await fetch('/api/products/trending-searches');
        const trendingResult = await trendingResponse.json();

        if (trendingResult.success && trendingResult.data) {
          setTrendingSearches(trendingResult.data as string[]);
        }

        // Fetch popular colors
        const colorsResponse = await fetch('/api/products/popular-colors');
        const colorsResult = await colorsResponse.json();

        if (colorsResult.success && colorsResult.data) {
          setPopularColors(colorsResult.data as PopularColor[]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Set fallback trending searches (brands and keywords only)
        setTrendingSearches([
          'MSI',
          'Granite',
          'Quartz',
          'Marble',
          'Kitchen',
          'Bathroom',
        ]);

        // Set fallback popular colors
        setPopularColors([
          { name: 'White', color: '#FFFFFF', count: 0 },
          { name: 'Black', color: '#000000', count: 0 },
          { name: 'Gray', color: '#808080', count: 0 },
          { name: 'Brown', color: '#8B4513', count: 0 },
          { name: 'Beige', color: '#F5F5DC', count: 0 },
          { name: 'Blue', color: '#0000FF', count: 0 },
        ]);
      }
    };

    fetchInitialData();
  }, []);

  // Search products when debounced search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.trim().length >= 2) {
        setIsLoading(true);
        setHasSearched(true);
        try {
          const response = await fetch(
            `/api/products/search?q=${encodeURIComponent(
              debouncedSearchTerm
            )}&limit=8`
          );
          const result = await response.json();

          if (result.success && result.data) {
            setSearchResults(result.data as ProductSearchResult[]);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else if (debouncedSearchTerm.trim().length === 0) {
        setSearchResults([]);
        setHasSearched(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleTrendingSearchClick = (trend: string) => {
    setSearchTerm(trend);
  };

  const handleColorClick = (colorName: string) => {
    setSearchTerm(colorName);
  };

  const handleProductClick = () => {
    setOpen(false);
  };

  const getProductPrice = (product: ProductSearchResult) => {
    if (product.sizes && product.sizes.length > 0) {
      const firstSize = product.sizes[0];
      const currentPrice = firstSize.price;
      const originalPrice = product.discount
        ? currentPrice / (1 - product.discount / 100)
        : currentPrice;
      return { currentPrice, originalPrice };
    }
    return { currentPrice: 0, originalPrice: 0 };
  };

  const displayProducts = hasSearched ? searchResults : recommendedProducts;
  return (
    <Dialog>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 md:mx-6 lg:mx-auto p-4 sm:p-6 bg-background rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search Products</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
            )}
          </div>

          {/* Trending Searches */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTrendingSearchClick(search)}
                  className="text-xs"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Popular Colors */}
          {popularColors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Search by Color</h3>
              <div className="flex flex-wrap gap-2">
                {popularColors.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => handleColorClick(color.name)}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white"
                    title={`Search for ${color.name} products`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {hasSearched
                ? searchResults.length > 0
                  ? `Search Results (${searchResults.length})`
                  : 'No products found'
                : 'Recommended for you'}
            </h3>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Searching...</span>
              </div>
            )}

            {/* No Results Message */}
            {hasSearched && searchResults.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  No products found for "{searchTerm}"
                </p>
                <p className="text-gray-400 text-sm">
                  Try searching with different keywords
                </p>
              </div>
            )}

            {/* Products Grid */}
            {displayProducts.length > 0 && !isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {displayProducts.map((product) => {
                  const { currentPrice, originalPrice } =
                    getProductPrice(product);
                  const mainImage = product.images?.[0]?.url || '';
                  const hasDiscount = product.discount && product.discount > 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className="space-y-2 group cursor-pointer"
                    >
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        {mainImage ? (
                          <Image
                            src={mainImage}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                        {hasDiscount && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            {Math.round(product.discount!)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">
                          {product.category?.name}
                        </p>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm">
                            ${currentPrice.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through">
                              ${originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchModal;
