import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { isClient, isStaffOrAdmin, getAdminDashboardUrl } from '@/lib/roles';
import SignOutButton from './SignOutButton';
import MobileMenu from './MobileMenu';
import { User, ExternalLink, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;
  const userRole = user?.role;

  // Public navigation links
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu - Left Side */}
          <div className="flex items-center md:hidden">
            <MobileMenu
              publicLinks={publicLinks}
              user={user}
              userRole={userRole}
            />
          </div>

          {/* Logo - Center on mobile, Left on desktop */}
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.jpeg"
                alt="LUX Cabinets & Stones"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Quick Links */}
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Contact
            </Link>

            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {/* Cart count badge can be added here */}
              </Button>
            </Link>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-4">
                {isClient(userRole) && (
                  <Link
                    href="/account"
                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                  >
                    Account
                  </Link>
                )}
                {isStaffOrAdmin(userRole) && (
                  <a
                    href={getAdminDashboardUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors inline-flex items-center"
                  >
                    Dashboard
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
                <SignOutButton />
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Cart - Right Side */}
          <div className="flex items-center md:hidden">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
