'use client';

import React from 'react';
import Link from 'next/link';

interface QuoteButtonFixedProps {
  productData: {
    id: string;
    title: string;
    sku: string;
  };
  className?: string;
}

export default function QuoteButtonFixed({
  productData,
  className = '',
}: QuoteButtonFixedProps) {
  // Direct link to quote page instead of modal
  return (
    <Link
      href={`/quote?productId=${productData.id}&productName=${encodeURIComponent(productData.title)}&sku=${encodeURIComponent(productData.sku)}`}
      className={`${className} inline-block w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center text-lg rounded-md shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50`}
    >
      Get a Quote Now
    </Link>
  );
}
