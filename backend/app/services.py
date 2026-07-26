import logging
from datetime import UTC, datetime
from decimal import Decimal
from secrets import token_hex

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.catalog import quote_line
from app.models import Address, Customer, IntegrationJob, Location, MenuItem, Order, OrderItem
from app.schemas import CreateOrderInput

logger = logging.getLogger(__name__)


def money(cents: int) -> Decimal:
    return Decimal(cents) / Decimal(100)


def order_number() -> str:
    timestamp = datetime.now(UTC).strftime("%Y%m%d")
    return f"BH-{timestamp}-{token_hex(3).upper()}"


def existing_order_result(order: Order) -> dict:
    return {
        "orderId": order.id,
        "orderNumber": order.order_number,
        "status": order.status,
        "totalCents": int(order.total * 100),
        "pos": {"status": "QUEUED", "jobId": "existing-idempotent-order"},
    }


def create_order(db: Session, data: CreateOrderInput, idempotency_key: str) -> dict:
    existing = db.scalar(select(Order).where(Order.idempotency_key == idempotency_key))
    if existing:
        return existing_order_result(existing)

    location = db.scalar(select(Location).where(Location.slug == "dordrecht"))
    if location is None:
        raise RuntimeError("Biryani House Dordrecht location has not been seeded")

    persisted_items = {
        value.slug: value
        for value in db.scalars(
            select(MenuItem).where(
                MenuItem.location_id == location.id,
                MenuItem.slug.in_([line.itemSlug for line in data.items]),
                MenuItem.active.is_(True),
                MenuItem.available.is_(True),
            )
        )
    }
    missing = [line.itemSlug for line in data.items if line.itemSlug not in persisted_items]
    if missing:
        raise ValueError(f"Menu items are not available in the database: {', '.join(missing)}")

    quoted: list[tuple] = []
    subtotal_cents = 0
    for line in data.items:
        database_item = persisted_items[line.itemSlug]
        catalog_item, line_total = quote_line(
            line.itemSlug,
            line.quantity,
            line.addonSlugs,
            int(database_item.price * 100),
        )
        quoted.append((line, catalog_item, line_total // line.quantity))
        subtotal_cents += line_total

    customer = db.scalar(select(Customer).where(Customer.email == data.customer.email.lower()))
    if customer is None:
        customer = Customer(
            name=data.customer.name,
            email=data.customer.email.lower(),
            phone=data.customer.phone,
        )
        db.add(customer)
        db.flush()
    else:
        customer.name = data.customer.name
        customer.phone = data.customer.phone

    if data.serviceType == "DELIVERY" and data.deliveryAddress:
        address = data.deliveryAddress
        db.add(
            Address(
                customer_id=customer.id,
                label="Delivery",
                street=f"{address.street} {address.houseNumber}",
                postal_code=address.postalCode,
                city=address.city,
            )
        )

    service_fee_cents = 99 if subtotal_cents else 0
    delivery_fee_cents = 250 if data.serviceType == "DELIVERY" else 0
    order = Order(
        order_number=order_number(),
        location_id=location.id,
        customer_id=customer.id,
        status="RECEIVED",
        service_type=data.serviceType,
        scheduled_for=data.scheduledFor,
        subtotal=money(subtotal_cents),
        delivery_fee=money(delivery_fee_cents),
        discount_total=money(0),
        total=money(subtotal_cents + service_fee_cents + delivery_fee_cents),
        idempotency_key=idempotency_key,
    )
    db.add(order)
    db.flush()

    for line, catalog_item, unit_cents in quoted:
        db.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=persisted_items[line.itemSlug].id,
                name=catalog_item["name"],
                quantity=line.quantity,
                unit_price=money(unit_cents),
                notes=line.notes,
            )
        )

    job = IntegrationJob(
        type="SUBMIT_ORDER_TO_POS",
        payload={"orderId": order.id, "orderNumber": order.order_number},
    )
    db.add(job)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raced_order = db.scalar(select(Order).where(Order.idempotency_key == idempotency_key))
        if raced_order:
            return existing_order_result(raced_order)
        raise

    logger.info("Queued order %s as POS job %s", order.order_number, job.id)
    return {
        "orderId": order.id,
        "orderNumber": order.order_number,
        "status": order.status,
        "totalCents": int(order.total * 100),
        "pos": {"status": "QUEUED", "jobId": job.id},
    }


def admin_feed(db: Session) -> dict:
    orders = db.scalars(
        select(Order)
        .options(selectinload(Order.customer), selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .limit(25)
    ).all()
    failed_jobs = db.scalars(
        select(IntegrationJob)
        .where(IntegrationJob.status.in_(["FAILED", "DEAD_LETTERED"]))
        .order_by(IntegrationJob.updated_at.desc())
        .limit(10)
    ).all()
    return {
        "orders": [
            {
                "id": order.id,
                "orderNumber": order.order_number,
                "status": order.status,
                "serviceType": order.service_type,
                "totalCents": int(order.total * 100),
                "createdAt": order.created_at.isoformat(),
                "customer": {
                    "name": order.customer.name,
                    "email": order.customer.email,
                    "phone": order.customer.phone,
                },
                "items": [
                    {
                        "id": item.id,
                        "name": item.name,
                        "quantity": item.quantity,
                        "unitPriceCents": int(item.unit_price * 100),
                        "notes": item.notes,
                    }
                    for item in order.items
                ],
            }
            for order in orders
        ],
        "failedJobs": [
            {"id": job.id, "type": job.type, "status": job.status, "lastError": job.last_error}
            for job in failed_jobs
        ],
    }
