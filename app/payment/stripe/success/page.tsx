'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { handleOrderSuccess, handleOrderError } from '@/lib/order-utils';

function StripeSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment intent from URL
        const paymentIntent = searchParams.get('payment_intent');
        const orderData = searchParams.get('orderData');

        if (!paymentIntent || !orderData) {
          setStatus('error');
          setMessage('Invalid payment information');
          return;
        }

        // Verify payment with backend
        const response = await fetch('/api/payments/stripe/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_intent: paymentIntent,
            orderData: JSON.parse(decodeURIComponent(orderData)),
          }),
        });

        const result = await response.json();

        if (result.success) {
          // Use utility to handle success with dialog
          handleOrderSuccess({
            orderId: result.orderId || '',
            clearCart,
            router,
            showSuccessDialog: true, // Show success dialog
          });
        } else {
          setStatus('error');
          setMessage(result.error || 'Payment verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify payment');
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function StripeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing payment...</p>
          </div>
        </div>
      }
    >
      <StripeSuccessContent />
    </Suspense>
  );
}
