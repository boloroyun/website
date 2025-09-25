'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import CartDrawer from './CartDrawer';
import AccountPopUp from './AccountPopUp';

const UserNavSection = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isAccountPopUpOpen, setIsAccountPopUpOpen] = useState(false);

  const handleUserClick = () => {
    if (isAuthenticated) {
      // Use both approaches to ensure navigation works
      console.log('🔍 User is authenticated, navigating to profile page');
      
      try {
        // 1. Use Next.js router for a smoother experience
        router.push('/profile');
        
        // 2. Also set a backup direct navigation with a slight delay
        setTimeout(() => {
          if (window.location.pathname !== '/profile') {
            console.log('⚠️ Router navigation may have failed, using direct navigation');
            window.location.href = '/profile';
          }
        }, 500);
      } catch (error) {
        console.error('❌ Error navigating to profile:', error);
        // Fallback to direct navigation if router fails
        window.location.href = '/profile';
      }
    } else {
      setIsAccountPopUpOpen(true);
    }
  };
  
  // Add a direct profile link for authenticated users
  useEffect(() => {
    // Clean up any previous link
    const oldProfileLink = document.getElementById('direct-profile-link');
    if (oldProfileLink) {
      oldProfileLink.remove();
    }
    
    // Only for authenticated users
    if (isAuthenticated && user) {
      // Create an invisible link that can be triggered programmatically
      const profileLink = document.createElement('a');
      profileLink.id = 'direct-profile-link';
      profileLink.href = '/profile';
      profileLink.style.display = 'none';
      document.body.appendChild(profileLink);
    }
  }, [isAuthenticated, user]);

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
        <div className="flex items-center space-x-3">
          {/* Welcome Text */}
          <span className="hidden md:block text-sm text-gray-600">
            Welcome,{' '}
            <span className="font-medium text-gray-900">{user?.username}</span>
          </span>

          {/* User Profile Button - Using Link for better navigation */}
          <Link href="/profile" passHref legacyBehavior>
            <Button
              onClick={(e) => {
                e.preventDefault(); // Prevent default to allow our custom handler
                handleUserClick();
              }}
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
              title={`View Profile - ${user?.username}`}
              aria-label="Go to profile page"
            >
              <User size={24} className="text-green-600" />
              {/* Green dot indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </Button>
          </Link>
        </div>
      ) : (
        /* Login/Signup Button for non-authenticated users */
        <Button
          onClick={handleUserClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          title="Login / Sign Up"
        >
          <User size={24} />
        </Button>
      )}

      {/* Account PopUp Modal */}
      <AccountPopUp
        isOpen={isAccountPopUpOpen}
        onClose={() => setIsAccountPopUpOpen(false)}
      />
    </div>
  );
};

export default UserNavSection;
