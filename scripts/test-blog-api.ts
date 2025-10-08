import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBlogAPI() {
  try {
    console.log('🔍 Testing blog API...');

    // Test basic connection
    console.log('1. Testing basic connection...');
    const count = await prisma.blogPost.count();
    console.log(`✅ Found ${count} blog posts in database`);

    // Test simple query
    console.log('2. Testing simple blog post query...');
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
      },
      take: 3,
    });
    console.log(`✅ Found ${posts.length} published posts`);
    posts.forEach(post => {
      console.log(`   - ${post.title} (${post.slug})`);
    });

    // Test with category
    console.log('3. Testing with category relationship...');
    const postsWithCategory = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
      },
      include: {
        category: true,
      },
      take: 1,
    });
    console.log(`✅ Found ${postsWithCategory.length} posts with category`);
    if (postsWithCategory.length > 0) {
      console.log(`   - Category: ${postsWithCategory[0].category.name}`);
    }

    // Test with tags
    console.log('4. Testing with tags relationship...');
    const postsWithTags = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      take: 1,
    });
    console.log(`✅ Found ${postsWithTags.length} posts with tags`);
    if (postsWithTags.length > 0) {
      console.log(`   - Tags: ${postsWithTags[0].tags.map(t => t.tag.name).join(', ')}`);
    }

    console.log('🎉 All tests passed! The blog API should work now.');

  } catch (error) {
    console.error('❌ Error testing blog API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogAPI();
