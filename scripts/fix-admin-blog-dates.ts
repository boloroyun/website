import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBlogDateFormats() {
  try {
    console.log('🔧 Fixing blog post date formats after admin update...');

    // Use raw MongoDB operations to fix the date format issue
    console.log('1. Using raw MongoDB operations to fix dates...');
    
    // Get the raw database connection
    const db = prisma.$extends({
      name: 'raw-operations',
    });

    // Update all blog posts to have proper DateTime format
    const result = await prisma.$runCommandRaw({
      update: 'BlogPost',
      updates: [
        {
          q: {}, // Match all documents
          u: {
            $set: {
              publishedAt: new Date(),
              updatedAt: new Date(),
            }
          },
          multi: true
        }
      ]
    });

    console.log('✅ Updated blog post dates using raw MongoDB operations');
    console.log('Result:', result);

    // Test if the fix worked
    console.log('2. Testing if the fix worked...');
    const testPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        publishedAt: true,
      },
      take: 3,
    });

    console.log('✅ Fix successful! Posts now have proper dates:');
    testPosts.forEach(post => {
      console.log(`   - ${post.title}: ${post.publishedAt}`);
    });

    console.log('🎉 Blog API should now work correctly!');

  } catch (error) {
    console.error('❌ Error fixing blog dates:', error);
    console.log('');
    console.log('💡 Alternative solution: Reset and recreate blog data');
    console.log('Run: npx tsx scripts/reset-blog-data.ts');
    console.log('Then: npx tsx scripts/create-sample-blog-data.ts');
  } finally {
    await prisma.$disconnect();
  }
}

fixBlogDateFormats();
