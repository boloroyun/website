'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

import CartDrawer from './CartDrawer';
import AccountPopUp from './AccountPopUp';

const UserNavSection = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isAccountPopUpOpen, setIsAccountPopUpOpen] = useState(false);

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      setIsAccountPopUpOpen(true);
    }
  };

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

          {/* User Profile Button */}
          <Button
            onClick={handleUserClick}
            variant="ghost"
            size="icon"
            className="relative cursor-pointer"
            title={`View Profile - ${user?.username}`}
          >
            <User size={24} className="text-green-600" />
            {/* Green dot indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </Button>
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
