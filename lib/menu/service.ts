import "server-only";

import { backendFetch } from "@/lib/backend/client";
import type { MenuFilters, MenuResponse } from "@/lib/menu/types";

export async function getMenu(filters: MenuFilters = {}): Promise<MenuResponse> {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.search) query.set("search", filters.search);
  if (filters.dietary?.length) query.set("dietary", filters.dietary.join(","));
  if (typeof filters.maxSpice === "number") query.set("maxSpice", String(filters.maxSpice));
  if (filters.popularOnly) query.set("popularOnly", "true");
  if (filters.includeUnavailable) query.set("includeUnavailable", "true");

  const menu = await backendFetch<MenuResponse>(`/api/menu?${query.toString()}`);
  if (!menu) throw new Error("Menu backend returned no data");
  return menu;
}
