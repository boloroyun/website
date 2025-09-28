'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProductSize {
  size: string;
  qty: number;
  price: number;
  sold: number;
}

interface SizeSelectorProps {
  sizes: ProductSize[];
  onSizeSelect: (size: ProductSize) => void;
  selectedSize?: ProductSize;
}

const SizeSelector= ({
  sizes,
  onSizeSelect,
  selectedSize,
}) => {
  const [activeSize, setActiveSize] = useState(
    (selectedSize || null) as ProductSize | null
  );

  const handleSizeClick = (size: ProductSize) => {
    setActiveSize(size);
    onSizeSelect(size);
  };

  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size, index) => {
          const isSelected = activeSize?.size === size.size;
          const isOutOfStock = size.qty <= 0;

          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              disabled={isOutOfStock}
              onClick={() => handleSizeClick(size)}
              className={`
                min-w-[60px] h-10 
                ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }
                ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed line-through'
                    : ''
                }
              `}
            >
              {size.size}
              {isOutOfStock && (
                <span className="ml-1 text-xs">(Out of Stock)</span>
              )}
            </Button>
          );
        })}
      </div>

      {activeSize && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">
            Price: ${activeSize.price.toFixed(2)}
          </span>
          {activeSize.qty <= 5 && activeSize.qty > 0 && (
            <span className="ml-3 text-orange-600 font-medium">
              Only {activeSize.qty} left in stock!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
