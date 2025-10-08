import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetBlogData() {
  try {
    console.log('🧹 Cleaning up existing blog data...');

    // Delete all blog post tags first (due to foreign key constraints)
    await prisma.blogPostTag.deleteMany({});
    console.log('✅ Deleted all blog post tags');

    // Delete all blog posts
    await prisma.blogPost.deleteMany({});
    console.log('✅ Deleted all blog posts');

    // Delete all blog categories
    await prisma.blogCategory.deleteMany({});
    console.log('✅ Deleted all blog categories');

    // Delete all blog tags
    await prisma.blogTag.deleteMany({});
    console.log('✅ Deleted all blog tags');

    console.log('🎉 Blog data cleanup completed!');
    console.log('💡 Now run: npx tsx scripts/create-sample-blog-data.ts');

  } catch (error) {
    console.error('❌ Error cleaning blog data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetBlogData();
