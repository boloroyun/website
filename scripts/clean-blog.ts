import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanBlogData() {
  console.log('🧹 Cleaning existing blog data...');

  try {
    // Delete in correct order due to relationships
    await prisma.blogComment.deleteMany({});
    console.log('✅ Deleted blog comments');

    await prisma.blogPostTag.deleteMany({});
    console.log('✅ Deleted blog post tags');

    await prisma.blogPost.deleteMany({});
    console.log('✅ Deleted blog posts');

    await prisma.blogTag.deleteMany({});
    console.log('✅ Deleted blog tags');

    await prisma.blogCategory.deleteMany({});
    console.log('✅ Deleted blog categories');

    console.log('🎉 Blog data cleanup completed!');
  } catch (error) {
    console.error('❌ Error cleaning blog data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanBlogData().catch((error) => {
  console.error('❌ Cleanup failed:', error);
  process.exit(1);
});
