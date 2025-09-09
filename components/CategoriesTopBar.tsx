'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import SearchModal from './SearchModal';

interface NavItem {
  name: string;
  href: string;
  hasSubmenu?: boolean;
  submenu?: { name: string; href: string }[];
}

interface CategoriesTopBarProps {
  categories: NavItem[];
}

const CategoriesTopBar: React.FC<CategoriesTopBarProps> = ({ categories }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Categories Navigation */}
          <div className="flex items-center space-x-6 flex-1 overflow-x-auto">
            {categories.map((category) => (
              <div key={category.name} className="relative group flex-shrink-0">
                {category.hasSubmenu && category.submenu ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-medium text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
                      >
                        {category.name}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56 p-0">
                      <div className="py-1">
                        <Link
                          href={category.href}
                          className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                        >
                          View All {category.name}
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                        {category.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Link
                    href={category.href}
                    className="text-xs font-medium text-gray-600 hover:text-black transition-colors duration-200 whitespace-nowrap px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Search Section */}
          <div className="flex items-center ml-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors duration-200 border border-gray-300 rounded-md hover:border-gray-400 bg-white"
            >
              <Search className="w-3 h-3" />
              <span className="hidden sm:inline">Search products...</span>
              <span className="sm:hidden">Search</span>
            </button>
            {searchOpen && <SearchModal setOpen={setSearchOpen} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTopBar;
