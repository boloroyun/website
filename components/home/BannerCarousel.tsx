'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';

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
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

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
      } overflow-hidden mb-[20px]`}
    >
      {/* Carousel slides with text overlays for the first two slides */}
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Very light overlay for the first two slides */}
          {index < 2 && (
            <div
              className="absolute inset-0 bg-black/10 pointer-events-none z-10"
              aria-hidden="true"
            ></div>
          )}

          {/* Image */}
          {!imageError[index] ? (
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
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

          {/* Text overlay for the first slide - Countertops */}
          {index === 0 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center h-full text-center px-4 text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Premium Quartz & Granite Countertops
              </h2>
              <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8">
                Beautiful, durable, and expertly installed in Northern Virginia.
              </p>
              <Link href="/request-a-quote">
                <Button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Get Free Estimate
                </Button>
              </Link>
            </div>
          )}

          {/* Text overlay for the second slide - Cabinets */}
          {index === 1 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center h-full text-center px-4 text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Custom Kitchen Cabinets for Every Home
              </h2>
              <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8">
                Transform your kitchen with modern, classic, and luxury designs.
              </p>
              <Link href="/category/cabinets">
                <Button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  View Cabinets
                </Button>
              </Link>
            </div>
          )}
        </div>
      ))}
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black rounded-none"
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black rounded-none"
      >
        <ChevronRight size={24} />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}${index === 0 ? ' - Countertops' : index === 1 ? ' - Cabinets' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
