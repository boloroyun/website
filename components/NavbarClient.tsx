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
import { Search, Phone, Facebook, Instagram, Youtube } from 'lucide-react';

// Custom Pinterest and TikTok icons
const PinterestIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
  </svg>
);

const TikTokIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

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

      {/* Header container */}
      <div className="bg-white shadow-sm">
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
              <span className="text-gray-500">|</span>
              <div className="flex items-center space-x-2">
                <a
                  href="https://www.facebook.com/profile.php?id=100077834019795"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="https://www.instagram.com/luxcabistones/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://www.youtube.com/@LUXCabinetsStones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube size={14} />
                </a>
                <a
                  href="https://www.pinterest.com/076iuae2zizrvl52yffotd3mrm5alu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  aria-label="Follow us on Pinterest"
                >
                  <PinterestIcon size={14} />
                </a>
                <a
                  href="https://www.tiktok.com/@luxcabinetstones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Follow us on TikTok"
                >
                  <TikTokIcon size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav
          className={`w-full bg-white transition-all duration-300 ${
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
                      width={600}
                      height={180}
                      className={`h-16 sm:h-20 w-auto transition-all duration-300 ${
                        scrolled ? 'scale-95' : ''
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

            {/* Desktop Navigation Menu - Hidden as requested */}
            {/* <div
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
                  {item.name}
                </Link>
              ))}
            </div>
          </div> */}
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavbarClient;
