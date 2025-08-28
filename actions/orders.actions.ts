'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { CartItem } from '@/lib/cart-store';

const prisma = new PrismaClient();

// Get current user from cookies
async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
      return null;
    }

    const userData = JSON.parse(authToken.value);
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// CartItem interface is now imported from @/lib/cart-store

// Interface for shipping address
interface ShippingAddress {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Create new order
export async function createOrder(data: {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  couponApplied?: string;
  total: number;
  subtotal: number;
  discount?: number;
  shippingPrice?: number;
  taxPrice?: number;
}) {
  try {
    const currentUser = await getCurrentUser();
    console.log('🔍 Current user from cookie:', currentUser);

    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!currentUser.id) {
      console.error('❌ User ID is missing from cookie data:', currentUser);
      return { success: false, error: 'User ID not found in session' };
    }

    // Validate cart items
    if (!data.cartItems || data.cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Validate shipping address
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
      if (!(data.shippingAddress as any)[field]?.trim()) {
        return {
          success: false,
          error: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
        };
      }
    }

    // Convert cart items to order products
    const orderProducts = data.cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      size: item.size,
      qty: item.quantity,
      price: item.price,
      // Include completion tracking for orders
      productCompletedAt: null,
    }));

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: currentUser.id,
        products: orderProducts,
        shippingAddress: {
          firstName: data.shippingAddress.firstName.trim(),
          lastName: data.shippingAddress.lastName.trim(),
          phoneNumber: data.shippingAddress.phoneNumber.trim(),
          address1: data.shippingAddress.address1.trim(),
          address2: data.shippingAddress.address2?.trim() || '',
          city: data.shippingAddress.city.trim(),
          state: data.shippingAddress.state.trim(),
          zipCode: data.shippingAddress.zipCode.trim(),
          country: data.shippingAddress.country.trim(),
        },
        paymentMethod: data.paymentMethod,
        total: data.total,
        totalBeforeDiscount: data.subtotal,
        couponApplied: data.couponApplied || null,
        shippingPrice: data.shippingPrice || 0,
        taxPrice: data.taxPrice || 0,
        status: 'Processing',
        // Set isPaid to false for COD, true for other payment methods (when called from payment verification)
        isPaid: data.paymentMethod === 'cod' ? false : true,
        isNew: true,
        totalSaved: data.discount || 0,
        // Set paidAt only for non-COD orders
        paidAt: data.paymentMethod === 'cod' ? null : new Date(),
      },
    });

    console.log('✅ Order created successfully:', {
      orderId: order.id,
      userId: currentUser.id,
      total: data.total,
      itemCount: data.cartItems.length,
    });

    revalidatePath('/profile/orders');
    revalidatePath('/order');

    return {
      success: true,
      message: 'Order placed successfully',
      orderId: order.id,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate orderId format (MongoDB ObjectId)
    if (!orderId || orderId.length !== 24) {
      return { success: false, error: 'Invalid order ID' };
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: currentUser.id, // Ensure user can only access their own orders
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

// Update order status (admin function)
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Not authorized' };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    console.log('✅ Order status updated:', {
      orderId: order.id,
      newStatus: status,
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Order status updated successfully',
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}
