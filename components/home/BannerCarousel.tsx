'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // Use website banners for desktop, app banners for mobile
  const desktopImages = websiteBanners.map((banner) => banner.url);
  const mobileImages = appBanners.map((banner) => banner.url);

  // Debug logging for mobile detection and image selection
  console.log('🔍 BannerCarousel Debug Info:');
  console.log('📱 isMobile:', isMobile);
  console.log('🖥️ desktopImages count:', desktopImages.length);
  console.log('📱 mobileImages count:', mobileImages.length);
  console.log('🖥️ desktopImages:', desktopImages);
  console.log('📱 mobileImages:', mobileImages);

  // Use real images or don't render if no images are available
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

  console.log('🎯 Selected images for display:', images);
  console.log('📊 Final image count:', images.length);

  // Don't render the carousel if no images are available
  if (images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center mb-[20px]">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No banners available</p>
          <p className="text-sm">Please add banners to display the carousel</p>
        </div>
      </div>
    );
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobileScreen = screenWidth <= 768; // Changed to more standard mobile breakpoint
      console.log('📏 Screen width:', screenWidth, 'isMobile:', isMobileScreen);
      setIsMobile(isMobileScreen);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    const interval = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [nextSlide]);

  return (
    <div
      className={`relative w-full ${
        isMobile ? 'h-[400px]' : 'h-[400px]'
      } overflow-hidden mb-[20px]`}
    >
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {!imageError[index] ? (
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              onError={() =>
                setImageError((prev) => ({ ...prev, [index]: true }))
              }
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
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
