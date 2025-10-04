'use client';

import { Star, MapPin, Sparkles, Eye, Heart } from 'lucide-react';
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

const PremiumGalleryProjectCard = ({
  product,
}: {
  product: DatabaseProduct;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mainImage =
    product.images && product.images.length > 0 ? product.images[0].url : '';
  const isGallery = product.pricingType === 'gallery';

  return (
    <div
      className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-4xl transition-all duration-700 transform hover:-translate-y-4 bg-white border border-gray-100/50 hover:border-blue-200/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background:
          'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      }}
    >
      {/* Premium background texture */}
      <div
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Image Container - Premium design with full visibility */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {mainImage ? (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Loading project...
                  </p>
                </div>
              </div>
            )}

            {/* Main image with 100% visibility */}
            <div className="relative w-full h-full p-6">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-25">
                <Image
                  src={mainImage}
                  alt={`${product.title} - Gallery project by Lux Cabinets & Stones`}
                  fill
                  className={`object-contain transition-all duration-700 group-hover:scale-105 p-2 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={95}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                />
              </div>
            </div>

            {/* Sophisticated overlay with subtle gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Premium badges with enhanced design */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              {product.featured && (
                <div className="relative">
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-sm border border-yellow-300/30 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    FEATURED
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-30 -z-10"></div>
                </div>
              )}
              {product.bestSeller && (
                <div className="relative">
                  <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-sm border border-red-400/30 flex items-center gap-2">
                    <Heart className="w-3 h-3 fill-current" />
                    POPULAR
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-lg opacity-30 -z-10"></div>
                </div>
              )}
            </div>

            {/* Gallery Collection Badge - Enhanced */}
            {isGallery && (
              <div className="absolute top-6 right-6">
                <div className="relative">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-2xl shadow-2xl backdrop-blur-sm border border-purple-400/30 flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    GALLERY
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-40 -z-10"></div>
                </div>
              </div>
            )}

            {/* Enhanced hover overlay with project info */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-500 flex items-end ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`p-8 text-white transform transition-transform duration-500 ${
                  isHovered ? 'translate-y-0' : 'translate-y-6'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-2" />
                    <span className="text-sm font-semibold">
                      {product.rating}
                    </span>
                    <span className="text-xs ml-2 opacity-75">
                      ({product.numReviews})
                    </span>
                  </div>
                </div>

                {/* Location/Finish info with icons */}
                {(product.location || product.finish) && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {product.location && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{product.location}</span>
                      </div>
                    )}
                    {product.finish && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>{product.finish}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl m-6">
            <span className="text-gray-500 font-medium">
              No Image Available
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Project Information */}
      <div className="p-8">
        {/* Category with premium styling */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              {product.subCategories && product.subCategories.length > 0
                ? product.subCategories[0].name
                : product.category.name}
            </span>
          </div>

          {/* View count or additional info */}
          <div className="flex items-center text-gray-400">
            <Eye className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">
              {product.numReviews} views
            </span>
          </div>
        </div>

        {/* Project Title with enhanced typography */}
        <h3 className="font-bold text-xl mb-4 text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
          {product.title}
        </h3>

        {/* Project Description with better formatting */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        {/* Enhanced View Project Button */}
        <Link href={`/product/${product.slug}`} className="block w-full">
          <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-blue-500/20 relative overflow-hidden group">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>

            <div className="relative flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="text-base">View Project Details</span>
            </div>
          </Button>
        </Link>
      </div>

      {/* Subtle corner decorations */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-3 border-t-3 border-blue-200/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-r-3 border-t-3 border-blue-200/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-3 border-b-3 border-blue-200/30 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-3 border-b-3 border-blue-200/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
};

const PremiumGalleryProductCard = ({
  heading,
  products = [],
  viewAllLink,
}: {
  heading: string;
  products?: DatabaseProduct[];
  viewAllLink?: string;
}) => {
  return (
    <div className="container mx-auto mb-20">
      {/* Enhanced Gallery Header */}
      <div className="text-center mb-16">
        <div className="relative inline-block">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 mb-6 leading-tight">
            {heading}
          </h2>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
          Explore our stunning collection of completed projects showcasing
          premium craftsmanship, innovative designs, and exceptional attention
          to detail.
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Premium Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.length > 0 ? (
          products.map((product) => (
            <PremiumGalleryProjectCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center h-80 text-center bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Gallery Projects Available
            </h3>
            <p className="text-gray-500 text-base max-w-md">
              We're working on amazing new projects to showcase here. Check back
              soon for inspiring transformations!
            </p>
          </div>
        )}
      </div>

      {/* Enhanced View All Button */}
      {viewAllLink && products.length > 0 && (
        <div className="flex justify-center mt-16">
          <Link href={viewAllLink}>
            <Button className="group px-12 py-5 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-blue-500/20 relative overflow-hidden">
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative flex items-center gap-3">
                <Eye className="w-6 h-6" />
                <span>VIEW ALL PROJECTS</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PremiumGalleryProductCard;
