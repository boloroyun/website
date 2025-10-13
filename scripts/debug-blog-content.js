import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugBlogContent() {
  try {
    console.log('🔍 Debugging blog post content...\n');

    // Get all blog posts with their content
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        published: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📊 Found ${posts.length} blog posts\n`);

    posts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}"`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.published} | Status: ${post.status}`);
      console.log(`   Excerpt length: ${post.excerpt?.length || 0} characters`);
      console.log(`   Content length: ${post.content?.length || 0} characters`);
      
      if (post.content) {
        console.log(`   Content preview (first 200 chars):`);
        console.log(`   "${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}"`);
        
        // Check content type
        if (post.content.includes('<')) {
          console.log(`   Content type: HTML`);
        } else if (post.content.includes('#')) {
          console.log(`   Content type: Markdown`);
        } else {
          console.log(`   Content type: Plain text`);
        }
      } else {
        console.log(`   ❌ NO CONTENT FOUND`);
      }
      
      console.log('   ' + '-'.repeat(80));
    });

    console.log('\n🔍 Checking individual post by slug...');
    
    // Try to get the newest post by slug
    if (posts.length > 0) {
      const newestPost = posts[0];
      console.log(`\nTesting slug lookup for: "${newestPost.slug}"`);
      
      try {
        const postBySlug = await prisma.blogPost.findUnique({
          where: { slug: newestPost.slug },
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        });
        
        if (postBySlug) {
          console.log(`✅ Post found by slug: "${postBySlug.title}"`);
          console.log(`   Content length: ${postBySlug.content?.length || 0} characters`);
          console.log(`   Category: ${postBySlug.category?.name || 'No category'}`);
        } else {
          console.log(`❌ Post not found by slug`);
        }
      } catch (error) {
        console.log(`❌ Error finding post by slug:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error debugging blog content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugBlogContent();
