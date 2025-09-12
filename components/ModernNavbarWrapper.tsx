import { getNavigationDataWithIcons } from '@/actions/navigation.actions';
import ModernNavbar from './ModernNavbar';

const ModernNavbarWrapper = async () => {
  // Fetch navigation data from database
  const navResult = await getNavigationDataWithIcons();
  const navItems = navResult.success ? navResult.data || [] : [];

  // Navigation items loaded silently

  return <ModernNavbar navItems={navItems} />;
};

export default ModernNavbarWrapper;
