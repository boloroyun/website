'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Removing framer-motion dependency
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { LuStore } from 'react-icons/lu';
import { GrLike } from 'react-icons/gr';
import { GiPerfumeBottle } from 'react-icons/gi';
import { FaBath } from 'react-icons/fa';
import { PiHighlighterCircleBold } from 'react-icons/pi';
import { MdFace4 } from 'react-icons/md';

// Using standard nav elements instead of Shadcn navigation-menu

import { Button } from '@/components/ui/button';
import UserNavSection from './UserNavSection';
import SearchModal from './SearchModal';
import { cn } from '@/lib/utils';

interface NavSubmenuItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  iconComponent?: string;
  hasSubmenu?: boolean;
  submenu?: NavSubmenuItem[];
}

// Map of icon component strings to their React component counterparts
const IconComponents: Record<string, React.ComponentType<any>> = {
  RiDiscountPercentFill: RiDiscountPercentFill,
  LuStore: LuStore,
  GrLike: GrLike,
  GiPerfumeBottle: GiPerfumeBottle,
  FaBath: FaBath,
  PiHighlighterCircleBold: PiHighlighterCircleBold,
  MdFace4: MdFace4,
};

interface ModernNavbarProps {
  navItems: NavItem[];
}

const ModernNavbar= ({ navItems }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed w-full top-0 left-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-2'
            : 'bg-white/70 backdrop-blur-md border-b border-gray-100/30 py-3'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="LUX Cabinets & Stones"
                  width={400}
                  height={120}
                  className="h-12 w-auto transition-all duration-300"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center justify-center space-x-6">
                {navItems.map((item, index) => (
                  <li key={index} className="relative group">
                    {item.hasSubmenu ? (
                      <>
                        <div className="relative flex items-center cursor-pointer">
                          <Link
                            href={item.href}
                            className={`relative flex items-center px-3 py-2 text-base font-medium transition-colors ${
                              isScrolled
                                ? 'text-gray-800 hover:text-black'
                                : 'text-gray-900 hover:text-black'
                            } group`}
                          >
                            {item.name}
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                          </Link>
                          <ChevronDown size={16} className="ml-1" />
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute left-0 mt-2 w-56 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="py-1">
                            {item.submenu?.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`relative px-3 py-2 text-base font-medium transition-colors ${
                          isScrolled
                            ? 'text-gray-800 hover:text-black'
                            : 'text-gray-900 hover:text-black'
                        } group`}
                      >
                        {item.name}
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side: Search and User */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Search Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'rounded-full hover:bg-gray-100/50 transition-colors',
                  isScrolled
                    ? 'text-gray-700 hover:text-black'
                    : 'text-gray-900 hover:text-black'
                )}
              >
                <Search size={20} className="mr-1" />
                <span className="hidden sm:inline">Search</span>
              </Button>

              {/* User Navigation */}
              <UserNavSection />

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={cn(
                    'rounded-full transition-all',
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-800 hover:bg-white/30'
                  )}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="py-2">
              <ul className="px-2 py-3 space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    {item.hasSubmenu ? (
                      <div className="flex flex-col">
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all duration-150"
                        >
                          <span className="flex items-center">
                            {item.iconComponent &&
                              IconComponents[item.iconComponent] &&
                              React.createElement(
                                IconComponents[item.iconComponent],
                                {
                                  className: 'mr-2',
                                  size: 18,
                                }
                              )}
                            {item.name}
                          </span>
                          <ChevronDown size={18} />
                        </Link>
                        <div className="pl-4 ml-2 border-l-2 border-gray-200">
                          {item.submenu?.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-150"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all duration-150"
                      >
                        <span className="flex items-center">
                          {item.iconComponent &&
                            IconComponents[item.iconComponent] &&
                            React.createElement(
                              IconComponents[item.iconComponent],
                              {
                                className: 'mr-2',
                                size: 18,
                              }
                            )}
                          {item.name}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && <SearchModal setOpen={setSearchOpen} />}

      {/* Spacer for fixed header - using inline style for dynamic height */}
      <div
        style={{ height: isScrolled ? '68px' : '84px' }}
        className="transition-all duration-300"
      ></div>
    </>
  );
};

export default ModernNavbar;
