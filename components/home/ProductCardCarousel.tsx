'use client';

import React, { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ProductImage {
  url: string;
  public_id: string;
}

interface ProductCardCarouselProps {
  images: ProductImage[];
  productTitle: string;
  productSlug: string;
  badges?: {
    bestSeller?: boolean;
    featured?: boolean;
    isSale?: boolean;
    discount?: number;
  };
}

const ProductCardCarousel: React.FC<ProductCardCarouselProps> = ({
  images,
  productTitle,
  productSlug,
  badges = {},
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Navigate to previous image with wraparound
  const goToPrevious = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (images.length <= 1) return;
      setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  // Navigate to next image with wraparound
  const goToNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (images.length <= 1) return;
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  // Safety check for empty images
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  // Safety check to ensure currentImage is within bounds
  const safeCurrentIndex = Math.min(
    Math.max(0, currentImage),
    images.length - 1
  );
  const currentImageData = images[safeCurrentIndex];

  return (
    <div className="relative w-full h-full">
      <Link href={`/product/${productSlug}`} className="block w-full h-full">
        <Image
          src={currentImageData.url}
          alt={`${productTitle} - Image ${safeCurrentIndex + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2"
          loading={safeCurrentIndex === 0 ? 'eager' : 'lazy'}
          quality={75}
        />
      </Link>

      {/* Product badges */}
      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
        {badges.bestSeller && (
          <span className="bg-[#E1B87F] text-white text-xs font-semibold px-2 py-1 rounded">
            BESTSELLER
          </span>
        )}
        {badges.featured && (
          <span className="bg-[#4F46E5] text-white text-xs font-semibold px-2 py-1 rounded">
            FEATURED
          </span>
        )}
        {badges.isSale && (
          <span className="bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      {/* Discount badge */}
      {badges.discount && badges.discount > 0 && (
        <span className="absolute bottom-2 left-2 bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
          {Math.round(badges.discount)}% OFF
        </span>
      )}

      {/* Navigation arrows - only show if there are multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-sm z-10 transition-transform hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-sm z-10 transition-transform hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-gray-800" />
          </button>
        </>
      )}

      {/* Image counter - only show if there are multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-[8px] px-1.5 py-0.5 rounded-full z-10">
          {safeCurrentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

// Export memoized component for better performance
export default memo(ProductCardCarousel);
