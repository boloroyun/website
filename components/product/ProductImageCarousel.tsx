'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
  url: string;
  public_id: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productTitle: string;
}

// Memoized thumbnail component to prevent unnecessary re-renders
const Thumbnail = memo(
  ({
    image,
    index,
    isActive,
    productTitle,
    onClick,
  }: {
    image: ProductImage;
    index: number;
    isActive: boolean;
    productTitle: string;
    onClick: (index: number) => void;
  }) => {
    return (
      <button
        key={`thumbnail-${index}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(index);
        }}
        className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
          isActive
            ? 'border-blue-600 shadow-md scale-105'
            : 'border-gray-200 hover:border-gray-400'
        }`}
        aria-label={`View image ${index + 1}`}
        aria-pressed={isActive}
      >
        <div
          className="relative w-full h-full bg-white brightness-110"
          style={{ boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.5)' }}
        >
          <Image
            src={image.url}
            alt={`${productTitle} - ${index === 0 ? 'Main view' : `Alternative view ${index}`} - Premium quality cabinet and stone products by Lux Cabinets & Stones`}
            fill
            className="object-contain p-1 opacity-100"
            sizes="(max-width: 768px) 64px, 80px"
            style={{
              backgroundColor: '#ffffff',
            }}
            loading="lazy"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              if (imgElement) {
                const timestamp = new Date().getTime();
                imgElement.src = `${image.url}?t=${timestamp}`;
              }
            }}
          />
        </div>
        {isActive && (
          <div className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none"></div>
        )}
      </button>
    );
  }
);

const ProductImageCarousel= ({
  images,
  productTitle,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(
    {} as { [key: number]: boolean }
  );
  const [imageErrors, setImageErrors] = useState(
    {} as { [key: number]: boolean }
  );

  // Navigate to previous image with wraparound
  const goToPrevious = React.useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Navigate to next image with wraparound
  const goToNext = React.useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Go to a specific image
  const goToImage = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentImage(index);
      }
    },
    [images.length]
  );

  // Initialize states when images change
  useEffect(() => {
    // Reset states when images change
    setCurrentImage(0);

    // Pre-mark all images as loaded to avoid visibility issues
    const initialLoadState: { [key: number]: boolean } = {};
    images.forEach((_, idx) => {
      initialLoadState[idx] = true;
    });

    setLoadedImages(initialLoadState);
    setImageErrors({});
  }, [images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevious, goToNext]);

  // Auto-advance images every 7 seconds if more than one image
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [goToNext, images.length]);

  // Memoize these values to prevent unnecessary recalculations
  const {
    safeCurrentIndex,
    currentImageData,
    isCurrentImageLoaded,
    hasCurrentImageError,
  } = useMemo(() => {
    // Handle empty images case
    if (!images || images.length === 0) {
      return {
        safeCurrentIndex: 0,
        currentImageData: null,
        isCurrentImageLoaded: false,
        hasCurrentImageError: false,
      };
    }

    // Safety check to ensure currentImage is within bounds
    const safeIndex = Math.min(Math.max(0, currentImage), images.length - 1);
    return {
      safeCurrentIndex: safeIndex,
      currentImageData: images[safeIndex],
      isCurrentImageLoaded: loadedImages[safeIndex],
      hasCurrentImageError: imageErrors[safeIndex],
    };
  }, [currentImage, images, loadedImages, imageErrors]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
          <span className="text-gray-500">No Image Available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative"
        style={{
          background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)',
        }}
      >
        {/* Loading indicator - only show briefly */}
        {false && !isCurrentImageLoaded && !hasCurrentImageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Current Image */}
        <div className="p-2 sm:p-4">
          <div
            className="relative w-full aspect-square bg-white brightness-110"
            style={{
              boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.5)',
            }}
          >
            {hasCurrentImageError ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Could not load image
              </div>
            ) : (
              <div
                key={`image-container-${safeCurrentIndex}`}
                className="w-full h-full"
              >
                <Image
                  key={`main-image-${safeCurrentIndex}`}
                  src={currentImageData?.url || ''}
                  alt={`${productTitle} - ${safeCurrentIndex === 0 ? 'Main product image' : `Detailed view ${safeCurrentIndex + 1}`} - High quality kitchen and bathroom solutions by Lux Cabinets & Stones`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-contain rounded-lg transition-opacity duration-300 opacity-100"
                  priority={safeCurrentIndex === 0} // Only prioritize the first image
                  quality={80} // Slightly reduce quality for better performance
                  onLoad={() => {
                    setLoadedImages((prev) => ({
                      ...prev,
                      [safeCurrentIndex]: true,
                    }));
                  }}
                  onError={(e) => {
                    // Try to reload the image or use a fallback
                    const imgElement = e.target as HTMLImageElement;
                    if (imgElement && currentImageData?.url) {
                      // Try to reload once
                      const timestamp = new Date().getTime();
                      imgElement.src = `${currentImageData.url}?t=${timestamp}`;
                    }
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows with enhanced click areas */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow-md z-30 transition-transform hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow-md z-30 transition-transform hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full z-20">
            {safeCurrentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails with active tracking - using memoized component */}
      {images.length > 1 && (
        <div className="flex justify-center gap-3 overflow-x-auto pb-3 mt-4 px-2 max-w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {images.map((image, index) => (
            <Thumbnail
              key={`thumbnail-${index}`}
              image={image}
              index={index}
              isActive={safeCurrentIndex === index}
              productTitle={productTitle}
              onClick={goToImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add displayName to Thumbnail component
Thumbnail.displayName = 'Thumbnail';

// Export memoized component for better performance
export default memo(ProductImageCarousel);
