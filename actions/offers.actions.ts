'use server';

import prisma from '@/lib/prisma';

// Special Combos (homescreen offers with type 'specialCombo')
export async function getSpecialCombos() {
  try {
    console.log('🎁 Fetching special combos from database...');

    const specialCombos = await prisma.homeScreenOffer.findMany({
      where: {
        type: 'specialCombo',
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📦 Found ${specialCombos.length} special combo records`);

    // Transform the data to include image URLs
    const formattedCombos = specialCombos.map((combo) => ({
      id: combo.id,
      title: combo.title,
      link: combo.link,
      images: combo.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
    }));

    console.log(
      '🔗 Special combos formatted:',
      formattedCombos.length,
      'items'
    );

    return { success: true, data: formattedCombos };
  } catch (error) {
    console.error('❌ Error fetching special combos:', error);
    return {
      success: false,
      error: 'Failed to fetch special combos',
      details: error,
    };
  }
}

// Crazy Deals (homescreen offers with type 'crazyDeal')
export async function getCrazyDeals() {
  try {
    console.log('🔥 Fetching crazy deals from database...');

    const crazyDeals = await prisma.homeScreenOffer.findMany({
      where: {
        type: 'crazyDeal',
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`💥 Found ${crazyDeals.length} crazy deal records`);

    // Transform the data to include image URLs
    const formattedDeals = crazyDeals.map((deal) => ({
      id: deal.id,
      title: deal.title,
      link: deal.link,
      images: deal.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
    }));

    console.log('🔗 Crazy deals formatted:', formattedDeals.length, 'items');

    return { success: true, data: formattedDeals };
  } catch (error) {
    console.error('❌ Error fetching crazy deals:', error);
    return {
      success: false,
      error: 'Failed to fetch crazy deals',
      details: error,
    };
  }
}

// All Homescreen Offers (for admin or other uses)
export async function getAllHomescreenOffers() {
  try {
    console.log('🏠 Fetching all homescreen offers from database...');

    const offers = await prisma.homeScreenOffer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📱 Found ${offers.length} homescreen offer records`);

    return { success: true, data: offers };
  } catch (error) {
    console.error('❌ Error fetching homescreen offers:', error);
    return {
      success: false,
      error: 'Failed to fetch homescreen offers',
      details: error,
    };
  }
}
