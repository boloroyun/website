import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Build-safe Prisma initialization
let prisma: PrismaClient | null = null;
function getPrisma() {
  // Skip Prisma initialization during build time
  if (typeof window !== 'undefined') {
    throw new Error('Prisma should not be called on client side');
  }

  // Skip during build process
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    throw new Error('Prisma not available during build');
  }

  // Skip if no database URL is available
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not available, skipping Prisma initialization');
    throw new Error('DATABASE_URL not available');
  }

  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log:
          process.env.NODE_ENV === 'development'
            ? ['error', 'warn']
            : ['error'],
      });
    } catch (error) {
      console.error('Failed to initialize Prisma client:', error);
      throw new Error('Database connection failed');
    }
  }
  return prisma;
}

// Build-safe auth options configuration
export const authOptions: NextAuthOptions = {
  // Note: We don't use PrismaAdapter with credentials provider
  // The adapter is mainly for OAuth providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const prisma = getPrisma();

          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user object (without password)
          return {
            id: user.id,
            name: user.name || user.email.split('@')[0], // Fallback to email username if name is null
            email: user.email,
            role: user.role,
            image: user.image,
          };
        } catch (error: any) {
          console.error('Auth error:', error);

          // Provide more specific error messages
          if (error.message === 'No user found with this email') {
            throw new Error('No account found with this email address');
          } else if (error.message === 'Invalid password') {
            throw new Error('Incorrect password');
          } else {
            throw new Error('Authentication failed');
          }
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include role in JWT token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Include role and id in session
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect errors to signin page
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === 'production' ? undefined : 'dev-fallback-secret'),
  debug: process.env.NODE_ENV === 'development',
};

// Helper functions to get server session
// getServerSession is already imported above

// Auth function for App Router server components
export const auth = async () => await getServerSession(authOptions);

// Type definitions for extended session
declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    id: string;
  }
}
