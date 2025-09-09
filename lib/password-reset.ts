import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Hash a token using SHA256
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Validate password strength
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  // Optional: Add special character validation if desired
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   return 'Password must contain at least one special character.';
  // }
  return null;
}

export async function createPasswordResetToken(
  userId: string
): Promise<{ token: string; expires: Date }> {
  const prismaInstance = getPrisma();

  try {
    // Delete any existing unexpired tokens for this user to prevent spam and ensure single active token
    await prismaInstance.passwordResetToken.deleteMany({
      where: {
        userId,
        expires: { gt: new Date() },
        usedAt: null,
      },
    });

    // Implement basic throttling: allow max 3 unexpired tokens per user
    const existingTokensCount = await prismaInstance.passwordResetToken.count({
      where: {
        userId,
        expires: { gt: new Date() },
        usedAt: null,
      },
    });

    const MAX_UNEXPIRED_TOKENS = 3;
    if (existingTokensCount >= MAX_UNEXPIRED_TOKENS) {
      // Delete the oldest unexpired tokens to make space
      const oldestTokens = await prismaInstance.passwordResetToken.findMany({
        where: {
          userId,
          expires: { gt: new Date() },
          usedAt: null,
        },
        orderBy: { createdAt: 'asc' },
        take: existingTokensCount - MAX_UNEXPIRED_TOKENS + 1, // Delete enough to get below limit
      });

      if (oldestTokens.length > 0) {
        await prismaInstance.passwordResetToken.deleteMany({
          where: {
            id: { in: oldestTokens.map((t) => t.id) },
          },
        });
        console.warn(
          `⚠️ Throttling: Deleted ${oldestTokens.length} oldest password reset tokens for user ${userId}`
        );
      }
    }

    // Generate token and expiration (1 hour from now)
    const token = crypto.randomBytes(32).toString('base64url'); // URL-safe base64
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prismaInstance.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expires,
      },
    });

    console.log('✅ Password reset token created for user:', userId);
    return { token, expires };
  } catch (error: any) {
    console.error('❌ Failed to create password reset token:', error);
    throw new Error('Failed to create password reset token.');
  } finally {
    await prismaInstance.$disconnect();
  }
}

export async function verifyPasswordResetToken(
  token: string
): Promise<{ userId: string } | null> {
  const prismaInstance = getPrisma();

  try {
    const tokenHash = hashToken(token);
    const resetToken = await prismaInstance.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expires: { gt: new Date() }, // Not expired
        usedAt: null, // Not used
      },
    });

    if (!resetToken) {
      console.warn(
        '⚠️ Invalid, expired, or already used password reset token.'
      );
      return null;
    }

    console.log(
      '✅ Valid password reset token verified for user:',
      resetToken.userId
    );
    return { userId: resetToken.userId };
  } catch (error: any) {
    console.error('❌ Failed to verify password reset token:', error);
    throw new Error('Failed to verify password reset token.');
  } finally {
    await prismaInstance.$disconnect();
  }
}

export async function markTokenUsed(token: string): Promise<void> {
  const prismaInstance = getPrisma();

  try {
    const tokenHash = hashToken(token);
    const result = await prismaInstance.passwordResetToken.updateMany({
      where: { tokenHash },
      data: { usedAt: new Date() },
    });

    if (result.count === 0) {
      throw new Error('Token not found or already used.');
    }

    console.log('✅ Password reset token marked as used');
  } catch (error: any) {
    console.error('❌ Failed to mark token as used:', error);
    throw new Error('Failed to mark token as used.');
  } finally {
    await prismaInstance.$disconnect();
  }
}

export async function cleanupExpiredTokens(): Promise<number> {
  const prismaInstance = getPrisma();

  try {
    const result = await prismaInstance.passwordResetToken.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      console.log(
        `🧹 Cleaned up ${result.count} expired password reset tokens`
      );
    }

    return result.count;
  } catch (error: any) {
    console.error('❌ Failed to cleanup expired tokens:', error);
    throw new Error('Failed to cleanup expired tokens.');
  } finally {
    await prismaInstance.$disconnect();
  }
}

export async function getTokenStats(userId: string) {
  const prismaInstance = getPrisma();

  try {
    const now = new Date();
    const total = await prismaInstance.passwordResetToken.count({
      where: { userId },
    });
    const active = await prismaInstance.passwordResetToken.count({
      where: { userId, expires: { gt: now }, usedAt: null },
    });
    const expired = await prismaInstance.passwordResetToken.count({
      where: { userId, expires: { lt: now }, usedAt: null },
    });
    const used = await prismaInstance.passwordResetToken.count({
      where: { userId, usedAt: { not: null } },
    });

    return {
      total,
      active,
      expired,
      used,
    };
  } catch (error: any) {
    console.error('❌ Failed to get token stats:', error);
    throw new Error('Failed to retrieve token statistics.');
  } finally {
    await prismaInstance.$disconnect();
  }
}
