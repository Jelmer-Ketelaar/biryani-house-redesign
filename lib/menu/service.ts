import "server-only";

import type { DietaryLabel, MenuFilters, MenuItem, MenuResponse, QuoteLineInput } from "@/lib/menu/types";

const categories = [
  {
    id: "cat-biryani",
    slug: "biryani",
    name: "Biryani",
    description: "Slow-cooked basmati rice with layered spices, herbs, and raita.",
    sortOrder: 1
  },
  {
    id: "cat-curry",
    slug: "curry",
    name: "Curry",
    description: "Comforting sauces, grilled proteins, and vegetarian classics.",
    sortOrder: 2
  },
  {
    id: "cat-tandoori",
    slug: "tandoori-grill",
    name: "Tandoori Grill",
    description: "Charred skewers and clay-oven favorites with chutneys.",
    sortOrder: 3
  },
  {
    id: "cat-sides",
    slug: "breads-rice",
    name: "Breads & Rice",
    description: "Fresh naan, extra rice, and cooling sides.",
    sortOrder: 4
  },
  {
    id: "cat-drinks",
    slug: "drinks",
    name: "Drinks",
    description: "Lassi, soft drinks, and meal finishers.",
    sortOrder: 5
  }
];

const addons = [
  {
    id: "addon-raita",
    slug: "extra-raita",
    name: "Extra raita",
    description: "Cooling yogurt with cucumber and toasted cumin.",
    priceCents: 195,
    dietaryLabels: ["vegetarian", "halal"] as DietaryLabel[],
    isAvailable: true
  },
  {
    id: "addon-naan",
    slug: "garlic-naan-addon",
    name: "Garlic naan",
    description: "Tandoor bread brushed with garlic butter.",
    priceCents: 350,
    dietaryLabels: ["vegetarian", "halal"] as DietaryLabel[],
    isAvailable: true
  },
  {
    id: "addon-chutney",
    slug: "mango-chutney",
    name: "Mango chutney",
    description: "Sweet mango relish for spicy dishes.",
    priceCents: 125,
    dietaryLabels: ["vegan", "vegetarian", "halal"] as DietaryLabel[],
    isAvailable: true
  }
];

function withAddons(item: Omit<MenuItem, "addons"> & { addonSlugs: string[] }): MenuItem {
  return {
    ...item,
    addons: item.addonSlugs
      .map((slug) => addons.find((addon) => addon.slug === slug))
      .filter((addon): addon is (typeof addons)[number] => Boolean(addon))
  };
}

const items: MenuItem[] = [
  withAddons({
    id: "item-chicken-biryani",
    slug: "chicken-biryani",
    categorySlug: "biryani",
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with marinated chicken, saffron, mint, and raita.",
    basePriceCents: 1495,
    status: "AVAILABLE",
    spiceLevel: 2,
    dietaryLabels: ["halal"],
    allergenTags: ["milk"],
    isPopular: true,
    prepTimeMinutes: 25,
    sortOrder: 1,
    addonSlugs: ["extra-raita", "garlic-naan-addon", "mango-chutney"],
    modifierGroups: [
      {
        id: "mg-chicken-spice",
        name: "Spice level",
        type: "SINGLE",
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        options: [
          { id: "mild", name: "Mild", priceDeltaCents: 0, isDefault: false, sortOrder: 1 },
          { id: "medium", name: "Medium", priceDeltaCents: 0, isDefault: true, sortOrder: 2 },
          { id: "hot", name: "Hot", priceDeltaCents: 0, isDefault: false, sortOrder: 3 }
        ]
      },
      {
        id: "mg-chicken-portion",
        name: "Portion",
        type: "SINGLE",
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2,
        options: [
          { id: "regular", name: "Regular", priceDeltaCents: 0, isDefault: true, sortOrder: 1 },
          { id: "large", name: "Large", priceDeltaCents: 350, isDefault: false, sortOrder: 2 }
        ]
      }
    ]
  }),
  withAddons({
    id: "item-butter-chicken",
    slug: "butter-chicken",
    categorySlug: "curry",
    name: "Butter Chicken",
    description: "Tandoori chicken in a rich tomato, cashew, cream, and fenugreek sauce.",
    basePriceCents: 1595,
    status: "AVAILABLE",
    spiceLevel: 1,
    dietaryLabels: ["halal", "contains-nuts"],
    allergenTags: ["milk", "cashew"],
    isPopular: true,
    prepTimeMinutes: 20,
    sortOrder: 1,
    addonSlugs: ["garlic-naan-addon"],
    modifierGroups: []
  }),
  withAddons({
    id: "item-chana-masala",
    slug: "chana-masala",
    categorySlug: "curry",
    name: "Chana Masala",
    description: "Chickpeas simmered with tomato, ginger, coriander, and roasted spices.",
    basePriceCents: 1195,
    status: "AVAILABLE",
    spiceLevel: 2,
    dietaryLabels: ["vegan", "vegetarian", "gluten-free", "halal"],
    allergenTags: [],
    isPopular: false,
    prepTimeMinutes: 18,
    sortOrder: 2,
    addonSlugs: ["mango-chutney"],
    modifierGroups: []
  }),
  withAddons({
    id: "item-tandoori-mix",
    slug: "tandoori-mix-grill",
    categorySlug: "tandoori-grill",
    name: "Tandoori Mix Grill",
    description: "Chicken tikka, seekh kebab, and grilled vegetables with mint chutney.",
    basePriceCents: 1895,
    status: "AVAILABLE",
    spiceLevel: 3,
    dietaryLabels: ["halal"],
    allergenTags: ["milk"],
    isPopular: true,
    prepTimeMinutes: 28,
    sortOrder: 1,
    addonSlugs: ["garlic-naan-addon", "extra-raita"],
    modifierGroups: []
  }),
  withAddons({
    id: "item-garlic-naan",
    slug: "garlic-naan",
    categorySlug: "breads-rice",
    name: "Garlic Naan",
    description: "Fresh tandoor naan with garlic butter and coriander.",
    basePriceCents: 350,
    status: "AVAILABLE",
    spiceLevel: 0,
    dietaryLabels: ["vegetarian", "halal"],
    allergenTags: ["gluten", "milk"],
    isPopular: true,
    prepTimeMinutes: 8,
    sortOrder: 1,
    addonSlugs: ["mango-chutney"],
    modifierGroups: []
  }),
  withAddons({
    id: "item-mango-lassi",
    slug: "mango-lassi",
    categorySlug: "drinks",
    name: "Mango Lassi",
    description: "Chilled mango yogurt drink with cardamom.",
    basePriceCents: 395,
    status: "AVAILABLE",
    spiceLevel: 0,
    dietaryLabels: ["vegetarian", "gluten-free", "halal"],
    allergenTags: ["milk"],
    isPopular: false,
    prepTimeMinutes: 3,
    sortOrder: 1,
    addonSlugs: [],
    modifierGroups: []
  })
];

