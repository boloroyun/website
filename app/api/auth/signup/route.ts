import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      const body = await request.json();
      const { name, email, password } = body;

      // Validation
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: 'Name, email, and password are required' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase()
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with CLIENT role (default)
      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          password: hashedPassword,
          role: Role.CLIENT, // Default role for website signup
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      });

      console.log('✅ New user created:', { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        },
        { status: 201 }
      );

    } finally {
      // Always disconnect Prisma client
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Signup error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to create account. Please try again.',
      },
      { status: 500 }
    );
  }
}
