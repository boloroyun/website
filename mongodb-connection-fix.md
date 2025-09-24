# MongoDB Connection Fix

The error you're seeing is a common MongoDB Atlas connection issue: `Server selection timeout: None of the available servers suitable for criteria ReadPreference(Primary)`.

## Step 1: Update your .env file

Edit your `.env` file to update your MongoDB connection string by adding these parameters:

```
DATABASE_URL="mongodb+srv://Boogii333888:Boss20252026@cluster0.wkqtz.mongodb.net/myapp?retryWrites=true&w=majority&authSource=admin&directConnection=true"
```

Key changes:

- Added `directConnection=true` - Forces a direct connection to the specified host
- Added `authSource=admin` - Specifies which database to authenticate against

## Step 2: Create a MongoDB connection helper

Create a file at `/lib/mongodb.ts` with better connection handling:

```typescript
import { PrismaClient } from '@prisma/client';

// Connection management variables
let prisma: PrismaClient | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

// Better error handling for MongoDB connections
export function getPrismaClient() {
  if (prisma) return prisma;

  if (connectionAttempts >= MAX_RETRIES) {
    console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
    throw new Error(`Database connection failed after ${MAX_RETRIES} attempts`);
  }

  try {
    connectionAttempts++;
    console.log(
      `Attempting to connect to MongoDB (attempt ${connectionAttempts})`
    );

    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    // Test the connection
    console.log('Testing MongoDB connection...');
    prisma.$connect();

    console.log('Successfully connected to MongoDB');
    return prisma;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    prisma = null;
    throw error;
  }
}

// For use in serverless environments
export async function connectToDB() {
  try {
    const client = getPrismaClient();
    await client.$connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Close connection when the server shuts down
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect();
    console.log('Disconnected from MongoDB');
  }
});

export default getPrismaClient();
```

## Step 3: Update Prisma configurations

In your Prisma schema, you can also add connection timeout settings by editing the `prisma/schema.prisma` file:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
  previewFeatures = ["extendedWhereUnique"]
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
  // Add this comment to remind you of the connection options
  // Add connection_limit=5 for production if needed
}
```

## Step 4: MongoDB Atlas Configuration

1. Check your MongoDB Atlas cluster:
   - Make sure your IP address is whitelisted in Atlas Network Access
   - Your Atlas cluster should be in "Active" state
   - Consider upgrading from a free tier if you're experiencing persistent issues

2. In MongoDB Atlas:
   - Navigate to Network Access
   - Add your current IP address
   - Or add 0.0.0.0/0 to allow connections from anywhere (less secure)

## Step 5: Test and Restart

1. Restart your Next.js application after making these changes:

   ```
   npm run dev
   ```

2. If you still have issues, try regenerating your Prisma client:

   ```
   npx prisma generate
   ```

3. For persistent connection issues:
   - Try a new MongoDB Atlas cluster
   - Check for MongoDB Atlas service outages
   - Contact MongoDB Atlas support
