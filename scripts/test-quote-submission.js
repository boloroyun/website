// Test script for quote submission functionality
require('dotenv').config();
const fetch = require('node-fetch');

// Generate a valid MongoDB ObjectID (24 hex characters)
function generateValidObjectId() {
  const hexChars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return result;
}

const TEST_QUOTE_DATA = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '555-123-4567',
  zipCode: '12345',
  notes: 'This is a test quote submission from the test script.',
  productId: generateValidObjectId(), // Valid ObjectID format
  productName: 'Test Product',
  sku: 'TEST-SKU-123',
  timestamp: new Date().toISOString(),
};

async function testQuoteSubmission() {
  console.log('🧪 Starting quote submission test...');
  console.log('📦 Test data:', TEST_QUOTE_DATA);

  try {
    // Step 1: Test the fallback-create endpoint directly
    console.log('\n📝 Step 1: Testing fallback-create endpoint...');
    const fallbackResponse = await fetch(
      'http://localhost:3000/api/quotes/fallback-create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(TEST_QUOTE_DATA),
      }
    );

    const fallbackResult = await fallbackResponse.json();

    if (fallbackResponse.ok) {
      console.log('✅ Fallback endpoint test passed!');
      console.log('📄 Response:', fallbackResult);

      if (fallbackResult.quoteId) {
        console.log(`🆔 Created quote ID: ${fallbackResult.quoteId}`);
      }
    } else {
      console.error('❌ Fallback endpoint test failed!');
      console.error('📄 Response:', fallbackResult);
      return false;
    }

    // Step 2: Test the main quotes endpoint
    console.log('\n📝 Step 2: Testing main quotes endpoint...');
    const mainResponse = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...TEST_QUOTE_DATA,
        name: 'Test User (Main API)',
        email: 'test-main@example.com',
      }),
    });

    const mainResult = await mainResponse.json();

    if (mainResponse.ok) {
      console.log('✅ Main endpoint test passed!');
      console.log('📄 Response:', mainResult);

      if (mainResult.quoteId) {
        console.log(`🆔 Created quote ID: ${mainResult.quoteId}`);
      }
    } else {
      console.error('❌ Main endpoint test failed!');
      console.error('📄 Response:', mainResult);
      return false;
    }

    console.log(
      '\n🎉 All tests passed! Quote submission functionality is working correctly.'
    );
    return true;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testQuoteSubmission()
  .then((success) => {
    if (!success) {
      console.error('\n❌ Quote submission test failed!');
      process.exit(1);
    }
    console.log('\n✅ Quote submission test completed successfully!');
  })
  .catch((error) => {
    console.error('\n💥 Unhandled error in test script:', error);
    process.exit(1);
  });
