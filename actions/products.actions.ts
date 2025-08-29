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

// Best Sellers (products sorted by sold count)
export async function getBestSellers(limit: number = 10) {
  try {
    console.log(`🏆 Fetching best seller products (limit: ${limit})...`);

    const bestSellers = await getPrisma().product.findMany({
      orderBy: [
        { featured: 'desc' },
        { bestSeller: 'desc' },
        { sold: 'desc' },
        { numReviews: 'desc' },
        { rating: 'desc' },
      ],
      take: limit,
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
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    console.log(`📈 Found ${bestSellers.length} best seller products`);

    // Transform data for frontend use
    const formattedProducts = bestSellers.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      slug: product.slug,
      brand: product.brand,
      rating: product.rating,
      numReviews: product.numReviews,
      sold: product.sold,
      discount: product.discount,
      pricingType: product.pricingType,
      images: product.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
      sizes: product.sizes,
      colors: product.colors,
      category: product.category,
      subCategories:
        product.productSubCategories?.map((psc) => ({
          id: psc.subCategory.id,
          name: psc.subCategory.name,
          slug: psc.subCategory.slug,
        })) || [],
      featured: product.featured,
      bestSeller: product.bestSeller,
    }));

    console.log(
      '🔗 Best sellers formatted:',
      formattedProducts.length,
      'products'
    );

    return { success: true, data: formattedProducts };
  } catch (error) {
    console.error('❌ Error fetching best sellers:', error);
    return {
      success: false,
      error: 'Failed to fetch best sellers',
      details: error,
    };
  }
}

// Featured Products
export async function getFeaturedProducts(limit: number = 8) {
  try {
    console.log(`⭐ Fetching featured products (limit: ${limit})...`);

    const featuredProducts = await getPrisma().product.findMany({
      where: {
        featured: true,
      },
      orderBy: [
        { rating: 'desc' },
        { numReviews: 'desc' },
        { createdAt: 'desc' },
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

    console.log(`✨ Found ${featuredProducts.length} featured products`);

    const formattedProducts = featuredProducts.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      slug: product.slug,
      brand: product.brand,
      rating: product.rating,
      numReviews: product.numReviews,
      sold: product.sold,
      discount: product.discount,
      pricingType: product.pricingType,
      images: product.images
        .map((image) => ({
          url: image.url || '',
          public_id: image.public_id || '',
        }))
        .filter((image) => image.url),
      sizes: product.sizes,
      colors: product.colors,
      category: product.category,
      featured: product.featured,
      bestSeller: product.bestSeller,
    }));

    return { success: true, data: formattedProducts };
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return {
      success: false,
      error: 'Failed to fetch featured products',
      details: error,
    };
  }
}

