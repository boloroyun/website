import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleBlogData() {
  try {
    console.log('🌱 Creating sample blog data...');

    // Create a sample category
    const category = await prisma.blogCategory.upsert({
      where: { slug: 'kitchen-design' },
      update: {},
      create: {
        name: 'Kitchen Design',
        slug: 'kitchen-design',
        description: 'Beautiful kitchen design ideas and inspiration',
        color: '#FF6B6B',
      },
    });

    console.log('✅ Created category:', category.name);

    // Create sample tags
    const tag1 = await prisma.blogTag.upsert({
      where: { slug: 'modern' },
      update: {},
      create: {
        name: 'Modern',
        slug: 'modern',
        color: '#4ECDC4',
      },
    });

    const tag2 = await prisma.blogTag.upsert({
      where: { slug: 'luxury' },
      update: {},
      create: {
        name: 'Luxury',
        slug: 'luxury',
        color: '#45B7D1',
      },
    });

    console.log('✅ Created tags:', tag1.name, tag2.name);

    // Create sample blog posts
    const blogPost1 = await prisma.blogPost.upsert({
      where: { slug: 'modern-kitchen-design-trends-2024' },
      update: {},
      create: {
        title: 'Modern Kitchen Design Trends 2024',
        slug: 'modern-kitchen-design-trends-2024',
        excerpt: 'Discover the latest kitchen design trends that are shaping modern homes in 2024. From minimalist aesthetics to smart appliances.',
        content: `<h2>The Future of Kitchen Design</h2>
          <p>Modern kitchens are evolving rapidly, combining functionality with stunning aesthetics. Here are the top trends for 2024:</p>
          
          <h3>1. Minimalist Design</h3>
          <p>Clean lines, hidden storage, and clutter-free countertops define the modern kitchen aesthetic.</p>
          
          <h3>2. Smart Appliances</h3>
          <p>Integration of IoT devices and smart appliances that can be controlled remotely.</p>
          
          <h3>3. Sustainable Materials</h3>
          <p>Eco-friendly materials like bamboo countertops and recycled glass backsplashes.</p>
          
          <h3>4. Bold Color Accents</h3>
          <p>While neutral tones dominate, bold accent colors add personality and warmth.</p>`,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          public_id: 'modern-kitchen-2024',
          alt: 'Modern kitchen with minimalist design and smart appliances',
          caption: 'A sleek modern kitchen showcasing 2024 design trends',
        },
        images: [
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
        ],
        status: 'published',
        featured: true,
        published: true,
        publishedAt: new Date(),
        readTime: 5,
        views: 0,
        likes: 0,
        metaTitle: 'Modern Kitchen Design Trends 2024 | LUX Design',
        metaDescription: 'Explore the latest kitchen design trends for 2024. Minimalist aesthetics, smart appliances, and sustainable materials.',
        metaKeywords: 'kitchen design, modern kitchen, 2024 trends, minimalist design, smart appliances',
        authorName: 'LUX Design Team',
        authorEmail: 'design@luxkitchens.com',
        categoryId: category.id,
      },
    });

    const blogPost2 = await prisma.blogPost.upsert({
      where: { slug: 'luxury-kitchen-materials-guide' },
      update: {},
      create: {
        title: 'Ultimate Guide to Luxury Kitchen Materials',
        slug: 'luxury-kitchen-materials-guide',
        excerpt: 'Everything you need to know about premium materials for your luxury kitchen renovation. From marble countertops to custom cabinetry.',
        content: `<h2>Premium Materials for Luxury Kitchens</h2>
          <p>Creating a luxury kitchen requires careful selection of high-quality materials that combine beauty with durability.</p>
          
          <h3>Countertop Materials</h3>
          <ul>
            <li><strong>Calacatta Marble</strong> - Timeless elegance with dramatic veining</li>
            <li><strong>Quartz Composites</strong> - Durable and low-maintenance luxury</li>
            <li><strong>Natural Granite</strong> - Classic beauty with unique patterns</li>
          </ul>
          
          <h3>Cabinet Materials</h3>
          <ul>
            <li><strong>Solid Wood</strong> - Cherry, walnut, and oak for warmth</li>
            <li><strong>High-Gloss Lacquer</strong> - Modern and sleek appearance</li>
            <li><strong>Custom Veneers</strong> - Unique wood grains and finishes</li>
          </ul>
          
          <h3>Hardware and Fixtures</h3>
          <p>Premium hardware in brushed gold, matte black, or polished chrome completes the luxury look.</p>`,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          public_id: 'luxury-materials',
          alt: 'Luxury kitchen with marble countertops and premium finishes',
          caption: 'Premium materials showcase luxury kitchen design',
        },
        images: [
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
        ],
        status: 'published',
        featured: false,
        published: true,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        readTime: 8,
        views: 0,
        likes: 0,
        metaTitle: 'Luxury Kitchen Materials Guide | Premium Finishes',
        metaDescription: 'Complete guide to luxury kitchen materials including marble, quartz, premium woods, and high-end fixtures.',
        metaKeywords: 'luxury kitchen, premium materials, marble countertops, custom cabinetry, kitchen renovation',
        authorName: 'Sarah Johnson',
        authorEmail: 'sarah@luxkitchens.com',
        categoryId: category.id,
      },
    });

    const blogPost3 = await prisma.blogPost.upsert({
      where: { slug: 'small-kitchen-design-ideas' },
      update: {},
      create: {
        title: '10 Small Kitchen Design Ideas That Maximize Space',
        slug: 'small-kitchen-design-ideas',
        excerpt: 'Transform your small kitchen into a functional and beautiful space with these clever design ideas and space-saving solutions.',
        content: `<h2>Making the Most of Your Small Kitchen</h2>
          <p>Small kitchens can be just as functional and beautiful as large ones with the right design approach.</p>
          
          <h3>Space-Saving Solutions</h3>
          <ol>
            <li><strong>Vertical Storage</strong> - Use wall-mounted cabinets up to the ceiling</li>
            <li><strong>Pull-Out Drawers</strong> - Maximize cabinet accessibility</li>
            <li><strong>Kitchen Islands</strong> - Multi-functional workspace and storage</li>
            <li><strong>Open Shelving</strong> - Creates visual space while providing storage</li>
            <li><strong>Light Colors</strong> - Reflect light and make space feel larger</li>
          </ol>
          
          <h3>Design Tips</h3>
          <p>Use mirrors strategically, choose compact appliances, and maintain clean lines throughout the design.</p>`,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          public_id: 'small-kitchen-design',
          alt: 'Compact kitchen with space-saving solutions',
          caption: 'Smart design maximizes space in small kitchens',
        },
        images: [
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
        ],
        status: 'published',
        featured: false,
        published: true,
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        readTime: 6,
        views: 0,
        likes: 0,
        metaTitle: 'Small Kitchen Design Ideas | Space-Saving Solutions',
        metaDescription: '10 clever small kitchen design ideas to maximize space and functionality. Space-saving solutions for compact kitchens.',
        metaKeywords: 'small kitchen, space saving, kitchen design, compact kitchen, small space design',
        authorName: 'Michael Chen',
        authorEmail: 'michael@luxkitchens.com',
        categoryId: category.id,
      },
    });

    console.log('✅ Created blog posts:', blogPost1.title, blogPost2.title, blogPost3.title);

    // Create blog post tags relationships
    try {
      await prisma.blogPostTag.createMany({
        data: [
          { postId: blogPost1.id, tagId: tag1.id },
          { postId: blogPost2.id, tagId: tag2.id },
          { postId: blogPost3.id, tagId: tag1.id },
        ],
      });
      console.log('✅ Created blog post tag relationships');
    } catch (error) {
      console.log('⚠️ Tag relationships may already exist, skipping...');
    }

    console.log('🎉 Sample blog data created successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- 1 Category: Kitchen Design');
    console.log('- 2 Tags: Modern, Luxury');
    console.log('- 3 Blog Posts: All published and ready to display');
    console.log('');
    console.log('🌐 Test your blog at: http://localhost:3000/blog');
    console.log('🔗 Test API at: http://localhost:3000/api/public/blog');

  } catch (error) {
    console.error('❌ Error creating sample blog data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleBlogData();