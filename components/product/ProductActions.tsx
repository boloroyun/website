'use client';

import React, { useState } from 'react';
import SizeSelector from './SizeSelector';
import ProductInteraction from './ProductInteraction';
import { useCartStore } from '@/lib/cart-store';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { cartMenuState } from '../store';
import QuoteButtonFixed from './QuoteButtonFixed';

interface ProductSize {
  size: string;
  qty: number;
  price: number;
  sold: number;
}

interface ProductActionsProps {
  sizes: ProductSize[];
  pricingType?: string;
  productData?: {
    id: string;
    title: string;
    slug: string;
    images: Array<{ url: string; public_id: string }>;
  };
}

const ProductActions= ({
  sizes,
  pricingType,
  productData,
}) => {
  const { addItem } = useCartStore();
  const { isAuthenticated, isLoading } = useOTPAuth();
  const params = useParams();
  const [, setCartMenuOpen] = useAtom(cartMenuState);
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    sizes.length > 0 ? sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSize(size);
    // Reset quantity to 1 when size changes and ensure it doesn't exceed available quantity
    const maxQty = size.qty;
    setQuantity(1);
    if (quantity > maxQty) {
      setQuantity(Math.max(1, Math.min(quantity, maxQty)));
    }
  };

  // Update quantity when selectedSize changes
  React.useEffect(() => {
    if (selectedSize && quantity > selectedSize.qty) {
      setQuantity(Math.max(1, selectedSize.qty));
    }
  }, [selectedSize, quantity]);

  const handleQuantityChange = (delta: number) => {
    if (!selectedSize) return;

    const newQuantity = Math.max(1, quantity + delta);
    const maxQuantity = selectedSize.qty;
    setQuantity(Math.min(newQuantity, maxQuantity));
  };

  const handleAddToCart = () => {
    if (pricingType === 'quote') {
      // Handle quote request
      toast.success("Quote request submitted! We'll contact you soon.");
      return;
    }

    if (pricingType === 'gallery') {
      // Handle gallery view - could scroll to gallery section or show images
      toast.info('Viewing gallery images for this product.');
      // Could implement gallery functionality here
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size first!');
      return;
    }

    if (!productData) {
      toast.error('Product information not available.');
      return;
    }

    // Get the first image or fallback
    const productImage = productData.images?.[0]?.url || '';

    // Add item to cart
    addItem({
      productId: productData.id,
      name: productData.title,
      price: selectedSize.price,
      quantity: quantity,
      size: selectedSize.size,
      maxQuantity: selectedSize.qty,
      image: productImage,
      slug: productData.slug,
    });

    // Show success message
    const successMessage = `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`;
    const toastAction = isAuthenticated
      ? {
          label: 'View Cart',
          onClick: () => setCartMenuOpen(true),
        }
      : {
          label: 'Sign In to Checkout',
          onClick: () => {
            // Trigger the account popup/login modal
            const accountEvent = new CustomEvent('open-account-popup');
            window.dispatchEvent(accountEvent);
          },
        };

    toast.success(successMessage, { action: toastAction });
  };

  // If it's a quote product with no sizes, show only the quote button
  if (pricingType === 'quote' && (!sizes || sizes.length === 0)) {
    return (
      <div className="space-y-4">
        {productData && (
          <QuoteButtonFixed
            productData={{
              id: productData.id,
              title: productData.title,
              sku: productData?.slug || '', // Using slug as fallback if no SKU is available
            }}
            className="w-full"
          />
        )}
      </div>
    );
  }

  // If it's a gallery product, show only the view gallery button
  if (pricingType === 'gallery') {
    const handleViewGallery = () => {
      window.location.href = '/category/project-gallery';
    };

    return (
      <div className="space-y-4">
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
          onClick={handleViewGallery}
        >
          VIEW GALLERY
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <SizeSelector
          sizes={sizes}
          onSizeSelect={handleSizeSelect}
          selectedSize={selectedSize}
        />
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        {/* Quantity Selector - Only show for fixed pricing products */}
        {pricingType === 'fixed' && (
          <div className="flex items-center gap-0">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="bg-[#F2F2F2] border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              -
            </button>
            <span className="w-16 text-center border-y border-gray-300 py-2 bg-white">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={!selectedSize || quantity >= selectedSize.qty}
              className="bg-[#F2F2F2] border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
        )}

        {/* Stock Info */}
        {selectedSize && pricingType === 'fixed' && (
          <div className="text-sm text-gray-600">
            {selectedSize.qty <= 10 && selectedSize.qty > 0 && (
              <p className="text-orange-600">
                Only {selectedSize.qty} available in stock
              </p>
            )}
            {selectedSize.qty === 0 && (
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}
          </div>
        )}

        {/* Add to Cart Button or Quote Button */}
        {pricingType === 'quote' && productData ? (
          <QuoteButtonFixed
            productData={{
              id: productData.id,
              title: productData.title,
              sku: productData?.slug || '', // Using slug as fallback if no SKU is available
            }}
            className="w-full"
          />
        ) : (
          <button
            className={`w-full py-4 px-6 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
              pricingType === 'gallery'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            onClick={handleAddToCart}
            disabled={
              pricingType === 'fixed' &&
              (!selectedSize || selectedSize.qty === 0)
            }
          >
            {pricingType === 'gallery'
              ? 'VIEW GALLERY'
              : !selectedSize
                ? 'SELECT SIZE'
                : selectedSize.qty === 0
                  ? 'OUT OF STOCK'
                  : 'ADD TO CART'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
