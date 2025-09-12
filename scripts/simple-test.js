// Simple script to test the orders API
const fetch = require('node-fetch');

async function testOrdersAPI() {
  try {
    console.log('🔍 Testing orders API...');

    // Create cookie data for a known user with orders
    const userId = '68a13ec0703ecaee644cefc3'; // From our previous test
    const authTokenCookie = `auth-token=${userId}; Path=/; HttpOnly; SameSite=Lax`;
    const authUserCookie = `auth-user=${JSON.stringify({
      id: userId,
      email: 'boogii333888@gmail.com',
      username: 'vip',
      role: 'CLIENT',
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
  }
}

testOrdersAPI().catch(console.error);
