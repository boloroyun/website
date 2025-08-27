'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';

interface ProductImage {
  url: string;
  public_id: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productTitle: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  productTitle,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-gray-500">No Image Available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Carousel */}
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Image
                  src={image.url}
                  alt={`${productTitle} - Image ${index + 1}`}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover rounded-lg"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                current === index
                  ? 'border-black shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
