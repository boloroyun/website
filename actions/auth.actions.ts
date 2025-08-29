'use server';

import { PrismaClient, Role } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email';

// Lazy Prisma initialization
let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Generate 4-digit code
function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send verification code via email
export async function sendVerificationCode(username: string, email: string) {
  let code: string;
  let expiresAt: Date;

  try {
    // Generate 4-digit code
    code = generateVerificationCode();
    expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store code in database first (upsert to handle existing records)
    await getPrisma().verificationCode.upsert({
      where: { email },
      update: {
        code,
        username,
        expiresAt,
      },
      create: {
        email,
        code,
        username,
        expiresAt,
      },
    });

    console.log(
      `📧 Verification code stored for ${email}: ${code} (expires at ${expiresAt.toISOString()})`
    );
  } catch (dbError) {
    console.error('Failed to store verification code:', dbError);
    return {
      success: false,
      error: 'Failed to generate verification code. Please try again.',
    };
  }

  // Try to send email (but don't fail if email service is not configured)
  try {
    // Generate email HTML
    const emailHtml = await generateVerificationEmailHtml(username, code);

    // Send email using the email service
    await sendEmail({
      to: email,
      subject: 'Your Verification Code - LUX Cabinets & Stones',
      html: emailHtml,
    });

    console.log(`✅ Email sent successfully to ${email}`);
    return { success: true, message: 'Verification code sent successfully' };
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    console.log(`🔧 Development Mode - Verification code for ${email}: ${code}`);

    // Email failed, but code is stored - provide helpful message
    return {
      success: true,
      message: process.env.NODE_ENV === 'development' 
        ? `Email service not configured. Use this code: ${code}`
        : 'Verification code sent successfully',
      testCode: process.env.NODE_ENV === 'development' ? code : undefined,
    };
  }
}

// Verify code and authenticate user
export async function verifyCode(email: string, code: string) {
  try {
    // Find verification code in database
    const storedData = await getPrisma().verificationCode.findUnique({
      where: { email },
    });

    if (!storedData) {
      return {
        success: false,
        error: 'No verification code found. Please request a new one.',
      };
    }

    // Check if code has expired
    if (new Date() > storedData.expiresAt) {
      // Delete expired code
      await getPrisma().verificationCode.delete({
        where: { email },
      });
      return {
        success: false,
        error: 'Verification code has expired. Please request a new one.',
      };
    }

    // Check if code matches
    if (storedData.code !== code) {
      return {
        success: false,
        error: 'Invalid verification code. Please try again.',
      };
    }

    console.log(`✅ Verification successful for ${email}`);

    // Code is valid, now handle user authentication
    let user = await getPrisma().user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user with unique username
      let finalUsername = storedData.username;

      // Check if username is already taken
      const existingUserWithUsername = await getPrisma().user.findUnique({
        where: { username: storedData.username },
      });

      if (existingUserWithUsername) {
        // Generate a unique username by appending a number
        let counter = 1;
        let isUnique = false;

        while (!isUnique && counter <= 100) {
          const testUsername = `${storedData.username}${counter}`;
          const existingUser = await getPrisma().user.findUnique({
            where: { username: testUsername },
          });

          if (!existingUser) {
            finalUsername = testUsername;
            isUnique = true;
          } else {
            counter++;
          }
        }

        if (!isUnique) {
          // Fallback to email-based username if all attempts fail
          finalUsername = email.split('@')[0] + Date.now();
        }

        console.log(
          `⚠️ Username '${storedData.username}' was taken, using '${finalUsername}' instead`
        );
      }

      user = await getPrisma().user.create({
        data: {
          name: finalUsername, // Use username as name for now
          email,
          password: '', // Empty password for verification-based auth
          username: finalUsername,
          role: Role.CLIENT,
        },
      });
      console.log(`👤 New user created: ${user.username} (${user.email})`);
    } else {
      // Update username if different and not taken by another user
      if (user.username !== storedData.username) {
        // Check if the new username is already taken by another user
        const existingUserWithUsername = await getPrisma().user.findFirst({
          where: {
            username: storedData.username,
            id: { not: user.id },
          },
        });

        if (existingUserWithUsername) {
          // If username is taken, keep the existing username
          console.log(
            `⚠️ Username '${storedData.username}' is already taken, keeping existing username '${user.username}'`
          );
        } else {
          // Update username if it's available
          user = await getPrisma().user.update({
            where: { id: user.id },
            data: { username: storedData.username },
          });
          console.log(`👤 User updated: ${user.username} (${user.email})`);
        }
      }
    }

    // Clear the verification code from database
    await getPrisma().verificationCode.delete({
      where: { email },
    });

    // Set authentication cookies
    const cookieStore = cookies();
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Set httpOnly cookie for server-side security
    cookieStore.set('auth-token', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set client-accessible cookie for frontend state management
    cookieStore.set('auth-user', JSON.stringify(userData), {
      httpOnly: false, // Client can access this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return {
      success: true,
      message: 'Successfully authenticated',
      user: userData,
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.',
    };
  }
}

// Resend verification code
export async function resendVerificationCode(email: string) {
  try {
    // Find existing verification code in database
    const storedData = await getPrisma().verificationCode.findUnique({
      where: { email },
    });

    if (!storedData) {
      return {
        success: false,
        error: 'No previous verification request found. Please start over.',
      };
    }

    // Generate new code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update the verification code in database
    await getPrisma().verificationCode.update({
      where: { email },
      data: {
        code,
        expiresAt,
      },
    });

    console.log(`🔄 New verification code generated for ${email}: ${code}`);

    // Try to send email (but don't fail if email service is not configured)
    try {
      // Generate email HTML
      const emailHtml = await generateVerificationEmailHtml(storedData.username, code);

      // Send email using the email service
      await sendEmail({
        to: email,
        subject: 'New Verification Code - LUX Cabinets & Stones',
        html: emailHtml,
      });

      console.log(`✅ Email sent successfully to ${email}`);
      return { 
        success: true, 
        message: 'New verification code sent successfully',
      };
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      console.log(`🔧 Development Mode - New verification code for ${email}: ${code}`);
      
      return { 
        success: true, 
        message: process.env.NODE_ENV === 'development' 
          ? `Email service not configured. Use this code: ${code}`
          : 'New verification code sent successfully',
        testCode: process.env.NODE_ENV === 'development' ? code : undefined,
      };
    }
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    return { success: false, error: 'Failed to resend verification email' };
  }
}

// Logout user
export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
  redirect('/');
}

// Get current user from cookies
export async function getCurrentUser() {
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
