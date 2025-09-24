// Simple script to test the API routes
// Run with: node scripts/test-api-routes.js

const fetch = require('node-fetch');

async function testApiRoutes() {
  console.log('Testing API routes...');

  try {
    // Test topbars API
    console.log('\nTesting /api/topbars:');
    const topbarsResponse = await fetch('http://localhost:3000/api/topbars');
    const topbarsData = await topbarsResponse.json();

    console.log('Status:', topbarsResponse.status);
    console.log('Success:', topbarsData.success);
    console.log('Data count:', topbarsData.data ? topbarsData.data.length : 0);

    // Test navigation API
    console.log('\nTesting /api/navigation:');
    const navResponse = await fetch('http://localhost:3000/api/navigation');
    const navData = await navResponse.json();

    console.log('Status:', navResponse.status);
    console.log('Success:', navData.success);
    console.log('Data count:', navData.data ? navData.data.length : 0);

    console.log('\nAPI testing complete!');
  } catch (error) {
    console.error('Error testing API routes:', error);
  }
}

testApiRoutes();
