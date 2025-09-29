const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCountertopsCategory() {
  try {
    console.log('🏗️ Adding Countertops category...');

    // Check if Countertops category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: 'countertops' },
    });

    if (existingCategory) {
      console.log('✅ Countertops category already exists!');
      console.log('Category:', existingCategory);
      return;
    }

    // Create the Countertops category
    const countertopsCategory = await prisma.category.create({
      data: {
        name: 'Countertops',
        slug: 'countertops',
        images: [
          {
            url: '/images/countertops-category.jpg',
            public_id: 'countertops-category',
          },
        ],
      },
    });

    console.log('✅ Successfully created Countertops category!');
    console.log('Category:', countertopsCategory);

    // Also check what categories we have now
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    console.log('\n📂 All categories in database:');
    allCategories.forEach((cat) => {
      console.log(
        `- ${cat.name} (${cat.slug}) - ${cat._count.products} products`
      );
    });
  } catch (error) {
    console.error('❌ Error adding Countertops category:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCountertopsCategory();
