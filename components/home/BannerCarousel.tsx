'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import HeroOverlay from './HeroOverlay';

interface BannerImage {
  url: string;
  public_id: string;
}

interface BannerCarouselProps {
  websiteBanners?: BannerImage[];
  appBanners?: BannerImage[];
}

const BannerCarousel = ({
  websiteBanners = [],
  appBanners = [],
}: BannerCarouselProps) => {
  // 🔥 ALL HOOKS AT TOP LEVEL - No exceptions!
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imageError, setImageError] = useState({} as { [key: number]: boolean });

  // Calculate images based on current mobile state
  const desktopImages = websiteBanners.map((banner) => banner.url);
  const mobileImages = appBanners.map((banner) => banner.url);

  const images = isMobile
    ? mobileImages.length > 0
      ? mobileImages
      : desktopImages.length > 0
        ? desktopImages
        : []
    : desktopImages.length > 0
      ? desktopImages
      : mobileImages.length > 0
        ? mobileImages
        : [];

  const totalSlides = images.length;

  // 🎯 useCallback hooks - ALL conditional logic inside callbacks
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleImageError = useCallback((index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 🔄 useEffect for window resize (runs once on mount)
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobileScreen = screenWidth <= 768;
      // Only log when debug mode is enabled
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.DEBUG_LOGS === '1'
      ) {
        console.log(
          '📏 Screen width:',
          screenWidth,
          'isMobile:',
          isMobileScreen
        );
      }
      setIsMobile(isMobileScreen);
    };

    // Set up resize listener
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // ✅ Empty dependency - resize listener only needs to be set up once

  // 🔄 useEffect for auto-slide functionality
  useEffect(() => {
    // ✅ Conditional auto-slide logic INSIDE useEffect
    let interval: NodeJS.Timeout | null = null;
    if (totalSlides > 0) {
      interval = setInterval(nextSlide, 8000);
    }

    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nextSlide, totalSlides]); // ✅ Proper dependencies for auto-slide

  // Debug logging using our safer logger
  // These logs will only show when DEBUG_LOGS=1 in .env.local
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.DEBUG_LOGS === '1'
  ) {
    console.log('🔍 BannerCarousel Debug Info:');
    console.log('📱 isMobile:', isMobile);
    console.log('🖥️ desktopImages count:', desktopImages.length);
    console.log('📱 mobileImages count:', mobileImages.length);
    // Avoid logging large arrays that clutter the console
    // console.log('🖥️ desktopImages:', desktopImages);
    // console.log('📱 mobileImages:', mobileImages);
    console.log('🎯 Selected image count:', images.length);
  }

  // Always show the carousel now since we have static slides
  // The empty state is no longer needed

  return (
    <div
      className={`relative w-full ${
        isMobile ? 'h-[500px]' : 'h-[80vh]'
      } overflow-hidden shadow-lg`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>
      </div>

      {/* Hero Overlay - Always visible regardless of slide */}
      <HeroOverlay
        title="Premium Cabinets & Stone Surfaces"
        subtitle="Explore our collection of high-quality cabinets, countertops, and custom designs for your dream home."
        ctaText="Get Free Estimate"
        ctaLink="/request-a-quote"
        showClosets={true}
      />

      {/* Carousel slides */}
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out ${
            index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          {/* Lighter overlay for better image visibility while maintaining text contrast */}
          <div className="absolute inset-0 bg-black/25 z-[1]"></div>

          {/* Image */}
          {!imageError[index] ? (
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover brightness-110"
              style={{
                filter: 'contrast(1.05) saturate(1.1)',
              }}
              priority={index === 0}
              onError={() => handleImageError(index)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-sm">Image failed to load</p>
              </div>
            </div>
          )}
        </div>
      ))}
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30 hover:text-white rounded-full w-12 h-12 shadow-lg"
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30 hover:text-white rounded-full w-12 h-12 shadow-lg"
      >
        <ChevronRight size={24} />
      </Button>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
