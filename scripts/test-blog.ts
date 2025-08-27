import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getBlogTags,
  getFeaturedBlogPosts,
} from '../actions/blog.actions';

async function testBlog() {
  console.log('🧪 Testing blog functionality...\n');

  try {
    // Test 1: Get all blog posts
    console.log('1. Testing getBlogPosts()...');
    const postsResult = await getBlogPosts({ page: 1, limit: 10 });
    if (postsResult.success && postsResult.data) {
      console.log(`✅ Found ${postsResult.data.posts.length} posts`);
      console.log(
        `   Pagination: ${postsResult.data.pagination.currentPage}/${postsResult.data.pagination.totalPages}`
      );

      if (postsResult.data.posts.length > 0) {
        const firstPost = postsResult.data.posts[0];
        console.log(
          `   First post: "${firstPost.title}" by ${firstPost.authorName}`
        );
        console.log(
          `   Category: ${firstPost.category.name}, Tags: ${firstPost.tags.map((t) => t.name).join(', ')}`
        );
      }
    } else {
      console.log('❌ Failed to get blog posts:', postsResult.error);
    }

    // Test 2: Get a specific blog post
    console.log('\n2. Testing getBlogPostBySlug()...');
    const slugs = [
      '10-modern-kitchen-design-trends-2024',
      'how-to-choose-perfect-cabinet-hardware',
    ];

    for (const slug of slugs) {
      const postResult = await getBlogPostBySlug(slug);
      if (postResult.success && postResult.data) {
        console.log(`✅ Found post: "${postResult.data.title}"`);
        console.log(
          `   Views: ${postResult.data.views}, Likes: ${postResult.data.likes}`
        );
        console.log(`   Read time: ${postResult.data.readTime} minutes`);
        console.log(
          `   SEO: ${postResult.data.metaTitle ? 'Has meta title' : 'No meta title'}`
        );
      } else {
        console.log(`❌ Failed to get post "${slug}":`, postResult.error);
      }
    }

    // Test 3: Get featured posts
    console.log('\n3. Testing getFeaturedBlogPosts()...');
    const featuredResult = await getFeaturedBlogPosts(3);
    if (featuredResult.success && featuredResult.data) {
      console.log(`✅ Found ${featuredResult.data.length} featured posts`);
      featuredResult.data.forEach((post) => {
        console.log(`   - "${post.title}" (${post.views} views)`);
      });
    } else {
      console.log('❌ Failed to get featured posts:', featuredResult.error);
    }

    // Test 4: Get categories
    console.log('\n4. Testing getBlogCategories()...');
    const categoriesResult = await getBlogCategories();
    if (categoriesResult.success && categoriesResult.data) {
      console.log(`✅ Found ${categoriesResult.data.length} categories`);
      categoriesResult.data.forEach((category) => {
        console.log(
          `   - ${category.name} (${category.postCount} posts) - ${category.color || 'No color'}`
        );
      });
    } else {
      console.log('❌ Failed to get categories:', categoriesResult.error);
    }

    // Test 5: Get tags
    console.log('\n5. Testing getBlogTags()...');
    const tagsResult = await getBlogTags();
    if (tagsResult.success && tagsResult.data) {
      console.log(`✅ Found ${tagsResult.data.length} tags`);
      tagsResult.data.forEach((tag) => {
        console.log(
          `   - ${tag.name} (${tag.postCount} posts) - ${tag.color || 'No color'}`
        );
      });
    } else {
      console.log('❌ Failed to get tags:', tagsResult.error);
    }

    // Test 6: Search functionality
    console.log('\n6. Testing search functionality...');
    const searchResult = await getBlogPosts({
      page: 1,
      limit: 5,
      search: 'kitchen',
    });
    if (searchResult.success && searchResult.data) {
      console.log(
        `✅ Search for "kitchen" returned ${searchResult.data.posts.length} posts`
      );
      searchResult.data.posts.forEach((post) => {
        console.log(`   - "${post.title}"`);
      });
    } else {
      console.log('❌ Search failed:', searchResult.error);
    }

    // Test 7: Category filtering
    console.log('\n7. Testing category filtering...');
    const categoryResult = await getBlogPosts({
      page: 1,
      limit: 5,
      categorySlug: 'kitchen-design',
    });
    if (categoryResult.success && categoryResult.data) {
      console.log(
        `✅ Kitchen Design category has ${categoryResult.data.posts.length} posts`
      );
      categoryResult.data.posts.forEach((post) => {
        console.log(`   - "${post.title}" in ${post.category.name}`);
      });
    } else {
      console.log('❌ Category filtering failed:', categoryResult.error);
    }

    console.log('\n🎉 All blog tests completed!');
    console.log('\n📝 Your blog is ready to use at:');
    console.log('   - Blog listing: http://localhost:3000/blog');
    console.log('   - Sample posts:');
    console.log(
      '     * http://localhost:3000/blog/10-modern-kitchen-design-trends-2024'
    );
    console.log(
      '     * http://localhost:3000/blog/how-to-choose-perfect-cabinet-hardware'
    );
    console.log(
      '     * http://localhost:3000/blog/natural-stone-vs-quartz-countertops'
    );
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testBlog();
