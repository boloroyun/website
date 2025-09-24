'use client';

import QuoteFormWithAPI from '@/components/quote/QuoteFormWithAPI';
import { useSearchParams } from 'next/navigation';

export default function QuotePage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const sku = searchParams.get('sku');

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {productName ? `Request Quote for ${productName}` : 'Request a Quote'}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below and our team will get back to you with pricing
          and availability information.
        </p>

        <QuoteFormWithAPI
          productName={productName || undefined}
          productId={productId || undefined}
          sku={sku || undefined}
        />
      </div>
    </main>
  );
}
