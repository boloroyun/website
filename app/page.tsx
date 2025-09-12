import BannerCarousel from '@/components/home/BannerCarousel';
import BlogImages from '@/components/home/BlogImages';
import CategorySection from '@/components/home/CategorySection';
import CrazyDeals from '@/components/home/CrazyDeals';
import GoogleReviews from '@/components/home/GoogleReviews';
import KeyBenefits from '@/components/home/KeyBenefits';
import ProductCard from '@/components/home/ProductCard';
import ProductCardByCategory from '@/components/home/ProductCardByCategory';
import ReviewSection from '@/components/home/ReviewSection';
import SpecialCombos from '@/components/home/SpecialCombos';
import SupplierSection from '@/components/home/SupplierSection';
import SocialShare from '@/components/SocialShare';
import TransparentHeaderWrapper from '@/components/TransparentHeaderWrapper';
import Navbar from '@/components/Navbar';
import TopBarWrapper from '@/components/TopBarWrapper';
import SectionSeparator from '@/components/ui/SectionSeparator';
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

  // Filter cabinet sections for specific layout handling if needed
  const cabinetSections = bestSellersBalanced.filter(
    (section) =>
      section.categoryName.toLowerCase().includes('cabinet') ||
      section.categorySlug.toLowerCase().includes('cabinet')
  );

  return (
    <div className="relative">
      {/* Standard Navigation */}
      <TopBarWrapper />
      <Navbar />

      {/* Hero Section with Banner Carousel */}
      <div className="relative">
        <BannerCarousel
          websiteBanners={
            websiteBanners.success ? (websiteBanners.data ?? []) : []
          }
          appBanners={appBanners.success ? (appBanners.data ?? []) : []}
        />
        
        {/* Wave separator at the bottom of the carousel */}
        <SectionSeparator variant="wave" position="bottom" color="#ffffff" height={50} />
      </div>
      
      {/* Special Combos Section */}
      <div className="relative bg-white">
        <SpecialCombos
          data={specialCombos.success ? (specialCombos.data ?? []) : []}
        />
        <SectionSeparator variant="curve" position="bottom" color="#f9fafb" height={60} />
      </div>
      
      {/* Best Sellers Section */}
      <div className="relative bg-gray-50 pt-8">
        <ProductCardByCategory
          heading="BEST SELLERS"
          sections={bestSellersBalanced}
          maxProductsPerCategory={4}
        />
        <SectionSeparator variant="angle" position="bottom" color="#ffffff" height={60} />
      </div>
      
      {/* Crazy Deals Section */}
      <div className="relative bg-white pt-8">
        <CrazyDeals deals={crazyDeals.success ? (crazyDeals.data ?? []) : []} />
        <SectionSeparator variant="wave" position="bottom" color="#f9fafb" height={50} />
      </div>
      
      {/* Categories Section */}
      <div className="relative bg-gray-50 pt-8">
        <CategorySection
          categories={categories.success ? (categories.data ?? []) : []}
        />
        <SectionSeparator variant="curve" position="bottom" color="#ffffff" height={60} />
      </div>
      
      {/* Key Benefits Section */}
      <div className="relative">
        <KeyBenefits />
        <SectionSeparator variant="zigzag" position="bottom" color="#f9fafb" height={40} />
      </div>
      
      {/* Blog Images Gallery Section */}
      <div className="relative">
        <BlogImages />
        <SectionSeparator variant="wave" position="bottom" color="#ffffff" height={50} />
      </div>
      
      {/* Google Reviews Section */}
      <div className="relative bg-white">
        <GoogleReviews placeId="ChIJgUbEo8pZwokR5oXTcr_zNvE" />
        <SectionSeparator variant="curve" position="bottom" color="#f9fafb" height={60} />
      </div>
      
      {/* Suppliers Section */}
      <div className="relative">
        <SupplierSection />
      </div>

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
