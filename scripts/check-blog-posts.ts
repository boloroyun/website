import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBlogPosts() {
  try {
    console.log('🔍 Checking current blog posts in database...');

    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`\n📊 Found ${posts.length} blog posts total:`);

    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   - ID: ${post.id}`);
      console.log(`   - Slug: ${post.slug}`);
      console.log(`   - Status: ${post.status}`);
      console.log(`   - Published: ${post.published}`);
      console.log(`   - PublishedAt: ${post.publishedAt}`);
      console.log(`   - CreatedAt: ${post.createdAt}`);
      console.log(`   - UpdatedAt: ${post.updatedAt}`);
    });

    // Check published posts specifically
    const publishedPosts = posts.filter(
      (post) => post.published && post.status === 'published'
    );
    console.log(
      `\n✅ Published posts that should show on blog page: ${publishedPosts.length}`
    );

    if (publishedPosts.length === 0) {
      console.log(
        '\n⚠️  No published posts found! This is why your blog page might be empty.'
      );
    }

    // Check for DateTime format issues
    const problematicPosts = posts.filter(
      (post) => typeof post.publishedAt === 'string'
    );
    if (problematicPosts.length > 0) {
      console.log(
        `\n❌ Found ${problematicPosts.length} posts with DateTime as string (this will cause errors):`
      );
      problematicPosts.forEach((post) => {
        console.log(
          `   - ${post.title}: publishedAt = "${post.publishedAt}" (${typeof post.publishedAt})`
        );
      });
    }
  } catch (error) {
    console.error('❌ Error checking blog posts:', error);

    if (error.code === 'P2023') {
      console.log(
        "\n💡 This is the DateTime conversion error we've seen before!"
      );
      console.log(
        'Your admin panel is saving DateTime fields as strings instead of Date objects.'
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogPosts();
