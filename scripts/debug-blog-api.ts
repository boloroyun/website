import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugBlogAPI() {
  try {
    console.log('🔍 Debugging blog API after admin update...');

    // Test 1: Basic connection
    console.log('1. Testing database connection...');
    const count = await prisma.blogPost.count();
    console.log(`✅ Found ${count} blog posts in database`);

    // Test 2: Check for any invalid data
    console.log('2. Checking for data issues...');
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        published: true,
        publishedAt: true,
        categoryId: true,
      },
    });

    console.log('Posts found:');
    posts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
      console.log(`      - Status: ${post.status}`);
      console.log(`      - Published: ${post.published}`);
      console.log(`      - PublishedAt: ${post.publishedAt}`);
      console.log(`      - CategoryId: ${post.categoryId}`);
    });

    // Test 3: Try the same query as the API
    console.log('3. Testing API query conditions...');
    const apiPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });
    console.log(`✅ Found ${apiPosts.length} published posts matching API conditions`);

    // Test 4: Test with relationships
    console.log('4. Testing with category relationship...');
    try {
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
      console.log(`✅ Category relationship works: ${postsWithCategory.length} posts`);
    } catch (error) {
      console.log(`❌ Category relationship error:`, error.message);
    }

    // Test 5: Test with tags relationship
    console.log('5. Testing with tags relationship...');
    try {
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
      console.log(`✅ Tags relationship works: ${postsWithTags.length} posts`);
    } catch (error) {
      console.log(`❌ Tags relationship error:`, error.message);
    }

    // Test 6: Check for missing categories
    console.log('6. Checking for missing categories...');
    const postsWithoutCategory = await prisma.blogPost.findMany({
      where: {
        categoryId: null,
      },
    });
    if (postsWithoutCategory.length > 0) {
      console.log(`⚠️  Found ${postsWithoutCategory.length} posts without categories:`);
      postsWithoutCategory.forEach(post => {
        console.log(`   - ${post.title} (${post.slug})`);
      });
    } else {
      console.log('✅ All posts have categories');
    }

  } catch (error) {
    console.error('❌ Error debugging blog API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugBlogAPI();
