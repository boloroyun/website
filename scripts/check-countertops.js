const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCountertops() {
  try {
    console.log('🔍 Checking Countertops products...\n');

    // Get all countertop products
    const countertops = await prisma.product.findMany({
      where: {
        category: {
          slug: 'countertops',
        },
      },
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { sold: 'desc' },
        { numReviews: 'desc' },
        { rating: 'desc' },
      ],
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

    console.log(`📊 Found ${countertops.length} countertop products total\n`);

    if (countertops.length > 0) {
      console.log('🏆 Top 10 Countertop products:');
      countertops.slice(0, 10).forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(
          `   Featured: ${product.featured}, Best Seller: ${product.bestSeller}, Sold: ${product.sold || 0}, Rating: ${product.rating}`
        );
      });
    } else {
      console.log('❌ No countertop products found!');
    }

    // Also check the overall ranking
    console.log('\n🔍 Checking overall product ranking...');
    const allProducts = await prisma.product.findMany({
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { sold: 'desc' },
        { numReviews: 'desc' },
        { rating: 'desc' },
      ],
      take: 20,
      select: {
        title: true,
        featured: true,
        bestSeller: true,
        sold: true,
        rating: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log('\n📈 Top 20 products overall:');
    allProducts.forEach((product, index) => {
      const categoryName = product.category?.name || 'No Category';
      console.log(`${index + 1}. ${product.title} (${categoryName})`);
      console.log(
        `   Featured: ${product.featured}, Best Seller: ${product.bestSeller}, Sold: ${product.sold || 0}, Rating: ${product.rating}`
      );
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCountertops();
