export type DietaryLabel =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "contains-nuts"
  | "halal";

export type MenuItemStatus = "AVAILABLE" | "SOLD_OUT" | "HIDDEN";

export type ModifierOption = {
  id: string;
  name: string;
  priceDeltaCents: number;
  isDefault: boolean;
  sortOrder: number;
};

export type ModifierGroup = {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: ModifierOption[];
};

export type MenuAddon = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  dietaryLabels: DietaryLabel[];
  isAvailable: boolean;
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
};

export type MenuItem = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  description: string;
  basePriceCents: number;
  imageUrl?: string;
  status: MenuItemStatus;
  spiceLevel: number;
  dietaryLabels: DietaryLabel[];
  allergenTags: string[];
  isPopular: boolean;
  prepTimeMinutes: number;
  sortOrder: number;
  modifierGroups: ModifierGroup[];
  addons: MenuAddon[];
};

export type ComboSuggestion = {
  id: string;
  slug: string;
  name: string;
  description: string;
  savingsText: string;
  sortOrder: number;
  itemSlugs: string[];
  roles: Record<string, string>;
};

export type MenuFilters = {
  category?: string;
  search?: string;
  dietary?: DietaryLabel[];
  maxSpice?: number;
  popularOnly?: boolean;
  includeUnavailable?: boolean;
};

export type MenuResponse = {
  categories: MenuCategory[];
  items: MenuItem[];
  popularItems: MenuItem[];
  combos: ComboSuggestion[];
  filters: {
    dietaryLabels: DietaryLabel[];
    spiceLevels: number[];
  };
};

export type SelectedModifier = {
  groupId: string;
  optionIds: string[];
};

export type QuoteLineInput = {
  itemSlug: string;
  quantity: number;
  modifiers: SelectedModifier[];
  addonSlugs: string[];
  specialInstructions?: string;
};
