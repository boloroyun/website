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
import { Search, Phone } from 'lucide-react';

const NavbarClient = () => {
  const { navItems, isLoaded, setNavItems, shouldRefetch } =
    useNavigationStore();
  const [isLoading, setIsLoading] = useState(!isLoaded);
  const [scrolled, setScrolled] = useState(false);

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

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-background-shine"></div>
        </div>
      )}

      {/* Top contact bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm">
            <a
              href="tel:+15713350118"
              className="flex items-center hover:text-blue-400 transition-colors"
            >
              <Phone size={14} className="mr-1" />
              <span>(571) 335-0118</span>
            </a>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-gray-300">
              Mon-Fri: 9AM-5PM
            </span>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-gray-300">
              Sat: 10AM-3PM
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link
              href="/request-a-quote"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Get Free Estimate
            </Link>
            <span className="text-gray-500">|</span>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        className={`w-full bg-white shadow-sm sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'shadow-md py-2' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left section: Mobile menu and search */}
            <div className="flex items-center space-x-4">
              <MobileNavMenu navItems={navItems} />

              <div className="hidden md:flex">
                <button
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Middle section: Logo */}
            <div className="flex items-center justify-center">
              <Link
                href={'/'}
                className="group relative overflow-hidden transition-all duration-300 p-1 rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/logo.jpeg"
                    alt="LUX Cabinets & Stones"
                    width={400}
                    height={120}
                    className={`h-12 sm:h-14 w-auto transition-all duration-300 ${
                      scrolled ? 'scale-90' : ''
                    }`}
                    priority
                    style={{ objectFit: 'contain' }}
                  />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Right section: User navigation */}
            <div className="flex justify-end">
              <UserNavSection />
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <div
            className={`hidden lg:flex justify-center mt-2 transition-all duration-300 ${
              scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            <div className="flex space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarClient;
