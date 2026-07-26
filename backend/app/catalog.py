from copy import deepcopy

CATEGORIES = [
    {
        "id": "cat-biryani",
        "slug": "biryani",
        "name": "Biryani",
        "description": "Slow-cooked basmati rice with layered spices, herbs, and raita.",
        "sortOrder": 1,
    },
    {
        "id": "cat-curry",
        "slug": "curry",
        "name": "Curry",
        "description": "Comforting sauces, grilled proteins, and vegetarian classics.",
        "sortOrder": 2,
    },
    {
        "id": "cat-tandoori",
        "slug": "tandoori-grill",
        "name": "Tandoori Grill",
        "description": "Charred skewers and clay-oven favorites with chutneys.",
        "sortOrder": 3,
    },
    {
        "id": "cat-sides",
        "slug": "breads-rice",
        "name": "Breads & Rice",
        "description": "Fresh naan, extra rice, and cooling sides.",
        "sortOrder": 4,
    },
    {
        "id": "cat-drinks",
        "slug": "drinks",
        "name": "Drinks",
        "description": "Lassi, soft drinks, and meal finishers.",
        "sortOrder": 5,
    },
]

ADDONS = {
    "extra-raita": {
        "id": "addon-raita",
        "slug": "extra-raita",
        "name": "Extra raita",
        "description": "Cooling yogurt with cucumber and toasted cumin.",
        "priceCents": 195,
        "dietaryLabels": ["vegetarian", "halal"],
        "isAvailable": True,
    },
    "garlic-naan-addon": {
        "id": "addon-naan",
        "slug": "garlic-naan-addon",
        "name": "Garlic naan",
        "description": "Tandoor bread brushed with garlic butter.",
        "priceCents": 350,
        "dietaryLabels": ["vegetarian", "halal"],
        "isAvailable": True,
    },
    "mango-chutney": {
        "id": "addon-chutney",
        "slug": "mango-chutney",
        "name": "Mango chutney",
        "description": "Sweet mango relish for spicy dishes.",
        "priceCents": 125,
        "dietaryLabels": ["vegan", "vegetarian", "halal"],
        "isAvailable": True,
    },
}


def item(
    slug: str,
    category: str,
    name: str,
    description: str,
    price: int,
    spice: int,
    dietary: list[str],
    allergens: list[str],
    popular: bool,
    prep: int,
    addons: list[str],
) -> dict:
    return {
        "id": f"item-{slug}",
        "slug": slug,
        "categorySlug": category,
        "name": name,
        "description": description,
        "basePriceCents": price,
        "status": "AVAILABLE",
        "spiceLevel": spice,
        "dietaryLabels": dietary,
        "allergenTags": allergens,
        "isPopular": popular,
        "prepTimeMinutes": prep,
        "sortOrder": 1,
        "modifierGroups": [],
        "addons": [ADDONS[value] for value in addons],
    }


ITEMS = [
    item(
        "chicken-biryani",
        "biryani",
        "Chicken Biryani",
        "Fragrant basmati rice layered with marinated chicken, saffron, mint, and raita.",
        1495,
        2,
        ["halal"],
        ["milk"],
        True,
        25,
        ["extra-raita", "garlic-naan-addon", "mango-chutney"],
    ),
    item(
        "butter-chicken",
        "curry",
        "Butter Chicken",
        "Tandoori chicken in a rich tomato, cashew, cream, and fenugreek sauce.",
        1595,
        1,
        ["halal", "contains-nuts"],
        ["milk", "cashew"],
        True,
        20,
        ["garlic-naan-addon"],
    ),
    item(
        "chana-masala",
        "curry",
        "Chana Masala",
        "Chickpeas simmered with tomato, ginger, coriander, and roasted spices.",
        1195,
        2,
        ["vegan", "vegetarian", "gluten-free", "halal"],
        [],
        False,
        18,
        ["mango-chutney"],
    ),
    item(
        "tandoori-mix-grill",
        "tandoori-grill",
        "Tandoori Mix Grill",
        "Chicken tikka, seekh kebab, and grilled vegetables with mint chutney.",
        1895,
        3,
        ["halal"],
        ["milk"],
        True,
        28,
        ["garlic-naan-addon", "extra-raita"],
    ),
    item(
        "garlic-naan",
        "breads-rice",
        "Garlic Naan",
        "Fresh tandoor naan with garlic butter and coriander.",
        350,
        0,
        ["vegetarian", "halal"],
        ["gluten", "milk"],
        True,
        8,
        ["mango-chutney"],
    ),
    item(
        "mango-lassi",
        "drinks",
        "Mango Lassi",
        "Chilled mango yogurt drink with cardamom.",
        395,
        0,
        ["vegetarian", "gluten-free", "halal"],
        ["milk"],
        False,
        3,
        [],
    ),
]

