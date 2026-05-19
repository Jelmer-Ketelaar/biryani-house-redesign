import "server-only";

import { getMenu } from "@/lib/menu/service";
import type { MenuItemDto } from "@/lib/validation/menu";

export async function getFeaturedMenuItems() {
  return getMenuItems();
}

export async function getMenuItems() {
  const menu = await getMenu({ includeUnavailable: true });
  const categoryBySlug = new Map(menu.categories.map((category) => [category.slug, category.name]));

  return menu.items.map<MenuItemDto>((item) => ({
    id: item.slug,
    name: item.name,
    description: item.description,
    category: categoryBySlug.get(item.categorySlug) ?? item.categorySlug,
    price: item.basePriceCents / 100,
    available: item.status === "AVAILABLE"
  }));
}
