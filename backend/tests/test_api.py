from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.catalog import ITEMS
from app.db import Base, get_db
from app.main import app
from app.models import Location, MenuItem

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
Base.metadata.create_all(engine)
with Session(engine) as session:
    location = Location(
        slug="dordrecht",
        name="Biryani House Dordrecht",
        address_line1="Voorstraat 394",
        postal_code="3311 VP",
        city="Dordrecht",
        phone="+31 6 41685055",
        email="hello@biryanihousedordrecht.com",
    )
    session.add(location)
    session.flush()
    session.add_all(
        MenuItem(
            location_id=location.id,
            slug=item["slug"],
            name=item["name"],
            price=Decimal(item["basePriceCents"]) / 100,
        )
        for item in ITEMS
    )
    session.commit()


def override_db():
    with Session(engine) as session:
        yield session


app.dependency_overrides[get_db] = override_db
client = TestClient(app)


def test_menu_contract() -> None:
    response = client.get("/api/menu?popularOnly=true")
    assert response.status_code == 200
    payload = response.json()
    assert payload["categories"]
    assert payload["items"]
    assert all(item["isPopular"] for item in payload["items"])


def test_menu_rejects_unknown_dietary_label() -> None:
    response = client.get("/api/menu?dietary=unknown")
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "BAD_REQUEST"


def test_order_validation_uses_existing_error_contract() -> None:
    response = client.post("/api/orders", json={})
    assert response.status_code == 400
    assert response.json()["error"]["message"] == "Request validation failed"


def test_order_rejects_past_schedule() -> None:
    response = client.post(
        "/api/orders",
        json={
            "serviceType": "TAKEAWAY",
            "scheduledFor": "2020-01-01T18:00:00Z",
            "customer": {
                "name": "Test Guest",
                "email": "guest@example.com",
                "phone": "+31612345678",
            },
            "items": [{"itemSlug": "chicken-biryani", "quantity": 1}],
        },
    )

    assert response.status_code == 400
    assert response.json()["error"]["message"] == "Request validation failed"