const combos = [
  {
    id: "combo-dinner-two",
    slug: "dinner-for-two",
    name: "Dinner for two",
    description: "Chicken biryani, butter chicken, garlic naan, and mango lassi.",
    savingsText: "Save about EUR 4 vs separate items",
    sortOrder: 1,
    itemSlugs: ["chicken-biryani", "butter-chicken", "garlic-naan", "mango-lassi"],
    roles: {}
  }
];

export async function getMenu(filters: MenuFilters = {}): Promise<MenuResponse> {
  const filteredItems = items.filter((item) => {
    if (!filters.includeUnavailable && item.status !== "AVAILABLE") return false;
    if (filters.category && item.categorySlug !== filters.category) return false;
    if (filters.popularOnly && !item.isPopular) return false;
    if (typeof filters.maxSpice === "number" && item.spiceLevel > filters.maxSpice) return false;
    if (filters.dietary?.length && !filters.dietary.every((label) => item.dietaryLabels.includes(label))) {
      return false;
    }
    if (filters.search) {
      return `${item.name} ${item.description}`.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });

  return {
    categories,
    items: filteredItems,
    popularItems: items.filter((item) => item.isPopular && item.status === "AVAILABLE").slice(0, 6),
    combos,
    filters: {
      dietaryLabels: ["vegetarian", "vegan", "gluten-free", "dairy-free", "contains-nuts", "halal"],
      spiceLevels: [0, 1, 2, 3]
    }
  };
}

export async function quoteMenu(lines: QuoteLineInput[]) {
  const itemsBySlug = new Map(items.map((item) => [item.slug, item]));
  const subtotalCents = lines.reduce((sum, line) => {
    const item = itemsBySlug.get(line.itemSlug);
    if (!item || item.status !== "AVAILABLE") throw new Error(`Menu item is unavailable: ${line.itemSlug}`);
    const addonTotal = line.addonSlugs.reduce((addonSum, slug) => {
      const addon = item.addons.find((candidate) => candidate.slug === slug);
      return addonSum + (addon?.priceCents ?? 0);
    }, 0);
    return sum + (item.basePriceCents + addonTotal) * line.quantity;
  }, 0);

  return {
    subtotalCents,
    serviceFeeCents: subtotalCents > 0 ? 99 : 0,
    totalCents: subtotalCents > 0 ? subtotalCents + 99 : 0,
    upsells: items
      .filter((item) => item.isPopular && !lines.some((line) => line.itemSlug === item.slug))
      .slice(0, 3)
      .map((item) => ({ ...item, reason: "Popular with your order" })),
    comboSuggestions: combos
  };
}
