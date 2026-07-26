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
  hasHydrated: boolean;
  markHydrated: () => void;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;

  return (
    typeof item.id === "string" &&
    typeof item.itemSlug === "string" &&
    typeof item.name === "string" &&
    Number.isInteger(item.unitPriceCents) &&
    Number.isInteger(item.quantity) &&
    (item.quantity ?? 0) >= 1 &&
    (item.quantity ?? 0) <= 20 &&
    Array.isArray(item.addonSlugs) &&
    item.addonSlugs.every((slug) => typeof slug === "string") &&
    Array.isArray(item.addonNames) &&
    item.addonNames.every((name) => typeof name === "string")
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      markHydrated: () => set({ hasHydrated: true }),
      addItem: (item) =>
        set((state) => {
          const addonSlugs = [...item.addonSlugs].sort();
          const existing = state.items.find(
            (cartItem) =>
              cartItem.itemSlug === item.itemSlug &&
              [...cartItem.addonSlugs].sort().join(",") === addonSlugs.join(",") &&
              cartItem.specialInstructions === item.specialInstructions
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === existing.id
                  ? { ...cartItem, quantity: Math.min(20, cartItem.quantity + item.quantity) }
                  : cartItem
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                addonSlugs,
                id: item.id ?? `${item.itemSlug}:${addonSlugs.join(",")}:${Date.now().toString(36)}`
              }
            ]
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((cartItem) => cartItem.id !== id)
              : state.items.map((cartItem) =>
                  cartItem.id === id ? { ...cartItem, quantity: Math.min(20, quantity) } : cartItem
                )
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),
      clear: () => set({ items: [] })
    }),
    {
      name: "biryani-house-cart",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<Pick<CartState, "items">>;
        return {
          ...currentState,
          items: Array.isArray(saved?.items) ? saved.items.filter(isCartItem) : []
        };
      }
    }
  )
);
