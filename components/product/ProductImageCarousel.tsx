'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import FullscreenImageModal from './FullscreenImageModal';

interface ProductImage {
  url: string;
  public_id: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productTitle: string;
  isGalleryProduct?: boolean; // New prop to identify gallery products
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
        className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
          isActive
            ? 'border-blue-600 shadow-lg scale-110 ring-2 ring-blue-200'
            : 'border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105'
        }`}
        aria-label={`View image ${index + 1}`}
        aria-pressed={isActive}
      >
        <div
          className="relative w-full h-full bg-gradient-to-br from-white to-gray-50"
          style={{ boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.8)' }}
        >
          <Image
            src={image.url}
            alt={`${productTitle} - ${index === 0 ? 'Main view' : `Alternative view ${index}`} - Premium quality cabinet and stone products by Lux Cabinets & Stones`}
            fill
            className="object-contain p-2 transition-opacity duration-300 hover:opacity-80"
            sizes="(max-width: 768px) 80px, 96px"
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
          <div className="absolute inset-0 border-3 border-blue-600 rounded-xl pointer-events-none bg-blue-600/10"></div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </button>
    );
  }
);

const ProductImageCarousel = ({
  images,
  productTitle,
  isGalleryProduct = false,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(
    {} as { [key: number]: boolean }
  );
  const [imageErrors, setImageErrors] = useState(
    {} as { [key: number]: boolean }
  );
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

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
    <div className="w-full space-y-6">
      {/* Main Image Display - Enhanced UI */}
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg border-2 overflow-hidden relative group ${
          isGalleryProduct
            ? 'shadow-2xl border-gray-200 hover:shadow-3xl'
            : 'border-gray-100 hover:shadow-xl'
        } transition-all duration-500`}
      >
        {/* Loading indicator - Enhanced */}
        {false && !isCurrentImageLoaded && !hasCurrentImageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white bg-opacity-90 z-10 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 font-medium">
                Loading image...
              </p>
            </div>
          </div>
        )}

        {/* Current Image - Enhanced responsive sizing */}
        <div
          className={`${
            isGalleryProduct ? 'p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10' : 'p-2 sm:p-4'
          } relative`}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-200 opacity-50 transition-opacity group-hover:opacity-70"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-200 opacity-50 transition-opacity group-hover:opacity-70"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-200 opacity-50 transition-opacity group-hover:opacity-70"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-200 opacity-50 transition-opacity group-hover:opacity-70"></div>

          <div
            className={`relative w-full ${
              isGalleryProduct
                ? 'aspect-[16/9] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[2/1] xl:aspect-[21/9]'
                : 'aspect-square'
            } bg-gradient-to-br from-white via-gray-25 to-white rounded-xl overflow-hidden`}
            style={{
              boxShadow: isGalleryProduct
                ? 'inset 0 0 60px rgba(59, 130, 246, 0.05), inset 0 0 30px rgba(255, 255, 255, 0.8)'
                : 'inset 0 0 40px rgba(255, 255, 255, 0.6)',
            }}
          >
            {hasCurrentImageError ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Could not load image
              </div>
            ) : (
              <div
                key={`image-container-${safeCurrentIndex}`}
                className="w-full h-full cursor-pointer"
                onClick={() => setIsFullscreenOpen(true)}
              >
                <Image
                  key={`main-image-${safeCurrentIndex}`}
                  src={currentImageData?.url || ''}
                  alt={`${productTitle} - ${safeCurrentIndex === 0 ? 'Main product image' : `Detailed view ${safeCurrentIndex + 1}`} - High quality kitchen and bathroom solutions by Lux Cabinets & Stones`}
                  fill
                  sizes={
                    isGalleryProduct
                      ? '(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 85vw, (max-width: 1280px) 75vw, 1200px'
                      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
                  }
                  className={`object-cover rounded-lg transition-all duration-300 opacity-100 hover:opacity-95 hover:scale-[1.02] ${
                    isGalleryProduct ? 'object-cover' : 'object-contain'
                  }`}
                  priority={safeCurrentIndex === 0} // Only prioritize the first image
                  quality={isGalleryProduct ? 95 : 80} // Higher quality for gallery products
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

        {/* Fullscreen expand button - Enhanced */}
        <button
          onClick={() => setIsFullscreenOpen(true)}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg border border-gray-200 z-30 transition-all duration-300 hover:scale-110 group-hover:shadow-xl"
          aria-label="View fullscreen"
        >
          <Expand className="h-5 w-5 text-gray-700 transition-colors hover:text-blue-600" />
        </button>

        {/* Navigation Arrows - Enhanced design */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg border border-gray-200 z-30 transition-all duration-300 hover:scale-110 hover:shadow-xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg border border-gray-200 z-30 transition-all duration-300 hover:scale-110 hover:shadow-xl"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
            </button>
          </>
        )}

        {/* Image counter - Enhanced */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full z-20 border border-white/20 shadow-lg">
            <span className="font-medium">{safeCurrentIndex + 1}</span>
            <span className="text-white/60 mx-1">of</span>
            <span className="font-medium">{images.length}</span>
          </div>
        )}
      </div>

      {/* Thumbnails - Enhanced design */}
      {images.length > 1 && (
        <div className="flex justify-center gap-4 overflow-x-auto pb-4 px-2 max-w-full scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
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

      {/* Fullscreen Image Modal */}
      <FullscreenImageModal
        images={images}
        initialIndex={safeCurrentIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        productTitle={productTitle}
      />
    </div>
  );
};

// Add displayName to Thumbnail component
Thumbnail.displayName = 'Thumbnail';

// Export memoized component for better performance
export default memo(ProductImageCarousel);
