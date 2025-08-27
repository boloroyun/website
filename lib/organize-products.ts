interface Product {
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
}

interface CategorySection {
  categoryName: string;
  categorySlug: string;
  products: Product[];
}

/**
 * Organizes products by their categories
 * @param products - Array of products to organize
 * @param prioritizeFeatured - If true, prioritizes featured products first
 * @returns Array of category sections with their products
 */
export function organizeProductsByCategory(
  products: Product[],
  prioritizeFeatured: boolean = false
): CategorySection[] {
  // Group products by category
  const categoryMap = new Map<string, CategorySection>();

  products.forEach((product) => {
    if (!product.category) return;

    const categoryKey = product.category.slug;

    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, {
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        products: [],
      });
    }

    categoryMap.get(categoryKey)!.products.push(product);
  });

  // Convert to array and sort by category name
  const sections = Array.from(categoryMap.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );

  // Sort products within each category
  sections.forEach((section) => {
    section.products.sort((a, b) => {
      if (prioritizeFeatured) {
        // For Best Sellers: Prioritize featured products first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        // Among featured products, prioritize best sellers
        if (a.featured && b.featured) {
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
        }

        // Among non-featured products, prioritize best sellers
        if (!a.featured && !b.featured) {
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
        }
      } else {
        // Default sorting: featured status, then best seller, then rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        // Then by best seller status
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
      }

      // Finally by rating
      return b.rating - a.rating;
    });
  });

  return sections;
}

/**
 * Limits the number of products per category and overall
 * @param sections - Category sections
 * @param maxProductsPerCategory - Maximum products per category
 * @param maxCategories - Maximum number of categories to include
 * @returns Limited category sections
 */
export function limitCategorySections(
  sections: CategorySection[],
  maxProductsPerCategory: number = 4,
  maxCategories: number = 3
): CategorySection[] {
  return sections.slice(0, maxCategories).map((section) => ({
    ...section,
    products: section.products.slice(0, maxProductsPerCategory),
  }));
}

/**
 * Gets category sections with balanced product distribution
 * Ensures each category has at least one product before adding more
 * @param sections - Category sections
 * @param totalProducts - Total number of products to distribute
 * @returns Balanced category sections
 */
export function getBalancedCategorySections(
  sections: CategorySection[],
  totalProducts: number = 12
): CategorySection[] {
  if (sections.length === 0) return [];

  // Calculate products per category
  const baseProductsPerCategory = Math.floor(totalProducts / sections.length);
  const remainingProducts = totalProducts % sections.length;

  return sections
    .map((section, index) => {
      const productsForThisCategory =
        baseProductsPerCategory + (index < remainingProducts ? 1 : 0);

      return {
        ...section,
        products: section.products.slice(
          0,
          Math.min(productsForThisCategory, section.products.length)
        ),
      };
    })
    .filter((section) => section.products.length > 0);
}

/**
 * Gets featured products from each category, prioritizing featured items
 * @param sections - Category sections
 * @param maxFeaturedPerCategory - Maximum featured products per category
 * @param maxCategories - Maximum number of categories
 * @returns Category sections with featured products prioritized
 */
export function getFeaturedCategorySections(
  sections: CategorySection[],
  maxFeaturedPerCategory: number = 4,
  maxCategories: number = 6
): CategorySection[] {
  return sections
    .slice(0, maxCategories)
    .map((section) => {
      // First, try to get featured products
      const featuredProducts = section.products.filter(
        (product) => product.featured
      );
      const nonFeaturedProducts = section.products.filter(
        (product) => !product.featured
      );

      // Take up to maxFeaturedPerCategory featured products first
      let selectedProducts = featuredProducts.slice(0, maxFeaturedPerCategory);

      // If we don't have enough featured products, fill with non-featured ones
      if (selectedProducts.length < maxFeaturedPerCategory) {
        const remainingSlots = maxFeaturedPerCategory - selectedProducts.length;
        selectedProducts = [
          ...selectedProducts,
          ...nonFeaturedProducts.slice(0, remainingSlots),
        ];
      }

      return {
        ...section,
        products: selectedProducts,
      };
    })
    .filter((section) => section.products.length > 0);
}
