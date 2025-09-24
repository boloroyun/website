'use server';

import { getPrismaClient } from '@/lib/mongodb';

// Use the improved Prisma client with better connection handling
function getPrisma() {
  return getPrismaClient();
}
import { getBestSellers } from './products.actions';
import { getCrazyDeals } from './offers.actions';
import { getAllCategories } from './categories.actions';

// Define navigation item types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  hasSubmenu?: boolean;
  hasLogo?: boolean; // Flag to indicate if this item should display a logo
  submenu?: NavSubmenuItem[];
}

export interface NavSubmenuItem {
  name: string;
  href: string;
}

// Get navigation data with real categories and special sections
export async function getNavigationData() {
  try {
    // Fetch all categories with subcategories
    const categoriesResult = await getAllCategories();
    const categories = categoriesResult.success ? categoriesResult.data : [];

    // Check if we have crazy deals
    const crazyDealsResult = await getCrazyDeals();
    const hasCrazyDeals =
      crazyDealsResult.success && (crazyDealsResult.data?.length ?? 0) > 0;

    // Check if we have best sellers
    const bestSellersResult = await getBestSellers(1);
    const hasBestSellers =
      bestSellersResult.success && (bestSellersResult.data?.length ?? 0) > 0;

    // Build navigation items array
    const navItems: NavItem[] = [];

    // Add Crazy Deals if available
    if (hasCrazyDeals) {
      navItems.push({
        name: 'CRAZY DEALS',
        href: '/crazy-deals',
      });
    }

    // Add Shop All (general products page)
    navItems.push({
      name: 'SHOP ALL',
      href: '/shop',
    });

    // Add Best Sellers if available
    if (hasBestSellers) {
      navItems.push({
        name: 'BESTSELLERS',
        href: '/bestsellers',
      });
    }

    // Add Blog with special logo indicator
    navItems.push({
      name: 'BLOG',
      href: '/blog',
      hasLogo: true, // Special flag to indicate this item should have a logo
    });

    // Add categories with subcategories
    categories?.forEach((category) => {
      const categoryNavItem: NavItem = {
        name: category.name.toUpperCase(),
        href: `/category/${category.slug}`,
      };

      // Add subcategories if available
      if (category.subCategories && category.subCategories.length > 0) {
        categoryNavItem.hasSubmenu = true;
        categoryNavItem.submenu = category.subCategories.map((subCat) => ({
          name: subCat.name,
          href: `/category/${category.slug}/${subCat.slug}`,
        }));
      }

      navItems.push(categoryNavItem);
    });

    // Navigation items built successfully

    return { success: true, data: navItems };
  } catch (error) {
    console.error('❌ Error fetching navigation data:', error);
    return {
      success: false,
      error: 'Failed to fetch navigation data',
      details: error,
    };
  }
}

// Get simplified navigation data for mobile menu with icons
export async function getNavigationDataWithIcons() {
  try {
    const navResult = await getNavigationData();
    if (!navResult.success) {
      return navResult;
    }

    // Map navigation items to include appropriate icons
    const navItemsWithIcons = navResult.data?.map((item) => {
      let iconComponent = null;

      // Map category names to appropriate icons
      switch (item.name) {
        case 'CRAZY DEALS':
          iconComponent = 'RiDiscountPercentFill';
          break;
        case 'SHOP ALL':
          iconComponent = 'LuStore';
          break;
        case 'BESTSELLERS':
          iconComponent = 'GrLike';
          break;
        case 'PERFUMES':
          iconComponent = 'GiPerfumeBottle';
          break;
        case 'BATH & BODY':
          iconComponent = 'FaBath';
          break;
        case 'MAKEUP':
          iconComponent = 'PiHighlighterCircleBold';
          break;
        case 'SKINCARE':
          iconComponent = 'MdFace4';
          break;
        default:
          // For other categories, we'll use a default icon
          iconComponent = 'LuStore';
      }

      return {
        ...item,
        iconComponent,
      };
    });

    return { success: true, data: navItemsWithIcons };
  } catch (error) {
    console.error('❌ Error fetching navigation data with icons:', error);
    return {
      success: false,
      error: 'Failed to fetch navigation data with icons',
      details: error,
    };
  }
}
