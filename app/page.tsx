import BannerCarousel from '@/components/home/BannerCarousel';
import BlogImages from '@/components/home/BlogImages';
import CategorySection from '@/components/home/CategorySection';
import CrazyDeals from '@/components/home/CrazyDeals';
import KeyBenefits from '@/components/home/KeyBenefits';
import ProductCard from '@/components/home/ProductCard';
import ProductCardByCategory from '@/components/home/ProductCardByCategory';
import ReviewSection from '@/components/home/ReviewSection';
import SpecialCombos from '@/components/home/SpecialCombos';
import SocialShare from '@/components/SocialShare';
import React from 'react';
import {
  organizeProductsByCategory,
  limitCategorySections,
  getFeaturedCategorySections,
} from '@/lib/organize-products';
import {
  getWebsiteBanners,
  getAppBanners,
  getSpecialCombos,
  getCrazyDeals,
  getBestSellers,
  getAllSubCategories,
  getNewArrivals,
  getAllCategories,
} from '@/actions';

// Make this page dynamic to avoid build-time issues with Prisma imports
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const HomePage = async () => {
  // Fetch all required data for the homepage
  console.log('🏠 Fetching homepage data...');

  const [
    websiteBanners,
    appBanners,
    specialCombos,
    crazyDeals,
    bestSellers,
    newArrivals,
    categories,
    subCategories,
  ] = await Promise.all([
    getWebsiteBanners(),
    getAppBanners(),
    getSpecialCombos(),
    getCrazyDeals(),
    getBestSellers(24), // Limit to 24 best sellers (4 per category × 6 categories)
    getNewArrivals(24), // Limit to 24 new arrivals (4 per category × 6 categories)
    getAllCategories(), // Fetch categories for luxury categories section
    getAllSubCategories(),
  ]);

  console.log('📊 Homepage data fetched:');
  console.log(
    '- Website banners:',
    websiteBanners.success ? (websiteBanners.data?.length ?? 0) : 0
  );
  console.log(
    '- App banners:',
    appBanners.success ? (appBanners.data?.length ?? 0) : 0
  );
  console.log(
    '- Special combos:',
    specialCombos.success ? (specialCombos.data?.length ?? 0) : 0
  );
  console.log(
    '- Crazy deals:',
    crazyDeals.success ? (crazyDeals.data?.length ?? 0) : 0
  );
  console.log(
    '- Best sellers:',
    bestSellers.success ? (bestSellers.data?.length ?? 0) : 0
  );
  console.log(
    '- New arrivals:',
    newArrivals.success ? (newArrivals.data?.length ?? 0) : 0
  );
  console.log(
    '- Categories:',
    categories.success ? (categories.data?.length ?? 0) : 0
  );
  console.log(
    '- Sub categories:',
    subCategories.success ? (subCategories.data?.length ?? 0) : 0
  );

  // Organize products by categories for best sellers and new arrivals
  const bestSellersData = bestSellers.success ? (bestSellers.data ?? []) : [];
  const newArrivalsData = newArrivals.success ? (newArrivals.data ?? []) : [];

  // Transform null values to undefined for compatibility with Product interface
  const bestSellersFormatted = bestSellersData.map((product) => ({
    ...product,
    brand: product.brand ?? undefined,
    sold: product.sold ?? undefined,
    discount: product.discount ?? undefined,
    colors: product.colors.map((color) => ({
      ...color,
      image: color.image ?? undefined,
    })),
  }));
  const newArrivalsFormatted = newArrivalsData.map((product) => ({
    ...product,
    brand: product.brand ?? undefined,
    sold: product.sold ?? undefined,
    discount: product.discount ?? undefined,
    colors: product.colors.map((color) => ({
      ...color,
      image: color.image ?? undefined,
    })),
  }));

  // Organize by categories with different strategies
  const bestSellersByCategory = organizeProductsByCategory(
    bestSellersFormatted,
    true // prioritize featured products for best sellers
  );
  const newArrivalsByCategory = organizeProductsByCategory(
    newArrivalsFormatted,
    false // normal sorting for new arrivals
  );

  // Get sections - Both Best Sellers and New Arrivals show 4 products from each category
  const bestSellersBalanced = getFeaturedCategorySections(
    bestSellersByCategory,
    4, // 4 featured products per category (or fill with non-featured)
    6 // max 6 categories
  );
  const newArrivalsBalanced = getFeaturedCategorySections(
    newArrivalsByCategory,
    4, // 4 products per category
    6 // max 6 categories
  );

  console.log(
    '🏆 Best sellers organized into',
    bestSellersByCategory.length,
    'categories (prioritizing featured products)'
  );
  console.log(
    '🆕 New arrivals organized into',
    newArrivalsByCategory.length,
    'categories'
  );
  console.log(
    '⭐ Best sellers featured sections:',
    bestSellersBalanced.length,
    'with total products:',
    bestSellersBalanced.reduce(
      (total, section) => total + section.products.length,
      0
    )
  );
  console.log(
    '🆕 New arrivals category sections:',
    newArrivalsBalanced.length,
    'with total products:',
    newArrivalsBalanced.reduce(
      (total, section) => total + section.products.length,
      0
    )
  );

  // Debug cabinet categories specifically
  const cabinetSections = bestSellersBalanced.filter(
    (section) =>
      section.categoryName.toLowerCase().includes('cabinet') ||
      section.categorySlug.toLowerCase().includes('cabinet')
  );
  if (cabinetSections.length > 0) {
    console.log('🗄️ Cabinet sections found:', cabinetSections.length);
    cabinetSections.forEach((section) => {
      const featuredCount = section.products.filter((p) => p.featured).length;
      console.log(
        `   - ${section.categoryName}: ${section.products.length} products, ${featuredCount} featured`
      );
    });
  } else {
    console.log('⚠️ No cabinet sections found in best sellers');
  }

  return (
    <div>
      <BannerCarousel
        websiteBanners={
          websiteBanners.success ? (websiteBanners.data ?? []) : []
        }
        appBanners={appBanners.success ? (appBanners.data ?? []) : []}
      />
      <SpecialCombos
        data={specialCombos.success ? (specialCombos.data ?? []) : []}
      />
      <ProductCardByCategory
        heading="BEST SELLERS"
        sections={bestSellersBalanced}
        maxProductsPerCategory={4}
      />
      <CategorySection
        categories={categories.success ? (categories.data ?? []) : []}
      />
      <CrazyDeals deals={crazyDeals.success ? (crazyDeals.data ?? []) : []} />
      <ProductCardByCategory
        heading="NEW ARRIVALS"
        sections={newArrivalsBalanced}
        maxProductsPerCategory={4}
      />
      <KeyBenefits />
      <BlogImages />

      {/* Floating Social Share Button */}
      <SocialShare
        variant="floating"
        title="LUX Cabinets & Stones - Premium Kitchen Cabinets & Stone Surfaces"
        description="Transform your kitchen with our premium countertops, custom cabinets, and professional installation services. Get a free quote today!"
        hashtags={[
          'LUXCabinets',
          'KitchenDesign',
          'CustomCabinets',
          'Countertops',
        ]}
      />
    </div>
  );
};

export default HomePage;
