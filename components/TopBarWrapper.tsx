import React from 'react';
import { getActiveTopBars } from '@/actions/topbar.actions';
import TopBar from './TopBar';

export default async function TopBarWrapper() {
  const topbarsResult = await getActiveTopBars();

  // Don't render anything if there are no topbars or if there's an error
  if (!topbarsResult.success || !topbarsResult.data?.length) {
    return null;
  }

  const topbars = topbarsResult.data;

  return (
    <div className="w-full">
      <TopBar topbars={topbars} autoSlide={true} autoSlideInterval={6000} />
    </div>
  );
}
