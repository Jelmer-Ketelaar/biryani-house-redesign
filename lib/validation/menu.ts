import { z } from "zod";

import type { MenuResponse as FullMenuResponse } from "@/lib/menu/types";

const dietaryLabels = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "contains-nuts",
  "halal"
] as const;

export const menuQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).max(80).optional(),
  dietary: z
    .string()
    .optional()
    .transform((value) => (value ? value.split(",").map((label) => label.trim()) : []))
    .pipe(z.array(z.enum(dietaryLabels))),
  maxSpice: z.coerce.number().int().min(0).max(3).optional(),
  popularOnly: z.coerce.boolean().optional().default(false),
  includeUnavailable: z.coerce.boolean().optional().default(false)
});

export const quoteLineSchema = z.object({
  itemSlug: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
  modifiers: z
    .array(
      z.object({
        groupId: z.string().trim().min(1),
        optionIds: z.array(z.string().trim().min(1)).max(10)
      })
    )
    .default([]),
  addonSlugs: z.array(z.string().trim().min(1)).max(12).default([]),
  specialInstructions: z.string().trim().max(240).optional()
});

export const quoteRequestSchema = z.object({
  lines: z.array(quoteLineSchema).min(1).max(40)
});

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().positive(),
  available: z.boolean()
});

export const menuResponseSchema = z.object({
  items: z.array(menuItemSchema)
});

export type MenuItemDto = z.infer<typeof menuItemSchema>;
export type MenuResponse = FullMenuResponse;
