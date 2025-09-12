// Script to fix authentication cookies
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function fixAuthCookies() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Looking for a valid user with orders...');

    // Find a user with orders
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
        role: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      take: 1,
    });

    if (usersWithOrders.length === 0) {
      console.log('❌ No users with orders found in the database');
      return;
    }

    const user = usersWithOrders[0];
    console.log(`✅ Found user ${user.id} with ${user._count.orders} orders`);

    // Create cookie data
    const authTokenCookie = `auth-token=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
    const authUserCookie = `auth-user=${JSON.stringify({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    })}; Path=/; SameSite=Lax; Max-Age=2592000`;

    // Generate a script to set cookies
    const cookieScript = `
// Run this in your browser's console when on your website
document.cookie = '${authTokenCookie}';
document.cookie = '${authUserCookie}';
console.log('✅ Authentication cookies set successfully!');
console.log('Please refresh the page to apply the changes.');
    `.trim();

    // Write to a file
    const outputPath = path.join(__dirname, 'fix-cookies.js');
    fs.writeFileSync(outputPath, cookieScript);

    console.log(`
✅ Cookie fix script generated at: ${outputPath}

INSTRUCTIONS:
1. Open your website in the browser
2. Open the browser's developer tools (F12 or right-click > Inspect)
3. Go to the Console tab
4. Copy and paste the contents of the fix-cookies.js file
5. Press Enter to run the script
6. Refresh the page

This will set valid authentication cookies for user: ${user.email} (${user.username})
    `);
  } catch (error) {
    console.error('❌ Error fixing auth cookies:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAuthCookies().catch(console.error);
