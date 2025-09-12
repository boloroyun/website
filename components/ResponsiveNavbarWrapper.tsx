import { getNavigationDataWithIcons } from '@/actions/navigation.actions';
import ResponsiveNavbar from './ResponsiveNavbar';

const ResponsiveNavbarWrapper = async () => {
  // Fetch navigation data from database
  const navResult = await getNavigationDataWithIcons();
  const navData = navResult.success ? navResult.data || [] : [];

  // Transform the navData to match the expected format for ResponsiveNavbar
  const navItems = navData.map((item, index) => {
    // Define our own type-safe object that conforms to the NavItem interface
    const navItem = {
      id: `nav-${index}`, // Add missing id property
      name: item.name,
      href: item.href,
      // icon should be a string or undefined
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      // Map children from submenu if it exists
      children:
        item.hasSubmenu && item.submenu
          ? item.submenu.map((subItem, subIndex) => ({
              id: `nav-${index}-${subIndex}`,
              name: subItem.name,
              href: subItem.href,
            }))
          : undefined,
    };
    return navItem;
  });

  console.log(
    '🧭 ResponsiveNavbar loaded with',
    navItems.length,
    'navigation items'
  );

  return <ResponsiveNavbar navItems={navItems} />;
};

export default ResponsiveNavbarWrapper;
