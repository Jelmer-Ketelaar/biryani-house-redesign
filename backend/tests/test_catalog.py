from app.catalog import get_menu, quote_line


def test_menu_filters_dietary_and_spice() -> None:
    menu = get_menu(dietary=["vegan"], max_spice=2)
    assert [item["slug"] for item in menu["items"]] == ["chana-masala"]


def test_quote_includes_allowed_addons() -> None:
    item, total = quote_line("chicken-biryani", 2, ["extra-raita"])
    assert item["name"] == "Chicken Biryani"
    assert total == (1495 + 195) * 2


def test_inventory_controls_public_price_and_availability() -> None:
    inventory = {
        "chicken-biryani": (1595, True, False),
        "chana-masala": (1250, True, True),
    }

    menu = get_menu(include_unavailable=True, inventory=inventory)

    assert [item["slug"] for item in menu["items"]] == ["chicken-biryani", "chana-masala"]
    assert menu["items"][0]["basePriceCents"] == 1595
    assert menu["items"][0]["status"] == "SOLD_OUT"
    assert menu["items"][1]["basePriceCents"] == 1250


def test_quote_uses_database_price_override() -> None:
    _, total = quote_line("chicken-biryani", 2, ["extra-raita"], base_price_cents=1595)

    assert total == (1595 + 195) * 2
