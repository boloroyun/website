/* eslint no-use-before-define: 0 */
import Link from 'next/link';
import { getNavigationDataWithIcons } from '@/actions/navigation.actions';
import MobileNavMenu from './MobileNavMenu';
import NavbarSearch from './NavbarSearch';

import UserNavSection from './UserNavSection';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = async () => {
  // Fetch navigation data from database
  const navResult = await getNavigationDataWithIcons();
  const navItems = navResult.success ? navResult.data || [] : [];

  console.log('🧭 Navbar loaded with', navItems.length, 'navigation items');

  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          <div className="flex items-center lg:w-1/3">
            <MobileNavMenu navItems={navItems} />
            <NavbarSearch />
          </div>

          <div className="flex-1 flex items-center justify-center lg:w-1/3">
            <Link href={'/'}>
              <h1 className="text-2xl font-bold">LUX Cabinets & Stones</h1>
            </Link>
          </div>

          <div className="lg:w-1/3">
            <UserNavSection />
          </div>
        </div>

        {/* For larger screens */}
        <div className="hidden lg:block border-t border-gray-200 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-evenly py-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-black group transition duration-300"
                >
                  {item.name}
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black "></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
