import React from 'react';
import { getActiveTopBars } from '@/actions/topbar.actions';
import { getNavigationData } from '@/actions/navigation.actions';
import TopBar from './TopBar';
import CategoriesTopBar from './CategoriesTopBar';

export default async function TopBarWrapper() {
  // Fetch both topbars and categories in parallel
  const [topbarsResult, navResult] = await Promise.all([
    getActiveTopBars(),
    getNavigationData(),
  ]);

  const topbars = topbarsResult.success ? topbarsResult.data || [] : [];
  const allNavItems = navResult.success ? navResult.data || [] : [];

  // Filter to get categories and include blog
  const categories = allNavItems.filter((item) => {
    const excludedItems = ['CRAZY DEALS', 'SHOP ALL', 'BESTSELLERS'];
    return !excludedItems.includes(item.name);
  });

  return (
    <div className="w-full">
      {/* Original announcement topbar */}
      {topbars.length > 0 && (
        <TopBar topbars={topbars} autoSlide={true} autoSlideInterval={6000} />
      )}

      {/* Categories and search topbar */}
      <CategoriesTopBar categories={categories} />
    </div>
  );
}
