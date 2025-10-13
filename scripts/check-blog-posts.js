import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFixBlogPosts() {
  try {
    console.log('🔍 Checking blog posts in database...\n');

    // First, let's get a count of all posts to see if there are any
    const totalCount = await prisma.blogPost.count();
    console.log(`📊 Total blog posts in database: ${totalCount}\n`);

    if (totalCount === 0) {
      console.log('❌ No blog posts found in database');
      return;
    }

    // Get all blog posts with minimal fields first to avoid null content issues
    const allPostsBasic = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        excerpt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📋 Found ${allPostsBasic.length} blog posts:\n`);

    // Show current status of all posts
    console.log('📋 Current blog posts status:');
    console.log('='.repeat(80));
    allPostsBasic.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}"`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Published: ${post.published}`);
      console.log(`   Published At: ${post.publishedAt || 'Not set'}`);
      console.log(`   Category: ${post.category?.name || 'No category'}`);
      console.log(`   Excerpt: ${post.excerpt ? 'Yes' : 'No'}`);
      console.log(`   Created: ${post.createdAt.toISOString().split('T')[0]}`);
      console.log('   ' + '-'.repeat(60));
    });

    // Count posts by status
    const statusCounts = await prisma.blogPost.groupBy({
      by: ['status', 'published'],
      _count: {
        _all: true,
      },
    });

    console.log('\n📈 Status breakdown:');
    statusCounts.forEach(group => {
      console.log(`   ${group.status} + published:${group.published} = ${group._count._all} posts`);
    });

    // Get published posts (what shows on website)
    const publishedCount = await prisma.blogPost.count({
      where: {
        published: true,
        status: 'published',
      },
    });

    console.log(`\n✅ Posts visible on website: ${publishedCount}`);

    // Find posts that need to be published
    const unpublishedPosts = allPostsBasic.filter(post => 
      !post.published || post.status !== 'published'
    );

    if (unpublishedPosts.length > 0) {
      console.log(`\n🔧 Found ${unpublishedPosts.length} posts that need to be published:`);
      
      unpublishedPosts.forEach((post, index) => {
        console.log(`${index + 1}. "${post.title}" - Status: ${post.status}, Published: ${post.published}`);
      });

      console.log('\n❓ Do you want to publish all these posts? (This will make them visible on your website)');
      console.log('   To publish them, run: npm run fix-blog-posts');
      
      // Show what the fix would do
      console.log('\n🔧 The fix will:');
      console.log('   - Set status: "published"');
      console.log('   - Set published: true');
      console.log('   - Set publishedAt: current date');
      console.log('   - Fix any missing content fields');
      console.log('   - Keep all other data unchanged');
    } else {
      console.log('\n✅ All posts are already properly published!');
    }

    // Check for posts with content issues
    console.log('\n🔍 Checking for content issues...');
    let postsWithIssues = 0;
    
    for (const post of allPostsBasic) {
      try {
        const fullPost = await prisma.blogPost.findUnique({
          where: { id: post.id },
          select: { content: true }
        });
        
        if (!fullPost?.content || fullPost.content.trim() === '') {
          postsWithIssues++;
        }
      } catch (error) {
        postsWithIssues++;
      }
    }
    
    if (postsWithIssues > 0) {
      console.log(`⚠️  Found ${postsWithIssues} posts with content issues that will be fixed during publication`);
    } else {
      console.log('✅ All posts have valid content');
    }

  } catch (error) {
    console.error('❌ Error checking blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function fixBlogPosts() {
  try {
    console.log('🔧 Publishing all blog posts...\n');

    // First, fix any posts with missing content
    console.log('🔧 Fixing posts with missing content...');
    
    const allPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
      }
    });

    let fixedContentCount = 0;
    for (const post of allPosts) {
      try {
        const fullPost = await prisma.blogPost.findUnique({
          where: { id: post.id },
          select: { content: true }
        });
        
        if (!fullPost?.content || fullPost.content.trim() === '') {
          const fallbackContent = post.excerpt || `${post.title}\n\nContent coming soon...`;
          
          await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: fallbackContent }
          });
          
          fixedContentCount++;
        }
      } catch (error) {
        // If we can't read the content, set a default
        const fallbackContent = post.excerpt || `${post.title}\n\nContent coming soon...`;
        
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { content: fallbackContent }
        });
        
        fixedContentCount++;
      }
    }

    if (fixedContentCount > 0) {
      console.log(`✅ Fixed content for ${fixedContentCount} posts`);
    }

    // Update all posts to be published
    const result = await prisma.blogPost.updateMany({
      where: {
        OR: [
          { published: false },
          { status: { not: 'published' } },
        ],
      },
      data: {
        published: true,
        status: 'published',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Successfully published ${result.count} blog posts!`);
    
    // Verify the fix
    const publishedCount = await prisma.blogPost.count({
      where: {
        published: true,
        status: 'published',
      },
    });

    console.log(`📊 Total published posts now: ${publishedCount}`);
    console.log('\n🌐 Your blog posts should now be visible on: https://luxcabistones.com/blog');
    console.log('\n🔄 Note: It may take a few minutes for the changes to appear on the website due to caching.');

  } catch (error) {
    console.error('❌ Error fixing blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'fix') {
  fixBlogPosts();
} else {
  checkAndFixBlogPosts();
}
