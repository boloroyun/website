'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  CreditCard,
  Truck,
  ShoppingBag,
  Tag,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import { getUserShippingAddress } from '@/actions/profile.actions';
import { createOrder } from '@/actions/orders.actions';
import { validateCoupon, calculateDiscount } from '@/actions/coupons.actions';
import { toast } from 'sonner';
import {
  US_STATES,
  COUNTRIES,
  formatPhoneNumber,
  validateZipCode,
} from '@/lib/address-data';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import CityAutocomplete from '@/components/CityAutocomplete';
import ZipCodeInput from '@/components/ZipCodeInput';
import Image from 'next/image';
import { handleOrderSuccess, handleOrderError } from '@/lib/order-utils';

// Interface for shipping address
interface ShippingAddress {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Main CheckoutPage component with Shopify-like design
 */
const CheckoutPage = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, hasHydrated } =
    useCartStore();

  // State management
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [hasExistingAddress, setHasExistingAddress] = useState(false);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 0; // Free shipping
  const taxRate = 0.08; // 8% tax
  const taxAmount = (subtotal - discount) * taxRate;
  const total = subtotal - discount + shippingCost + taxAmount;

  // Get button text based on payment method
  const getButtonText = () => {
    switch (paymentMethod) {
      case 'razorpay':
        return 'Pay with Razorpay';
      case 'stripe':
        return 'Pay with Stripe';
      case 'cod':
        return 'Continue with COD';
      default:
        return 'Place Order';
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirect if cart is empty (after hydration) - but not during order placement or after completion
  useEffect(() => {
    if (
      hasHydrated &&
      items.length === 0 &&
      !isPlacingOrder &&
      !orderCompleted
    ) {
      toast.error('Your cart is empty. Redirecting to shop...');
      setTimeout(() => router.push('/shop'), 2000);
    }
  }, [hasHydrated, items.length, router, isPlacingOrder, orderCompleted]);

  // Load shipping address
  const loadShippingAddress = useCallback(async () => {
    setIsLoadingAddress(true);
    try {
      const result = await getUserShippingAddress();
      if (result.success && result.address) {
        setShippingAddress({
          firstName: result.address.firstName || '',
          lastName: result.address.lastName || '',
          phoneNumber: result.address.phoneNumber || '',
          address1: result.address.address1 || '',
          address2: result.address.address2 || '',
          city: result.address.city || '',
          state: result.address.state || '',
          zipCode: result.address.zipCode || '',
          country: result.address.country || 'US',
        });
        setHasExistingAddress(true);
      }
    } catch (error) {
      console.error('Error loading shipping address:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadShippingAddress();
    }
  }, [isAuthenticated, loadShippingAddress]);

  // Handle phone number formatting
  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    setShippingAddress((prev) => ({ ...prev, phoneNumber: formatted }));
  }, []);

  // Handle address autocomplete selection
  const handleAddressSelect = useCallback((suggestion: any) => {
    setShippingAddress((prev) => ({
      ...prev,
      address1: suggestion.address,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
    }));
  }, []);

  // Handle ZIP code location found
  const handleZipCodeLocationFound = useCallback(
    (location: { city: string; state: string; stateCode: string }) => {
      setShippingAddress((prev) => ({
        ...prev,
        city: location.city,
        state: location.stateCode,
      }));
    },
    []
  );

  // Handle city selection
  const handleCitySelect = useCallback((cityData: any) => {
    setShippingAddress((prev) => ({
      ...prev,
      city: cityData.city,
      state: cityData.stateCode,
      zipCode: prev.zipCode || cityData.zipCodes[0] || '',
    }));
  }, []);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await calculateDiscount(subtotal, couponCode);
      if (result.success && result.discount) {
        setAppliedCoupon(result.discount);
        setDiscount(result.discount.amount);
        toast.success(
          `Coupon applied! You saved $${result.discount.amount.toFixed(2)}`
        );
      } else {
        toast.error(result.error || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'address1',
      'city',
      'state',
      'zipCode',
      'country',
    ];

    for (const field of requiredFields) {
      const fieldValue = shippingAddress[field as keyof ShippingAddress];
      if (!fieldValue?.trim()) {
        toast.error(
          `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
        );
        return false;
      }
    }

    if (
      shippingAddress.country === 'US' &&
      !validateZipCode(shippingAddress.zipCode)
    ) {
      toast.error('Please enter a valid US ZIP code');
      return false;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    return true;
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async () => {
    try {
      const orderData = {
        cartItems: items,
        shippingAddress,
        paymentMethod: 'razorpay',
        couponApplied: appliedCoupon?.couponCode || undefined,
        total,
        subtotal,
        discount,
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
      };

      const response = await fetch('/api/payments/razorpay/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          orderData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // For now, simulate successful Razorpay payment and proceed to verification
        toast.info('Simulating Razorpay payment completion...');

        // Simulate payment response
        const mockPaymentResponse = {
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_order_id: result.orderId,
          razorpay_signature: `signature_${Date.now()}`,
        };

        // Verify payment immediately (in real implementation, this would be called by Razorpay webhook)
        await verifyRazorpayPayment(mockPaymentResponse, orderData);

        // TODO: Replace with actual Razorpay integration
        // const options = {
        //   key: result.key,
        //   amount: result.amount,
        //   currency: result.currency,
        //   name: 'LUX Cabinets & Stones',
        //   description: 'Order Payment',
        //   order_id: result.orderId,
        //   handler: async (response) => {
        //     await verifyRazorpayPayment(response, orderData);
        //   },
        // };
        // const rzp = new window.Razorpay(options);
        // rzp.open();
      } else {
        toast.error(result.error || 'Failed to initialize Razorpay payment');
      }
    } catch (error) {
      toast.error('Failed to initialize Razorpay payment');
    }
  };

  // Verify Razorpay payment
  const verifyRazorpayPayment = async (
    paymentResponse: any,
    orderData: any
  ) => {
    try {
      const response = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentResponse,
          orderData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Set order completed flag to prevent cart redirect
        setOrderCompleted(true);
        // Use utility to handle success with dialog
        handleOrderSuccess({
          orderId: result.orderId || '',
          clearCart,
          router,
          showSuccessDialog: true, // Show success dialog
        });
      } else {
        handleOrderError(result.error || 'Payment verification failed');
      }
    } catch (error) {
      toast.error('Failed to verify payment');
    }
  };

  // Initialize Stripe payment
  const initializeStripePayment = async () => {
    try {
      const orderData = {
        cartItems: items,
        shippingAddress,
        paymentMethod: 'stripe',
        couponApplied: appliedCoupon?.couponCode || undefined,
        total,
        subtotal,
        discount,
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
      };

      const response = await fetch('/api/payments/stripe/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          orderData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // For now, simulate successful Stripe payment and redirect to success page
        toast.info('Simulating Stripe payment completion...');

        // Simulate successful payment by redirecting to success page with mock payment intent
        const mockPaymentIntent = `pi_${Date.now()}`;
        const orderDataEncoded = encodeURIComponent(JSON.stringify(orderData));
        const successUrl = `/payment/stripe/success?payment_intent=${mockPaymentIntent}&orderData=${orderDataEncoded}`;

        // Redirect to success page which will handle verification and redirect to order page
        router.push(successUrl);

        // TODO: Replace with actual Stripe Elements integration
        // const stripe = await loadStripe(result.publishableKey);
        // const { error } = await stripe.confirmPayment({
        //   elements,
        //   confirmParams: {
        //     return_url: `${window.location.origin}/payment/stripe/success?orderData=${encodeURIComponent(JSON.stringify(orderData))}`,
        //   },
        // });
        // if (error) {
        //   toast.error(error.message || 'Payment failed');
        // } else {
        //   // Payment successful, will be redirected to success page
        // }
      } else {
        toast.error(result.error || 'Failed to initialize Stripe payment');
      }
    } catch (error) {
      toast.error('Failed to initialize Stripe payment');
    }
  };

  // Place order for COD
  const placeCODOrder = async () => {
    const orderData = {
      cartItems: items,
      shippingAddress,
      paymentMethod: 'cod',
      couponApplied: appliedCoupon?.couponCode || undefined,
      total,
      subtotal,
      discount,
      shippingPrice: shippingCost,
      taxPrice: taxAmount,
    };

    const result = await createOrder(orderData);
    if (result.success) {
      // Set order completed flag to prevent cart redirect
      setOrderCompleted(true);
      // Use utility to handle success with dialog
      handleOrderSuccess({
        orderId: result.orderId || '',
        clearCart,
        router,
        showSuccessDialog: true, // Show success dialog
      });
    } else {
      handleOrderError(result.error || 'Failed to place order');
    }
  };

  // Handle payment action based on selected method
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);
    try {
      switch (paymentMethod) {
        case 'razorpay':
          await initializeRazorpayPayment();
          break;
        case 'stripe':
          await initializeStripePayment();
          break;
        case 'cod':
          await placeCODOrder();
          break;
        default:
          toast.error('Please select a valid payment method');
      }
    } catch (error) {
      toast.error('Failed to process payment');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Left Side - Forms */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Shipping Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAddress ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading address...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={shippingAddress.phoneNumber}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="(555) 123-4567"
                          maxLength={17}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={shippingAddress.country}
                          onValueChange={(value) =>
                            setShippingAddress({
                              ...shippingAddress,
                              country: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <AddressAutocomplete
                          label="Address Line 1"
                          value={shippingAddress.address1}
                          onChange={(value) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address1: value,
                            })
                          }
                          onAddressSelect={handleAddressSelect}
                          placeholder="Start typing your street address..."
                          id="address1"
                          country={shippingAddress.country}
                          currentCity={shippingAddress.city}
                          currentState={shippingAddress.state}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address2">
                          Address Line 2 (Optional)
                        </Label>
                        <Input
                          id="address2"
                          value={shippingAddress.address2}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address2: e.target.value,
                            })
                          }
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      <div>
                        <CityAutocomplete
                          label="City"
                          value={shippingAddress.city}
                          onChange={(value) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: value,
                            })
                          }
                          onCitySelect={handleCitySelect}
                          placeholder="Enter city name..."
                          id="city"
                          country={shippingAddress.country}
                          stateCode={shippingAddress.state}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {shippingAddress.country === 'US' ? (
                          <Select
                            value={shippingAddress.state}
                            onValueChange={(value) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem
                                  key={state.value}
                                  value={state.value}
                                >
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id="state"
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: e.target.value,
                              })
                            }
                            placeholder="Enter state/province"
                          />
                        )}
                      </div>
                      <div>
                        <ZipCodeInput
                          label={
                            shippingAddress.country === 'US'
                              ? 'ZIP Code'
                              : 'Postal Code'
                          }
                          value={shippingAddress.zipCode}
                          onChange={(value) =>
                            setShippingAddress({
                              ...shippingAddress,
                              zipCode: value,
                            })
                          }
                          onLocationFound={handleZipCodeLocationFound}
                          placeholder={
                            shippingAddress.country === 'US'
                              ? 'Enter ZIP code'
                              : 'Enter postal code'
                          }
                          id="zipCode"
                          country={shippingAddress.country}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <Label htmlFor="razorpay" className="cursor-pointer">
                          Razorpay (Cards, UPI, Wallets)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        <Label htmlFor="stripe" className="cursor-pointer">
                          Stripe (International Cards)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Truck className="h-5 w-5 text-green-600" />
                        <Label htmlFor="cod" className="cursor-pointer">
                          Cash on Delivery (COD)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.uid}
                          className="flex items-center space-x-4"
                        >
                          <div className="relative">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium">
                              {item.name} - {item.size}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon Section */}
                    <div className="border-t pt-4">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {appliedCoupon.couponCode}
                            </span>
                            <span className="text-sm text-green-600">
                              (-${appliedCoupon.amount.toFixed(2)})
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="coupon">Discount Code</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="coupon"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Enter coupon code"
                            />
                            <Button
                              variant="outline"
                              onClick={handleApplyCoupon}
                              disabled={isApplyingCoupon}
                            >
                              {isApplyingCoupon ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Apply'
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Totals */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>
                          {shippingCost === 0 ? 'Free' : `$${shippingCost}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || items.length === 0}
                      className="w-full mt-6"
                      size="lg"
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {paymentMethod === 'cod'
                            ? 'Placing Order...'
                            : 'Processing Payment...'}
                        </>
                      ) : (
                        `${getButtonText()} - $${total.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
