import { getActiveTopBars } from '@/actions/topbar.actions';
import { getNavigationDataWithIcons } from '@/actions/navigation.actions';
import TransparentHeader from './TransparentHeader';

const TransparentHeaderWrapper = async () => {
  // Fetch both topbars and navigation items in parallel
  const [topbarsResult, navResult] = await Promise.all([
    getActiveTopBars(),
    getNavigationDataWithIcons(),
  ]);

  const topbars = topbarsResult.success ? topbarsResult.data || [] : [];
  const navItems = navResult.success ? navResult.data || [] : [];

  return <TransparentHeader topbars={topbars} navItems={navItems} />;
};

export default TransparentHeaderWrapper;
