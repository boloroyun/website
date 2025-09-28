'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { cartMenuState } from './store';
import { useCartStore } from '@/lib/cart-store';
import { getBestSellers } from '@/actions/products.actions';
import { toast } from 'sonner';

interface RecommendedProduct {
  id: string;
  title: string;
  images: { url: string | null }[];
  slug: string;
}

const CartDrawer = () => {
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState);
  const { items, removeItem, updateQuantity, hasHydrated } = useCartStore();
  const [recommendedProducts, setRecommendedProducts] = useState([] as RecommendedProduct[]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const result = await getBestSellers(4);
        // Only log in debug mode
        if (process.env.DEBUG_LOGS === '1') {
          console.log('CartDrawer - Recommended products:', result);
        }
        if (result.success && result.data) {
          setRecommendedProducts(
            result.data.map((product: any) => ({
              id: product.id,
              title: product.title,
              images: product.images,
              slug: product.slug,
            }))
          );
        }
      } catch (error) {
        // Silent error handling to avoid console spam
      }
    };
    fetchRecommendedProducts();
  }, []);

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  // Only log in debug mode
  if (process.env.DEBUG_LOGS === '1') {
    console.log(
      'CartDrawer - Current recommended products:',
      recommendedProducts
    );
  }

  const handleOnClickCartMenu = () => {
    setCartMenuOpen(true);
  };

  const handleRemoveItem = (uid: string, itemName: string) => {
    removeItem(uid);
    toast.success(`${itemName} removed from cart`);
  };

  const handleContinueShopping = () => {
    setCartMenuOpen(false);
  };

  return (
    <div className="relative">
      <Sheet open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={() => handleOnClickCartMenu()}
            variant={'ghost'}
            size={'icon'}
            className="relative"
          >
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px] h-[20px]">
              {hasHydrated ? items.length : 0}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px] flex flex-col">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">
                Shopping Cart
              </SheetTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {hasHydrated ? items.length : 0} item
                  {items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 h-full">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-center mb-6">
                  Add some products to get started!
                </p>
                <Button
                  onClick={handleContinueShopping}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pr-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {items.map((item: any) => (
                  <div
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    key={item.uid}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleRemoveItem(item.uid, item.name)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove item"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                              onClick={() =>
                                updateQuantity(item.uid, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-2 text-sm font-medium border-x border-gray-300 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                              onClick={() =>
                                updateQuantity(item.uid, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">
                                ${item.price.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Products */}
            {items.length > 0 && recommendedProducts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  You might also like
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {recommendedProducts.map((product) => (
                    <Link
                      href={`/product/${product.slug}`}
                      key={product.id}
                      className="flex-shrink-0 w-28 group"
                      onClick={() => setCartMenuOpen(false)}
                    >
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors">
                        <Image
                          src={product.images[0]?.url || ''}
                          alt={product.title}
                          width={112}
                          height={112}
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-xs text-gray-700 mt-2 truncate group-hover:text-blue-600">
                        {product.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 pt-4 bg-white">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Tax included. Shipping calculated at checkout.
                </p>

                <div className="space-y-2">
                  <a href="/checkout">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                      onClick={() => setCartMenuOpen(false)}
                    >
                      Proceed to Checkout
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;
