'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductSize {
  size: string;
  qty: number;
  price: number;
  sold: number;
}

interface ProductInteractionProps {
  selectedSize?: ProductSize;
  onAddToCart: (quantity: number, size?: ProductSize) => void;
}

const ProductInteraction= ({
  selectedSize,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    const maxQuantity = selectedSize?.qty || 999;
    setQuantity(Math.min(newQuantity, maxQuantity));
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedSize);
  };

  const maxQuantity = selectedSize?.qty || 999;
  const isOutOfStock = selectedSize && selectedSize.qty <= 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-0">
        <Button
          variant="outline"
          className="bg-[#F2F2F2]"
          size="icon"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center border-y-2 py-[6px]">{quantity}</span>
        <Button
          variant="outline"
          className="bg-[#F2F2F2]"
          size="icon"
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= maxQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Quantity Info */}
      {selectedSize && (
        <div className="text-sm text-gray-600">
          {maxQuantity <= 10 && maxQuantity > 0 && (
            <p className="text-orange-600">
              Only {maxQuantity} available in stock
            </p>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        className="w-full bg-black text-white gap-4 py-7"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
      </Button>
    </div>
  );
};

export default ProductInteraction;
