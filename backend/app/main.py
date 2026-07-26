import logging
from datetime import UTC, datetime
from uuid import uuid4

import stripe
from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pwdlib import PasswordHash
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from app.catalog import DIETARY, get_menu
from app.config import get_settings
from app.db import get_db
from app.models import Location, MenuItem, User, WebhookEvent
from app.schemas import CreateOrderInput, LoginInput
from app.services import admin_feed, create_order

settings = get_settings()
password_hash = PasswordHash.recommended()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")

app = FastAPI(title="Biryani House API", version="1.0.0", docs_url="/api/docs")
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.app_secret,
    https_only=settings.production,
    same_site="lax",
    max_age=60 * 60 * 24 * 30,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Idempotency-Key", "Stripe-Signature"],
)


def api_error(code: str, message: str, status: int, details=None) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={"error": {"code": code, "message": message, "details": details}},
    )


@app.exception_handler(RequestValidationError)
async def validation_error(_: Request, error: RequestValidationError) -> JSONResponse:
    return api_error("BAD_REQUEST", "Request validation failed", 400, jsonable_encoder(error.errors()))


@app.exception_handler(ValueError)
async def value_error(_: Request, error: ValueError) -> JSONResponse:
    return api_error("BAD_REQUEST", str(error), 400)


@app.exception_handler(Exception)
async def unexpected_error(_: Request, error: Exception) -> JSONResponse:
    logging.exception("Unhandled API error", exc_info=error)
    return api_error("INTERNAL_ERROR", "Unexpected server error", 500)


def current_user(request: Request, db: Session = Depends(get_db)) -> User:
    user_id = request.session.get("user_id")
    user = db.get(User, user_id) if user_id else None
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user


def admin_user(user: User = Depends(current_user)) -> User:
    if "ADMIN" not in user.roles:
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user


@app.get("/api/health")
def health(db: Session = Depends(get_db)) -> dict:
    db.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "service": "biryani-house-platform",
        "runtime": "python-fastapi",
        "timestamp": datetime.now(UTC).isoformat(),
    }


@app.get("/api/menu")
def menu(
    category: str | None = Query(default=None, min_length=1),
    search: str | None = Query(default=None, min_length=1, max_length=80),
    dietary: str | None = None,
    maxSpice: int | None = Query(default=None, ge=0, le=3),
    popularOnly: bool = False,
    includeUnavailable: bool = False,
    db: Session = Depends(get_db),
) -> dict:
    dietary_labels = [value.strip() for value in dietary.split(",")] if dietary else []
    invalid = [value for value in dietary_labels if value not in DIETARY]
    if invalid:
        raise ValueError(f"Unsupported dietary labels: {', '.join(invalid)}")
    location = db.scalar(select(Location).where(Location.slug == "dordrecht"))
    if location is None:
        raise RuntimeError("Biryani House Dordrecht location has not been seeded")
    inventory = {
        item.slug: (int(item.price * 100), item.active, item.available)
        for item in db.scalars(select(MenuItem).where(MenuItem.location_id == location.id))
    }
    return get_menu(
        category,
        search,
        dietary_labels,
        maxSpice,
        popularOnly,
        includeUnavailable,
        inventory,
    )


@app.post("/api/orders", status_code=201)
def orders(
    data: CreateOrderInput,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    key = request.headers.get("Idempotency-Key") or str(uuid4())
    return create_order(db, data, key)


@app.post("/api/auth/login")
def login(data: LoginInput, request: Request, db: Session = Depends(get_db)) -> dict:
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if user is None or not password_hash.verify(data.password, user.password_hash):
        return api_error("UNAUTHORIZED", "Invalid email or password", 401)
    request.session.clear()
    request.session["user_id"] = user.id
    return {"user": {"id": user.id, "name": user.name, "email": user.email, "roles": user.roles}}


@app.post("/api/auth/logout", status_code=204)
def logout(request: Request) -> Response:
    request.session.clear()
    return Response(status_code=204)


@app.get("/api/auth/me")
def me(user: User = Depends(current_user)) -> dict:
    return {"user": {"id": user.id, "name": user.name, "email": user.email, "roles": user.roles}}


@app.get("/api/admin/orders")
def admin_orders(_: User = Depends(admin_user), db: Session = Depends(get_db)) -> dict:
    return admin_feed(db)


@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    signature = request.headers.get("stripe-signature")
    if not signature:
        return api_error("BAD_REQUEST", "Missing Stripe signature", 400)
    if not settings.stripe_webhook_secret:
        return api_error("INTERNAL_ERROR", "Stripe webhook secret is not configured", 500)
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, signature, settings.stripe_webhook_secret)
    except (ValueError, stripe.SignatureVerificationError):
        return api_error("BAD_REQUEST", "Invalid Stripe webhook", 400)
    record = WebhookEvent(
        provider="stripe",
        event_id=event["id"],
        event_type=event["type"],
        payload=dict(event),
        processed_at=datetime.now(UTC),
    )
    db.add(record)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
    return {"received": True}
