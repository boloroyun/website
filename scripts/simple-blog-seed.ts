import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simpleBlogSeed() {
  console.log('🌱 Creating blog data...');

  try {
    // Step 1: Create categories
    console.log('Creating categories...');
    const kitchenCategory = await prisma.blogCategory.create({
      data: {
        name: 'Kitchen Design',
        slug: 'kitchen-design',
        description: 'Latest trends and tips for modern kitchen design',
        color: '#3B82F6',
      },
    });

    const cabinetCategory = await prisma.blogCategory.create({
      data: {
        name: 'Cabinet Tips',
        slug: 'cabinet-tips',
        description: 'Expert advice on cabinet selection and maintenance',
        color: '#10B981',
      },
    });

    const stoneCategory = await prisma.blogCategory.create({
      data: {
        name: 'Stone Guide',
        slug: 'stone-guide',
        description: 'Complete guide to natural stones and countertops',
        color: '#8B5CF6',
      },
    });

    console.log('✅ Created categories');

    // Step 2: Create tags
    console.log('Creating tags...');
    const modernTag = await prisma.blogTag.create({
      data: { name: 'Modern', slug: 'modern', color: '#3B82F6' },
    });

    const trendsTag = await prisma.blogTag.create({
      data: { name: 'Trends', slug: 'trends', color: '#EC4899' },
    });

    const maintenanceTag = await prisma.blogTag.create({
      data: { name: 'Maintenance', slug: 'maintenance', color: '#F59E0B' },
    });

    const luxuryTag = await prisma.blogTag.create({
      data: { name: 'Luxury', slug: 'luxury', color: '#8B5CF6' },
    });

    console.log('✅ Created tags');

    // Step 3: Create blog posts
    console.log('Creating blog posts...');

    const post1 = await prisma.blogPost.create({
      data: {
        title: '10 Modern Kitchen Design Trends for 2024',
        slug: '10-modern-kitchen-design-trends-2024',
        excerpt:
          'Discover the hottest kitchen design trends that are shaping modern homes in 2024. From bold color schemes to innovative storage solutions.',
        content: `
          <h2>The Evolution of Modern Kitchen Design</h2>
          <p>Kitchen design continues to evolve, and 2024 brings exciting new trends that combine functionality with stunning aesthetics. Whether you're planning a complete renovation or looking for inspiration to update your current space, these trends will help you create a kitchen that's both beautiful and practical.</p>
          
          <h3>1. Bold Color Palettes</h3>
          <p>Gone are the days of all-white kitchens. This year, homeowners are embracing bold, saturated colors like deep navy blues, forest greens, and even dramatic blacks. These rich hues create depth and personality while maintaining sophistication.</p>
          
          <h3>2. Mixed Material Combinations</h3>
          <p>The trend of mixing materials continues to gain momentum. Think warm wood tones paired with cool marble, or matte black fixtures against natural stone. This approach creates visual interest and allows for more personalized design expressions.</p>
          
          <h3>3. Statement Range Hoods</h3>
          <p>Range hoods are no longer just functional—they're becoming the focal point of the kitchen. From sleek stainless steel designs to custom wood constructions, statement range hoods add architectural interest to any space.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop',
          public_id: 'modern-kitchen-trends-2024',
          alt: 'Modern kitchen with sleek design and bold colors',
          caption:
            'A stunning example of modern kitchen design featuring bold colors and mixed materials',
        },
        images: [],
        status: 'published',
        featured: true,
        published: true,
        publishedAt: new Date('2024-01-15T10:00:00.000Z'),
        readTime: 5,
        views: 1250,
        likes: 89,
        metaTitle:
          '10 Modern Kitchen Design Trends for 2024 | LUX Design Guide',
        metaDescription:
          'Discover the hottest kitchen design trends for 2024. From bold colors to smart storage, get inspired by the latest in modern kitchen design.',
        metaKeywords:
          'modern kitchen design, kitchen trends 2024, kitchen renovation, interior design',
        authorName: 'Sarah Thompson',
        authorEmail: 'sarah@luxcabinets.com',
        authorImage:
          'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop',
        authorBio:
          'Senior Interior Designer with over 10 years of experience in luxury kitchen design.',
        categoryId: kitchenCategory.id,
      },
    });

    const post2 = await prisma.blogPost.create({
      data: {
        title: 'How to Choose the Perfect Cabinet Hardware',
        slug: 'how-to-choose-perfect-cabinet-hardware',
        excerpt:
          'Cabinet hardware might seem like a small detail, but it can make or break your kitchen design. Learn how to select the perfect knobs and pulls.',
        content: `
          <h2>The Importance of Cabinet Hardware</h2>
          <p>Cabinet hardware is often called the "jewelry" of the kitchen, and for good reason. These small details can dramatically impact both the functionality and aesthetic appeal of your space. The right hardware choice can elevate a simple cabinet design to something truly special.</p>
          
          <h3>Consider Your Kitchen Style</h3>
          <p>The first step in choosing cabinet hardware is understanding your kitchen's overall style. A traditional kitchen might call for classic brass knobs, while a modern space could benefit from sleek, handleless designs or minimalist pulls.</p>
          
          <h3>Size and Proportion Matter</h3>
          <p>Hardware size should be proportional to your cabinet doors and drawers. Larger doors can handle bigger pulls, while smaller doors look best with appropriately sized knobs.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=630&fit=crop',
          public_id: 'cabinet-hardware-guide',
          alt: 'Various cabinet hardware options displayed',
          caption:
            'A selection of different cabinet hardware styles and finishes',
        },
        images: [],
        status: 'published',
        featured: true,
        published: true,
        publishedAt: new Date('2024-01-12T14:30:00.000Z'),
        readTime: 4,
        views: 890,
        likes: 67,
        metaTitle: 'How to Choose Perfect Cabinet Hardware | Expert Tips',
        metaDescription:
          'Learn how to select the perfect cabinet hardware for your kitchen. Expert tips on styles, sizes, and finishes.',
        metaKeywords:
          'cabinet hardware, kitchen knobs, cabinet pulls, kitchen renovation',
        authorName: 'Michael Rodriguez',
        authorEmail: 'michael@luxcabinets.com',
        authorImage:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        authorBio:
          'Kitchen design specialist with expertise in cabinet hardware and fixtures.',
        categoryId: cabinetCategory.id,
      },
    });

    const post3 = await prisma.blogPost.create({
      data: {
        title: 'Natural Stone vs Quartz: Making the Right Choice',
        slug: 'natural-stone-vs-quartz-countertops',
        excerpt:
          'Confused about choosing between natural stone and quartz for your countertops? This comprehensive guide breaks down the pros and cons of each.',
        content: `
          <h2>The Great Countertop Debate</h2>
          <p>Choosing the right countertop material is one of the most important decisions in kitchen design. Two of the most popular options—natural stone and quartz—each offer unique benefits.</p>
          
          <h3>Natural Stone: Timeless Beauty</h3>
          <p>Natural stone, particularly granite and marble, offers unmatched beauty with unique patterns that can't be replicated. Each slab is one-of-a-kind, creating a truly custom look for your kitchen.</p>
          
          <h3>Quartz: Engineered Excellence</h3>
          <p>Quartz countertops are engineered stone surfaces made from natural quartz crystals combined with resins and pigments. This process creates a durable, consistent surface that's perfect for busy kitchens.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1574782771005-94f8e5a5af1d?w=1200&h=630&fit=crop',
          public_id: 'stone-vs-quartz-countertops',
          alt: 'Comparison of natural stone and quartz countertops',
          caption:
            'Side-by-side comparison of natural stone and engineered quartz surfaces',
        },
        images: [],
        status: 'published',
        featured: false,
        published: true,
        publishedAt: new Date('2024-01-10T09:15:00.000Z'),
        readTime: 6,
        views: 1100,
        likes: 78,
        metaTitle:
          'Natural Stone vs Quartz Countertops: Complete Comparison Guide',
        metaDescription:
          'Compare natural stone and quartz countertops. Learn the pros and cons of each to make the right choice for your kitchen.',
        metaKeywords:
          'natural stone countertops, quartz countertops, kitchen countertops, granite vs quartz',
        authorName: 'Emily Chen',
        authorEmail: 'emily@luxcabinets.com',
        authorImage:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        authorBio:
          'Stone specialist and kitchen designer with 8 years of experience in natural and engineered surfaces.',
        categoryId: stoneCategory.id,
      },
    });

    console.log('✅ Created blog posts');

    // Step 4: Create tag associations
    console.log('Creating tag associations...');
    await prisma.blogPostTag.create({
      data: { postId: post1.id, tagId: modernTag.id },
    });
    await prisma.blogPostTag.create({
      data: { postId: post1.id, tagId: trendsTag.id },
    });
    await prisma.blogPostTag.create({
      data: { postId: post2.id, tagId: maintenanceTag.id },
    });
    await prisma.blogPostTag.create({
      data: { postId: post3.id, tagId: luxuryTag.id },
    });

    console.log('✅ Created tag associations');

    // Step 5: Create some comments
    console.log('Creating comments...');
    await prisma.blogComment.create({
      data: {
        postId: post1.id,
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@example.com',
        content:
          "This article was incredibly helpful! I've been planning my kitchen renovation and these trends are exactly what I was looking for.",
        approved: true,
      },
    });

    await prisma.blogComment.create({
      data: {
        postId: post1.id,
        name: 'LUX Design Team',
        email: 'team@luxcabinets.com',
        content:
          "Thank you so much for the kind words, Sarah! We're thrilled that our trend guide is helping with your renovation planning.",
        approved: true,
      },
    });

    await prisma.blogComment.create({
      data: {
        postId: post2.id,
        name: 'Mike Thompson',
        email: 'mike.t@example.com',
        content:
          'Great breakdown of hardware selection! I never realized how much the proportions matter.',
        approved: true,
      },
    });

    console.log('✅ Created comments');

    // Print summary
    const categoriesCount = await prisma.blogCategory.count();
    const tagsCount = await prisma.blogTag.count();
    const postsCount = await prisma.blogPost.count();
    const commentsCount = await prisma.blogComment.count();

    console.log('\n🎉 Blog seeding completed successfully!');
    console.log('\n📊 Blog Data Summary:');
    console.log(`- Categories: ${categoriesCount}`);
    console.log(`- Tags: ${tagsCount}`);
    console.log(`- Posts: ${postsCount}`);
    console.log(`- Comments: ${commentsCount}`);
  } catch (error) {
    console.error('❌ Error seeding blog data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

simpleBlogSeed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
