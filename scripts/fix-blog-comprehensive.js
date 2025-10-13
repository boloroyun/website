import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBlogPostsComprehensive() {
  try {
    console.log('🔧 Comprehensive Blog Posts Fix Starting...\n');

    // Step 1: Check if we have any blog categories
    console.log('🔍 Checking blog categories...');
    const categories = await prisma.blogCategory.findMany();
    console.log(`Found ${categories.length} blog categories`);

    let defaultCategory;
    if (categories.length === 0) {
      console.log('📝 Creating default blog category...');
      defaultCategory = await prisma.blogCategory.create({
        data: {
          name: 'General',
          slug: 'general',
          description: 'General blog posts',
        },
      });
      console.log(`✅ Created default category: ${defaultCategory.name}`);
    } else {
      defaultCategory = categories[0];
      console.log(`✅ Using existing category: ${defaultCategory.name}`);
    }

    // Step 2: Get all blog posts with raw query to avoid Prisma validation
    console.log('\n🔍 Finding all blog posts (including broken ones)...');
    
    const rawPosts = await prisma.$queryRaw`
      SELECT 
        _id as id,
        title,
        slug,
        excerpt,
        content,
        status,
        published,
        "publishedAt",
        "categoryId",
        "authorName",
        "createdAt"
      FROM "BlogPost"
    `;

    console.log(`📊 Found ${rawPosts.length} blog posts in database\n`);

    if (rawPosts.length === 0) {
      console.log('❌ No blog posts found in database');
      return;
    }

    // Step 3: Fix each blog post
    let fixedCount = 0;
    
    for (const [index, post] of rawPosts.entries()) {
      console.log(`🔧 Fixing post ${index + 1}/${rawPosts.length}: "${post.title}"`);
      
      const updates = {};
      let needsUpdate = false;

      // Fix missing category
      if (!post.categoryId) {
        updates.categoryId = defaultCategory.id;
        needsUpdate = true;
        console.log('   ✅ Fixed missing category');
      }

      // Fix missing content
      if (!post.content || post.content.trim() === '') {
        updates.content = post.excerpt || `# ${post.title}\n\nContent coming soon...`;
        needsUpdate = true;
        console.log('   ✅ Fixed missing content');
      }

      // Fix missing excerpt
      if (!post.excerpt || post.excerpt.trim() === '') {
        updates.excerpt = `${post.title} - Read more about this topic.`;
        needsUpdate = true;
        console.log('   ✅ Fixed missing excerpt');
      }

      // Fix missing author
      if (!post.authorName || post.authorName.trim() === '') {
        updates.authorName = 'LUX Cabinets & Stones';
        needsUpdate = true;
        console.log('   ✅ Fixed missing author');
      }

      // Set to published
      if (!post.published || post.status !== 'published') {
        updates.published = true;
        updates.status = 'published';
        updates.publishedAt = new Date();
        needsUpdate = true;
        console.log('   ✅ Set to published');
      }

      // Apply updates if needed
      if (needsUpdate) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: updates,
        });
        fixedCount++;
        console.log(`   ✅ Post "${post.title}" fixed successfully`);
      } else {
        console.log(`   ✅ Post "${post.title}" was already correct`);
      }
      
      console.log('   ' + '-'.repeat(50));
    }

    // Step 4: Verify results
    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixedCount} posts`);
    
    const publishedCount = await prisma.blogPost.count({
      where: {
        published: true,
        status: 'published',
      },
    });
    
    console.log(`   Published posts now: ${publishedCount}`);

    // Step 5: Show final status
    console.log(`\n📋 Final blog posts status:`);
    const finalPosts = await prisma.blogPost.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    finalPosts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}"`);
      console.log(`   Status: ${post.status} | Published: ${post.published}`);
      console.log(`   Category: ${post.category.name}`);
      console.log(`   Author: ${post.authorName}`);
      console.log(`   Content: ${post.content.length} characters`);
      console.log('   ' + '-'.repeat(40));
    });

    console.log('\n🎉 All blog posts have been fixed and published!');
    console.log('🌐 Your blog posts should now be visible on: https://luxcabistones.com/blog');
    console.log('🔄 Note: It may take a few minutes for changes to appear due to caching.');

  } catch (error) {
    console.error('❌ Error fixing blog posts:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the comprehensive fix
fixBlogPostsComprehensive();
