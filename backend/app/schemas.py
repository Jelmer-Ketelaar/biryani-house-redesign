from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator


class CustomerInput(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=40)


class DeliveryAddressInput(BaseModel):
    street: str = Field(min_length=2, max_length=160)
    houseNumber: str = Field(min_length=1, max_length=30)
    postalCode: str = Field(min_length=4, max_length=20)
    city: str = Field(min_length=2, max_length=100)


class OrderLineInput(BaseModel):
    itemSlug: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=1, le=20)
    addonSlugs: list[str] = Field(default_factory=list, max_length=12)
    notes: str | None = Field(default=None, max_length=500)


class CreateOrderInput(BaseModel):
    serviceType: Literal["DELIVERY", "TAKEAWAY"]
    scheduledFor: datetime | None = None
    customer: CustomerInput
    deliveryAddress: DeliveryAddressInput | None = None
    items: list[OrderLineInput] = Field(min_length=1, max_length=40)

    @model_validator(mode="after")
    def require_delivery_address(self) -> "CreateOrderInput":
        if self.serviceType == "DELIVERY" and self.deliveryAddress is None:
            raise ValueError("Delivery address is required for delivery orders")
        if self.scheduledFor is not None:
            if self.scheduledFor.tzinfo is None:
                raise ValueError("Scheduled order time must include a timezone")
            if self.scheduledFor <= datetime.now(UTC):
                raise ValueError("Scheduled order time must be in the future")
        return self


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
