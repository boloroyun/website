/* eslint no-use-before-define: 0 */
import Link from 'next/link';
import Image from 'next/image';
import { getNavigationDataWithIcons } from '@/actions/navigation.actions';
import MobileNavMenu from './MobileNavMenu';

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
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center lg:w-1/3">
            <MobileNavMenu navItems={navItems} />
          </div>

          <div className="flex-1 flex items-center justify-center lg:w-1/3">
            <Link href={'/'}>
              <Image
                src="/images/logo.jpeg"
                alt="LUX Cabinets & Stones"
                width={400}
                height={120}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="lg:w-1/3">
            <UserNavSection />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
