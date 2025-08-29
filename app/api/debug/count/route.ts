import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Lazy import Prisma to avoid build-time instantiation
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      // Get counts for all key tables
      const [
        userCount,
        productCount,
        categoryCount,
        subCategoryCount,
        orderCount,
        cartCount,
        reviewCount,
        couponCount,
        homeScreenOfferCount,
        appBannerCount,
        websiteBannerCount,
        topBarCount,
        newsletterSubscriptionCount,
        verificationCodeCount,
        blogCategoryCount,
        blogTagCount,
        blogPostCount,
        blogCommentCount,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.category.count(),
        prisma.subCategory.count(),
        prisma.order.count(),
        prisma.cart.count(),
        prisma.review.count(),
        prisma.coupon.count(),
        prisma.homeScreenOffer.count(),
        prisma.appBanner.count(),
        prisma.websiteBanner.count(),
        prisma.topBar.count(),
        prisma.newsletterSubscription.count(),
        prisma.verificationCode.count(),
        prisma.blogCategory.count(),
        prisma.blogTag.count(),
        prisma.blogPost.count(),
        prisma.blogComment.count(),
      ]);

      // Calculate total records
      const totalRecords = 
        userCount +
        productCount +
        categoryCount +
        subCategoryCount +
        orderCount +
        cartCount +
        reviewCount +
        couponCount +
        homeScreenOfferCount +
        appBannerCount +
        websiteBannerCount +
        topBarCount +
        newsletterSubscriptionCount +
        verificationCodeCount +
        blogCategoryCount +
        blogTagCount +
        blogPostCount +
        blogCommentCount;

      const counts = {
        // Core business data
        users: userCount,
        products: productCount,
        categories: categoryCount,
        subCategories: subCategoryCount,
        orders: orderCount,
        carts: cartCount,
        reviews: reviewCount,
        coupons: couponCount,

        // Marketing & UI
        homeScreenOffers: homeScreenOfferCount,
        appBanners: appBannerCount,
        websiteBanners: websiteBannerCount,
        topBars: topBarCount,
        newsletterSubscriptions: newsletterSubscriptionCount,

        // Auth & Security
        verificationCodes: verificationCodeCount,

        // Blog system
        blogCategories: blogCategoryCount,
        blogTags: blogTagCount,
        blogPosts: blogPostCount,
        blogComments: blogCommentCount,

        // Summary
        totalRecords,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        databaseConnected: true,
      };

      return NextResponse.json({
        success: true,
        data: counts,
        message: 'Database counts retrieved successfully',
      });

    } finally {
      // Always disconnect Prisma client
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Database count error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve database counts',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        databaseConnected: false,
      },
      { status: 500 }
    );
  }
}
