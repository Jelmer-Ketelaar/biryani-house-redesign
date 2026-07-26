from decimal import Decimal

from pwdlib import PasswordHash
from sqlalchemy import select

from app.catalog import ITEMS
from app.db import SessionLocal
from app.models import Location, MenuItem, User


def run() -> None:
    with SessionLocal.begin() as db:
        location = db.scalar(select(Location).where(Location.slug == "dordrecht"))
        if location is None:
            location = Location(
                slug="dordrecht",
                name="Biryani House Dordrecht",
                address_line1="Voorstraat 394",
                postal_code="3311 VP",
                city="Dordrecht",
                phone="+31 6 41685055",
                email="hello@biryanihousedordrecht.com",
            )
            db.add(location)
            db.flush()
        else:
            location.name = "Biryani House Dordrecht"
            location.address_line1 = "Voorstraat 394"
            location.postal_code = "3311 VP"
            location.city = "Dordrecht"
            location.phone = "+31 6 41685055"
            location.email = "hello@biryanihousedordrecht.com"

        existing_items = {
            item.slug: item
            for item in db.scalars(select(MenuItem).where(MenuItem.location_id == location.id))
        }
        for catalog_item in ITEMS:
            existing_item = existing_items.get(catalog_item["slug"])
            price = Decimal(catalog_item["basePriceCents"]) / 100
            if existing_item is None:
                db.add(
                    MenuItem(
                        location_id=location.id,
                        slug=catalog_item["slug"],
                        name=catalog_item["name"],
                        price=price,
                    )
                )
            else:
                existing_item.name = catalog_item["name"]
                existing_item.price = price
                existing_item.active = True

        if db.scalar(select(User).where(User.email == "admin@example.com")) is None:
            db.add(
                User(
                    name="Restaurant admin",
                    email="admin@example.com",
                    password_hash=PasswordHash.recommended().hash("change-me-now"),
                    roles=["USER", "ADMIN"],
                )
            )
    print("Seed complete. Change the development admin password before any shared deployment.")


if __name__ == "__main__":
    run()
