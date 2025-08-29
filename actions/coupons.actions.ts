'use server';

import { PrismaClient } from '@prisma/client';

// Lazy Prisma initialization
let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Validate and apply coupon
export async function validateCoupon(couponCode: string) {
  try {
    if (!couponCode.trim()) {
      return { success: false, error: 'Please enter a coupon code' };
    }

    // Find the coupon by code (case-insensitive)
    const coupon = await getPrisma().coupon.findFirst({
      where: {
        coupon: {
          equals: couponCode.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (!coupon) {
      return { success: false, error: 'Invalid coupon code' };
    }

    // Check if coupon is within valid date range
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (currentDate < startDate) {
      return { success: false, error: 'This coupon is not yet valid' };
    }

    if (currentDate > endDate) {
      return { success: false, error: 'This coupon has expired' };
    }

    console.log('✅ Coupon validated successfully:', {
      couponCode: coupon.coupon,
      discount: coupon.discount,
      validFrom: coupon.startDate,
      validTo: coupon.endDate,
    });

    return {
      success: true,
      coupon: {
        code: coupon.coupon,
        discount: coupon.discount,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
      },
      message: `Coupon applied! You saved ${coupon.discount}%`,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { success: false, error: 'Failed to validate coupon' };
  }
}

// Calculate discount amount
export async function calculateDiscount(subtotal: number, couponCode: string) {
  try {
    const result = await validateCoupon(couponCode);

    if (!result.success || !result.coupon) {
      return { success: false, error: result.error };
    }

    const discountAmount = (subtotal * result.coupon.discount) / 100;
    const total = subtotal - discountAmount;

    return {
      success: true,
      discount: {
        percentage: result.coupon.discount,
        amount: discountAmount,
        total: Math.max(0, total), // Ensure total doesn't go negative
        couponCode: result.coupon.code,
      },
    };
  } catch (error) {
    console.error('Error calculating discount:', error);
    return { success: false, error: 'Failed to calculate discount' };
  }
}

// Get all active coupons (admin function)
export async function getActiveCoupons() {
  try {
    const currentDate = new Date();

    const coupons = await getPrisma().coupon.findMany({
      where: {
        endDate: {
          gte: currentDate.toISOString(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, coupons };
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return { success: false, error: 'Failed to fetch coupons' };
  }
}
