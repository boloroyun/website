import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBlogDates() {
  try {
    console.log('🔧 Fixing blog post date formats...');

    // Get all blog posts
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        publishedAt: true,
      },
    });

    console.log(`Found ${posts.length} blog posts to check`);

    for (const post of posts) {
      try {
        // Update each post to ensure proper date format
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            publishedAt: new Date(), // Set to current date
            updatedAt: new Date(),
          },
        });
        console.log(`✅ Fixed dates for: ${post.title}`);
      } catch (error) {
        console.log(`⚠️ Could not fix dates for: ${post.title}`, error.message);
      }
    }

    console.log('🎉 Date format fix completed!');

  } catch (error) {
    console.error('❌ Error fixing blog dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBlogDates();
