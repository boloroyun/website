'use server';

import prisma from '@/lib/prisma';
import { getBestSellers } from './products.actions';
import { getCrazyDeals } from './offers.actions';
import { getAllCategories } from './categories.actions';

// Define navigation item types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: NavSubmenuItem[];
}

export interface NavSubmenuItem {
  name: string;
  href: string;
}

// Get navigation data with real categories and special sections
export async function getNavigationData() {
  try {
    console.log('🧭 Fetching navigation data...');

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

    console.log(
      `📊 Found ${categories?.length ?? 0} categories, crazy deals: ${hasCrazyDeals}, best sellers: ${hasBestSellers}`
    );

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

    // Add Blog
    navItems.push({
      name: 'BLOG',
      href: '/blog',
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

    console.log(`🔗 Built ${navItems.length} navigation items`);

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
