'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Lazy Prisma initialization
let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

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

// Update user information (username only)
export async function updateUserInfo(username: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!username.trim()) {
      return { success: false, error: 'Username is required' };
    }

    // Check if username is already taken by another user
    const existingUser = await getPrisma().user.findFirst({
      where: {
        username: username.trim(),
        id: { not: currentUser.id },
      },
    });

    if (existingUser) {
      return { success: false, error: 'Username is already taken' };
    }

    // Update user in database
    const updatedUser = await getPrisma().user.update({
      where: { id: currentUser.id },
      data: { username: username.trim() },
    });

    // Update cookies with new username
    const cookieStore = cookies();
    const updatedUserData = {
      ...currentUser,
      username: updatedUser.username,
    };

    // Update httpOnly cookie for server-side security
    cookieStore.set('auth-token', JSON.stringify(updatedUserData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Update client-accessible cookie for frontend state management
    cookieStore.set('auth-user', JSON.stringify(updatedUserData), {
      httpOnly: false, // Client can access this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    revalidatePath('/profile');

    console.log('✅ Username updated successfully:', {
      oldUsername: currentUser.username,
      newUsername: updatedUser.username,
      userId: currentUser.id,
    });

    return {
      success: true,
      message: 'Username updated successfully',
      user: updatedUserData,
    };
  } catch (error) {
    console.error('Error updating user info:', error);
    return { success: false, error: 'Failed to update user information' };
  }
}

// Get user orders
export async function getUserOrders() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const orders = await getPrisma().order.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

// Get user shipping address
export async function getUserShippingAddress() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const user = await getPrisma().user.findUnique({
      where: { id: currentUser.id },
      select: { address: true },
    });

    return { success: true, address: user?.address || null };
  } catch (error) {
    console.error('Error fetching shipping address:', error);
    return { success: false, error: 'Failed to fetch shipping address' };
  }
}

// Update user shipping address
export async function updateShippingAddress(addressData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate required fields
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
      if (!(addressData as any)[field]?.trim()) {
        return {
          success: false,
          error: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
        };
      }
    }

    // Update user address
    await getPrisma().user.update({
      where: { id: currentUser.id },
      data: {
        address: {
          firstName: addressData.firstName.trim(),
          lastName: addressData.lastName.trim(),
          phoneNumber: addressData.phoneNumber.trim(),
          address1: addressData.address1.trim(),
          address2: addressData.address2?.trim() || '',
          city: addressData.city.trim(),
          state: addressData.state.trim(),
          zipCode: addressData.zipCode.trim(),
          country: addressData.country.trim(),
          active: true,
        },
      },
    });

    revalidatePath('/profile');
    return { success: true, message: 'Shipping address updated successfully' };
  } catch (error) {
    console.error('Error updating shipping address:', error);
    return { success: false, error: 'Failed to update shipping address' };
  }
}