// New Arrivals (products sorted by creation date, distributed across categories)
export async function getNewArrivals(limit: number = 10) {
  try {
    console.log(`🆕 Fetching new arrival products (limit: ${limit})...`);

    // Fetch more products to ensure good distribution across categories
    const fetchLimit = Math.max(limit * 2, 30); // Fetch at least 30 or double the limit

    const newArrivals = await getPrisma().product.findMany({
      orderBy: [
        { createdAt: 'desc' },
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      take: fetchLimit,
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
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    console.log(
      `🛍️ Found ${newArrivals.length} new arrival products (fetched ${fetchLimit}, target: ${limit})`
    );

    // If we fetched more than needed, select a balanced subset across categories
    let selectedProducts = newArrivals;
    if (newArrivals.length > limit) {
      // Group by category
      const byCategory = newArrivals.reduce(
        (acc, product) => {
          const categorySlug = product.category?.slug || 'no-category';
          if (!acc[categorySlug]) acc[categorySlug] = [];
          acc[categorySlug].push(product);
          return acc;
        },
        {} as Record<string, typeof newArrivals>
      );

      // Select products from each category in round-robin fashion
      selectedProducts = [];
      const categories = Object.keys(byCategory);
      let categoryIndex = 0;
      const maxPerCategory = Math.ceil(limit / categories.length);

      while (
        selectedProducts.length < limit &&
        categories.some((cat) => byCategory[cat].length > 0)
      ) {
        const currentCategory = categories[categoryIndex];
        const categoryProducts = byCategory[currentCategory];

        if (categoryProducts.length > 0) {
          const product = categoryProducts.shift();
          if (product) selectedProducts.push(product);
        }

        categoryIndex = (categoryIndex + 1) % categories.length;
      }

      console.log(
        `🎯 Selected ${selectedProducts.length} products balanced across ${categories.length} categories`
      );
    }

    // Transform data for frontend use
    const formattedProducts = selectedProducts.map((product) => ({
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
      subCategories:
        product.productSubCategories?.map((psc) => ({
          id: psc.subCategory.id,
          name: psc.subCategory.name,
          slug: psc.subCategory.slug,
        })) || [],
      featured: product.featured,
      bestSeller: product.bestSeller,
    }));

    console.log(
      '🔗 New arrivals formatted:',
      formattedProducts.length,
      'products'
    );

    return { success: true, data: formattedProducts };
  } catch (error) {
    console.error('❌ Error fetching new arrivals:', error);
    return {
      success: false,
      error: 'Failed to fetch new arrivals',
      details: error,
    };
  }
}

// All Products (with optional filtering)
export async function getAllProducts(options?: {
  categoryId?: string;
  featured?: boolean;
  bestSeller?: boolean;
  limit?: number;
}) {
  try {
    console.log('📦 Fetching all products with filters:', options);

    const whereClause: any = {};

    if (options?.categoryId) {
      whereClause.categoryId = options.categoryId;
    }
    if (options?.featured !== undefined) {
      whereClause.featured = options.featured;
    }
    if (options?.bestSeller !== undefined) {
      whereClause.bestSeller = options.bestSeller;
    }

    const products = await getPrisma().product.findMany({
      where: whereClause,
      orderBy: [{ rating: 'desc' }, { sold: 'desc' }, { createdAt: 'desc' }],
      take: options?.limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(`📦 Found ${products.length} products`);

    return { success: true, data: products };
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return {
      success: false,
      error: 'Failed to fetch products',
      details: error,
    };
  }
}

// Search Products by title keyword
export async function searchProducts(keyword: string, limit: number = 20) {
  try {
    console.log(
      `🔍 Searching products with keyword: "${keyword}" (limit: ${limit})`
    );

    if (!keyword || keyword.trim().length < 2) {
      return {
        success: false,
        error: 'Search keyword must be at least 2 characters',
      };
    }

    const searchResults = await getPrisma().product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword.trim(),
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            brand: {
              contains: keyword.trim(),
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: keyword.trim(),
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            colors: {
              some: {
                name: {
                  contains: keyword.trim(),
                  mode: 'insensitive', // Case-insensitive search
                },
              },
            },
          },
        ],
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
      `📊 Found ${searchResults.length} products matching "${keyword}"`
    );

    // Transform data for frontend use
    const formattedProducts = searchResults.map((product) => ({
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
    console.error('❌ Error searching products:', error);
    return {
      success: false,
      error: 'Failed to search products',
      details: error,
    };
  }
}

// Get popular colors from products
export async function getPopularColors() {
  try {
    console.log('🎨 Fetching popular colors from products...');

    // Get products that have colors and are popular
    const productsWithColors = await getPrisma().product.findMany({
      where: {
        colors: {
          isEmpty: false, // Only products that have colors
        },
        OR: [{ featured: true }, { bestSeller: true }, { sold: { gt: 0 } }],
      },
      select: {
        colors: true,
        featured: true,
        bestSeller: true,
        sold: true,
      },
      orderBy: [{ featured: 'desc' }, { bestSeller: 'desc' }, { sold: 'desc' }],
      take: 50,
    });

    console.log(`🎨 Found ${productsWithColors.length} products with colors`);

    // Extract and count colors with popularity scoring
    const colorCounts: Record<
      string,
      { count: number; color: string; name: string }
    > = {};

    productsWithColors.forEach((product) => {
      const popularity =
        (product.bestSeller ? 3 : 0) +
        (product.featured ? 2 : 0) +
        Math.min(product.sold || 0, 3);

      product.colors.forEach((colorObj) => {
        const colorKey = colorObj.color.toLowerCase();
        if (!colorCounts[colorKey]) {
          colorCounts[colorKey] = {
            count: 0,
            color: colorObj.color,
            name: colorObj.name,
          };
        }
        colorCounts[colorKey].count += popularity;
      });
    });

    // Get top 8 colors, sorted by popularity
    const popularColors = Object.values(colorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((colorData) => ({
        name: colorData.name,
        color: colorData.color,
        count: colorData.count,
      }));

    console.log(`🎨 Found ${popularColors.length} popular colors`);

    return {
      success: true,
      data: popularColors,
    };
  } catch (error) {
    console.error('Error fetching popular colors:', error);
    // Fallback to common colors
    return {
      success: true,
      data: [
        { name: 'White', color: '#FFFFFF', count: 0 },
        { name: 'Black', color: '#000000', count: 0 },
        { name: 'Gray', color: '#808080', count: 0 },
        { name: 'Brown', color: '#8B4513', count: 0 },
        { name: 'Beige', color: '#F5F5DC', count: 0 },
        { name: 'Blue', color: '#0000FF', count: 0 },
      ],
    };
  }
}

// Get trending searches based on real data (brands and keywords only)
export async function getTrendingSearches() {
  try {
    // Get top brands from best-selling products
    const topBrands = await getPrisma().product.findMany({
      where: {
        brand: {
          not: null,
        },
        OR: [{ bestSeller: true }, { featured: true }, { sold: { gt: 0 } }],
      },
      select: {
        brand: true,
        sold: true,
        bestSeller: true,
        featured: true,
      },
      orderBy: [{ bestSeller: 'desc' }, { featured: 'desc' }, { sold: 'desc' }],
      take: 30,
    });

    // Extract unique brands and count their popularity
    const brandCounts: Record<string, number> = {};
    topBrands.forEach((product) => {
      if (product.brand) {
        const popularity =
          (product.bestSeller ? 3 : 0) +
          (product.featured ? 2 : 0) +
          Math.min(product.sold || 0, 5); // Cap sold count contribution
        brandCounts[product.brand] =
          (brandCounts[product.brand] || 0) + popularity;
      }
    });

    // Get top 4 brands
    const topBrandNames = Object.entries(brandCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([brand]) => brand);

    // Get popular product keywords from best sellers
    const bestSellingProducts = await getPrisma().product.findMany({
      where: {
        OR: [{ bestSeller: true }, { featured: true }, { sold: { gt: 5 } }],
      },
      select: {
        title: true,
        sold: true,
        bestSeller: true,
        featured: true,
      },
      orderBy: [{ bestSeller: 'desc' }, { featured: 'desc' }, { sold: 'desc' }],
      take: 100,
    });

    // Extract common keywords from product titles
    const keywordCounts: Record<string, number> = {};
    const skipWords = new Set([
      'the',
      'and',
      'or',
      'with',
      'for',
      'of',
      'in',
      'a',
      'an',
      'is',
      'to',
      'at',
      'by',
      'on',
    ]);

    bestSellingProducts.forEach((product) => {
      const words = product.title
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2 && !skipWords.has(word));

      const popularity =
        (product.bestSeller ? 3 : 0) +
        (product.featured ? 2 : 0) +
        Math.min(product.sold || 0, 3);

      words.forEach((word) => {
        keywordCounts[word] = (keywordCounts[word] || 0) + popularity;
      });
    });

    // Get top keywords, capitalize them
    const topKeywords = Object.entries(keywordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([keyword]) => keyword.charAt(0).toUpperCase() + keyword.slice(1));

    // Combine trending searches: brands + keywords only
    const trendingSearches = [...topBrandNames, ...topKeywords].slice(0, 8); // Limit to 8 trending searches

    return {
      success: true,
      data: trendingSearches,
    };
  } catch (error) {
    console.error('Error fetching trending searches:', error);
    // Fallback to default trending searches (brands and keywords only)
    return {
      success: true,
      data: ['MSI', 'Granite', 'Quartz', 'Marble', 'Kitchen', 'Bathroom'],
    };
  }
}
