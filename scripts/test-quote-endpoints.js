// Script to test the admin quote API endpoints
// Run with: node scripts/test-quote-endpoints.js

const fetch = require('node-fetch');

// Mock quote data for testing
const mockQuoteData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '123-456-7890',
  zipCode: '12345',
  notes: 'This is a test quote request',
  productId: 'test-product-id',
  productName: 'Test Product',
  sku: 'TEST-SKU',
  timestamp: new Date().toISOString(),
};

// Base URLs to test
const adminApiBaseUrls = [
  'https://admin.luxcabistones.com',
  'https://luxcabistones.com/admin',
];

// Endpoints to test
const endpoints = [
  '/api/quote-requests',
  '/api/quotes/submit',
  '/api/quotes',
  '/quotes',
  '/quote-requests',
];

// HTTP methods to test
const methods = ['POST', 'PUT', 'OPTIONS'];

// Function to test a specific endpoint
async function testEndpoint(baseUrl, endpoint, method) {
  const url = `${baseUrl}${endpoint}`;
  console.log(`Testing ${method} ${url}...`);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'website-quote-request',
        'X-Api-Key': 'test-api-key',
      },
      body: method !== 'OPTIONS' ? JSON.stringify(mockQuoteData) : undefined,
    });

    console.log(`  Status: ${response.status} ${response.statusText}`);

    // Check if we got a useful response
    let responseData;
    try {
      responseData = await response.text();
      console.log(
        `  Response: ${responseData.substring(0, 100)}${responseData.length > 100 ? '...' : ''}`
      );
    } catch (e) {
      console.log(`  Could not read response body: ${e.message}`);
    }

    // If we got a 200 or 201 response, success!
    if (response.status === 200 || response.status === 201) {
      console.log(`  ✅ Success! Endpoint ${method} ${url} works!`);
      return true;
    }

    return false;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

// Main function to run all tests
async function runTests() {
  console.log('🔍 Testing Quote API Endpoints\n');

  let successFound = false;

  for (const baseUrl of adminApiBaseUrls) {
    console.log(`\n==== Testing Base URL: ${baseUrl} ====\n`);

    for (const endpoint of endpoints) {
      for (const method of methods) {
        const success = await testEndpoint(baseUrl, endpoint, method);
        if (success) {
          successFound = true;
          console.log(
            `\n✅ FOUND WORKING ENDPOINT: ${method} ${baseUrl}${endpoint}\n`
          );
        }
      }
    }
  }

  if (!successFound) {
    console.log('\n❌ No working endpoints found. Try checking:');
    console.log('  - If the admin API is running and accessible');
    console.log('  - If CORS is properly configured on the admin server');
    console.log('  - If the API endpoints are correctly defined');
    console.log('  - If authentication is required (API key, token, etc.)');
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('Unexpected error:', error);
});
