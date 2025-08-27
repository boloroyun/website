import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = (): PrismaClient => new PrismaClient();

type GlobalPrisma = { prisma?: PrismaClient };
const globalForPrisma = globalThis as unknown as GlobalPrisma;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
