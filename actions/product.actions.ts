'use server';

import prisma from '@/lib/prisma';

// Get a single product by slug with all related data
export async function getProductBySlug(slug: string) {
  try {
    console.log(`🔍 Fetching product by slug: ${slug}`);

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        productSubCategories: {
          include: {
            subCategory: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        productReviews: {
          include: {
            review: {
              include: {
                reviewBy: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      console.log(`❌ Product not found with slug: ${slug}`);
      return { success: false, error: 'Product not found' };
    }

    console.log(`✅ Found product: ${product.title}`);

    // Transform data for frontend use
    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      longDescription: product.longDescription,
      slug: product.slug,
      brand: product.brand ?? undefined,
      rating: product.rating,
      numReviews: product.numReviews,
      sold: product.sold ?? undefined,
      discount: product.discount ?? undefined,
      pricingType: product.pricingType,
      featured: product.featured,
      bestSeller: product.bestSeller,
      sku: product.sku,
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
      benefits: product.benefits,
      ingredients: product.ingredients,
      category: product.category,
      categoryId: product.categoryId, // Include categoryId for related products
      subCategories: product.productSubCategories.map((psc) => psc.subCategory),
      reviews: product.productReviews.map((pr) => ({
        id: pr.review.id,
        rating: pr.review.rating,
        review: pr.review.review,
        reviewCreatedAt: pr.review.reviewCreatedAt,
        verified: pr.review.verified,
        reviewBy: pr.review.reviewBy.username,
      })),
    };

    return { success: true, data: formattedProduct };
  } catch (error) {
    console.error('❌ Error fetching product by slug:', error);
    return {
      success: false,
      error: 'Failed to fetch product',
      details: error,
    };
  }
}

// Get related products (same category, excluding current product)
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 8
) {
  try {
    console.log(
      `🔄 Fetching related products for category: ${categoryId}, excluding product: ${productId}`
    );

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
        id: { not: productId }, // Exclude current product
      },
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { rating: 'desc' },
        { sold: 'desc' },
      ],
      take: limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(
      `✅ Found ${relatedProducts.length} related products in category: ${categoryId}`
    );

    // If we don't have enough products from the same category, fetch from other categories
    let finalProducts = relatedProducts;
    if (relatedProducts.length < limit) {
      console.log(
        `🔄 Not enough products in same category (${relatedProducts.length}/${limit}), fetching from other categories...`
      );

      const additionalProducts = await prisma.product.findMany({
        where: {
          categoryId: { not: categoryId }, // Different category
          id: { not: productId }, // Exclude current product
        },
        orderBy: [
          { featured: 'desc' },
          { bestSeller: 'desc' },
          { rating: 'desc' },
          { sold: 'desc' },
        ],
        take: limit - relatedProducts.length, // Fill the remaining spots
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });

      finalProducts = [...relatedProducts, ...additionalProducts];
      console.log(
        `✅ Total related products: ${finalProducts.length} (${relatedProducts.length} same category + ${additionalProducts.length} other categories)`
      );
    }

    // Transform data for frontend use
    const formattedProducts = finalProducts.map((product) => ({
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
      category: product.category,
      featured: product.featured,
      bestSeller: product.bestSeller,
    }));

    return { success: true, data: formattedProducts };
  } catch (error) {
    console.error('❌ Error fetching related products:', error);
    return {
      success: false,
      error: 'Failed to fetch related products',
      details: error,
    };
  }
}

// Get Related Products Organized by Categories (for "You May Also Like" section)
export async function getRelatedProductsByCategory(
  productId: string,
  currentCategoryId: string,
  productsPerCategory: number = 4,
  maxCategories: number = 6
) {
  try {
    console.log(
      `🔄 Fetching related products by category for product: ${productId}, excluding category: ${currentCategoryId}`
    );

    // First, get products from the same category (excluding current product)
    const sameCategory = await prisma.product.findMany({
      where: {
        categoryId: currentCategoryId,
        id: { not: productId },
      },
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { rating: 'desc' },
        { sold: 'desc' },
      ],
      take: productsPerCategory,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    // Then get products from other categories
    const otherCategories = await prisma.product.findMany({
      where: {
        categoryId: { not: currentCategoryId },
        id: { not: productId },
      },
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { rating: 'desc' },
        { sold: 'desc' },
      ],
      take: productsPerCategory * (maxCategories - 1), // Get enough for other categories
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(
      `✅ Found ${sameCategory.length} products from same category, ${otherCategories.length} from other categories`
    );

    // Combine and organize by categories
    const allProducts = [...sameCategory, ...otherCategories];

    // Group by category
    const byCategory = allProducts.reduce(
      (acc, product) => {
        const categorySlug = product.category?.slug || 'no-category';
        const categoryName = product.category?.name || 'Other';

        if (!acc[categorySlug]) {
          acc[categorySlug] = {
            categorySlug,
            categoryName,
            products: [],
          };
        }

        if (acc[categorySlug].products.length < productsPerCategory) {
          acc[categorySlug].products.push(product);
        }

        return acc;
      },
      {} as Record<
        string,
        { categorySlug: string; categoryName: string; products: any[] }
      >
    );

    // Convert to array and limit categories
    const categorySections = Object.values(byCategory)
      .filter((section) => section.products.length > 0)
      .slice(0, maxCategories)
      .map((section) => ({
        categorySlug: section.categorySlug,
        categoryName: section.categoryName,
        products: section.products.map((product) => ({
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
            .map((image: any) => ({
              url: image.url || '',
              public_id: image.public_id || '',
            }))
            .filter((image: any) => image.url),
          sizes: product.sizes,
          colors: product.colors.map((color: any) => ({
            ...color,
            image: color.image ?? undefined,
          })),
          category: product.category,
          featured: product.featured,
          bestSeller: product.bestSeller,
        })),
      }));

    const totalProducts = categorySections.reduce(
      (total, section) => total + section.products.length,
      0
    );

    console.log(
      `📊 Organized into ${categorySections.length} categories with ${totalProducts} total products`
    );

    return { success: true, data: categorySections };
  } catch (error) {
    console.error(
      `❌ Error fetching related products by category for product ${productId}:`,
      error
    );
    return {
      success: false,
      error: 'Failed to fetch related products by category',
      details: error,
    };
  }
}
