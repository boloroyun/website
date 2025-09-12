// Script to check if there are any orders in the database
const { PrismaClient } = require('@prisma/client');

async function checkOrders() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Connecting to database...');

    // Check database connection by counting users
    const userCount = await prisma.user.count();
    console.log(`✅ Database connection successful. Found ${userCount} users.`);

    // Count orders
    const orderCount = await prisma.order.count();
    console.log(`📦 Found ${orderCount} orders in the database.`);

    if (orderCount > 0) {
      // Get a sample of orders
      const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          total: true,
          status: true,
          createdAt: true,
        },
      });

      console.log('📋 Recent orders:');
      orders.forEach((order) => {
        console.log(
          `- Order ${order.id}: User ${order.userId}, Total $${order.total}, Status: ${order.status}, Created: ${order.createdAt}`
        );
      });

      // Check if there are any users with orders
      const usersWithOrders = await prisma.user.findMany({
        where: {
          orders: {
            some: {},
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        take: 5,
      });

      console.log('\n👤 Users with orders:');
      if (usersWithOrders.length > 0) {
        usersWithOrders.forEach((user) => {
          console.log(
            `- User ${user.id}: ${user.email || 'No email'} (${user.username || 'No username'}), Orders: ${user._count.orders}`
          );
        });
      } else {
        console.log('No users with orders found.');
      }
    }
  } catch (error) {
    console.error('❌ Error checking orders:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

checkOrders().catch(console.error);
