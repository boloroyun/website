// Script to test the orders API
const fetch = require('node-fetch');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { PrismaClient } = require('@prisma/client');

async function testOrdersAPI() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing orders API...');

    // First check if we have any orders
    const orderCount = await prisma.order.count();
    console.log(`📊 Found ${orderCount} orders in the database`);

    if (orderCount === 0) {
      console.log('❌ No orders found in the database');
      return;
    }

    // Get a sample order
    const sampleOrder = await prisma.order.findFirst({
      select: {
        id: true,
        userId: true,
        total: true,
      },
    });

    console.log(
      `✅ Found order ${sampleOrder.id} for user ${sampleOrder.userId}`
    );

    // Get the user for this order
    const user = await prisma.user.findUnique({
      where: { id: sampleOrder.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      console.log(`❌ User ${sampleOrder.userId} not found in the database`);
      return;
    }

    console.log(`✅ Found user ${user.id} with ${user._count.orders} orders`);

    // Create cookie data
    const authTokenCookie = `auth-token=${userWithOrders.id}; Path=/; HttpOnly; SameSite=Lax`;
    const authUserCookie = `auth-user=${JSON.stringify({
      id: userWithOrders.id,
      email: userWithOrders.email,
      username: userWithOrders.username,
      role: userWithOrders.role,
    })}; Path=/; SameSite=Lax`;

    const cookieHeader = `${authTokenCookie}; ${authUserCookie}`;

    // Make the request to the API
    console.log('🌐 Making request to orders API with valid cookies...');
    const response = await fetch('http://localhost:3000/api/profile/orders', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    console.log(`🌐 API Response Status: ${response.status}`);

    const data = await response.json();
    console.log('📊 API Response Data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log(`✅ Successfully fetched ${data.orders.length} orders`);
    } else {
      console.log(`❌ Failed to fetch orders: ${data.error}`);
    }

    // Now try the debug endpoint
    console.log('\n🔍 Testing debug auth endpoint...');
    const debugResponse = await fetch('http://localhost:3000/api/debug/auth', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    console.log(`🌐 Debug API Response Status: ${debugResponse.status}`);

    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log(
        '📊 Debug API Response Data:',
        JSON.stringify(debugData, null, 2)
      );
    } else {
      console.log('❌ Debug API request failed');
    }
  } catch (error) {
    console.error('❌ Error testing orders API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersAPI().catch(console.error);
