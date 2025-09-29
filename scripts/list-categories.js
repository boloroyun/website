const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAllCategories() {
  try {
    console.log('📂 Fetching all categories...');

    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log(`\n✅ Found ${allCategories.length} categories in database:\n`);

    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
      console.log(`   - Products: ${cat._count.products}`);
      console.log(
        `   - Images: ${cat.images.length > 0 ? cat.images[0].url : 'No image'}`
      );
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllCategories();
