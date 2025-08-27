import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBlog() {
  console.log('🌱 Seeding blog data...');

  try {
    // Create blog categories
    const kitchenDesignCategory = await prisma.blogCategory.create({
      data: {
        name: 'Kitchen Design',
        slug: 'kitchen-design',
        description: 'Latest trends and tips for modern kitchen design',
        color: '#3B82F6',
        image: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
          public_id: 'kitchen-design-category',
        },
      },
    });

    const cabinetTipsCategory = await prisma.blogCategory.create({
      data: {
        name: 'Cabinet Tips',
        slug: 'cabinet-tips',
        description: 'Expert advice on cabinet selection and maintenance',
        color: '#10B981',
        image: {
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          public_id: 'cabinet-tips-category',
        },
      },
    });

    const stoneGuideCategory = await prisma.blogCategory.create({
      data: {
        name: 'Stone Guide',
        slug: 'stone-guide',
        description: 'Complete guide to natural stones and countertops',
        color: '#8B5CF6',
        image: {
          url: 'https://images.unsplash.com/photo-1574782771005-94f8e5a5af1d?w=800&h=600&fit=crop',
          public_id: 'stone-guide-category',
        },
      },
    });

    const homeRenovationCategory = await prisma.blogCategory.create({
      data: {
        name: 'Home Renovation',
        slug: 'home-renovation',
        description: 'Tips and guides for complete home renovation projects',
        color: '#F59E0B',
        image: {
          url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=600&fit=crop',
          public_id: 'home-renovation-category',
        },
      },
    });

    console.log('✅ Created blog categories');

    // Create blog tags
    const tags = await Promise.all([
      prisma.blogTag.create({
        data: { name: 'Modern', slug: 'modern', color: '#3B82F6' },
      }),
      prisma.blogTag.create({
        data: { name: 'Traditional', slug: 'traditional', color: '#8B5A2B' },
      }),
      prisma.blogTag.create({
        data: { name: 'Minimalist', slug: 'minimalist', color: '#6B7280' },
      }),
      prisma.blogTag.create({
        data: { name: 'Luxury', slug: 'luxury', color: '#8B5CF6' },
      }),
      prisma.blogTag.create({
        data: {
          name: 'Budget-Friendly',
          slug: 'budget-friendly',
          color: '#10B981',
        },
      }),
      prisma.blogTag.create({
        data: { name: 'Maintenance', slug: 'maintenance', color: '#F59E0B' },
      }),
      prisma.blogTag.create({
        data: { name: 'Trends', slug: 'trends', color: '#EC4899' },
      }),
      prisma.blogTag.create({
        data: { name: 'DIY', slug: 'diy', color: '#EF4444' },
      }),
    ]);

    console.log('✅ Created blog tags');

    // Create sample blog posts
    const blogPosts = [
      {
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
          
          <h3>4. Smart Storage Solutions</h3>
          <p>Innovation in storage continues with pull-out pantries, hidden spice racks, and drawer organizers that maximize every inch of space. These solutions keep countertops clutter-free while ensuring everything has its place.</p>
          
          <h3>5. Sustainable Materials</h3>
          <p>Eco-conscious homeowners are choosing sustainable materials like reclaimed wood, recycled glass countertops, and low-VOC finishes. These choices benefit both the environment and indoor air quality.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop',
          public_id: 'modern-kitchen-trends-2024',
          alt: 'Modern kitchen with sleek design and bold colors',
          caption:
            'A stunning example of modern kitchen design featuring bold colors and mixed materials',
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            public_id: 'kitchen-trend-1',
            alt: 'Bold color palette kitchen',
            caption: 'Example of bold color palette in modern kitchen design',
          },
          {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            public_id: 'kitchen-trend-2',
            alt: 'Mixed materials kitchen',
            caption: 'Beautiful combination of wood and stone materials',
          },
        ],
        status: 'published',
        featured: true,
        published: true,
        publishedAt: new Date('2024-01-15T10:00:00Z'),
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
        categoryId: kitchenDesignCategory.id,
        tagIds: [tags[0].id, tags[6].id], // Modern, Trends
      },
      {
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
          <p>Hardware size should be proportional to your cabinet doors and drawers. Larger doors can handle bigger pulls, while smaller doors look best with appropriately sized knobs. A good rule of thumb is that pulls should be about 1/3 the width of the cabinet door.</p>
          
          <h3>Finish Selection</h3>
          <p>Choose finishes that complement your other kitchen elements. Popular options include brushed nickel for versatility, matte black for modern appeal, and brass for warmth and luxury. Consider durability and maintenance requirements when making your choice.</p>
          
          <h3>Functionality First</h3>
          <p>While aesthetics are important, don't forget about functionality. Pulls are generally easier to use than knobs, especially for drawers. Consider the daily users of your kitchen and their comfort when operating the hardware.</p>
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
        publishedAt: new Date('2024-01-12T14:30:00Z'),
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
        categoryId: cabinetTipsCategory.id,
        tagIds: [tags[5].id, tags[1].id], // Maintenance, Traditional
      },
      {
        title: 'Natural Stone vs Quartz: Making the Right Choice',
        slug: 'natural-stone-vs-quartz-countertops',
        excerpt:
          'Confused about choosing between natural stone and quartz for your countertops? This comprehensive guide breaks down the pros and cons of each.',
        content: `
          <h2>The Great Countertop Debate</h2>
          <p>Choosing the right countertop material is one of the most important decisions in kitchen design. Two of the most popular options—natural stone and quartz—each offer unique benefits. Understanding their differences will help you make the best choice for your lifestyle and budget.</p>
          
          <h3>Natural Stone: Timeless Beauty</h3>
          <p>Natural stone, particularly granite and marble, offers unmatched beauty with unique patterns that can't be replicated. Each slab is one-of-a-kind, creating a truly custom look for your kitchen.</p>
          
          <h4>Pros of Natural Stone:</h4>
          <ul>
            <li>Unique, natural patterns and colors</li>
            <li>Heat resistant</li>
            <li>Adds value to your home</li>
            <li>Can be repaired and refinished</li>
            <li>Natural antibacterial properties</li>
          </ul>
          
          <h4>Cons of Natural Stone:</h4>
          <ul>
            <li>Requires regular sealing</li>
            <li>Can stain and etch</li>
            <li>Higher maintenance</li>
            <li>More expensive installation</li>
          </ul>
          
          <h3>Quartz: Engineered Excellence</h3>
          <p>Quartz countertops are engineered stone surfaces made from natural quartz crystals combined with resins and pigments. This process creates a durable, consistent surface that's perfect for busy kitchens.</p>
          
          <h4>Pros of Quartz:</h4>
          <ul>
            <li>Non-porous and stain-resistant</li>
            <li>No sealing required</li>
            <li>Consistent patterns and colors</li>
            <li>Low maintenance</li>
            <li>Strong and durable</li>
          </ul>
          
          <h4>Cons of Quartz:</h4>
          <ul>
            <li>Can be damaged by extreme heat</li>
            <li>Limited repair options</li>
            <li>Artificial appearance</li>
            <li>Higher upfront cost</li>
          </ul>
          
          <h3>Making Your Decision</h3>
          <p>Consider your cooking habits, maintenance preferences, and budget when making your choice. If you love the natural beauty and don't mind regular maintenance, natural stone might be perfect. If you prefer low-maintenance surfaces with consistent appearance, quartz could be your ideal choice.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1574782771005-94f8e5a5af1d?w=1200&h=630&fit=crop',
          public_id: 'stone-vs-quartz-countertops',
          alt: 'Comparison of natural stone and quartz countertops',
          caption:
            'Side-by-side comparison of natural stone and engineered quartz surfaces',
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1574782771005-94f8e5a5af1d?w=800&h=600&fit=crop',
            public_id: 'natural-stone-countertop',
            alt: 'Natural stone countertop with unique veining',
            caption:
              'Beautiful natural stone countertop showcasing unique patterns',
          },
          {
            url: 'https://images.unsplash.com/photo-1574782771005-94f8e5a5af1d?w=800&h=600&fit=crop',
            public_id: 'quartz-countertop',
            alt: 'Quartz countertop with consistent pattern',
            caption: 'Engineered quartz countertop with consistent coloring',
          },
        ],
        status: 'published',
        featured: false,
        published: true,
        publishedAt: new Date('2024-01-10T09:15:00Z'),
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
        categoryId: stoneGuideCategory.id,
        tagIds: [tags[3].id, tags[4].id], // Luxury, Budget-Friendly
      },
      {
        title: 'Budget-Friendly Kitchen Renovation Ideas',
        slug: 'budget-friendly-kitchen-renovation-ideas',
        excerpt:
          'Transform your kitchen without breaking the bank. Discover practical renovation ideas that deliver maximum impact for minimal cost.',
        content: `
          <h2>Affordable Kitchen Transformations</h2>
          <p>A kitchen renovation doesn't have to cost a fortune. With smart planning and creative solutions, you can achieve a stunning transformation while staying within your budget. Here are proven strategies that deliver maximum impact for your investment.</p>
          
          <h3>Paint Your Cabinets</h3>
          <p>One of the most cost-effective ways to update your kitchen is by painting existing cabinets. Choose a fresh, modern color that complements your space. Proper preparation and quality paint will ensure professional-looking results.</p>
          
          <h3>Update Hardware</h3>
          <p>Swapping old cabinet hardware for new knobs and pulls can instantly modernize your kitchen. This simple change can make cabinets look brand new and is one of the most affordable updates you can make.</p>
          
          <h3>Add a Backsplash</h3>
          <p>A new backsplash can dramatically change your kitchen's appearance. Consider subway tiles for a classic look, or choose colorful mosaic tiles for a bold statement. Many tile options are DIY-friendly, saving on installation costs.</p>
          
          <h3>Upgrade Lighting</h3>
          <p>Good lighting can transform any space. Replace old fixtures with modern pendants or under-cabinet lighting. LED options are energy-efficient and come in various styles to match your design aesthetic.</p>
          
          <h3>Refinish Countertops</h3>
          <p>If replacement isn't in the budget, consider refinishing existing countertops. Options include concrete overlays, tile overlays, or specialized refinishing kits that can make old surfaces look new again.</p>
          
          <h3>Open Shelving</h3>
          <p>Remove some upper cabinet doors to create open shelving. This trendy look costs nothing but can make your kitchen feel larger and more modern. Display your favorite dishes and glassware for a personalized touch.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&h=630&fit=crop',
          public_id: 'budget-kitchen-renovation',
          alt: 'Before and after budget kitchen renovation',
          caption: 'Stunning kitchen transformation achieved on a budget',
        },
        images: [],
        status: 'published',
        featured: false,
        published: true,
        publishedAt: new Date('2024-01-08T11:45:00Z'),
        readTime: 4,
        views: 950,
        likes: 125,
        metaTitle:
          'Budget-Friendly Kitchen Renovation Ideas That Actually Work',
        metaDescription:
          'Transform your kitchen on a budget with these proven renovation ideas. Get maximum impact without breaking the bank.',
        metaKeywords:
          'budget kitchen renovation, affordable kitchen updates, DIY kitchen makeover, kitchen renovation tips',
        authorName: 'David Wilson',
        authorEmail: 'david@luxcabinets.com',
        authorImage:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        authorBio:
          'Budget renovation specialist and DIY expert with a passion for affordable home improvements.',
        categoryId: homeRenovationCategory.id,
        tagIds: [tags[4].id, tags[7].id], // Budget-Friendly, DIY
      },
      {
        title: 'Maintaining Your Kitchen Cabinets: A Complete Guide',
        slug: 'maintaining-kitchen-cabinets-complete-guide',
        excerpt:
          'Proper maintenance extends the life of your kitchen cabinets and keeps them looking beautiful. Learn the essential care tips from our experts.',
        content: `
          <h2>Protecting Your Investment</h2>
          <p>Kitchen cabinets are a significant investment in your home, and proper maintenance ensures they continue to look beautiful and function well for years to come. With the right care routine, your cabinets can maintain their appearance and structural integrity throughout their lifespan.</p>
          
          <h3>Daily Care Practices</h3>
          <p>Start with simple daily habits that prevent damage before it occurs. Wipe up spills immediately, especially those containing acids or oils. Use coasters under glasses and avoid slamming doors and drawers.</p>
          
          <h3>Regular Cleaning</h3>
          <p>Clean your cabinets weekly with a mild soap solution and a soft cloth. Avoid harsh chemicals or abrasive cleaners that can damage finishes. Always dry thoroughly to prevent water damage.</p>
          
          <h3>Hardware Maintenance</h3>
          <p>Check and tighten hardware regularly. Loose hinges and handles can cause unnecessary wear and tear. Lubricate hinges annually with a drop of light machine oil to ensure smooth operation.</p>
          
          <h3>Dealing with Different Finishes</h3>
          <p>Different cabinet finishes require specific care. Painted cabinets need gentle cleaning, wood cabinets may benefit from occasional conditioning, and laminate surfaces require non-abrasive cleaners.</p>
          
          <h3>Professional Maintenance</h3>
          <p>Consider professional maintenance every few years, especially for high-end finishes. Professionals can spot potential problems early and perform repairs that extend cabinet life.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=630&fit=crop',
          public_id: 'cabinet-maintenance-guide',
          alt: 'Person cleaning kitchen cabinets properly',
          caption:
            'Proper cabinet maintenance keeps your kitchen looking beautiful',
        },
        images: [],
        status: 'published',
        featured: false,
        published: true,
        publishedAt: new Date('2024-01-05T16:20:00Z'),
        readTime: 3,
        views: 650,
        likes: 45,
        metaTitle: 'Kitchen Cabinet Maintenance Guide | Keep Cabinets Like New',
        metaDescription:
          'Learn how to properly maintain your kitchen cabinets with this complete guide. Expert tips to extend cabinet life and preserve beauty.',
        metaKeywords:
          'cabinet maintenance, kitchen care, cabinet cleaning, home maintenance',
        authorName: 'Lisa Johnson',
        authorEmail: 'lisa@luxcabinets.com',
        authorImage:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        authorBio:
          'Home maintenance expert specializing in kitchen and cabinet care.',
        categoryId: cabinetTipsCategory.id,
        tagIds: [tags[5].id], // Maintenance
      },
    ];

    // Create blog posts
    for (const postData of blogPosts) {
      const { tagIds, ...postWithoutTags } = postData;

      const post = await prisma.blogPost.create({
        data: postWithoutTags,
      });

      // Create tag associations
      for (const tagId of tagIds) {
        await prisma.blogPostTag.create({
          data: {
            postId: post.id,
            tagId: tagId,
          },
        });
      }

      console.log(`✅ Created blog post: ${post.title}`);
    }

    // Create some sample comments
    const posts = await prisma.blogPost.findMany({ take: 2 });

    if (posts.length > 0) {
      await prisma.blogComment.create({
        data: {
          postId: posts[0].id,
          name: 'Sarah Mitchell',
          email: 'sarah.mitchell@example.com',
          content:
            "This article was incredibly helpful! I've been planning my kitchen renovation and these trends are exactly what I was looking for. The bold color palette idea especially caught my attention.",
          approved: true,
        },
      });

      await prisma.blogComment.create({
        data: {
          postId: posts[0].id,
          name: 'LUX Design Team',
          email: 'team@luxcabinets.com',
          content:
            "Thank you so much for the kind words, Sarah! We're thrilled that our trend guide is helping with your renovation planning. Feel free to reach out if you have any specific questions about implementing these trends in your space.",
          approved: true,
        },
      });

      await prisma.blogComment.create({
        data: {
          postId: posts[1].id,
          name: 'Mike Thompson',
          email: 'mike.t@example.com',
          content:
            'Great breakdown of hardware selection! I never realized how much the proportions matter. This guide helped me choose the perfect pulls for my cabinet doors.',
          approved: true,
        },
      });

      console.log('✅ Created sample comments');
    }

    console.log('🎉 Blog seeding completed successfully!');

    // Print summary
    const categoriesCount = await prisma.blogCategory.count();
    const tagsCount = await prisma.blogTag.count();
    const postsCount = await prisma.blogPost.count();
    const commentsCount = await prisma.blogComment.count();

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

// Run the seed function
seedBlog().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
