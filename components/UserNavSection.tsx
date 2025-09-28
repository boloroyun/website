'use client';

import { useState, useEffect } from 'react';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import CartDrawer from './CartDrawer';

const UserNavSection = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, logout } = useOTPAuth();

  const handleUserClick = () => {
    if (isAuthenticated) {
      // Use Next.js router for smoother navigation
      console.log('🔍 User is authenticated, navigating to account page');
      console.log('🔍 Current URL:', window.location.pathname);

      // Only navigate if we're not already on the account page
      if (window.location.pathname !== '/account') {
        router.push('/account');
      } else {
        console.log('🔍 Already on account page, no navigation needed');
      }
    } else {
      // Redirect to new OTP login page
      console.log('🔍 User not authenticated, redirecting to login');
      router.push('/auth/login-otp');
    }
  };

  // We're using Next.js router for navigation, no need for direct link

  if (isLoading) {
    return (
      <div className="flex items-center justify-end space-x-4">
        {/* Cart Icon */}
        <CartDrawer />

        {/* Loading User State */}
        <Button variant="ghost" size="icon" disabled>
          <Loader2 size={24} className="animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-4">
      {/* Cart Icon */}
      <CartDrawer />

      {/* User Section */}
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          {/* Welcome Text */}
          <span className="hidden sm:block text-sm text-gray-600">
            Welcome,{' '}
            <span className="font-semibold text-gray-900">
              {user?.username || user?.name || 'User'}
            </span>
          </span>

          {/* User Profile Button */}
          <Button
            onClick={handleUserClick}
            variant="ghost"
            size="icon"
            className="relative cursor-pointer hover:bg-green-50 transition-colors group"
            title={`View Account - ${user?.username}`}
            aria-label="Go to account page"
          >
            <User size={24} className="text-green-600" />
            {/* Green dot indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            {/* Mobile-friendly tooltip */}
            <span className="absolute -bottom-8 whitespace-nowrap bg-black text-white text-xs rounded py-1 px-2 hidden md:group-hover:block">
              My Account
            </span>
          </Button>

          {/* Logout Button */}
          <Button
            onClick={logout}
            variant="ghost"
            size="icon"
            className="relative cursor-pointer hover:bg-red-50 transition-colors group"
            title="Sign Out"
            aria-label="Sign out of your account"
          >
            <LogOut size={20} className="text-red-600" />
            {/* Mobile-friendly tooltip */}
            <span className="absolute -bottom-8 whitespace-nowrap bg-black text-white text-xs rounded py-1 px-2 hidden md:group-hover:block">
              Sign Out
            </span>
          </Button>
        </div>
      ) : (
        /* Login/Signup Button for non-authenticated users */
        <Button
          onClick={handleUserClick}
          variant="ghost"
          size="icon"
          className="relative cursor-pointer hover:bg-blue-50 transition-colors group"
          title="Sign In with Email Code"
          aria-label="Sign in to your account"
        >
          <User size={24} className="text-blue-600" />
          {/* Mobile-friendly tooltip */}
          <span className="absolute -bottom-8 whitespace-nowrap bg-black text-white text-xs rounded py-1 px-2 hidden md:group-hover:block">
            Sign In
          </span>
        </Button>
      )}
    </div>
  );
};

export default UserNavSection;
