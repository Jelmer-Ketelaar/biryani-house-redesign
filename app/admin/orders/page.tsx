import { AlertTriangle, Clock3, ReceiptText, RefreshCw } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { backendFetch } from "@/lib/backend/client";
import { formatEuro } from "@/lib/menu/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Staff Orders",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

const statusCopy: Record<string, string> = {
  DRAFT: "Draft",
  RECEIVED: "Received",
  PAYMENT_PENDING: "Payment pending",
  PAYMENT_AUTHORIZED: "Payment authorised",
  SUBMITTED_TO_POS: "Sent to POS",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for pickup",
  OUT_FOR_DELIVERY: "Out for delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed"
};

type AdminFeed = {
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    serviceType: string;
    totalCents: number;
    createdAt: string;
    customer: { name: string; phone: string; email: string };
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPriceCents: number;
      notes: string | null;
    }>;
  }>;
  failedJobs: Array<{
    id: string;
    type: string;
    status: string;
    lastError: string | null;
  }>;
};

export default async function AdminOrdersPage() {
  const feed = await backendFetch<AdminFeed>("/api/admin/orders", {}, { allowUnauthorized: true });
  if (!feed) redirect("/auth/sign-in?next=%2Fadmin%2Forders");
  const { orders, failedJobs } = feed;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-card/75">
        <div className="container flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Staff operations</p>
            <h1 className="mt-2 text-4xl font-black">Live orders</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Recent online orders, customer details, totals, and integration exceptions for
              restaurant staff.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/orders">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </a>
          </Button>
        </div>
      </section>

      <div className="container grid gap-6 py-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black">{order.orderNumber}</h2>
                      <StatusBadge status={order.status} />
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-black text-muted-foreground">
                        {order.serviceType === "DELIVERY" ? "Delivery" : "Takeaway"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.customer.name} · {order.customer.phone} · {order.customer.email}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Intl.DateTimeFormat("nl-NL", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(order.createdAt))}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-black">{formatEuro(order.totalCents)}</p>
                    <p className="text-xs font-bold text-muted-foreground">
                      {order.items.length} line items
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3 rounded-2xl bg-background px-4 py-3 text-sm"
                    >
                      <span>
                        <strong>{item.quantity}x</strong> {item.name}
                        {item.notes ? (
                          <span className="ml-2 text-muted-foreground">({item.notes})</span>
                        ) : null}
                      </span>
                      <span className="font-black">
                        {formatEuro(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
              <ReceiptText className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 text-xl font-black">No online orders yet</h2>
              <p className="mt-2 text-muted-foreground">
                New delivery and takeaway orders will appear here after checkout.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-black">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Integration alerts
            </h2>
            {failedJobs.length > 0 ? (
              <div className="mt-4 space-y-3">
                {failedJobs.map((job) => (
                  <div key={job.id} className="rounded-2xl bg-destructive/10 p-3 text-sm">
                    <p className="font-black">{job.type}</p>
                    <p className="mt-1 text-muted-foreground">
                      {job.lastError ?? "No error detail"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-background p-4 text-sm text-muted-foreground">
                No failed POS jobs currently require attention.
              </p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const needsAttention = status === "FAILED" || status === "CANCELLED";

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-black",
        needsAttention
          ? "bg-destructive/10 text-destructive"
          : "bg-secondary text-secondary-foreground"
      )}
    >
      {statusCopy[status] ?? status}
    </span>
  );
}
