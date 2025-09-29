const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugBestSellers() {
  try {
    console.log('🔍 Debugging Best Sellers data...\n');

    // Get best sellers like the homepage does
    const bestSellers = await prisma.product.findMany({
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { sold: 'desc' },
        { numReviews: 'desc' },
        { rating: 'desc' },
      ],
      take: 12,
      select: {
        id: true,
        title: true,
        slug: true,
        rating: true,
        numReviews: true,
        sold: true,
        featured: true,
        bestSeller: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(`📊 Found ${bestSellers.length} best sellers total\n`);

    // Group by category
    const byCategory = {};
    bestSellers.forEach((product) => {
      if (product.category) {
        const categorySlug = product.category.slug;
        if (!byCategory[categorySlug]) {
          byCategory[categorySlug] = {
            categoryName: product.category.name,
            categorySlug: categorySlug,
            products: [],
          };
        }
        byCategory[categorySlug].products.push({
          title: product.title,
          featured: product.featured,
          bestSeller: product.bestSeller,
          sold: product.sold || 0,
          rating: product.rating,
        });
      }
    });

    console.log('📂 Products by category:\n');
    Object.values(byCategory).forEach((section) => {
      console.log(`🏷️  ${section.categoryName} (${section.categorySlug}):`);
      console.log(`   - ${section.products.length} products`);
      section.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title}`);
        console.log(
          `      Featured: ${product.featured}, Best Seller: ${product.bestSeller}, Sold: ${product.sold}, Rating: ${product.rating}`
        );
      });
      console.log('');
    });

    // Check specifically for cabinets and countertops
    const cabinets = byCategory['cabinets'];
    const countertops = byCategory['countertops'];

    console.log('🎯 Specific check for Cabinets and Countertops:\n');
    console.log('Cabinets section:', cabinets ? 'Found' : 'NOT FOUND');
    if (cabinets) {
      console.log(`  - ${cabinets.products.length} cabinet products`);
    }

    console.log('Countertops section:', countertops ? 'Found' : 'NOT FOUND');
    if (countertops) {
      console.log(`  - ${countertops.products.length} countertop products`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugBestSellers();
