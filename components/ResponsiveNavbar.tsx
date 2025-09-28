'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserNavSection from './UserNavSection';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon?: string;
  hasLogo?: boolean;
  children?: NavItem[];
}

interface ResponsiveNavbarProps {
  navItems: NavItem[];
}

const ResponsiveNavbar= ({ navItems }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle dropdown menu
  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="relative h-14 w-48 transition-all duration-300">
                <Image
                  src="/images/logo.jpeg"
                  alt="LUX Cabinets & Stones"
                  fill
                  className={`object-contain ${isScrolled ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`flex items-center ${
                        isScrolled ? 'text-gray-800' : 'text-white'
                      } hover:text-gray-300 px-4 py-2 rounded-md text-base font-semibold tracking-wide`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div
                      className={`absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                        activeDropdown === item.id
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-2'
                      }`}
                    >
                      <div
                        className="py-2"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block px-5 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    } hover:text-gray-300 px-4 py-2 rounded-md text-base font-semibold tracking-wide flex items-center`}
                  >
                    {item.hasLogo && (
                      <div className="mr-2 relative w-6 h-6">
                        <Image
                          src="/images/logo1.jpeg"
                          alt="Logo"
                          width={24}
                          height={24}
                          className="rounded-sm object-contain"
                        />
                      </div>
                    )}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* User Navigation and Cart */}
          <div className="flex items-center">
            <div className={`${isScrolled ? 'text-gray-800' : 'text-white'}`}>
              <UserNavSection />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md text-${
                isScrolled ? 'gray-800' : 'white'
              } hover:text-gray-500 focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 pt-3 pb-4 space-y-2 sm:px-5">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="w-full flex items-center justify-between text-gray-800 hover:bg-gray-100 px-4 py-3 rounded-md text-lg font-semibold"
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-5 w-5" />
                    </button>
                    {activeDropdown === item.id && (
                      <div className="pl-6 border-l-2 border-gray-200 ml-4 mt-1 mb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-gray-800 hover:bg-gray-100 px-4 py-3 rounded-md text-lg font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default ResponsiveNavbar;
