/**
 * Crisp Database Helper
 *
 * Utility functions for querying and managing Crisp activity data
 */

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export interface CrispActivityQuery {
  event?: string;
  email?: string;
  sessionId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Get Crisp activities with optional filtering
 */
export async function getCrispActivities(query: CrispActivityQuery = {}) {
  const prismaInstance = getPrisma();

  const {
    event,
    email,
    sessionId,
    startDate,
    endDate,
    limit = 50,
    offset = 0,
  } = query;

  const where: any = {};

  if (event) {
    where.event = event;
  }

  if (email) {
    where.email = email;
  }

  if (sessionId) {
    where.sessionId = sessionId;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = startDate;
    }
    if (endDate) {
      where.createdAt.lte = endDate;
    }
  }

  try {
    const activities = await prismaInstance.crispActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prismaInstance.crispActivity.count({ where });

    return {
      activities,
      total,
      hasMore: offset + activities.length < total,
    };
  } catch (error) {
    console.error('Error fetching Crisp activities:', error);
    throw new Error('Failed to fetch Crisp activities');
  }
}

/**
 * Get activity statistics
 */
export async function getCrispActivityStats(days: number = 30) {
  const prismaInstance = getPrisma();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Total activities
    const totalActivities = await prismaInstance.crispActivity.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Activities by event type
    const eventStats = await prismaInstance.crispActivity.groupBy({
      by: ['event'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: {
        event: true,
      },
      orderBy: {
        _count: {
          event: 'desc',
        },
      },
    });

    // Unique users (emails)
    const uniqueUsers = await prismaInstance.crispActivity.findMany({
      where: {
        createdAt: { gte: startDate },
        email: { not: null },
      },
      select: { email: true },
      distinct: ['email'],
    });

    // Unique sessions
    const uniqueSessions = await prismaInstance.crispActivity.findMany({
      where: {
        createdAt: { gte: startDate },
        sessionId: { not: null },
      },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });

    return {
      totalActivities,
      uniqueUsers: uniqueUsers.length,
      uniqueSessions: uniqueSessions.length,
      eventBreakdown: eventStats.map((stat) => ({
        event: stat.event,
        count: stat._count.event,
      })),
      period: `${days} days`,
    };
  } catch (error) {
    console.error('Error fetching Crisp activity stats:', error);
    throw new Error('Failed to fetch Crisp activity statistics');
  }
}

/**
 * Get recent activities for a specific email
 */
export async function getUserCrispActivities(
  email: string,
  limit: number = 20
) {
  const prismaInstance = getPrisma();

  try {
    const activities = await prismaInstance.crispActivity.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return activities;
  } catch (error) {
    console.error('Error fetching user Crisp activities:', error);
    throw new Error('Failed to fetch user Crisp activities');
  }
}

/**
 * Clean up old Crisp activities (older than specified days)
 */
export async function cleanupOldActivities(olderThanDays: number = 90) {
  const prismaInstance = getPrisma();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  try {
    const result = await prismaInstance.crispActivity.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    console.log(`🧹 Cleaned up ${result.count} old Crisp activities`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up old Crisp activities:', error);
    throw new Error('Failed to cleanup old Crisp activities');
  }
}
