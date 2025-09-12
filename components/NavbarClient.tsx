'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileNavMenu from './MobileNavMenu';
import UserNavSection from './UserNavSection';
import { getNavigationDataWithIcons } from '@/actions/navigation.actions';
import { useNavigationStore } from '@/lib/navigation-store';
import { LoadingSpinner } from './ui/loading-spinner';
import { useRouter, usePathname } from 'next/navigation';

const NavbarClient = () => {
  const { navItems, isLoaded, setNavItems, shouldRefetch } =
    useNavigationStore();
  const [isLoading, setIsLoading] = useState(!isLoaded);

  const router = useRouter();
  const pathname = usePathname();
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Handle navigation progress indicator
  useEffect(() => {
    const handleStart = () => setLoadingRoute(true);
    const handleStop = () => setLoadingRoute(false);

    // Subscribe to navigation events
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleStop);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleStop);
    };
  }, []);

  useEffect(() => {
    const fetchNavItems = async () => {
      // Only fetch if data isn't loaded or needs refreshing
      if (!isLoaded || shouldRefetch()) {
        try {
          setIsLoading(true);
          const navResult = await getNavigationDataWithIcons();
          if (navResult.success && navResult.data) {
            setNavItems(navResult.data);
          }
        } catch (error) {
          console.error('Failed to fetch navigation data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchNavItems();
  }, [isLoaded, setNavItems, shouldRefetch]);

  return (
    <>
      {/* Loading indicator for navigation */}
      {loadingRoute && (
        <div className="fixed top-0 left-0 w-full z-50 bg-blue-500 h-1">
          <div className="h-full bg-white animate-pulse"></div>
        </div>
      )}

      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center lg:w-1/3">
              <MobileNavMenu navItems={navItems} />
            </div>

            <div className="flex-1 flex items-center justify-center lg:w-1/3">
              <Link
                href={'/'}
                className="relative logo-hover-effect overflow-hidden transition-all duration-300 p-1 rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative logo-container transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/logo.jpeg"
                    alt="LUX Cabinets & Stones"
                    width={400}
                    height={120}
                    className="h-14 sm:h-16 md:h-16 w-auto logo-image"
                    priority
                    style={{ objectFit: 'contain' }}
                  />
                  <div className="logo-underline"></div>
                </div>
              </Link>
            </div>

            <div className="lg:w-1/3 flex justify-end">
              <UserNavSection />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarClient;
