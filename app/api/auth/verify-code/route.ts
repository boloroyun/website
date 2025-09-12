import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Declare prisma at the outermost scope so it's accessible in the catch block
  let prisma: import('@prisma/client').PrismaClient | null = null;

  try {
    const { email, code } = await req.json();

    console.log(
      `Received verification request for email: ${email}, code: ${code}`
    );

    if (!email || !code) {
      console.log('Missing email or code in request');
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      console.log(`Invalid code format: ${code}`);
      return NextResponse.json(
        { success: false, error: 'Code must be 4 digits' },
        { status: 400 }
      );
    }

    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');

    try {
      console.log('Initializing Prisma client');
      prisma = new PrismaClient();
      console.log('Successfully initialized Prisma client');
    } catch (prismaError) {
      console.error('Failed to initialize Prisma client:', prismaError);
      throw new Error(
        `Database connection error: ${prismaError instanceof Error ? prismaError.message : 'Unknown error'}`
      );
    }

    // Find verification code in database
    console.log(`Searching for verification code for email: ${email}`);

    let storedData;
    try {
      storedData = await prisma.verificationCode.findUnique({
        where: { email },
      });

      console.log(
        storedData
          ? `Found verification data for ${email}: expires at ${storedData.expiresAt}`
          : `No verification data found for ${email}`
      );
    } catch (dbError) {
      console.error('Database query error:', dbError);
      throw new Error(
        `Database query failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`
      );
    }

    if (!storedData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No verification code found. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (new Date() > storedData.expiresAt) {
      // Delete expired code
      await prisma.verificationCode.delete({
        where: { email },
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Verification code has expired. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Check if code matches
    console.log(
      `Comparing stored code: ${storedData.code} with submitted code: ${code}`
    );

    if (storedData.code !== code) {
      console.log(
        `Code mismatch - stored: ${storedData.code}, submitted: ${code}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid verification code. Please try again.',
        },
        { status: 400 }
      );
    }

    console.log('Verification code matches!');

    console.log(`✅ Verification successful for ${email}`);

    // Code is valid, now handle user authentication
    let user;

    // First, check if the user exists at all using a count operation
    // This avoids any issues with null fields in the user record
    try {
      const userCount = await prisma.user.count({
        where: { email },
      });

      console.log(`Found ${userCount} users with email: ${email}`);

      if (userCount > 0) {
        // User exists, now fetch their data safely
        try {
          // Try to find existing user, with safer query that doesn't select the password field
          const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              role: true,
              // Intentionally NOT selecting password field to avoid null issues
            },
          });

          if (existingUser) {
            // User exists, use their info but skip the problematic password field
            user = existingUser;
            console.log(
              `Found existing user: ${user.username} (${user.email})`
            );
          } else {
            // This is a rare case where count found a user but findUnique couldn't retrieve it
            console.log(
              `Strange: Count found user with email ${email} but findUnique returned null`
            );
            // Use a minimal user object to prevent creation attempt
            user = {
              id: 'unknown',
              email,
              username: email.split('@')[0],
              role: 'CLIENT',
            };
          }
        } catch (fetchError) {
          console.error('Error fetching existing user details:', fetchError);
          // Use a minimal user object to prevent creation attempt
          user = {
            id: 'unknown',
            email,
            username: email.split('@')[0],
            role: 'CLIENT',
          };
        }
      } else {
        console.log(`No existing user found for email: ${email}`);
        user = null; // Will be handled by the next section
      }
    } catch (userQueryError) {
      console.error('Error querying for existing user:', userQueryError);
      // To avoid unique constraint violations, assume user might exist
      // Use a minimal user object to prevent creation attempt
      user = {
        id: 'unknown',
        email,
        username: email.split('@')[0],
        role: 'CLIENT',
      };
    }

    if (!user) {
      // Create new user with unique username
      let finalUsername = storedData.username;

      // Check if username is already taken
      const existingUserWithUsername = await prisma.user.findUnique({
        where: { username: storedData.username },
      });

      if (existingUserWithUsername) {
        // Generate a unique username by appending a number
        let counter = 1;
        let isUnique = false;

        while (!isUnique && counter <= 100) {
          const testUsername = `${storedData.username}${counter}`;
          const existingUser = await prisma.user.findUnique({
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

      // Generate a random password for verification-based auth
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).toUpperCase().slice(-4) +
        '!1';
      console.log(`Generated random password for new user: ${email}`);

      // Import bcrypt to hash the password
      const bcrypt = await import('bcryptjs');
      // Hash the password with 10 salt rounds (standard)
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          name: finalUsername, // Use username as name for now
          email,
          password: hashedPassword, // Hashed random password for verification-based auth
          username: finalUsername,
          role: Role.CLIENT,
        },
      });
      console.log(`👤 New user created: ${user.username} (${user.email})`);
    } else {
      // Skip username updates if we're using a placeholder user object
      if (user.id === 'unknown') {
        console.log(
          `Using placeholder user object for ${user.email}, skipping username update`
        );
      }
      // Only attempt to update username if this is a real user with valid ID
      else if (user.username !== storedData.username) {
        // Check if the new username is already taken by another user
        try {
          const existingUserWithUsername = await prisma.user.findFirst({
            where: {
              username: storedData.username,
              id: { not: user.id },
            },
            select: { id: true }, // Only select the id to avoid password issues
          });

          if (!existingUserWithUsername) {
            // Username is available, update it safely
            try {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { username: storedData.username },
                select: {
                  // Only select the fields we need
                  id: true,
                  name: true,
                  email: true,
                  username: true,
                  role: true,
                },
              });
              console.log(
                `👤 Updated username for ${user.email}: ${user.username}`
              );
            } catch (updateError) {
              console.error(
                `Failed to update username for ${user.email}:`,
                updateError
              );
              // Continue with existing user data, don't fail the whole process
            }
          } else {
            console.log(
              `Username ${storedData.username} is already taken by another user, keeping existing username`
            );
          }
        } catch (usernameCheckError) {
          console.error(
            'Error checking for username availability:',
            usernameCheckError
          );
          // Continue with existing username
        }
      }
      console.log(
        `👤 Existing user logged in: ${user.username} (${user.email})`
      );
    }

    // Clean up verification code
    await prisma.verificationCode.delete({
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

    // Set user data cookie (7 days)
    cookieStore.set('auth-user', JSON.stringify(userData), {
      httpOnly: false, // Accessible to client-side JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Set auth token cookie (7 days)
    cookieStore.set('auth-token', user.id, {
      httpOnly: true, // More secure, not accessible to client-side JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log(`🍪 Authentication cookies set for user: ${user.username}`);

    // Disconnect Prisma client
    try {
      await prisma.$disconnect();
      console.log('Prisma client disconnected successfully');
    } catch (disconnectError) {
      console.error('Error disconnecting Prisma client:', disconnectError);
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: userData,
    });
  } catch (error) {
    console.error('Verify code API error:', error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Attempt to disconnect Prisma client if it was initialized
    if (prisma) {
      try {
        await prisma.$disconnect();
        console.log('Prisma client disconnected after error');
      } catch (disconnectError) {
        console.error(
          'Error disconnecting Prisma client after error:',
          disconnectError
        );
      }
    }

    // Send a more descriptive error message in development
    if (process.env.NODE_ENV === 'development') {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        {
          success: false,
          error: 'Verification failed: ' + errorMessage,
          details: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    // In production, still return a generic message
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
