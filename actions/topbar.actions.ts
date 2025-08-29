'use server';

import { PrismaClient } from '@prisma/client';

// Lazy Prisma initialization
let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Get all topbars for display
export async function getAllTopBars() {
  try {
    console.log('📊 Fetching all topbars...');

    const topbars = await getPrisma().topBar.findMany({
      orderBy: { createdAt: 'asc' }, // Show in creation order
    });

    console.log(`📊 Found ${topbars.length} topbars`);

    // Transform data for frontend use
    const formattedTopBars = topbars.map((topbar) => ({
      id: topbar.id,
      title: topbar.title,
      link: topbar.link,
      textColor: topbar.textColor,
      backgroundColor: topbar.backgroundColor || undefined,
      button: topbar.button
        ? {
            text: topbar.button.text || undefined,
            link: topbar.button.link || undefined,
            textColor: topbar.button.textColor,
            backgroundColor: topbar.button.backgroundColor,
          }
        : undefined,
      createdAt: topbar.createdAt,
      updatedAt: topbar.updatedAt,
    }));

    console.log('🔗 TopBars formatted for frontend');

    return { success: true, data: formattedTopBars };
  } catch (error) {
    console.error('❌ Error fetching topbars:', error);
    return {
      success: false,
      error: 'Failed to fetch topbars',
      details: error,
    };
  }
}

// Get active topbars (you can add active field to schema later if needed)
export async function getActiveTopBars() {
  try {
    console.log('📊 Fetching active topbars...');

    // For now, get all topbars (you can add where clause for active: true later)
    const result = await getAllTopBars();

    if (result.success) {
      // Limit to maximum 2 topbars for carousel functionality
      const limitedTopBars = result.data?.slice(0, 2) || [];

      console.log(`📊 Returning ${limitedTopBars.length} active topbars`);

      return {
        success: true,
        data: limitedTopBars,
      };
    }

    return result;
  } catch (error) {
    console.error('❌ Error fetching active topbars:', error);
    return {
      success: false,
      error: 'Failed to fetch active topbars',
      details: error,
    };
  }
}

// Get single topbar by ID
export async function getTopBarById(id: string) {
  try {
    console.log(`📊 Fetching topbar by ID: ${id}`);

    const topbar = await getPrisma().topBar.findUnique({
      where: { id },
    });

    if (!topbar) {
      return { success: false, error: 'TopBar not found' };
    }

    console.log(`📊 Found topbar: ${topbar.title}`);

    // Transform data for frontend use
    const formattedTopBar = {
      id: topbar.id,
      title: topbar.title,
      link: topbar.link,
      textColor: topbar.textColor,
      backgroundColor: topbar.backgroundColor || undefined,
      button: topbar.button
        ? {
            text: topbar.button.text || undefined,
            link: topbar.button.link || undefined,
            textColor: topbar.button.textColor,
            backgroundColor: topbar.button.backgroundColor,
          }
        : undefined,
      createdAt: topbar.createdAt,
      updatedAt: topbar.updatedAt,
    };

    return { success: true, data: formattedTopBar };
  } catch (error) {
    console.error('❌ Error fetching topbar by ID:', error);
    return {
      success: false,
      error: 'Failed to fetch topbar',
      details: error,
    };
  }
}
