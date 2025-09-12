/**
 * Test script for the quotes API
 *
 * Run with: node scripts/test-quote-api.js
 */

// Test data
const testQuoteData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '555-123-4567',
  zipCode: '12345',
  notes: 'This is a test quote request',
  productId: 'test-product-id',
  productName: 'Test Product',
  sku: 'TEST-123',
  timestamp: new Date().toISOString(),
};

// The URL to test - change this to match your local or production URL
const apiUrl = 'http://localhost:3002/api/quotes';

// Log the test data
console.log(
  '🧪 Testing quotes API with data:',
  JSON.stringify(testQuoteData, null, 2)
);
console.log(`🧪 Sending request to: ${apiUrl}`);

// Send the request
fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testQuoteData),
})
  .then((response) => {
    console.log(`🧪 Response status: ${response.status}`);
    console.log(`🧪 Response OK: ${response.ok}`);

    // Log headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log(`🧪 Response headers:`, headers);

    return response.json();
  })
  .then((data) => {
    console.log('🧪 Response data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Test successful!');
    } else {
      console.log('❌ Test failed!');
    }
  })
  .catch((error) => {
    console.error('❌ Error during test:', error);
  });
