'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'sonner';
import SocialShare from '@/components/SocialShare';

const CartPage = () => {
  const { items, removeItem, updateQuantity, hasHydrated } = useCartStore();

  const handleRemoveItem = (uid: string, itemName: string) => {
    removeItem(uid);
    toast.success(`${itemName} removed from cart`);
  };

  const isCartEmpty = items.length === 0;
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  // Don't render until hydrated to prevent hydration mismatch
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Continue Shopping</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your
                cart
              </p>
            </div>
          </div>
          <ShoppingCart size={32} className="text-gray-400" />
        </div>

        {isCartEmpty ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start
                browsing our premium cabinets and stones!
              </p>
              <div className="space-y-4">
                <Link href="/products">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Browse All Products
                  </Button>
                </Link>
                <Link href="/products/cabinets">
                  <Button variant="outline" className="w-full">
                    Shop Cabinets
                  </Button>
                </Link>
                <Link href="/products/stones">
                  <Button variant="outline" className="w-full">
                    Shop Stones
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card
                  key={item.uid}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 md:w-30 md:h-30 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Size: {item.size}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.uid, item.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.uid, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="px-4 py-2 border border-gray-300 rounded-md text-center min-w-[60px] font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.uid, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxQuantity}
                            className="h-8 w-8 p-0"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Secure checkout with SSL encryption
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Need Help?</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span>📞</span>
                      <span>571-335-0118</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>📧</span>
                      <span>info@luxcabistones.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🏪</span>
                      <span>Visit our showroom</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">🚚</span>
              </div>
              <span className="text-sm font-medium">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">🛡️</span>
              </div>
              <span className="text-sm font-medium">15-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">⭐</span>
              </div>
              <span className="text-sm font-medium">Expert Installation</span>
            </div>
          </div>
        </div>

        {/* Social Share Section */}
        <div className="mt-8 text-center">
          <SocialShare
            variant="minimal"
            title="LUX Cabinets & Stones - Shopping Cart"
            description="Check out my cart from LUX Cabinets & Stones - Premium kitchen cabinets and stone surfaces."
            hashtags={['LUXCabinets', 'ShoppingCart', 'KitchenDesign']}
          />
        </div>
      </div>

      {/* Floating Social Share Button */}
      <SocialShare
        variant="floating"
        title="LUX Cabinets & Stones - Shopping Cart"
        description="Sharing my cart from LUX Cabinets & Stones - Premium kitchen cabinets and stone surfaces for dream homes."
        hashtags={['LUXCabinets', 'ShoppingCart', 'HomeImprovement']}
      />
    </div>
  );
};

export default CartPage;
