// Test script for quote submission
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testQuoteCreation() {
  try {
    console.log('Testing database connection and quote creation...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Create a test quote request
    const testQuote = await prisma.quoteRequest.create({
      data: {
        email: 'test@example.com',
        customerName: 'Test User',
        phone: '555-1234',
        zip: '12345',
        productName: 'Test Product',
        status: 'NEW',
      },
    });

    console.log('✅ Test quote created successfully:', {
      id: testQuote.id,
      publicToken: testQuote.publicToken,
      email: testQuote.email,
    });

    // Clean up - delete the test quote
    await prisma.quoteRequest.delete({
      where: { id: testQuote.id },
    });

    console.log('✅ Test quote deleted successfully');

    return true;
  } catch (error) {
    console.error('❌ Error during test:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testQuoteCreation()
  .then((success) => {
    console.log(success ? '✅ All tests passed!' : '❌ Test failed');
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
