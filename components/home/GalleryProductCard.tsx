'use client';

import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface DatabaseProduct {
  id: string;
  title: string;
  description: string;
  slug: string;
  brand?: string;
  rating: number;
  numReviews: number;
  sold?: number;
  discount?: number;
  pricingType: string;
  finish?: string;
  location?: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  sizes: Array<{
    size: string;
    qty: number;
    price: number;
    sold: number;
  }>;
  colors: Array<{
    name: string;
    color: string;
    image?: string;
  }>;
  category: {
    name: string;
    slug: string;
  };
  subCategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featured: boolean;
  bestSeller: boolean;
}

const GalleryProjectCard = ({ product }: { product: DatabaseProduct }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const mainImage =
    product.images && product.images.length > 0 ? product.images[0].url : '';
  const isGallery = product.pricingType === 'gallery';

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 bg-white border border-gray-100">
      {/* Image Container - Enhanced with better aspect ratio */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {mainImage ? (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 font-medium">
                    Loading...
                  </p>
                </div>
              </div>
            )}
            <Image
              src={mainImage}
              alt={`${product.title} - Gallery project by Lux Cabinets & Stones`}
              fill
              className={`object-contain transition-all duration-700 group-hover:scale-105 p-4 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />

            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Project badges - Enhanced */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-yellow-400/30">
                  ⭐ FEATURED
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-red-400/30">
                  🔥 POPULAR
                </span>
              )}
            </div>

            {/* Gallery Collection Badge - Enhanced */}
            {isGallery && (
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-purple-400/30">
                  🎨 GALLERY
                </span>
              </div>
            )}

            {/* Hover overlay with project info */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-semibold">
                    {product.rating}
                  </span>
                  <span className="text-xs ml-2 opacity-75">
                    ({product.numReviews} reviews)
                  </span>
                </div>

                {/* Location/Finish info if available */}
                {(product.location || product.finish) && (
                  <div className="text-xs opacity-90 mb-2">
                    {product.location && <span>📍 {product.location}</span>}
                    {product.location && product.finish && (
                      <span className="mx-2">•</span>
                    )}
                    {product.finish && <span>✨ {product.finish}</span>}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="p-6">
        {/* Category */}
        <div className="text-xs text-blue-600 font-medium mb-2 uppercase tracking-wide">
          {product.subCategories && product.subCategories.length > 0
            ? product.subCategories[0].name
            : product.category.name}
        </div>

        {/* Project Title */}
        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {product.title}
        </h3>

        {/* Project Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* View Project Button */}
        <Link href={`/product/${product.slug}`} className="block w-full">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View Project Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

const GalleryProductCard = ({
  heading,
  products = [],
  viewAllLink,
}: {
  heading: string;
  products?: DatabaseProduct[];
  viewAllLink?: string;
}) => {
  return (
    <div className="container mx-auto mb-16">
      {/* Gallery Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {heading}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our stunning collection of completed projects showcasing
          premium craftsmanship and innovative designs.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <GalleryProjectCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🏗️</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No gallery projects available
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back soon for new project showcases!
            </p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {viewAllLink && products.length > 0 && (
        <div className="flex justify-center mt-12">
          <Link href={viewAllLink}>
            <Button
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              VIEW ALL PROJECTS
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GalleryProductCard;
