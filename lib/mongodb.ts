import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000; // 1 second

export async function connectWithRetry(
  retries = MAX_RETRIES
): Promise<PrismaClient> {
  if (prisma) {
    return prisma;
  }

  try {
    console.log('Attempting to connect to Prisma...');
    const client = new PrismaClient();
    await client.$connect();
    console.log('Prisma connected successfully!');
    prisma = client;
    return client;
  } catch (error) {
    console.error('Prisma connection failed:', error);
    if (retries > 0) {
      console.log(
        `Retrying connection in ${RETRY_DELAY_MS / 1000} seconds... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectWithRetry(retries - 1);
    } else {
      console.error('Max retries reached. Failed to connect to Prisma.');
      throw new Error('Failed to connect to database after multiple retries.');
    }
  }
}

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    // In development, use a global variable to prevent multiple PrismaClient instances
    // from being created during hot-reloads, which can exhaust database connections.
    if (process.env.NODE_ENV === 'development') {
      if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
      }
      prisma = (global as any).prisma;
    } else {
      prisma = new PrismaClient();
    }
  }
  return prisma!;
}

// For use in serverless environments
export async function connectToDB() {
  try {
    const client = await connectWithRetry();
    return client;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Optional: Disconnect Prisma client on application shutdown
export async function disconnectPrismaClient() {
  if (prisma) {
    console.log('Disconnecting Prisma client...');
    await prisma.$disconnect();
    prisma = undefined;
    console.log('Prisma client disconnected.');
  }
}

// Ensure graceful shutdown in Next.js development
if (process.env.NODE_ENV === 'development') {
  process.on('beforeExit', disconnectPrismaClient);
  process.on('SIGINT', disconnectPrismaClient);
  process.on('SIGTERM', disconnectPrismaClient);
}
