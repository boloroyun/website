import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ProductCardCarousel from './ProductCardCarousel';
import QuoteRequestButton from '../QuoteRequestButton';

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
const Card = ({
  product,
  shop,
}: {
  product: DatabaseProduct;
  shop?: boolean;
}) => {
  // Get the first available price from sizes array
  const getProductPrice = () => {
    if (product.sizes && product.sizes.length > 0) {
      const firstSize = product.sizes[0];
      return {
        currentPrice: firstSize.price,
        originalPrice:
          product.discount && product.discount > 0
            ? firstSize.price / (1 - product.discount / 100)
            : firstSize.price,
      };
    }
    return { currentPrice: 0, originalPrice: 0 };
  };

  const { currentPrice, originalPrice } = getProductPrice();
  const hasDiscount = product.discount != null && product.discount > 0;
  const mainImage =
    product.images && product.images.length > 0 ? product.images[0].url : '';

  // Check for sale conditions and pricing type
  const isSale = hasDiscount && product.discount! >= 20; // 20%+ discount counts as sale
  const isQuoteRequired = product.pricingType === 'quote';
  const isGallery = product.pricingType === 'gallery';

  return (
    <div className="w-full flex-shrink-0 flex flex-col h-full">
      {/* Card container with fixed height */}
      <div className="flex flex-col h-full border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full pt-[100%]">
          {/* 1:1 aspect ratio */}
          <div className="absolute inset-0">
            {product.images && product.images.length > 0 ? (
              <ProductCardCarousel
                images={product.images}
                productTitle={product.title}
                productSlug={product.slug}
                badges={{
                  bestSeller: product.bestSeller,
                  featured: product.featured,
                  isSale: isSale,
                  discount: product.discount,
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Content container with fixed height and padding */}
        <div className="flex flex-col flex-grow p-2 sm:p-4">
          {/* Category name - smaller on small screens */}
          <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 line-clamp-1">
            {product.subCategories && product.subCategories.length > 0
              ? product.subCategories[0].name.length > 25
                ? product.subCategories[0].name.substring(0, 25) + '...'
                : product.subCategories[0].name
              : product.category.name.length > 25
                ? product.category.name.substring(0, 25) + '...'
                : product.category.name}
          </div>

          {/* Product title with fixed height */}
          <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 h-8 sm:h-10 line-clamp-2">
            {product.title}
          </h3>

          {/* Ratings - simplified on small screens */}
          <div className="flex items-center mb-1 sm:mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-semibold ml-0.5 sm:ml-1">
              {product.rating}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2">
              ({product.numReviews})
            </span>
          </div>

          {/* Price section with consistent height */}
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4 h-5 sm:h-6">
            {isQuoteRequired ? (
              <span className="font-medium sm:font-semibold text-blue-600 bg-blue-50 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-sm">
                Quote Required
              </span>
            ) : isGallery ? (
              <span className="font-medium sm:font-semibold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-[10px] sm:text-sm">
                Gallery Collection
              </span>
            ) : (
              <>
                <span className="font-medium sm:font-semibold text-[10px] sm:text-sm">
                  ${currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-gray-500 line-through text-[10px] sm:text-sm">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Button - pushed to bottom with mt-auto */}
          {!shop && (
            <div className="mt-auto">
              {isQuoteRequired ? (
                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full"
                >
                  <Button className="w-full transition-colors px-1 py-1 sm:py-2 text-[10px] sm:text-sm h-7 sm:h-auto bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 shadow-md">
                    Get a Quote Now
                  </Button>
                </Link>
              ) : (
                <Link
                  href={
                    isGallery
                      ? '/category/project-gallery'
                      : `/product/${product.slug}`
                  }
                  className="block w-full"
                >
                  <Button
                    className={`w-full transition-colors px-1 py-1 sm:py-2 text-[10px] sm:text-sm h-7 sm:h-auto ${
                      isGallery
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isGallery ? 'VIEW' : 'VIEW'}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({
  heading,
  shop,
  products = [],
  viewAllLink,
}: {
  heading: string;
  shop?: boolean;
  products?: DatabaseProduct[];
  viewAllLink?: string;
}) => {
  return (
    <div className="container mx-auto mb-[20px]">
      {shop ? null : (
        <div className="flex justify-center">
          <div className="heading ownContainer uppercase sm:my-[40px]">
            {heading}
          </div>
        </div>
      )}
      <div className="relative">
        <div
          className={`${
            shop
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
              : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'
          } mb-8`}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} product={product} shop={shop} />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-48">
              <p className="text-gray-500 text-lg">No products available</p>
            </div>
          )}
        </div>
      </div>
      {!shop && viewAllLink && (
        <div className="flex justify-center mt-8">
          <Link href={viewAllLink} className="w-full sm:w-auto">
            <Button
              variant={'outline'}
              className="w-full sm:w-[347px] border-2 border-black textGap px-[10px] py-[20px]"
            >
              VIEW ALL
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
