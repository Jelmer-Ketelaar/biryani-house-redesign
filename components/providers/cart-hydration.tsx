"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/stores/cart-store";

export function CartHydration() {
  useEffect(() => {
    void Promise.resolve(useCartStore.persist.rehydrate()).finally(() => {
      useCartStore.getState().markHydrated();
    });
  }, []);

  return null;
}
