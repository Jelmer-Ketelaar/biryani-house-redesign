"use client";

import type { FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/page-loading";
import { formatEuro } from "@/lib/menu/format";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

type ServiceType = "DELIVERY" | "TAKEAWAY";

type OrderResponse = {
  orderId: string;
  orderNumber: string;
  status: string;
  totalCents: number;
  pos: {
    status: string;
    jobId?: string;
    posOrderId?: string;
  };
};

type FormState = {
  serviceType: ServiceType;
  scheduledFor: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
};

const initialForm: FormState = {
  serviceType: "DELIVERY",
  scheduledFor: "",
  name: "",
  email: "",
  phone: "",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "Dordrecht"
};

export function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0),
    [items]
  );
  const serviceFeeCents = subtotalCents > 0 ? 99 : 0;
  const deliveryFeeCents = form.serviceType === "DELIVERY" ? 250 : 0;
  const totalCents = subtotalCents + serviceFeeCents + deliveryFeeCents;
  const minimumScheduleTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Add at least one dish before checkout.");
      return;
    }
    if (form.scheduledFor && new Date(form.scheduledFor) < new Date()) {
      setError("Choose a future order time or leave the schedule field empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current
        },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          serviceType: form.serviceType,
          scheduledFor: form.scheduledFor ? new Date(form.scheduledFor).toISOString() : undefined,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone
          },
          deliveryAddress:
            form.serviceType === "DELIVERY"
              ? {
                  street: form.street,
                  houseNumber: form.houseNumber,
                  postalCode: form.postalCode,
                  city: form.city
                }
              : undefined,
          items: items.map((item) => ({
            itemSlug: item.itemSlug,
            quantity: item.quantity,
            addonSlugs: item.addonSlugs,
            notes: item.specialInstructions
          }))
        })
      });

      const payload = await response.json().catch(() => ({
        error: { message: "The ordering service returned an invalid response." }
      }));
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "We could not place the order.");
      }

      setOrder(payload);
      clear();
    } catch (caughtError) {
      setError(
        caughtError instanceof DOMException && caughtError.name === "TimeoutError"
          ? "The ordering service took too long to respond. Check your connection and try again."
          : caughtError instanceof Error
            ? caughtError.message
            : "We could not place the order."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasHydrated) {
    return <PageLoading label="Loading your basket" />;
  }

  if (order) {
    return (
      <main className="container grid min-h-[calc(100dvh-4rem)] place-items-center py-12">
        <section className="w-full max-w-2xl rounded-3xl border border-border/70 bg-card p-6 text-center shadow-sm sm:p-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <p className="eyebrow mt-5">Order received</p>
          <h1 className="mt-2 text-3xl font-black">Thanks, we received your order.</h1>
          <p className="mt-3 text-muted-foreground">
            Keep order number <strong>{order.orderNumber}</strong> for your records. Its current
            status is {order.status.toLowerCase().replaceAll("_", " ")}.
          </p>
          <div className="mt-6 rounded-2xl bg-background p-4 text-left">
            <p className="text-sm font-bold text-muted-foreground">Total</p>
            <p className="text-2xl font-black">{formatEuro(order.totalCents)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The restaurant will contact you if it needs to clarify any details.
            </p>
          </div>
          <Button asChild className="mt-6">
            <Link href="/menu">Order again</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-card/70">
        <div className="container py-8">
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link href="/menu">
              <ArrowLeft className="h-4 w-4" />
              Back to menu
            </Link>
          </Button>
          <h1 className="mt-4 text-4xl font-black">Checkout</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Choose delivery or takeaway, confirm your details, and submit the order to Biryani House
            Dordrecht.
          </p>
        </div>
      </section>

      <form onSubmit={submitOrder} className="container grid gap-6 py-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="text-xl font-black">Fulfilment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["DELIVERY", "TAKEAWAY"] as ServiceType[]).map((serviceType) => (
                <button
                  key={serviceType}
                  type="button"
                  aria-pressed={form.serviceType === serviceType}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    form.serviceType === serviceType
                      ? "border-primary bg-secondary"
                      : "border-border bg-background"
                  )}
                  onClick={() => setForm((current) => ({ ...current, serviceType }))}
                >
                  <span className="block font-black">
                    {serviceType === "DELIVERY" ? "Delivery" : "Takeaway"}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {serviceType === "DELIVERY"
                      ? "Delivered around Dordrecht"
                      : "Pick up from Voorstraat 394"}
                  </span>
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-bold">
              Schedule time <span className="font-normal text-muted-foreground">(optional)</span>
              <input
                type="datetime-local"
                min={minimumScheduleTime}
                className="mt-2 min-h-12 w-full rounded-2xl border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                value={form.scheduledFor}
                onChange={(event) =>
                  setForm((current) => ({ ...current, scheduledFor: event.target.value }))
                }
              />
            </label>
          </section>

          <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="text-xl font-black">Contact details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                label="Name"
                value={form.name}
                required
                autoComplete="name"
                minLength={2}
                onChange={(name) => setForm((current) => ({ ...current, name }))}
              />
              <TextField
                label="Phone"
                type="tel"
                value={form.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                minLength={8}
                onChange={(phone) => setForm((current) => ({ ...current, phone }))}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                required
                autoComplete="email"
                className="sm:col-span-2"
                onChange={(email) => setForm((current) => ({ ...current, email }))}
              />
            </div>
          </section>

          {form.serviceType === "DELIVERY" ? (
            <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
              <h2 className="text-xl font-black">Delivery address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                <TextField
                  label="Street"
                  value={form.street}
                  required
                  autoComplete="street-address"
                  onChange={(street) => setForm((current) => ({ ...current, street }))}
                />
                <TextField
                  label="No."
                  value={form.houseNumber}
                  required
                  autoComplete="address-line2"
                  onChange={(houseNumber) => setForm((current) => ({ ...current, houseNumber }))}
                />
                <TextField
                  label="Postcode"
                  value={form.postalCode}
                  required
                  autoComplete="postal-code"
                  inputMode="text"
                  minLength={4}
                  onChange={(postalCode) => setForm((current) => ({ ...current, postalCode }))}
                />
                <TextField
                  label="City"
                  value={form.city}
                  required
                  autoComplete="address-level2"
                  onChange={(city) => setForm((current) => ({ ...current, city }))}
                />
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h2 className="font-black">Your order</h2>
                <p className="text-sm text-muted-foreground">{items.length} cart lines</p>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-2xl bg-background p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-black">{item.name}</p>
                        {item.addonNames.length > 0 ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.addonNames.join(", ")}
                          </p>
                        ) : null}
                      </div>
                      <p className="font-black">
                        {formatEuro(item.unitPriceCents * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border bg-card p-1">
                        <button
                          type="button"
                          className="grid h-8 w-8 place-items-center"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          type="button"
                          className="grid h-8 w-8 place-items-center"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="font-black">Your basket is empty</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add dishes from the menu first.
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/menu">Browse menu</Link>
                </Button>
              </div>
            )}

            <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <SummaryLine label="Subtotal" value={subtotalCents} />
              <SummaryLine label="Service" value={serviceFeeCents} />
              <SummaryLine label="Delivery" value={deliveryFeeCents} />
              <div className="flex justify-between pt-3 text-lg font-black">
                <span>Total</span>
                <span>{formatEuro(totalCents)}</span>
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-bold text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button className="mt-5 w-full" size="lg" disabled={items.length === 0 || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Place order
            </Button>
          </section>
        </aside>
      </form>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className,
  autoComplete,
  inputMode,
  minLength
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  minLength?: number;
}) {
  return (
    <label className={cn("block text-sm font-bold", className)}>
      {label}
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        minLength={minLength}
        className="mt-2 min-h-12 w-full rounded-2xl border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SummaryLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{formatEuro(value)}</span>
    </div>
  );
}
