export default function Loading() {
  return (
    <div className="max-w-7xl ownContainer pb-6 px-6 pt-2">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-[20px]">
        {/* Product Image Skeleton */}
        <div className="w-full lg:w-1/2">
          <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        {/* Product Information Skeleton */}
        <div className="w-full lg:w-1/2 space-y-4">
          {/* Title */}
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>

          {/* Category */}
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
          </div>

          {/* Price */}
          <div className="py-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mt-2"></div>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-10 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-0 w-32">
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-l"></div>
              <div className="w-12 h-10 bg-gray-200 animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-r"></div>
            </div>
            <div className="w-full h-14 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 px-1 py-8 rounded">
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion Skeleton */}
      <div className="space-y-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
        ))}
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-64 mx-auto"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-full h-64 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
