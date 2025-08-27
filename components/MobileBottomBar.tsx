'use client';
import { useAtom } from 'jotai';
import { Grid, Home, Menu, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { hamburgerMenuState, cartMenuState } from './store';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
const MobileBottomBar = () => {
  const router = useRouter();
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState);
  const { getTotalItems, hasHydrated } = useCartStore();
  const { isAuthenticated } = useAuth();
  const [, setCartMenuOpen] = useAtom(cartMenuState);

  const handleOnClickHamburgerMenu = () => {
    setHamMenuOpen(true);
    console.log('ham', hamMenuOpen);
  };
  const handleOnClickCartMenu = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to view your cart', {
        action: {
          label: 'Sign In',
          onClick: () => {
            router.push('/auth');
          },
        },
      });
      return;
    }
    setCartMenuOpen(true);
  };

  const handleOnClickAccountMenu = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth');
    }
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link
          href={'/'}
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1 para">Home</span>
        </Link>
        <Link
          href={'#'}
          onClick={() => handleOnClickHamburgerMenu()}
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs mt-1 para">Menu</span>
        </Link>
        <Link
          href={'/shop'}
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <Grid className="w-6 h-6" />
          <span className="text-xs mt-1 para">Shop</span>
        </Link>
        <button
          onClick={() => handleOnClickCartMenu()}
          className="flex flex-col items-center text-gray-600 hover:text-black relative"
        >
          <ShoppingBag className="w-6 h-6" />
          {hasHydrated && getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
          <span className="text-xs mt-1 para">Cart</span>
        </button>{' '}
        <button
          onClick={() => handleOnClickAccountMenu()}
          className="flex flex-col items-center text-gray-600 hover:text-black"
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1 para">Account</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomBar;
