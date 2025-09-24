// MongoDB connection test script
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

async function testMongoDBConnection() {
  console.log('Testing MongoDB connection...');
  console.log(
    `Using connection string: ${process.env.DATABASE_URL.replace(/\/\/([^:]+):[^@]+@/, '//\\1:****@')}`
  );

  let prisma;

  try {
    // Initialize Prisma client
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    // Test connection
    console.log('Connecting to MongoDB...');
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB!');

    // Try to execute a simple query
    console.log('Attempting to query the database...');
    const categoryCount = await prisma.category.count();
    console.log(
      `✅ Database query successful! Found ${categoryCount} categories.`
    );

    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error(error);

    // Provide more helpful error information
    if (
      error.message.includes('ENOTFOUND') ||
      error.message.includes('connection timed out')
    ) {
      console.log(
        '\n🔍 DIAGNOSIS: Network connectivity issue or incorrect hostname'
      );
      console.log(
        'SOLUTION: Check your network connection and verify the hostname in your connection string'
      );
    } else if (error.message.includes('AuthenticationFailed')) {
      console.log('\n🔍 DIAGNOSIS: Authentication failed');
      console.log(
        'SOLUTION: Verify your username and password in the connection string'
      );
    } else if (error.message.includes('Server selection timeout')) {
      console.log('\n🔍 DIAGNOSIS: MongoDB Atlas server selection timeout');
      console.log('SOLUTIONS:');
      console.log(
        '1. Check if your IP address is whitelisted in MongoDB Atlas'
      );
      console.log(
        '2. Try adding directConnection=true to your connection string'
      );
      console.log('3. Check if MongoDB Atlas is experiencing an outage');
      console.log(
        '4. Use a VPN or different network if on a restricted network'
      );
    }

    return false;
  } finally {
    // Always disconnect client
    if (prisma) {
      console.log('Disconnecting from MongoDB...');
      await prisma.$disconnect();
      console.log('Disconnected.');
    }
  }
}

// Run the test
testMongoDBConnection()
  .then((success) => {
    if (success) {
      console.log('\n✅ MongoDB connection test completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ MongoDB connection test failed.');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Unhandled error during test:', err);
    process.exit(1);
  });
