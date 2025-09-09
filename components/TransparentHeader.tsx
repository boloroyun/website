'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import TopBar from './TopBar';
import UserNavSection from './UserNavSection';
import MobileNavMenu from './MobileNavMenu';
import SearchModal from './SearchModal';

interface TopBarData {
  id: string;
  title: string;
  link: string;
  textColor: string;
  backgroundColor?: string;
  button?: {
    text?: string;
    link?: string;
    textColor: string;
    backgroundColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Import the NavItem type from MobileNavMenu to ensure type compatibility
import type { NavItem as MobileNavItem } from './MobileNavMenu';
type NavItem = MobileNavItem;

interface TransparentHeaderProps {
  topbars: TopBarData[];
  navItems: NavItem[];
}

const TransparentHeader = ({ topbars, navItems }: TransparentHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle scroll events to add background when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* TopBar */}
      {topbars.length > 0 && (
        <div
          className={`${scrolled ? 'bg-black/80' : 'bg-transparent'} transition-all duration-300`}
        >
          <TopBar topbars={topbars} autoSlide={true} autoSlideInterval={6000} />
        </div>
      )}

      {/* Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section: Mobile menu */}
            <div className="flex items-center lg:w-1/3">
              <MobileNavMenu navItems={navItems} />
            </div>

            {/* Middle section: Logo */}
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

            {/* Right section: Search, user, cart */}
            <div className="lg:w-1/3 flex items-center justify-end space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-700" />
              </button>

              {/* User and Cart */}
              <UserNavSection />

              {/* Search Modal */}
              {searchOpen && <SearchModal setOpen={setSearchOpen} />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;
