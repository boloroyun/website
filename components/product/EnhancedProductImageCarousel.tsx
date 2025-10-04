'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, Sparkles } from 'lucide-react';
import FullscreenImageModal from './FullscreenImageModal';

interface ProductImage {
  url: string;
  public_id: string;
}

interface EnhancedProductImageCarouselProps {
  images: ProductImage[];
  productTitle: string;
  isGalleryProduct?: boolean;
}

// Enhanced Thumbnail Component with premium design
const PremiumThumbnail = memo(
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(index);
        }}
        className={`group relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden transition-all duration-500 ${
          isActive
            ? 'ring-4 ring-blue-500/50 shadow-2xl scale-110 bg-gradient-to-br from-blue-50 to-white'
            : 'ring-2 ring-gray-200/50 hover:ring-blue-300/50 shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-br from-white to-gray-50'
        }`}
        aria-label={`View image ${index + 1}`}
        aria-pressed={isActive}
      >
        {/* Premium background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-25 to-white">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Image container */}
        <div className="relative w-full h-full p-3">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={image.url}
              alt={`${productTitle} - Thumbnail ${index + 1}`}
              fill
              className="object-contain transition-all duration-500 group-hover:scale-105"
              sizes="112px"
              loading="lazy"
            />
          </div>
        </div>

        {/* Active indicator with glow effect */}
        {isActive && (
          <>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl"></div>
          </>
        )}

        {/* Hover glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{
            background:
              'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
          }}
        />
      </button>
    );
  }
);

const EnhancedProductImageCarousel = ({
  images,
  productTitle,
  isGalleryProduct = false,
}: EnhancedProductImageCarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(
    {} as { [key: number]: boolean }
  );
  const [imageErrors, setImageErrors] = useState(
    {} as { [key: number]: boolean }
  );
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Navigation functions
  const goToPrevious = React.useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = React.useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

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
    setCurrentImage(0);
    const initialLoadState: { [key: number]: boolean } = {};
    images.forEach((_, idx) => {
      initialLoadState[idx] = true;
    });
    setLoadedImages(initialLoadState);
    setImageErrors({});
  }, [images]);

  // Auto-advance for gallery products
  useEffect(() => {
    if (images.length <= 1 || !isGalleryProduct) return;
    const timer = setInterval(() => {
      goToNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [goToNext, images.length, isGalleryProduct]);

  const safeCurrentIndex = Math.min(
    Math.max(0, currentImage),
    images.length - 1
  );
  const currentImageData = images[safeCurrentIndex];

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-3xl border-2 border-gray-200">
          <span className="text-gray-500 font-medium">No Image Available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Premium Main Image Container */}
      <div
        className={`relative overflow-hidden transition-all duration-700 group ${
          isGalleryProduct
            ? 'rounded-3xl shadow-2xl hover:shadow-4xl border-2 border-gray-200/30 hover:border-blue-300/50'
            : 'rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200/40 hover:border-gray-300/60'
        }`}
        style={{
          background: isGalleryProduct
            ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #ffffff 70%, #f1f5f9 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)',
        }}
      >
        {/* Sophisticated background texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02), transparent 70%)',
          }}
        />

        {/* Premium image container */}
        <div
          className={`relative ${
            isGalleryProduct
              ? 'p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20'
              : 'p-6 sm:p-8 md:p-10'
          }`}
        >
          {/* Sophisticated corner decorations */}
          <div className="absolute top-6 left-6 w-8 h-8 border-l-4 border-t-4 border-blue-300/40 rounded-tl-2xl opacity-50 group-hover:opacity-100 group-hover:border-blue-400/60 transition-all duration-700"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-r-4 border-t-4 border-blue-300/40 rounded-tr-2xl opacity-50 group-hover:opacity-100 group-hover:border-blue-400/60 transition-all duration-700"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l-4 border-b-4 border-blue-300/40 rounded-bl-2xl opacity-50 group-hover:opacity-100 group-hover:border-blue-400/60 transition-all duration-700"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r-4 border-b-4 border-blue-300/40 rounded-br-2xl opacity-50 group-hover:opacity-100 group-hover:border-blue-400/60 transition-all duration-700"></div>

          {/* Inner premium frame */}
          <div className="absolute inset-12 border-2 border-gray-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:border-blue-200/40"></div>

          {/* Main image container */}
          <div
            className={`relative w-full ${
              isGalleryProduct
                ? 'aspect-[16/9] sm:aspect-[16/10] lg:aspect-[16/9] xl:aspect-[16/8]'
                : 'aspect-square'
            } bg-gradient-to-br from-white via-gray-25 to-white rounded-3xl overflow-hidden cursor-pointer`}
            onClick={() => setIsFullscreenOpen(true)}
            style={{
              boxShadow: isGalleryProduct
                ? 'inset 0 0 100px rgba(59, 130, 246, 0.02), inset 0 0 50px rgba(255, 255, 255, 0.95), 0 8px 40px rgba(0, 0, 0, 0.06)'
                : 'inset 0 0 80px rgba(255, 255, 255, 0.9), 0 4px 30px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Image with enhanced hover effects */}
            <div className="relative w-full h-full p-4">
              <Image
                src={currentImageData?.url || ''}
                alt={`${productTitle} - Premium product showcase`}
                fill
                className="object-contain transition-all duration-700 hover:scale-[1.02] hover:opacity-95"
                sizes={
                  isGalleryProduct
                    ? '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px'
                    : '(max-width: 768px) 100vw, 600px'
                }
                quality={isGalleryProduct ? 98 : 85}
                priority={safeCurrentIndex === 0}
                onLoad={() => {
                  setLoadedImages((prev) => ({
                    ...prev,
                    [safeCurrentIndex]: true,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Premium Controls */}
        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreenOpen(true)}
          className="absolute top-6 right-6 w-14 h-14 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 z-30 transition-all duration-500 hover:scale-110 group-hover:shadow-2xl hover:border-blue-300/50"
          aria-label="View fullscreen"
        >
          <Expand className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 z-30 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:border-blue-300/50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-7 w-7 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 z-30 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:border-blue-300/50"
              aria-label="Next image"
            >
              <ChevronRight className="h-7 w-7 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
            </button>
          </>
        )}

        {/* Premium image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-xl text-white px-6 py-3 rounded-2xl z-20 border border-white/10 shadow-2xl">
            <span className="font-semibold text-sm">
              {safeCurrentIndex + 1}
            </span>
            <span className="text-white/60 mx-2 text-sm">of</span>
            <span className="font-semibold text-sm">{images.length}</span>
          </div>
        )}
      </div>

      {/* Premium Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex justify-center gap-6 overflow-x-auto pb-6 px-4 max-w-full scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-gray-100/50 scrollbar-thumb-rounded-full">
          {images.map((image, index) => (
            <PremiumThumbnail
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

      {/* Fullscreen Modal */}
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

// Add display names
PremiumThumbnail.displayName = 'PremiumThumbnail';

export default memo(EnhancedProductImageCarousel);
