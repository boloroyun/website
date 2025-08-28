'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  uid: string; // productid_size_qty format
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  maxQuantity: number;
  image: string;
  slug: string;
  // Optional additional properties for enhanced functionality
  vendor?: any; // JSON data for vendor information
  color?: {
    name: string;
    color: string; // Color hex code
    image?: string; // Optional image URL for color swatch
  };
  // Additional properties that might be useful
  sku?: string;
  discount?: number;
  originalPrice?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  // Actions
  addItem: (item: Omit<CartItem, 'uid'>) => void;
  updateQuantity: (uid: string, quantity: number) => void;
  removeItem: (uid: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemByUid: (uid: string) => CartItem | undefined;
}

const generateUid = (productId: string, size: string): string => {
  return `${productId}_${size}`;
};

// Utility function to create a complete cart item with all required properties
export const createCartItem = (
  baseItem: Omit<CartItem, 'uid'>,
  options?: {
    vendor?: any;
    color?: CartItem['color'];
    sku?: string;
    discount?: number;
    originalPrice?: number;
  }
): CartItem => {
  const uid = generateUid(baseItem.productId, baseItem.size);

  return {
    ...baseItem,
    uid,
    // Include optional properties if provided
    vendor: options?.vendor,
    color: options?.color,
    sku: options?.sku,
    discount: options?.discount,
    originalPrice: options?.originalPrice,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (newItem) => {
        // Validate required properties
        const requiredFields = [
          'productId',
          'name',
          'price',
          'quantity',
          'size',
          'maxQuantity',
          'image',
          'slug',
        ];
        for (const field of requiredFields) {
          if ((newItem as any)[field] === undefined || (newItem as any)[field] === null) {
            console.error(`❌ Missing required field: ${field}`, newItem);
            throw new Error(`Missing required field: ${field}`);
          }
        }

        const uid = generateUid(newItem.productId, newItem.size);
        const existingItem = get().items.find((item) => item.uid === uid);

        if (existingItem) {
          // If item exists, update quantity (but don't exceed max)
          const newQuantity = Math.min(
            existingItem.quantity + newItem.quantity,
            existingItem.maxQuantity
          );
          set((state) => ({
            items: state.items.map((item) =>
              item.uid === uid ? { ...item, quantity: newQuantity } : item
            ),
          }));
        } else {
          // Add new item with all properties
          const cartItem: CartItem = {
            ...newItem,
            uid,
            quantity: Math.min(newItem.quantity, newItem.maxQuantity),
            // Ensure optional properties are defined (with defaults if not provided)
            vendor: newItem.vendor || undefined,
            color: newItem.color || undefined,
            sku: newItem.sku || undefined,
            discount: newItem.discount || 0,
            originalPrice: newItem.originalPrice || newItem.price,
          };
          set((state) => ({
            items: [...state.items, cartItem],
          }));
        }
      },

      updateQuantity: (uid, quantity) => {
        if (quantity <= 0) {
          get().removeItem(uid);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.uid === uid) {
              return {
                ...item,
                quantity: Math.min(Math.max(1, quantity), item.maxQuantity),
              };
            }
            return item;
          }),
        }));
      },

      removeItem: (uid) => {
        set((state) => ({
          items: state.items.filter((item) => item.uid !== uid),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemByUid: (uid) => {
        return get().items.find((item) => item.uid === uid);
      },
    }),
    {
      name: 'lux-cart-storage',
      // Only persist the items, not the isOpen or hasHydrated state
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
