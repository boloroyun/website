// Test script for the "Get a Quote Now" button functionality
require('dotenv').config();
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function testQuoteButton() {
  console.log('🧪 Starting quote button test...');

  try {
    // Step 1: Test the GetQuoteButton component
    console.log('\n📝 Step 1: Testing direct quote submission...');

    const testQuoteData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-123-4567',
      zipCode: '12345',
      notes: 'This is a test quote submission from the test script.',
      productId: generateValidObjectId(), // Generate a valid MongoDB ObjectID
      productName: 'Test Product',
      sku: 'TEST-SKU-123',
      timestamp: new Date().toISOString(),
    };

    console.log('📦 Test data:', testQuoteData);

    // Test the direct API endpoint
    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testQuoteData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Direct quote submission test passed!');
      console.log('📄 Response:', result);

      if (result.quoteId) {
        console.log(`🆔 Created quote ID: ${result.quoteId}`);
      }
    } else {
      console.error('❌ Direct quote submission test failed!');
      console.error('📄 Response:', result);
      return false;
    }

    console.log('\n✅ Quote button functionality test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Generate a valid MongoDB ObjectID (24 hex characters)
function generateValidObjectId() {
  const hexChars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return result;
}

// Run the test
testQuoteButton()
  .then((success) => {
    if (!success) {
      console.error('\n❌ Quote button test failed!');
      process.exit(1);
    }
    console.log('\n✅ Quote button test completed successfully!');
  })
  .catch((error) => {
    console.error('\n💥 Unhandled error in test script:', error);
    process.exit(1);
  });
