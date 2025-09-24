/**
 * Test script to verify the integration between the website and admin API for quotes
 */

const fetch = require('node-fetch');

// Configuration
const WEBSITE_API = 'http://localhost:3000/api/quotes';
const ADMIN_API = 'http://localhost:3001/api/quotes';
const ADMIN_API_KEY =
  '4a1c4f6bbffaa3f213926afb6510fc01fcf4b5ad044aba281bb66b41a90a34d8';
const ADMIN_LOGIN_API = 'http://localhost:3001/api/auth/login';
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com', // Replace with actual admin credentials
  password: 'admin123', // Replace with actual admin password
};

// Test quote data
const testQuote = {
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '555-123-4567',
  zipCode: '12345',
  notes: 'This is a test quote from the integration test script',
  productName: 'Test Product',
  productId: '123456789012345678901234', // 24-character MongoDB ID format
  sku: 'TEST-SKU-123',
  material: 'Test Material',
  dimensions: '10x10',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Submit a test quote to the website API
 */
async function submitTestQuote() {
  console.log(
    `${colors.blue}🔍 Testing quote submission to website API...${colors.reset}`
  );

  try {
    const response = await fetch(WEBSITE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testQuote),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(
        `${colors.green}✅ Successfully submitted quote to website API${colors.reset}`
      );
      console.log(
        `${colors.cyan}📋 Response:${colors.reset}`,
        JSON.stringify(result, null, 2)
      );
      return result.quoteId;
    } else {
      console.log(
        `${colors.red}❌ Failed to submit quote to website API${colors.reset}`
      );
      console.log(
        `${colors.cyan}📋 Response:${colors.reset}`,
        JSON.stringify(result, null, 2)
      );
      return null;
    }
  } catch (error) {
    console.error(
      `${colors.red}❌ Error submitting quote:${colors.reset}`,
      error
    );
    return null;
  }
}

/**
 * Login to the admin API and get an auth token
 */
async function loginToAdminAPI() {
  console.log(`${colors.blue}🔑 Logging in to admin API...${colors.reset}`);

  try {
    const response = await fetch(ADMIN_LOGIN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ADMIN_CREDENTIALS),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.token) {
        console.log(
          `${colors.green}✅ Successfully logged in to admin API${colors.reset}`
        );
        return result.token;
      }
    }

    console.log(`${colors.red}❌ Failed to login to admin API${colors.reset}`);
    console.log(`${colors.cyan}📋 Status:${colors.reset}`, response.status);

    // Try to get the error message
    try {
      const errorText = await response.text();
      console.log(`${colors.cyan}📋 Error:${colors.reset}`, errorText);
    } catch (e) {
      console.log(
        `${colors.cyan}📋 Could not parse error response${colors.reset}`
      );
    }

    return null;
  } catch (error) {
    console.error(
      `${colors.red}❌ Error logging in to admin API:${colors.reset}`,
      error
    );
    return null;
  }
}

/**
 * Check if the quote exists in the admin API
 */
async function checkQuoteInAdmin(quoteId) {
  if (!quoteId) {
    console.log(
      `${colors.yellow}⚠️ No quote ID provided, skipping admin API check${colors.reset}`
    );
    return;
  }

  console.log(
    `${colors.blue}🔍 Checking if quote exists in admin API...${colors.reset}`
  );

  // First, login to get an auth token
  const authToken = await loginToAdminAPI();
  if (!authToken) {
    console.log(
      `${colors.yellow}⚠️ Could not authenticate with admin API, skipping check${colors.reset}`
    );
    return;
  }

  try {
    // First try the quotes endpoint
    const response = await fetch(`${ADMIN_API}?id=${quoteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': ADMIN_API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result && (result.data || result.quotes)) {
        const quotes = result.data || result.quotes;
        if (Array.isArray(quotes) && quotes.length > 0) {
          console.log(
            `${colors.green}✅ Quote found in admin API${colors.reset}`
          );
          console.log(
            `${colors.cyan}📋 Quote data:${colors.reset}`,
            JSON.stringify(quotes[0], null, 2)
          );
          return;
        }
      }
      console.log(
        `${colors.yellow}⚠️ Quote not found in admin API response${colors.reset}`
      );
      console.log(
        `${colors.cyan}📋 Response:${colors.reset}`,
        JSON.stringify(result, null, 2)
      );
    } else {
      console.log(
        `${colors.red}❌ Failed to check quote in admin API${colors.reset}`
      );
      console.log(`${colors.cyan}📋 Status:${colors.reset}`, response.status);

      // Try to get the error message
      try {
        const errorText = await response.text();
        console.log(`${colors.cyan}📋 Error:${colors.reset}`, errorText);
      } catch (e) {
        console.log(
          `${colors.cyan}📋 Could not parse error response${colors.reset}`
        );
      }
    }
  } catch (error) {
    console.error(
      `${colors.red}❌ Error checking quote in admin API:${colors.reset}`,
      error
    );
  }
}

/**
 * Run the test
 */
async function runTest() {
  console.log(
    `${colors.magenta}🚀 Starting quote integration test${colors.reset}`
  );

  // Add unique identifier to test quote
  testQuote.notes += ` [Test ID: ${Date.now()}]`;

  // Step 1: Submit the test quote
  const quoteId = await submitTestQuote();

  if (quoteId) {
    // Step 2: Wait a moment for processing
    console.log(
      `${colors.yellow}⏳ Waiting 3 seconds for quote processing...${colors.reset}`
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 3: Check if the quote exists in the admin API
    await checkQuoteInAdmin(quoteId);
  }

  console.log(`${colors.magenta}🏁 Test completed${colors.reset}`);
}

// Run the test
runTest().catch((error) => {
  console.error(`${colors.red}❌ Unhandled error:${colors.reset}`, error);
});
