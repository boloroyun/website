'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import QuoteModal from '@/components/QuoteModal';

interface GetQuoteButtonProps {
  productData: {
    id: string;
    title: string;
    sku: string;
  };
  className?: string;
}

export default function GetQuoteButton({
  productData,
  className = '',
}: GetQuoteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Add debugging to help identify click issues
  const handleButtonClick = (e: any) => {
    console.log('Quote button clicked!');
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event propagation
    openModal();
  };

  return (
    <>
      {/* Use a regular button element instead of the shadcn Button component */}
      <button
        type="button"
        onClick={handleButtonClick}
        className={`${className} bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium cursor-pointer`}
      >
        Get a Quote Now
      </button>

      <QuoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        productData={productData}
      />
    </>
  );
}
