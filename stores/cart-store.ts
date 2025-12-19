import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface CartState {
  items: CartItem[];

  // Computed properties
  totalItems: number;
  totalAmount: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItem: (productId: number) => CartItem | undefined;
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.product.id === product.id);

        let newItems: CartItem[];

        if (existingItem) {
          // Update quantity if item already exists
          newItems = items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          newItems = [...items, { product, quantity }];
        }

        const { totalItems, totalAmount } = calculateTotals(newItems);
        set({ items: newItems, totalItems, totalAmount });
      },

      removeItem: (productId: number) => {
        const { items } = get();
        const newItems = items.filter((item) => item.product.id !== productId);
        const { totalItems, totalAmount } = calculateTotals(newItems);
        set({ items: newItems, totalItems, totalAmount });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeItem(productId);
          return;
        }

        const newItems = items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );

        const { totalItems, totalAmount } = calculateTotals(newItems);
        set({ items: newItems, totalItems, totalAmount });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 });
      },

      getItem: (productId: number) => {
        const { items } = get();
        return items.find((item) => item.product.id === productId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { totalItems, totalAmount } = calculateTotals(state.items);
          state.totalItems = totalItems;
          state.totalAmount = totalAmount;
        }
      },
    }
  )
);
