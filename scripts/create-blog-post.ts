import { PrismaClient } from '@prisma/client';
import { createBlogPostData } from '../lib/blog-utils';

const prisma = new PrismaClient();

// Example function to create a new blog post
async function createNewBlogPost() {
  console.log('✍️ Creating a new blog post...');

  try {
    // First, get available categories
    const categories = await prisma.blogCategory.findMany();
    console.log('Available categories:');
    categories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });

    // Example blog post data
    const postInput = {
      title: 'Small Kitchen Design Ideas That Maximize Space',
      content: `
        <h2>Making the Most of Your Small Kitchen</h2>
        <p>A small kitchen doesn't mean you have to compromise on style or functionality. With smart design choices and creative solutions, you can create a beautiful and efficient cooking space that feels much larger than its actual size.</p>
        
        <h3>1. Vertical Storage Solutions</h3>
        <p>When floor space is limited, think vertically. Install cabinets that reach the ceiling, use wall-mounted shelves, and consider magnetic strips for knives and spice jars. Every inch of vertical space is valuable real estate.</p>
        
        <h3>2. Light Colors and Reflective Surfaces</h3>
        <p>Light colors make spaces feel larger and brighter. Choose white or light-colored cabinets, add mirrors or glossy backsplashes, and ensure plenty of lighting. Natural light is best, but under-cabinet LED strips can work wonders.</p>
        
        <h3>3. Multi-Functional Islands</h3>
        <p>If you have room for an island, make it work hard for you. Include storage underneath, add a breakfast bar for dining, and consider built-in appliances like a microwave or wine fridge.</p>
        
        <h3>4. Smart Appliance Choices</h3>
        <p>Choose appliances that fit your space and needs. Consider compact or counter-depth refrigerators, combination microwave-convection ovens, and dishwasher drawers that can fit in tight spaces.</p>
        
        <h3>5. Open Shelving</h3>
        <p>Replace some upper cabinets with open shelving to create an airy feel. Display your beautiful dishes and glassware while keeping frequently used items within easy reach.</p>
      `,
      categoryId:
        categories.find((cat) => cat.name === 'Kitchen Design')?.id ||
        categories[0].id,
      authorName: 'Jessica Martinez',
      authorEmail: 'jessica@luxcabinets.com',
      authorBio:
        'Small space design specialist with a passion for maximizing functionality in compact kitchens.',
      tags: ['Small Spaces', 'Storage Solutions'],
      featuredImageUrl:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop',
      status: 'published' as const,
      featured: false,
    };

    // Create the blog post data
    const blogPostData = createBlogPostData(postInput);

    // Create the blog post
    const newPost = await prisma.blogPost.create({
      data: blogPostData,
    });

    console.log(`✅ Created blog post: "${newPost.title}"`);
    console.log(`   Slug: ${newPost.slug}`);
    console.log(`   Read time: ${newPost.readTime} minutes`);
    console.log(`   Status: ${newPost.status}`);
    console.log(`   URL: http://localhost:3000/blog/${newPost.slug}`);

    // Create some tags if they don't exist and associate them
    const tagNames = ['Small Spaces', 'Storage Solutions'];
    for (const tagName of tagNames) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');

      let tag = await prisma.blogTag.findUnique({ where: { slug } });

      if (!tag) {
        tag = await prisma.blogTag.create({
          data: {
            name: tagName,
            slug,
            color: '#6B7280',
          },
        });
        console.log(`✅ Created new tag: ${tagName}`);
      }

      // Associate tag with post
      await prisma.blogPostTag.create({
        data: {
          postId: newPost.id,
          tagId: tag.id,
        },
      });
    }

    console.log('✅ Blog post created successfully with tags!');
  } catch (error) {
    console.error('❌ Error creating blog post:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uncomment the line below to create the blog post
// createNewBlogPost();

console.log('📝 Blog post creation script ready!');
console.log(
  'To create a new blog post, uncomment the last line and run: npx tsx scripts/create-blog-post.ts'
);
