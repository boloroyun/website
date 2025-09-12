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

  return (
    <>
      <Button
        onClick={openModal}
        className={`${className} bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded`}
      >
        Get Quote Right Now
      </Button>

      <QuoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        productData={productData}
      />
    </>
  );
}
