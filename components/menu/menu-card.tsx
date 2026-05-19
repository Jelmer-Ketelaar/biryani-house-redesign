"use client";

import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/lib/stores/cart-store";
import type { MenuItemDto } from "@/lib/validation/menu";

export function MenuCard({ item }: Readonly<{ item: MenuItemDto }>) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="group overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-black text-secondary-foreground">
              <Sparkles className="h-3 w-3" />
              {item.category}
            </span>
            <CardTitle className="mt-3">{item.name}</CardTitle>
          </div>
          <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-sm font-black text-accent-foreground">
            EUR {item.price.toFixed(2)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="min-h-12 text-sm leading-6 text-muted-foreground">{item.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          <span className="text-xs font-bold text-muted-foreground">
            {item.available ? "Available today" : "Temporarily sold out"}
          </span>
          <Button
            size="sm"
            disabled={!item.available}
            onClick={() =>
              addItem({
                id: item.id,
                itemSlug: item.id,
                name: item.name,
                quantity: 1,
                unitPriceCents: Math.round(item.price * 100),
                addonSlugs: [],
                addonNames: []
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
