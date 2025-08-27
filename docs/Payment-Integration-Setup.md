# Payment Integration Setup Guide

This guide explains how to set up payment integrations for Razorpay, Stripe, and Cash on Delivery (COD).

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## Payment Flow

### 1. Razorpay Integration

1. **Initialize Payment**: `/api/payments/razorpay/initialize`
   - Creates Razorpay order
   - Returns order ID and amount

2. **Payment Verification**: `/api/payments/razorpay/verify`
   - Verifies payment signature
   - Creates order in database
   - Sets `isPaid: true`

### 2. Stripe Integration

1. **Initialize Payment**: `/api/payments/stripe/initialize`
   - Creates Stripe PaymentIntent
   - Returns client secret

2. **Payment Verification**: `/api/payments/stripe/verify`
   - Verifies payment status
   - Creates order in database
   - Sets `isPaid: true`

### 3. Cash on Delivery (COD)

- **Direct Order Creation**: Creates order immediately
- Sets `isPaid: false`
- No payment gateway interaction required

## Implementation Status

### ✅ Completed Features

- [x] Payment method selection (Razorpay, Stripe, COD)
- [x] API routes for payment initialization
- [x] API routes for payment verification
- [x] COD order creation with `isPaid: false`
- [x] Dynamic button text based on payment method
- [x] Order creation with proper payment status

### 🚧 Pending Implementation

- [ ] Actual Razorpay SDK integration
- [ ] Actual Stripe SDK integration
- [ ] Payment gateway callback handling
- [ ] Error handling for failed payments
- [ ] Payment retry mechanisms

## Next Steps

### For Razorpay:

1. Install Razorpay SDK:

   ```bash
   npm install razorpay
   ```

2. Uncomment the integration code in:
   - `/app/api/payments/razorpay/initialize/route.ts`
   - `/app/api/payments/razorpay/verify/route.ts`
   - `/app/checkout/page.tsx` (Razorpay frontend integration)

### For Stripe:

1. Install Stripe SDK:

   ```bash
   npm install stripe @stripe/stripe-js @stripe/react-stripe-js
   ```

2. Uncomment the integration code in:
   - `/app/api/payments/stripe/initialize/route.ts`
   - `/app/api/payments/stripe/verify/route.ts`
   - `/app/checkout/page.tsx` (Stripe Elements integration)

## Testing

### Test COD Flow:

1. Add items to cart
2. Go to checkout
3. Select "Cash on Delivery"
4. Fill shipping address
5. Click "Continue with COD"
6. Order should be created with `isPaid: false`

### Test Payment Gateway Flow:

1. Add items to cart
2. Go to checkout
3. Select "Razorpay" or "Stripe"
4. Fill shipping address
5. Click "Pay with [Gateway]"
6. Payment initialization should work (currently shows info message)

## Database Schema

Orders are created with the following payment-related fields:

```typescript
{
  paymentMethod: 'razorpay' | 'stripe' | 'cod',
  isPaid: boolean, // false for COD, true for successful payments
  paidAt: Date | null, // null for COD, payment date for others
  razorpay_order_id?: string,
  razorpay_payment_id?: string,
  // Stripe fields can be added similarly
}
```
