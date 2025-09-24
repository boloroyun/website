// Script to test the quote request database connection
// Run with: node scripts/test-quote-db.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testQuoteDatabase() {
  console.log('Testing quote request database connection...');

  let prisma = null;

  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    prisma = new PrismaClient();
    await prisma.$connect();

    console.log('✅ Connected to MongoDB successfully!');

    // Test querying the quote requests
    const quoteCount = await prisma.quoteRequest.count();
    console.log(`Found ${quoteCount} quote requests in the database.`);

    // Test creating a test quote request
    const testQuote = await prisma.quoteRequest.create({
      data: {
        email: 'test@example.com',
        customerName: 'Test User',
        productName: 'Test Product',
        status: 'NEW',
        notes:
          'This is a test quote request from the test script. You can delete this.',
      },
    });

    console.log(
      '✅ Successfully created test quote request with ID:',
      testQuote.id
    );

    // Delete the test quote
    await prisma.quoteRequest.delete({
      where: { id: testQuote.id },
    });

    console.log('✅ Successfully deleted test quote request');

    return true;
  } catch (error) {
    console.error('❌ Error testing quote database:', error);
    return false;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

testQuoteDatabase()
  .then((success) => {
    if (success) {
      console.log('✅ Quote database test completed successfully!');
    } else {
      console.error('❌ Quote database test failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error('Unhandled error in test script:', err);
    process.exit(1);
  });
