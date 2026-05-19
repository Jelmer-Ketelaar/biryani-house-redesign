"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  itemSlug: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  addonSlugs: string[];
  addonNames: string[];
  specialInstructions?: string;
};

type AddCartItemInput = Omit<CartItem, "id"> & { id?: string };

type CartState = {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  subtotalCents: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id:
                item.id ??
                `${item.itemSlug}:${item.addonSlugs.sort().join(",")}:${Date.now().toString(36)}`
            }
          ]
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((cartItem) =>
              cartItem.id === id
                ? {
                    ...cartItem,
                    quantity: Math.max(1, Math.min(20, quantity))
                  }
                : cartItem
            )
            .filter((cartItem) => cartItem.quantity > 0)
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),
      clear: () => set({ items: [] }),
      subtotalCents: () =>
        get().items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
    }),
    {
      name: "biryani-house-cart",
      partialize: (state) => ({ items: state.items })
    }
  )
);
