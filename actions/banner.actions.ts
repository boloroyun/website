'use server';

import prisma from '@/lib/prisma';
// Website Banners
export async function getWebsiteBanners() {
  try {
    console.log('🌐 Fetching website banners from database...');

    const websiteRecordCount = await prisma.websiteBanner.count();
    console.log(
      `📊 Total WebsiteBanner records in database: ${websiteRecordCount}`
    );

    const websiteBanners = await prisma.websiteBanner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(
      '🗃️ Raw websiteBanners data:',
      JSON.stringify(websiteBanners, null, 2)
    );

    console.log(`📸 Found ${websiteBanners.length} website banner records`);

    // Extract all images from all banner records
    const allImages = websiteBanners
      .flatMap((banner) =>
        banner.images.map((image) => ({
          public_id: image.public_id || '',
          url: image.url || '',
        }))
      )
      .filter((image) => image.url); // Only include images with valid URLs

    console.log(`🖼️ Total website banner images: ${allImages.length}`);
    console.log(
      '🔗 Website banner URLs:',
      allImages.map((img) => img.url)
    );

    return { success: true, data: allImages };
  } catch (error) {
    console.error('❌ Error fetching website banners:', error);
    return {
      success: false,
      error: 'Failed to fetch website banners',
      details: error,
    };
  }
}

// App Banners
export async function getAppBanners() {
  try {
    console.log('📱 Fetching app banners from database...');

    // Try to count records first to check connectivity
    console.log('🔍 Checking database connectivity...');
    const recordCount = await prisma.appBanner.count();
    console.log(`📊 Total AppBanner records in database: ${recordCount}`);

    const appBanners = await prisma.appBanner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log('🗃️ Raw appBanners data:', JSON.stringify(appBanners, null, 2));

    console.log(`📸 Found ${appBanners.length} app banner records`);

    // Extract all images from all banner records
    const allImages = appBanners
      .flatMap((banner) =>
        banner.images.map((image) => ({
          public_id: image.public_id || '',
          url: image.url || '',
        }))
      )
      .filter((image) => image.url); // Only include images with valid URLs

    console.log(`🖼️ Total app banner images: ${allImages.length}`);
    console.log(
      '🔗 App banner URLs:',
      allImages.map((img) => img.url)
    );

    return { success: true, data: allImages };
  } catch (error) {
    console.error('❌ Error fetching app banners:', error);
    console.error('Error type:', typeof error);
    console.error(
      'Error message:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return {
      success: false,
      error: 'Failed to fetch app banners',
      details: error,
    };
  }
}