COMBOS = [
    {
        "id": "combo-dinner-two",
        "slug": "dinner-for-two",
        "name": "Dinner for two",
        "description": "Chicken biryani, butter chicken, garlic naan, and mango lassi.",
        "savingsText": "Suggested pairing",
        "sortOrder": 1,
        "itemSlugs": ["chicken-biryani", "butter-chicken", "garlic-naan", "mango-lassi"],
        "roles": {},
    }
]
DIETARY = ["vegetarian", "vegan", "gluten-free", "dairy-free", "contains-nuts", "halal"]


def get_menu(
    category: str | None = None,
    search: str | None = None,
    dietary: list[str] | None = None,
    max_spice: int | None = None,
    popular_only: bool = False,
    include_unavailable: bool = False,
    inventory: dict[str, tuple[int, bool, bool]] | None = None,
) -> dict:
    dietary = dietary or []
    resolved_items = []
    for source in ITEMS:
        candidate = deepcopy(source)
        if inventory is not None:
            inventory_item = inventory.get(candidate["slug"])
            if inventory_item is None:
                continue
            price_cents, active, available = inventory_item
            if not active:
                continue
            candidate["basePriceCents"] = price_cents
            candidate["status"] = "AVAILABLE" if available else "SOLD_OUT"
        resolved_items.append(candidate)

    filtered = []
    for candidate in resolved_items:
        if not include_unavailable and candidate["status"] != "AVAILABLE":
            continue
        if category and candidate["categorySlug"] != category:
            continue
        if popular_only and not candidate["isPopular"]:
            continue
        if max_spice is not None and candidate["spiceLevel"] > max_spice:
            continue
        if dietary and not all(label in candidate["dietaryLabels"] for label in dietary):
            continue
        if search and search.lower() not in f"{candidate['name']} {candidate['description']}".lower():
            continue
        filtered.append(candidate)
    return {
        "categories": deepcopy(CATEGORIES),
        "items": deepcopy(filtered),
        "popularItems": deepcopy(
            [value for value in resolved_items if value["isPopular"] and value["status"] == "AVAILABLE"][:6]
        ),
        "combos": deepcopy(COMBOS),
        "filters": {"dietaryLabels": DIETARY, "spiceLevels": [0, 1, 2, 3]},
    }


def quote_line(
    item_slug: str,
    quantity: int,
    addon_slugs: list[str],
    base_price_cents: int | None = None,
) -> tuple[dict, int]:
    candidate = next(
        (value for value in ITEMS if value["slug"] == item_slug and value["status"] == "AVAILABLE"), None
    )
    if candidate is None:
        raise ValueError(f"Menu item is unavailable: {item_slug}")
    addon_by_slug = {addon["slug"]: addon for addon in candidate["addons"]}
    invalid = [slug for slug in addon_slugs if slug not in addon_by_slug]
    if invalid:
        raise ValueError(f"Add-ons are unavailable for {item_slug}: {', '.join(invalid)}")
    item_price_cents = candidate["basePriceCents"] if base_price_cents is None else base_price_cents
    unit_cents = item_price_cents + sum(addon_by_slug[slug]["priceCents"] for slug in addon_slugs)
    return candidate, unit_cents * quantity
