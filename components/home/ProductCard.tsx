import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

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

  // Check for sale conditions
  const isSale = hasDiscount && product.discount! >= 20; // 20%+ discount counts as sale
  return (
    <div className="w-full flex-shrink-0 mb-2">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-auto object-cover mb-4"
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </Link>
        <div className="absolute top-2 left-2 flex gap-2">
          {product.bestSeller && (
            <span className="bg-[#E1B87F] text-white text-xs font-semibold px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
          {product.featured && (
            <span className="bg-[#4F46E5] text-white text-xs font-semibold px-2 py-1 rounded">
              FEATURED
            </span>
          )}
          {isSale && (
            <span className="bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
        {hasDiscount && (
          <span className="absolute bottom-2 left-2 bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
            {Math.round(product.discount!)}% OFF
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-1 textGap text-[10px]">
        {product.subCategories && product.subCategories.length > 0
          ? product.subCategories[0].name.length > 25
            ? product.subCategories[0].name.substring(0, 25) + '...'
            : product.subCategories[0].name
          : product.category.name.length > 25
            ? product.category.name.substring(0, 25) + '...'
            : product.category.name}
      </div>
      <h3 className="font-semibold text-sm mb-2 textGap">
        {product.title.length > 25
          ? product.title.substring(0, 25) + '...'
          : product.title}
      </h3>
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-semibold ml-1">{product.rating}</span>
        <span className="text-xs text-gray-500 ml-2">
          ({product.numReviews} Reviews)
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        {product.pricingType === 'quote' ? (
          <span className="font-semibold text-blue-600">Quote Required</span>
        ) : product.pricingType === 'gallery' ? (
          <span className="font-semibold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            Gallery Collection
          </span>
        ) : (
          <>
            <span className="font-semibold">${currentPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-gray-500 line-through text-sm">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </>
        )}
      </div>
      {!shop && (
        <Link
          href={
            product.pricingType === 'gallery'
              ? '/category/project-gallery'
              : `/product/${product.slug}`
          }
        >
          <Button
            className={`w-full transition-colors ${
              product.pricingType === 'gallery'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {product.pricingType === 'quote'
              ? 'Get Quote Right Now'
              : product.pricingType === 'gallery'
                ? 'VIEW GALLERY'
                : 'VIEW PRODUCT'}
          </Button>
        </Link>
      )}
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
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4'
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
          <Link href={viewAllLink}>
            <Button
              variant={'outline'}
              className="w-[90%] sm:w-[347px] border-2 border-black textGap px-[10px] py-[20px]"
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
