import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBlogPostsMongoDB() {
  try {
    console.log('🔧 MongoDB Blog Posts Fix Starting...\n');

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

    // Step 2: Try to get blog posts one by one to identify broken ones
    console.log('\n🔍 Checking blog posts individually...');
    
    // Get total count first
    const totalCount = await prisma.blogPost.count();
    console.log(`📊 Total blog posts in database: ${totalCount}`);

    if (totalCount === 0) {
      console.log('❌ No blog posts found in database');
      return;
    }

    // Try to get all posts with minimal fields to identify issues
    let workingPosts = [];
    let brokenPostsCount = 0;

    // Get posts without the problematic relations first
    try {
      const basicPosts = await prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          published: true,
          createdAt: true,
        },
      });
      console.log(`✅ Successfully retrieved ${basicPosts.length} posts with basic info`);
      workingPosts = basicPosts;
    } catch (error) {
      console.log('❌ Could not retrieve posts with basic info:', error.message);
      return;
    }

    // Step 3: Fix each post individually
    console.log('\n🔧 Fixing each blog post...');
    let fixedCount = 0;

    for (const [index, basicPost] of workingPosts.entries()) {
      console.log(`\n🔧 Processing post ${index + 1}/${workingPosts.length}: "${basicPost.title}"`);
      
      try {
        // Try to get the full post to see what's missing
        let fullPost;
        try {
          fullPost = await prisma.blogPost.findUnique({
            where: { id: basicPost.id },
            include: {
              category: true,
            },
          });
        } catch (error) {
          console.log('   ⚠️  Could not load full post due to missing category, fixing...');
          
          // Update the post with required fields
          await prisma.blogPost.update({
            where: { id: basicPost.id },
            data: {
              categoryId: defaultCategory.id,
              content: fullPost?.content || `# ${basicPost.title}\n\nContent coming soon...`,
              excerpt: fullPost?.excerpt || `${basicPost.title} - Read more about this topic.`,
              authorName: fullPost?.authorName || 'LUX Cabinets & Stones',
              published: true,
              status: 'published',
              publishedAt: new Date(),
            },
          });
          
          fixedCount++;
          console.log('   ✅ Fixed missing category and other required fields');
          continue;
        }

        if (fullPost) {
          const updates = {};
          let needsUpdate = false;

          // Check and fix missing fields
          if (!fullPost.categoryId) {
            updates.categoryId = defaultCategory.id;
            needsUpdate = true;
            console.log('   ✅ Will fix missing category');
          }

          if (!fullPost.content || fullPost.content.trim() === '') {
            updates.content = fullPost.excerpt || `# ${fullPost.title}\n\nContent coming soon...`;
            needsUpdate = true;
            console.log('   ✅ Will fix missing content');
          }

          if (!fullPost.excerpt || fullPost.excerpt.trim() === '') {
            updates.excerpt = `${fullPost.title} - Read more about this topic.`;
            needsUpdate = true;
            console.log('   ✅ Will fix missing excerpt');
          }

          if (!fullPost.authorName || fullPost.authorName.trim() === '') {
            updates.authorName = 'LUX Cabinets & Stones';
            needsUpdate = true;
            console.log('   ✅ Will fix missing author');
          }

          // Set to published
          if (!fullPost.published || fullPost.status !== 'published') {
            updates.published = true;
            updates.status = 'published';
            updates.publishedAt = new Date();
            needsUpdate = true;
            console.log('   ✅ Will set to published');
          }

          // Apply updates if needed
          if (needsUpdate) {
            await prisma.blogPost.update({
              where: { id: fullPost.id },
              data: updates,
            });
            fixedCount++;
            console.log(`   ✅ Post "${fullPost.title}" fixed successfully`);
          } else {
            console.log(`   ✅ Post "${fullPost.title}" was already correct`);
          }
        }

      } catch (error) {
        console.log(`   ❌ Error processing post: ${error.message}`);
        brokenPostsCount++;
      }
    }

    // Step 4: Verify results
    console.log(`\n📊 Fix Summary:`);
    console.log(`   Posts processed: ${workingPosts.length}`);
    console.log(`   Posts fixed: ${fixedCount}`);
    console.log(`   Posts with errors: ${brokenPostsCount}`);
    
    // Check how many are now published
    const publishedCount = await prisma.blogPost.count({
      where: {
        published: true,
        status: 'published',
      },
    });
    
    console.log(`   Published posts now: ${publishedCount}`);

    // Step 5: Show final status of working posts
    console.log(`\n📋 Final blog posts status:`);
    try {
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
        console.log(`   Category: ${post.category?.name || 'No category'}`);
        console.log(`   Author: ${post.authorName || 'No author'}`);
        console.log(`   Has content: ${post.content ? 'Yes' : 'No'}`);
        console.log(`   Has excerpt: ${post.excerpt ? 'Yes' : 'No'}`);
        console.log('   ' + '-'.repeat(40));
      });

      console.log('\n🎉 Blog posts fix completed!');
      console.log('🌐 Your blog posts should now be visible on: https://luxcabistones.com/blog');
      console.log('🔄 Note: It may take a few minutes for changes to appear due to caching.');

    } catch (error) {
      console.log('❌ Could not retrieve final status, but fixes were applied');
      console.log('🌐 Please check: https://luxcabistones.com/blog');
    }

  } catch (error) {
    console.error('❌ Error in main fix process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the MongoDB-compatible fix
fixBlogPostsMongoDB();
