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
  LocalBusinessJsonLd,
  WebsiteJsonLd,
  FAQJsonLd,
} from '@/components/SEO/JsonLd';
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
      {/* Structured Data for SEO */}
      <LocalBusinessJsonLd
        name="Lux Cabinets & Stones"
        description="Premium kitchen and bath countertops, cabinets, and stone fabrication in Northern Virginia."
        url={
          process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com'
        }
        telephone="+17039910262"
        address={{
          streetAddress: '14631 Lee Highway, Suite 201',
          addressLocality: 'Centreville',
          addressRegion: 'VA',
          postalCode: '20121',
          addressCountry: 'US',
        }}
        geo={{
          latitude: 38.8462,
          longitude: -77.4089,
        }}
        images={[
          `${process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com'}/images/logo.jpeg`,
          `${process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com'}/images/showroom.jpg`,
        ]}
        rating={{
          ratingValue: 4.8,
          ratingCount: 120,
        }}
        priceRange="$$"
        openingHours={[
          'Monday 09:00-18:00',
          'Tuesday 09:00-18:00',
          'Wednesday 09:00-18:00',
          'Thursday 09:00-18:00',
          'Friday 09:00-18:00',
          'Saturday 10:00-16:00',
          'Sunday 10:00-16:00',
        ]}
        sameAs={[
          'https://www.facebook.com/luxcabinetsandstones',
          'https://www.instagram.com/luxcabinetsandstones',
          'https://www.pinterest.com/luxcabinetsandstones',
        ]}
      />

      <WebsiteJsonLd
        name="Lux Cabinets & Stones"
        url={
          process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com'
        }
        description="Premium kitchen and bath countertops, cabinets, and stone fabrication in Northern Virginia."
        publisher={{
          name: 'Lux Cabinets & Stones',
          logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com'}/images/logo.jpeg`,
        }}
      />

      <FAQJsonLd
        questions={[
          {
            question: 'What types of countertops do you offer?',
            answer:
              'We offer a wide range of premium countertops including granite, quartz, marble, quartzite, and more. Each material has unique properties and aesthetic qualities to suit different kitchen and bathroom designs.',
          },
          {
            question: 'Do you provide installation services?',
            answer:
              'Yes, we provide professional installation services for all our products. Our experienced team ensures proper measurement, fabrication, and installation for a perfect fit and finish.',
          },
          {
            question: 'How can I get a quote for my project?',
            answer:
              'You can request a quote through our website by filling out the quote request form, calling us directly, or visiting our showroom. We offer free estimates and consultations for all projects.',
          },
          {
            question: 'What areas do you serve?',
            answer:
              'We primarily serve Northern Virginia, including Centreville, Fairfax, Arlington, Alexandria, and surrounding areas. Please contact us to confirm service availability in your specific location.',
          },
          {
            question: 'How long does installation typically take?',
            answer:
              'Installation time varies depending on the project scope. Countertop installations typically take 1-2 days, while full kitchen cabinet installations may take 3-5 days. We provide specific timeframes during the quoting process.',
          },
        ]}
      />

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
        <SectionSeparator
          variant="wave"
          position="bottom"
          color="#ffffff"
          height={50}
        />
      </div>

      {/* Special Combos Section */}
      <div className="relative bg-white">
        <SpecialCombos
          data={specialCombos.success ? (specialCombos.data ?? []) : []}
        />
        <SectionSeparator
          variant="curve"
          position="bottom"
          color="#ffffff"
          height={60}
        />
      </div>

      {/* Best Sellers Section */}
      <div className="relative bg-teal-50 pt-8">
        <ProductCardByCategory
          heading="BEST SELLERS"
          sections={bestSellersBalanced}
          maxProductsPerCategory={4}
        />
        <SectionSeparator
          variant="angle"
          position="bottom"
          color="#f0fdfa"
          height={60}
        />
      </div>

      {/* Crazy Deals Section */}
      <div className="relative bg-white pt-8">
        <CrazyDeals deals={crazyDeals.success ? (crazyDeals.data ?? []) : []} />
        <SectionSeparator
          variant="wave"
          position="bottom"
          color="#ffffff"
          height={50}
        />
      </div>

      {/* Categories Section */}
      <div className="relative bg-cyan-50 pt-8">
        <CategorySection
          categories={categories.success ? (categories.data ?? []) : []}
        />
        <SectionSeparator
          variant="curve"
          position="bottom"
          color="#ecfeff"
          height={60}
        />
      </div>

      {/* Key Benefits Section */}
      <div className="relative bg-white">
        <KeyBenefits />
        <SectionSeparator
          variant="zigzag"
          position="bottom"
          color="#ffffff"
          height={40}
        />
      </div>

      {/* Blog Images Gallery Section */}
      <div className="relative bg-teal-50">
        <BlogImages />
        <SectionSeparator
          variant="wave"
          position="bottom"
          color="#f0fdfa"
          height={50}
        />
      </div>

      {/* Google Reviews Section */}
      <div className="relative bg-white">
        <GoogleReviews placeId="ChIJgUbEo8pZwokR5oXTcr_zNvE" />
        <SectionSeparator
          variant="curve"
          position="bottom"
          color="#ffffff"
          height={60}
        />
      </div>

      {/* Suppliers Section */}
      <div className="relative bg-cyan-50">
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
