/**
 * Test script for the admin quotes API
 *
 * Run with: node scripts/test-admin-quotes-api.js
 */

// Test data - formatted to match the website's quote request structure
const testQuoteData = {
  name: 'Test User From Website',
  email: 'test@example.com',
  phone: '555-123-4567',
  zipCode: '12345',
  notes: 'This is a test quote request from the website',
  productId: 'test-product-id',
  productName: 'Test Product',
  sku: 'TEST-123',
  timestamp: new Date().toISOString(),
  // Add a unique identifier to track this specific test
  testId: 'test-' + Date.now(),
};

// The URL to test - change this to match your admin API URL
const apiUrl = 'https://admin.luxcabistones.com/api/quotes/submit';

// Log the test data
console.log(
  '🧪 Testing admin quotes API with data:',
  JSON.stringify(testQuoteData, null, 2)
);
console.log(`🧪 Sending request to: ${apiUrl}`);

// Send the request
fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Source': 'website-quote-request-test',
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

    return response.text().then((text) => {
      try {
        return text ? JSON.parse(text) : {};
      } catch (e) {
        console.log('🧪 Raw response text:', text);
        return {};
      }
    });
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
