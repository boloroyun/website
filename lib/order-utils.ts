/**
 * Order utilities for handling post-checkout operations
 */

import { toast } from 'sonner';

export interface OrderRedirectParams {
  orderId: string;
  clearCart: () => void;
  router: any;
  showSuccessToast?: boolean;
  showSuccessDialog?: boolean;
}

/**
 * Handles the post-order operations including cart clearing and redirect
 * @param params - Order redirect parameters
 */
export const handleOrderSuccess = ({
  orderId,
  clearCart,
  router,
  showSuccessToast = false,
  showSuccessDialog = true,
}: OrderRedirectParams) => {
  try {
    // Clear the cart silently
    clearCart();

    // Show success notification
    if (showSuccessDialog) {
      toast.success('🎉 Order created successfully!', {
        description: `Order #${orderId.slice(-8)} has been placed and confirmed.`,
        duration: 4000,
      });
    } else if (showSuccessToast) {
      toast.success('Order placed successfully!');
    }

    // Small delay to let user see the success message, then redirect
    setTimeout(() => {
      router.push(`/order/${orderId}`);
    }, 1000);
  } catch (error) {
    console.error('Error in order success handling:', error);
    // Still redirect even if there's an error
    setTimeout(() => {
      router.push(`/order/${orderId}`);
    }, 1000);
  }
};

/**
 * Handles order failure scenarios
 * @param error - Error message
 * @param router - Next.js router
 */
export const handleOrderError = (error: string, router?: any) => {
  toast.error(error || 'Failed to place order');

  // Optionally redirect back to checkout on critical errors
  if (error.includes('authentication') || error.includes('session')) {
    router?.push('/checkout');
  }
};
