// Add publicToken migration helper
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('QuoteRequest');

    // Find all quote requests without a publicToken
    const quoteRequests = await collection
      .find({ publicToken: { $exists: false } })
      .toArray();
    console.log(
      `Found ${quoteRequests.length} quote requests without publicToken`
    );

    // Update each quote request with a unique publicToken
    const crypto = require('crypto');
    let updated = 0;

    for (const quote of quoteRequests) {
      const publicToken = crypto.randomUUID();
      const result = await collection.updateOne(
        { _id: quote._id },
        { $set: { publicToken } }
      );

      if (result.modifiedCount > 0) {
        updated++;
      }
    }

    console.log(
      `Updated ${updated} quote requests with unique publicToken values`
    );

    // Verify unique constraint will work
    const duplicates = await collection
      .aggregate([
        { $group: { _id: '$publicToken', count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    if (duplicates.length > 0) {
      console.error(`Found ${duplicates.length} duplicate publicToken values`);
      console.error(duplicates);
      process.exit(1);
    } else {
      console.log(
        'No duplicate publicToken values found, safe to create unique index'
      );
    }
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main().catch((e) => {
  console.error('Error in migration script:', e);
  process.exit(1);
});
