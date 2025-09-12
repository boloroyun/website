import React from 'react';
import { Star } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import ProductCard from '@/components/home/ProductCard';
import ProductCardByCategory from '@/components/home/ProductCardByCategory';
import ProductReviewComponent from '@/components/product/ProductReviewComponent';
import ProductDetailsAccordian from '@/components/product/ProductDetailsAccordian';
import ProductActions from '@/components/product/ProductActions';
import ProductImageCarousel from '@/components/product/ProductImageCarousel';
import SocialShare from '@/components/SocialShare';
import { getProductBySlug, getRelatedProductsByCategory } from '@/actions';
import { getProductFeatures } from '@/lib/product-features';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent build-time server action execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Server-side product page that fetches data based on slug
const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = params;

  // Fetch product data
  const productResult = await getProductBySlug(slug);

  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;

  // Fetch related products organized by categories
  const relatedProductsResult = await getRelatedProductsByCategory(
    product.id,
    product.categoryId,
    4, // 4 products per category
    6 // max 6 categories
  );

  const relatedProductsByCategory = relatedProductsResult.success
    ? relatedProductsResult.data
    : [];

  // Calculate price range from sizes
  const getPriceInfo = () => {
    if (!product.sizes || product.sizes.length === 0) {
      return { minPrice: 0, maxPrice: 0, hasDiscount: false };
    }

    const prices = product.sizes.map((size) => size.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const hasDiscount = product.discount && product.discount > 0;

    return {
      minPrice,
      maxPrice,
      hasDiscount,
      originalMinPrice: hasDiscount
        ? minPrice / (1 - product.discount! / 100)
        : minPrice,
      originalMaxPrice: hasDiscount
        ? maxPrice / (1 - product.discount! / 100)
        : maxPrice,
    };
  };

  const {
    minPrice,
    maxPrice,
    hasDiscount,
    originalMinPrice,
    originalMaxPrice,
  } = getPriceInfo();

  // Get primary category name and subcategory
  const categoryName = product.category.name;
  const subcategoryName =
    product.subCategories && product.subCategories.length > 0
      ? product.subCategories[0].name
      : null;

  // Get dynamic features based on product category
  const productFeatures = getProductFeatures(categoryName);

  return (
    <div>
      {/* Announcement Marquee */}
      <Marquee className="bg-[#81d8d0] flex justify-between gap-[50px] p-4 sm:hidden">
        <p className="para mx-4">
          ✨ Get a quick quote for your countertop or cabinet project.
        </p>
        <p className="para mx-4">
          ✨ Share your measurements and style preferences—we'll provide fast
          pricing and guide you through materials, designs, and installation
          timelines.
        </p>
        <p className="para mx-4">
          🏠 Click "Get Quote Right Now" to start your project today!
        </p>
      </Marquee>

      {/* Main container */}
      <div className="max-w-7xl ownContainer pb-6 px-6 pt-2">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-[20px]">
          {/* Product Image Carousel */}
          <div className="w-full lg:w-1/2">
            <ProductImageCarousel
              images={product.images || []}
              productTitle={product.title}
            />
          </div>

          {/* Product Information */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* Product Title */}
            <h1 className="text-2xl lg:subHeading">{product.title}</h1>

            {/* Product Subcategory or Category */}
            <p className="text-xs lg:text-sm text-gray-500 uppercase">
              {subcategoryName || categoryName}
            </p>

            {/* Product Details */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {/* Brand */}
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Brand:</span>
                    <span className="text-gray-800">{product.brand}</span>
                  </div>
                )}

                {/* SKU */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">SKU:</span>
                  <span className="text-gray-800 font-mono text-xs">
                    {product.sku}
                  </span>
                </div>

                {/* Finish */}
                {product.finish && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Finish:</span>
                    <span className="text-gray-800">{product.finish}</span>
                  </div>
                )}

                {/* Location */}
                {product.location && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Location:</span>
                    <span className="text-gray-800">{product.location}</span>
                  </div>
                )}

                {/* Discount */}
                {hasDiscount && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Discount:</span>
                    <span className="text-red-600 font-semibold">
                      {Math.round(product.discount!)}% OFF
                    </span>
                  </div>
                )}

                {/* Available Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-600 mr-2">
                        Colors:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.color }}
                              title={color.name}
                            ></div>
                            <span className="text-xs text-gray-700">
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Product Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({product.numReviews} Review
                {product.numReviews !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Pricing Information - Hidden for gallery type */}
            {product.pricingType !== 'gallery' && (
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4">
                <div className="mb-4 lg:mb-0">
                  {product.pricingType === 'quote' ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                        Quote Required
                      </span>
                      <span className="text-sm text-gray-600">
                        Contact us for pricing
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        {minPrice === maxPrice ? (
                          <span className="text-2xl lg:text-3xl font-bold">
                            ${minPrice.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-2xl lg:text-3xl font-bold">
                            ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
                          </span>
                        )}

                        {hasDiscount && (
                          <>
                            {minPrice === maxPrice ? (
                              <span className="text-lg text-gray-500 line-through">
                                ${originalMinPrice?.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-lg text-gray-500 line-through">
                                ${originalMinPrice?.toFixed(2)} - $
                                {originalMaxPrice?.toFixed(2)}
                              </span>
                            )}
                            <span className="text-red-500 font-semibold">
                              -{Math.round(product.discount!)}%
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Inclusive of all taxes
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Product Actions (Size Selection + Add to Cart) */}
            <ProductActions
              sizes={product.sizes || []}
              pricingType={product.pricingType}
              productData={{
                id: product.id,
                title: product.title,
                slug: product.slug,
                images: product.images || [],
              }}
            />

            {/* Product Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {productFeatures.map(({ icon: Icon, text }, index) => (
                <div
                  className="flex flex-col items-center text-center bg-gray-100 px-1 py-8 justify-center"
                  key={index}
                >
                  <div className="rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-2">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <ProductDetailsAccordian
          description={product.description}
          longDescription={product.longDescription}
          benefits={product.benefits}
          ingredients={product.ingredients}
        />

        {/* Product Review Component */}
        <ProductReviewComponent
          reviews={product.reviews || []}
          averageRating={product.rating}
          totalReviews={product.numReviews}
        />

        {/* Related Products Section */}
        <ProductCardByCategory
          heading="YOU MAY ALSO LIKE"
          sections={relatedProductsByCategory || []}
          maxProductsPerCategory={4}
        />

        {/* Social Share Section */}
        <div className="mt-12 text-center">
          <SocialShare
            variant="default"
            title={`${product.title} - LUX Cabinets & Stones`}
            description={product.description}
            image={product.images?.[0]?.url || ''}
            hashtags={[
              'LUXCabinets',
              'KitchenDesign',
              product.category?.name || 'Products',
            ]}
          />
        </div>
      </div>

      {/* Floating Social Share Button */}
      <SocialShare
        variant="floating"
        title={`${product.title} - LUX Cabinets & Stones`}
        description={`Check out this premium ${product.category?.name || 'product'} from LUX Cabinets & Stones. ${product.description}`}
        image={product.images?.[0]?.url || ''}
        hashtags={[
          'LUXCabinets',
          'KitchenDesign',
          product.category?.name || 'Products',
        ]}
      />
    </div>
  );
};

export default ProductPage;
