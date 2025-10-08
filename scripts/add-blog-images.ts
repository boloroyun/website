import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addBlogImages() {
  try {
    console.log('🖼️ Adding featured images to blog posts...');

    // Get all existing blog posts
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    console.log(`Found ${posts.length} blog posts to update`);

    // Update each post with appropriate images
    for (const post of posts) {
      let featuredImage;
      let images = [];

      // Assign images based on the post slug
      switch (post.slug) {
        case 'modern-kitchen-design-trends-2024':
          featuredImage = {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            public_id: 'modern-kitchen-2024',
            alt: 'Modern kitchen with minimalist design and smart appliances',
            caption: 'A sleek modern kitchen showcasing 2024 design trends',
          };
          images = [
            {
              url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
              public_id: 'smart-appliances',
              alt: 'Smart kitchen appliances and IoT devices',
              caption: 'Smart appliances integrated into modern kitchen design',
            },
            {
              url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
              public_id: 'minimalist-storage',
              alt: 'Minimalist kitchen with hidden storage solutions',
              caption: 'Clean lines and hidden storage define modern aesthetics',
            },
          ];
          break;

        case 'luxury-kitchen-materials-guide':
          featuredImage = {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            public_id: 'luxury-materials',
            alt: 'Luxury kitchen with marble countertops and premium finishes',
            caption: 'Premium materials showcase luxury kitchen design',
          };
          images = [
            {
              url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
              public_id: 'marble-countertops',
              alt: 'Calacatta marble countertops with dramatic veining',
              caption: 'Calacatta marble brings timeless elegance',
            },
            {
              url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
              public_id: 'custom-cabinetry',
              alt: 'Custom wood cabinetry with premium hardware',
              caption: 'Custom cabinetry with high-end finishes',
            },
          ];
          break;

        case 'small-kitchen-design-ideas':
          featuredImage = {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            public_id: 'small-kitchen-design',
            alt: 'Compact kitchen with space-saving solutions',
            caption: 'Smart design maximizes space in small kitchens',
          };
          images = [
            {
              url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
              public_id: 'vertical-storage',
              alt: 'Vertical storage solutions in small kitchen',
              caption: 'Vertical storage maximizes cabinet space',
            },
            {
              url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
              public_id: 'open-shelving',
              alt: 'Open shelving creates visual space',
              caption: 'Open shelving makes small spaces feel larger',
            },
          ];
          break;

        default:
          // Default image for any other posts
          featuredImage = {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            public_id: 'default-kitchen',
            alt: 'Beautiful kitchen design',
            caption: 'Professional kitchen design inspiration',
          };
          break;
      }

      // Update the blog post with images
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          featuredImage,
          images,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Added images to: ${post.title}`);
    }

    console.log('🎉 Blog images added successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`- Updated ${posts.length} blog posts with featured images`);
    console.log('- Added gallery images to each post');
    console.log('- All images include alt text and captions for SEO');
    console.log('');
    console.log('🌐 Test your blog at: http://localhost:3000/blog');
    console.log('🔗 Test API at: http://localhost:3000/api/public/blog');

  } catch (error) {
    console.error('❌ Error adding blog images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBlogImages();
