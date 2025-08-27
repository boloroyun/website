import React from 'react';

const ProductsPageSkeleton = () => {
  return (
    <div className="space-y-16">
      {/* Generate skeleton for 3 category sections */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="relative">
          {/* Category Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Category Image Skeleton */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* Category Info Skeleton */}
              <div>
                <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse" />
              </div>
            </div>

            {/* View All Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse" />
          </div>

          {/* Subcategories Skeleton */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, tagIndex) => (
                <div
                  key={tagIndex}
                  className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, productIndex) => (
              <div
                key={productIndex}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Product Image Skeleton */}
                <div className="h-64 bg-gray-200 animate-pulse" />

                {/* Product Info Skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button Skeleton */}
          <div className="text-center mt-6">
            <div className="h-12 bg-gray-200 rounded-md w-64 mx-auto animate-pulse" />
          </div>

          {/* Divider */}
          {sectionIndex < 2 && (
            <div className="mt-16">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsPageSkeleton;
