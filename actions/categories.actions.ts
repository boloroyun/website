'use server';

import { PrismaClient } from '@prisma/client';

// Lazy Prisma initialization
let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Get all categories with their subcategories
export async function getAllCategories() {
  try {
    console.log('📂 Fetching all categories with subcategories...');

    const categories = await getPrisma().category.findMany({
      include: {
        subCategories: {
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log(`📁 Found ${categories.length} categories`);

    // Transform data for frontend use
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      images: category.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
      productCount: category._count.products,
      subCategories: category.subCategories.map((subCat) => ({
        id: subCat.id,
        name: subCat.name,
        slug: subCat.slug,
        images: subCat.images
          .map((image) => ({
            url: image.url || '',
            public_id: image.public_id || '',
          }))
          .filter((image) => image.url),
      })),
    }));

    console.log('🔗 Categories formatted with subcategories');

    return { success: true, data: formattedCategories };
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories',
      details: error,
    };
  }
}

// Get all subcategories (flat list)
export async function getAllSubCategories() {
  try {
    console.log('📂 Fetching all subcategories...');

    const subCategories = await getPrisma().subCategory.findMany({
      include: {
        parent: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            productSubCategories: true,
          },
        },
      },
      orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
    });

    console.log(`📁 Found ${subCategories.length} subcategories`);

    // Transform data for frontend use
    const formattedSubCategories = subCategories.map((subCat) => ({
      id: subCat.id,
      name: subCat.name,
      slug: subCat.slug,
      images: subCat.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
      parent: subCat.parent,
      productCount: subCat._count.productSubCategories,
    }));

    console.log('🔗 Subcategories formatted');

    return { success: true, data: formattedSubCategories };
  } catch (error) {
    console.error('❌ Error fetching subcategories:', error);
    return {
      success: false,
      error: 'Failed to fetch subcategories',
      details: error,
    };
  }
}

// Get categories for navigation/menu (without subcategories for performance)
export async function getCategoriesForNav() {
  try {
    console.log('🧭 Fetching categories for navigation...');

    const categories = await getPrisma().category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
      },
      orderBy: { name: 'asc' },
    });

    console.log(`📁 Found ${categories.length} categories for navigation`);

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      images: category.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
    }));

    return { success: true, data: formattedCategories };
  } catch (error) {
    console.error('❌ Error fetching categories for navigation:', error);
    return {
      success: false,
      error: 'Failed to fetch categories for navigation',
      details: error,
    };
  }
}

// Get a single category with its products and subcategories
export async function getCategoryWithProducts(slug: string) {
  try {
    console.log(`📂 Fetching category by slug: ${slug}`);

    const category = await getPrisma().category.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: [
            { featured: 'desc' },
            { bestSeller: 'desc' },
            { rating: 'desc' },
            { sold: 'desc' },
          ],
          take: 20, // Limit products for performance
          include: {
            productSubCategories: {
              include: {
                subCategory: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        subCategories: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    console.log(
      `📁 Found category: ${category.name} with ${category.products.length} products`
    );

    return { success: true, data: category };
  } catch (error) {
    console.error('❌ Error fetching category with products:', error);
    return {
      success: false,
      error: 'Failed to fetch category with products',
      details: error,
    };
  }
}
