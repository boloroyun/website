import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP for secure storage
function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Create and store OTP for email login
export async function createLoginOTP(
  email: string
): Promise<{ otp: string; expires: Date }> {
  const prismaInstance = getPrisma();

  try {
    // Clean up old OTPs for this email (older than 1 hour)
    await prismaInstance.loginOTP.deleteMany({
      where: {
        email: email.toLowerCase(),
        createdAt: {
          lt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        },
      },
    });

    // Check rate limiting - max 3 active OTPs per email
    const activeOTPs = await prismaInstance.loginOTP.count({
      where: {
        email: email.toLowerCase(),
        expires: { gt: new Date() },
        usedAt: undefined, // MongoDB requires undefined, not null
      },
    });

    if (activeOTPs >= 3) {
      throw new Error(
        'Too many OTP requests. Please wait before requesting a new code.'
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // OTP created successfully

    // Store OTP in database
    await prismaInstance.loginOTP.create({
      data: {
        email: email.toLowerCase(),
        otpHash,
        expires,
      },
    });

    console.log(`✅ Login OTP created for ${email} (expires in 5 minutes)`);
    return { otp, expires };
  } catch (error: any) {
    console.error('❌ Failed to create login OTP:', error);
    throw new Error(error.message || 'Failed to create login OTP');
  } finally {
    await prismaInstance.$disconnect();
  }
}

// Verify OTP for email login
export async function verifyLoginOTP(
  email: string,
  otp: string
): Promise<{ valid: boolean; userId?: string }> {
  const prismaInstance = getPrisma();

  // Don't disconnect in this function - let the caller handle it

  try {
    const otpHash = hashOTP(otp);

    // Find the OTP record
    const otpRecord = await prismaInstance.loginOTP.findFirst({
      where: {
        email: email.toLowerCase(),
        otpHash,
        expires: { gt: new Date() }, // Not expired
        usedAt: undefined, // Not used (MongoDB requires undefined, not null)
      },
    });

    if (!otpRecord) {
      // Increment attempts for any matching email/OTP combination
      await prismaInstance.loginOTP.updateMany({
        where: {
          email: email.toLowerCase(),
          expires: { gt: new Date() },
          usedAt: undefined, // MongoDB requires undefined, not null
        },
        data: {
          attempts: { increment: 1 },
        },
      });

      console.warn(`⚠️ Invalid OTP attempt for ${email}`);
      return { valid: false };
    }

    // Check if too many attempts
    if (otpRecord.attempts >= 3) {
      console.warn(`⚠️ Too many OTP attempts for ${email}`);
      return { valid: false };
    }

    // Mark OTP as used
    await prismaInstance.loginOTP.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() },
    });

    console.log(`✅ Valid OTP verified for ${email}`);
    return { valid: true };
  } catch (error: any) {
    console.error('❌ Failed to verify login OTP:', error);
    return { valid: false };
  } finally {
    // Don't disconnect here - let the caller handle it
    // await prismaInstance.$disconnect();
  }
}

// Clean up expired OTPs (can be called periodically)
export async function cleanupExpiredOTPs(): Promise<number> {
  const prismaInstance = getPrisma();

  try {
    const result = await prismaInstance.loginOTP.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      console.log(`🧹 Cleaned up ${result.count} expired login OTPs`);
    }

    return result.count;
  } catch (error: any) {
    console.error('❌ Failed to cleanup expired OTPs:', error);
    throw new Error('Failed to cleanup expired OTPs');
  } finally {
    await prismaInstance.$disconnect();
  }
}

// Get OTP statistics for an email (for debugging)
export async function getOTPStats(email: string) {
  const prismaInstance = getPrisma();

  try {
    const now = new Date();
    const total = await prismaInstance.loginOTP.count({
      where: { email: email.toLowerCase() },
    });
    const active = await prismaInstance.loginOTP.count({
      where: {
        email: email.toLowerCase(),
        expires: { gt: now },
        usedAt: undefined, // MongoDB requires undefined, not null
      },
    });
    const expired = await prismaInstance.loginOTP.count({
      where: {
        email: email.toLowerCase(),
        expires: { lt: now },
        usedAt: undefined, // MongoDB requires undefined, not null
      },
    });
    const used = await prismaInstance.loginOTP.count({
      where: {
        email: email.toLowerCase(),
        usedAt: { not: null },
      },
    });

    return { total, active, expired, used };
  } catch (error: any) {
    console.error('❌ Failed to get OTP stats:', error);
    throw new Error('Failed to retrieve OTP statistics');
  } finally {
    await prismaInstance.$disconnect();
  }
}
