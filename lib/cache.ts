// Simple in-memory cache for server-side data
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const cache = new SimpleCache();

// Cache wrapper for async functions
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    console.log(`🎯 Cache hit for key: ${key}`);
    return cached;
  }

  console.log(`🔄 Cache miss for key: ${key}, fetching...`);

  // Execute function and cache result
  const result = await fn();
  cache.set(key, result, ttlSeconds);

  return result;
}

// Cleanup expired cache items every 5 minutes
if (typeof window === 'undefined') {
  setInterval(
    () => {
      cache.cleanup();
    },
    5 * 60 * 1000
  );
}

// Cache keys for common data
export const CACHE_KEYS = {
  BEST_SELLERS: (limit: number) => `best-sellers-${limit}`,
  NEW_ARRIVALS: (limit: number) => `new-arrivals-${limit}`,
  CATEGORIES: 'categories',
  SUB_CATEGORIES: 'sub-categories',
  WEBSITE_BANNERS: 'website-banners',
  APP_BANNERS: 'app-banners',
  SPECIAL_COMBOS: 'special-combos',
  CRAZY_DEALS: 'crazy-deals',
  PRODUCT: (slug: string) => `product-${slug}`,
  CATEGORY_PRODUCTS: (slug: string, page: number) =>
    `category-${slug}-page-${page}`,
} as const;
