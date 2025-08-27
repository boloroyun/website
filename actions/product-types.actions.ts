'use server';

import prisma from '@/lib/prisma';

// Define product type sections
export interface ProductTypeSection {
  type: 'beauty' | 'cabinets' | 'stones' | 'other';
  title: string;
  description: string;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    images: Array<{
      url: string;
      public_id: string;
    }>;
    productCount: number;
    subCategories: Array<{
      id: string;
      name: string;
      slug: string;
      images: Array<{
        url: string;
        public_id: string;
      }>;
    }>;
  }>;
  products: Array<{
    id: string;
    title: string;
    description: string;
    slug: string;
    brand?: string;
    rating: number;
    numReviews: number;
    sold?: number;
    discount?: number;
    pricingType: string;
    images: Array<{
      url: string;
      public_id: string;
    }>;
    sizes: Array<{
      size: string;
      qty: number;
      price: number;
      sold: number;
    }>;
    colors: Array<{
      name: string;
      color: string;
      image?: string;
    }>;
    category?: {
      name: string;
      slug: string;
    };
    subCategories?: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    featured: boolean;
    bestSeller: boolean;
  }>;
}

// Function to classify categories by product type
function classifyProductType(
  categoryName: string,
  categorySlug: string
): ProductTypeSection['type'] {
  const name = categoryName.toLowerCase();
  const slug = categorySlug.toLowerCase();

  // Beauty products
  if (
    name.includes('perfume') ||
    name.includes('cosmetic') ||
    name.includes('makeup') ||
    name.includes('skincare') ||
    name.includes('beauty') ||
    name.includes('bath') ||
    name.includes('body') ||
    name.includes('fragrance') ||
    slug.includes('beauty')
  ) {
    return 'beauty';
  }

  // Cabinet products
  if (
    name.includes('cabinet') ||
    name.includes('furniture') ||
    name.includes('storage') ||
    name.includes('wardrobe') ||
    name.includes('shelf') ||
    slug.includes('cabinet') ||
    slug.includes('cabinets')
  ) {
    return 'cabinets';
  }

  // Stone products
  if (
    name.includes('stone') ||
    name.includes('marble') ||
    name.includes('granite') ||
    name.includes('tile') ||
    name.includes('ceramic') ||
    slug.includes('stone')
  ) {
    return 'stones';
  }

  return 'other';
}

// Get all products organized by type sections
export async function getAllProductsByType() {
  try {
    console.log('🏗️ Fetching all products organized by type sections...');

    // Fetch all categories with their products
    const categories = await prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: { name: 'asc' },
        },
        products: {
          orderBy: [
            { featured: 'desc' },
            { bestSeller: 'desc' },
            { rating: 'desc' },
            { sold: 'desc' },
          ],
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
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log(`📦 Found ${categories.length} categories`);

    // Initialize sections
    const sections: Map<ProductTypeSection['type'], ProductTypeSection> =
      new Map();

    sections.set('beauty', {
      type: 'beauty',
      title: 'Beauty & Personal Care',
      description:
        'Discover our luxury collection of beauty products, skincare, cosmetics, and fragrances.',
      categories: [],
      products: [],
    });

    sections.set('cabinets', {
      type: 'cabinets',
      title: 'Cabinets & Furniture',
      description:
        'Explore our premium collection of cabinets, storage solutions, and furniture pieces.',
      categories: [],
      products: [],
    });

    sections.set('stones', {
      type: 'stones',
      title: 'Stones & Materials',
      description:
        'Browse our exquisite selection of natural stones, tiles, and construction materials.',
      categories: [],
      products: [],
    });

    sections.set('other', {
      type: 'other',
      title: 'Other Products',
      description: 'Additional products and miscellaneous items.',
      categories: [],
      products: [],
    });

    // Classify and organize categories and products
    categories.forEach((category) => {
      const productType = classifyProductType(category.name, category.slug);
      const section = sections.get(productType);

      if (section && category.products.length > 0) {
        // Format category data
        const formattedCategory = {
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
        };

        // Format products data
        const formattedProducts = category.products.map((product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          slug: product.slug,
          brand: product.brand ?? undefined,
          rating: product.rating,
          numReviews: product.numReviews,
          sold: product.sold ?? undefined,
          discount: product.discount ?? undefined,
          pricingType: product.pricingType,
          images: product.images
            .map((image) => ({
              url: image.url || '',
              public_id: image.public_id || '',
            }))
            .filter((image) => image.url),
          sizes: product.sizes,
          colors: product.colors.map((color) => ({
            ...color,
            image: color.image ?? undefined,
          })),
          category: {
            name: category.name,
            slug: category.slug,
          },
          subCategories:
            product.productSubCategories?.map((psc) => ({
              id: psc.subCategory.id,
              name: psc.subCategory.name,
              slug: psc.subCategory.slug,
            })) || [],
          featured: product.featured,
          bestSeller: product.bestSeller,
        }));

        section.categories.push(formattedCategory);
        section.products.push(...formattedProducts);
      }
    });

    // Filter out empty sections
    const activeSections = Array.from(sections.values()).filter(
      (section) => section.products.length > 0
    );

    console.log(
      `🎯 Organized products into ${activeSections.length} type sections:`
    );
    activeSections.forEach((section) => {
      console.log(
        `  - ${section.title}: ${section.products.length} products in ${section.categories.length} categories`
      );
    });

    return { success: true, data: activeSections };
  } catch (error) {
    console.error('❌ Error fetching products by type:', error);
    return {
      success: false,
      error: 'Failed to fetch products by type',
      details: error,
    };
  }
}

// Get products for a specific type section
export async function getProductsByType(
  productType: ProductTypeSection['type']
) {
  try {
    console.log(`🔍 Fetching products for type: ${productType}`);

    const allSectionsResult = await getAllProductsByType();

    if (!allSectionsResult.success) {
      return allSectionsResult;
    }

    const targetSection = allSectionsResult.data?.find(
      (section) => section.type === productType
    );

    if (!targetSection) {
      return {
        success: false,
        error: `No products found for type: ${productType}`,
      };
    }

    return { success: true, data: targetSection };
  } catch (error) {
    console.error(`❌ Error fetching products for type ${productType}:`, error);
    return {
      success: false,
      error: `Failed to fetch products for type: ${productType}`,
      details: error,
    };
  }
}
