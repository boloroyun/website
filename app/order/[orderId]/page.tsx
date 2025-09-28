'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Truck,
  MapPin,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  Star,
  Copy,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import SocialShare from '@/components/SocialShare';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useOTPAuth();
  const [order, setOrder] = useState(null as any);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  const orderId = params.orderId as string;

  const loadOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/order/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrder(result.order);
      } else {
        setError(result.error || 'Order not found');
      }
    } catch (error) {
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (isAuthenticated && orderId) {
      loadOrder();
    }
  }, [isAuthenticated, authLoading, orderId, router, loadOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success('Order ID copied to clipboard');
  };

  const handleContactSupport = async () => {
    if (!order) return;

    setIsSendingSupport(true);
    try {
      // Create a default support message with order context
      const defaultMessage = `Hello,

I need assistance with my order #${order.id.slice(-8)}.

Order Details:
- Order Date: ${formatDate(order.createdAt)}
- Total Amount: ${formatCurrency(order.total)}
- Status: ${order.status}
- Payment Method: ${order.paymentMethod}

Please help me with: [Please describe your issue here]

Thank you for your assistance.`;

      const response = await fetch('/api/contact/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: `Support Request for Order #${order.id.slice(-8)}`,
          message: defaultMessage,
          orderId: order.id,
          customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          customerEmail: '', // Will use authenticated user's email from cookies
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('📧 Support request sent successfully!', {
          description:
            'Our team will respond within 24 hours to help with your order.',
          duration: 5000,
        });
      } else {
        toast.error('Failed to send support request', {
          description:
            result.error || 'Please try again or contact us directly.',
        });
      }
    } catch (error) {
      console.error('Error sending support request:', error);
      toast.error('Failed to send support request', {
        description:
          'Please try again or contact us directly at info@luxcabistones.com',
      });
    } finally {
      setIsSendingSupport(false);
    }
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['processing', 'shipped', 'delivered'];
    const currentIndex = statuses.findIndex((s) => s === status?.toLowerCase());
    return {
      progress:
        currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0,
      steps: statuses.map((s, index) => ({
        name: s.charAt(0).toUpperCase() + s.slice(1),
        completed: index <= currentIndex,
        current: index === currentIndex,
      })),
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/profile')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusProgress = getStatusProgress(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="mb-6 hover:bg-white/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>

          {/* Order Header Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Order #{order.id.slice(-8)}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyOrderId}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title="Copy Order ID"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  Total: {formatCurrency(order.total)}
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="font-semibold text-lg">{order.status}</span>
                </div>

                {/* Order Progress Bar */}
                <div className="w-full lg:w-80">
                  <div className="flex justify-between mb-2">
                    {statusProgress.steps.map((step, index) => (
                      <div
                        key={step.name}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            step.completed
                              ? 'bg-green-600'
                              : step.current
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                          }`}
                        />
                        <span className="text-xs mt-1 text-gray-600">
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${statusProgress.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xl">Order Items</span>
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      {order.products.length} item
                      {order.products.length > 1 ? 's' : ''} ordered
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {order.products.map((product: any, index: number) => (
                    <div
                      key={`${product.productId}-${index}`}
                      className="group"
                    >
                      <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name || 'Product'}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          {/* Quantity Badge */}
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                            {product.qty}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                              <span className="font-medium">Size:</span>
                              <span className="ml-1">{product.size}</span>
                            </span>
                            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                              <span className="font-medium">Qty:</span>
                              <span className="ml-1">{product.qty}</span>
                            </span>
                          </div>
                          {/* Individual Price */}
                          <p className="text-sm text-gray-500">
                            {formatCurrency(product.price)} each
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right space-y-1">
                          <p className="font-bold text-xl text-gray-900">
                            {formatCurrency(product.price * product.qty)}
                          </p>
                          {product.qty > 1 && (
                            <p className="text-sm text-gray-500">
                              {product.qty} × {formatCurrency(product.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      {index < order.products.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Track Order
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Star className="mr-2 h-4 w-4" />
                      Rate Products
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-xl">Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 space-y-3">
                  <p className="font-bold text-lg text-gray-900">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-medium">
                      {order.shippingAddress.address1}
                    </p>
                    {order.shippingAddress.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p className="font-medium">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  {order.shippingAddress.phoneNumber && (
                    <div className="flex items-center mt-4 pt-3 border-t border-gray-200">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">
                        {order.shippingAddress.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-xl">Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        order.totalBeforeDiscount ||
                          order.total - order.shippingPrice - order.taxPrice
                      )}
                    </span>
                  </div>

                  {order.totalSaved > 0 && (
                    <div className="flex justify-between items-center py-2 text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -{formatCurrency(order.totalSaved)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {order.shippingPrice === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatCurrency(order.shippingPrice)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">
                      {formatCurrency(order.taxPrice || 0)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  {order.totalSaved > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          You saved {formatCurrency(order.totalSaved)} on this
                          order!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-xl">Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold capitalize bg-gray-100 px-3 py-1 rounded-full">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold ${
                        order.isPaid
                          ? 'text-green-700 bg-green-100'
                          : 'text-red-700 bg-red-100'
                      }`}
                    >
                      {order.isPaid ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
                    </span>
                  </div>

                  {order.isPaid && order.paidAt && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Paid On</span>
                      <span className="font-semibold">
                        {formatDate(order.paidAt)}
                      </span>
                    </div>
                  )}

                  {order.couponApplied && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Coupon Applied</span>
                      <span className="font-semibold text-green-600">
                        {order.couponApplied}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Phone className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-xl">Need Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-semibold">571-335-0118</p>
                      <p className="text-sm text-gray-600">Call us anytime</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-semibold">info@luxcabistones.com</p>
                      <p className="text-sm text-gray-600">Email support</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-blue-800 text-sm">
                      Our customer service team is here to help with any
                      questions about your order. We typically respond within 24
                      hours.
                    </p>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={handleContactSupport}
                    disabled={isSendingSupport}
                  >
                    {isSendingSupport ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {isSendingSupport ? 'Sending...' : 'Contact Support'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Social Share Button */}
      <SocialShare
        variant="floating"
        title={`Order #${order.id.slice(-8)} - LUX Cabinets & Stones`}
        description={`Check out my order from LUX Cabinets & Stones! ${order.products.length} item${order.products.length > 1 ? 's' : ''} ordered for ${formatCurrency(order.total)}.`}
        hashtags={['LUXCabinets', 'OrderUpdate', 'HomeImprovement']}
      />
    </div>
  );
}
