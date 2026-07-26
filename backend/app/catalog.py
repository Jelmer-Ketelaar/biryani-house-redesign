from copy import deepcopy

from app.menu_data import CATEGORIES, ITEMS

ADDONS = {
    "extra-raita": {
        "id": "addon-raita",
        "slug": "extra-raita",
        "name": "Extra raita",
        "description": "Kruidige yoghurt met diverse groenten.",
        "priceCents": 350,
        "dietaryLabels": ["vegetarian", "halal"],
        "isAvailable": True,
    },
    "garlic-bread-addon": {
        "id": "addon-garlic-bread",
        "slug": "garlic-bread-addon",
        "name": "Garlic Bread",
        "description": "Knoflookbrood als bijgerecht.",
        "priceCents": 399,
        "dietaryLabels": ["vegetarian", "halal"],
        "isAvailable": True,
    },
    "mango-chutney": {
        "id": "addon-chutney",
        "slug": "mango-chutney",
        "name": "Mango chutney",
        "description": "Zoete mango chutney voor bij een kruidig gerecht.",
        "priceCents": 125,
        "dietaryLabels": ["vegetarian", "halal"],
        "isAvailable": True,
    },
}

COMBOS = [
    {
        "id": "combo-dinner-two",
        "slug": "dinner-for-two",
        "name": "Dinner for two",
        "description": "Chicken biryani, butter chicken, garlic bread en mango lassi.",
        "savingsText": "Suggested pairing",
        "sortOrder": 1,
        "itemSlugs": [
            "chicken-biryani",
            "non-veg-butter-chicken",
            "garlic-bread",
            "mango-lassi",
        ],
        "roles": {},
    }
]
DIETARY = ["vegetarian", "vegan", "gluten-free", "dairy-free", "contains-nuts", "halal"]


def resolved_item(source: dict) -> dict:
    candidate = deepcopy(source)
    addon_slugs = candidate.pop("addonSlugs", [])
    candidate["addons"] = [deepcopy(ADDONS[slug]) for slug in addon_slugs]
    return candidate


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
        candidate = resolved_item(source)
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
        spice_level = candidate["spiceLevel"]
        if max_spice is not None and spice_level is not None and spice_level > max_spice:
            continue
        if dietary and not all(label in candidate["dietaryLabels"] for label in dietary):
            continue
        searchable = f"{candidate['name']} {candidate['description']}".lower()
        if search and search.lower() not in searchable:
            continue
        filtered.append(candidate)

    return {
        "categories": deepcopy(CATEGORIES),
        "items": filtered,
        "popularItems": [
            value for value in resolved_items if value["isPopular"] and value["status"] == "AVAILABLE"
        ][:6],
        "combos": deepcopy(COMBOS),
        "filters": {
            "dietaryLabels": [
                label for label in DIETARY if any(label in item["dietaryLabels"] for item in resolved_items)
            ],
            "spiceLevels": [0, 1, 2, 3],
        },
    }


def quote_line(
    item_slug: str,
    quantity: int,
    addon_slugs: list[str],
    base_price_cents: int | None = None,
) -> tuple[dict, int]:
    source = next(
        (value for value in ITEMS if value["slug"] == item_slug and value["status"] == "AVAILABLE"),
        None,
    )
    if source is None:
        raise ValueError(f"Menu item is unavailable: {item_slug}")

    candidate = resolved_item(source)
    addon_by_slug = {addon["slug"]: addon for addon in candidate["addons"]}
    invalid = [slug for slug in addon_slugs if slug not in addon_by_slug]
    if invalid:
        raise ValueError(f"Add-ons are unavailable for {item_slug}: {', '.join(invalid)}")

    item_price_cents = candidate["basePriceCents"] if base_price_cents is None else base_price_cents
    unit_cents = item_price_cents + sum(addon_by_slug[slug]["priceCents"] for slug in addon_slugs)
    return candidate, unit_cents * quantity
