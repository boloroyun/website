'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  User,
  Menu,
  Package,
  Truck,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { LuStore } from 'react-icons/lu';
import { GrLike } from 'react-icons/gr';
import { GiPerfumeBottle } from 'react-icons/gi';
import { FaBath } from 'react-icons/fa';
import { PiHighlighterCircleBold } from 'react-icons/pi';
import { MdFace4 } from 'react-icons/md';
import { useAtom } from 'jotai';
import { hamburgerMenuState } from './store';
import Link from 'next/link';
import Image from 'next/image';

export interface NavItem {
  name: string;
  href: string;
  iconComponent?: string;
  hasSubmenu?: boolean;
  hasLogo?: boolean;
  submenu?: Array<{
    name: string;
    href: string;
  }>;
}

interface MobileNavMenuProps {
  navItems: NavItem[];
}

const MobileNavMenu = ({ navItems }: MobileNavMenuProps) => {
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState);
  const [activeSubmenu, setActiveSubmenu] = useState(null as string | null);

  const handleOnClickHamburgerMenu = () => {
    setHamMenuOpen(true);
  };

  const toggleSubmenu = (name: string) => {
    if (activeSubmenu === name) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(name);
    }
  };

  // Map icon component names to actual components
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'RiDiscountPercentFill':
        return <RiDiscountPercentFill size={24} />;
      case 'LuStore':
        return <LuStore size={24} />;
      case 'GrLike':
        return <GrLike size={24} />;
      case 'GiPerfumeBottle':
        return <GiPerfumeBottle size={24} />;
      case 'FaBath':
        return <FaBath size={24} />;
      case 'PiHighlighterCircleBold':
        return <PiHighlighterCircleBold size={24} />;
      case 'MdFace4':
        return <MdFace4 size={24} />;
      default:
        return <LuStore size={24} />;
    }
  };

  return (
    <Sheet open={hamMenuOpen} onOpenChange={setHamMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
          className="lg:hidden p-2 hover:bg-gray-100 transition-colors rounded-md"
          onClick={handleOnClickHamburgerMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={20} className="text-gray-600" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className="w-[280px] sm:w-[320px] md:w-[400px] overflow-y-auto p-0"
      >
        {/* Mobile menu header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Download our app</p>
              <p className="text-xs text-gray-300">and get 10% OFF!</p>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md">
            Download App
          </Button>
        </div>

        {/* Navigation items */}
        <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/profile/orders">
            <Button
              variant={'outline'}
              className="flex text-black items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none w-full"
            >
              <Package size={20} />
              <span>MY ORDERS</span>
            </Button>
          </Link>
          <Link href="/track-order">
            <Button
              variant={'outline'}
              className="flex text-black items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none w-full"
            >
              <Truck size={20} />
              <span>TRACK ORDER</span>
            </Button>
          </Link>
        </div>

        {/* Menu items with submenus */}
        <div className="space-y-4">
          {navItems.map((item) => (
            <div key={item.name}>
              <div
                className="flex items-center justify-between py-2 border-b border-b-gray-300 text-black cursor-pointer"
                onClick={() =>
                  item.hasSubmenu
                    ? toggleSubmenu(item.name)
                    : setHamMenuOpen(false)
                }
              >
                <Link
                  href={item.href}
                  className="flex text-black items-center space-x-4 flex-1"
                  onClick={() => !item.hasSubmenu && setHamMenuOpen(false)}
                >
                  {item.hasLogo ? (
                    <div className="relative w-6 h-6 mr-2">
                      <Image
                        src="/images/logo.jpeg"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="rounded-sm object-contain"
                      />
                    </div>
                  ) : (
                    getIconComponent(item.iconComponent)
                  )}
                  <span className="font-medium">{item.name}</span>
                </Link>
                {item.hasSubmenu && (
                  <div>
                    {activeSubmenu === item.name ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                )}
              </div>

              {/* Display submenu if the item is clicked */}
              {item.hasSubmenu && activeSubmenu === item.name && (
                <ul className="pl-2 pt-2 space-y-1">
                  {item.submenu?.map((submenuItem, index) => (
                    <div
                      className="flex items-center justify-start"
                      key={index}
                    >
                      <ChevronRight className="w-5 h-5" />
                      <Link
                        href={submenuItem.href}
                        className="text-sm text-gray-600 hover:text-black"
                        onClick={() => setHamMenuOpen(false)}
                      >
                        {submenuItem.name}
                      </Link>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
