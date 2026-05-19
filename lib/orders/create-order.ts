import "server-only";

import { Prisma } from "@prisma/client";

import { submitOrderToPos } from "@/lib/integrations/pos-adapter";
import { getMenu, quoteMenu } from "@/lib/menu/service";
import { prisma } from "@/lib/db/prisma";
import { createOrderNumber } from "@/lib/orders/order-number";
import type { CreateOrderInput } from "@/lib/validation/orders";

type CreateOrderResult = {
  orderId: string;
  orderNumber: string;
  status: string;
  totalCents: number;
  pos: Awaited<ReturnType<typeof submitOrderToPos>>;
};

export async function createOrder(input: CreateOrderInput, idempotencyKey: string) {
  const existingOrder = await prisma.order.findUnique({
    where: { idempotencyKey },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true
    }
  });

  if (existingOrder) {
    return {
      orderId: existingOrder.id,
      orderNumber: existingOrder.orderNumber,
      status: existingOrder.status,
      totalCents: decimalToCents(existingOrder.total),
      pos: { status: "QUEUED", jobId: "existing-idempotent-order" }
    } satisfies CreateOrderResult;
  }

  const menu = await getMenu({ includeUnavailable: true });
  const menuBySlug = new Map(menu.items.map((item) => [item.slug, item]));
  const quote = await quoteMenu(
    input.items.map((item) => ({
      itemSlug: item.itemSlug,
      quantity: item.quantity,
      addonSlugs: item.addonSlugs,
      modifiers: [],
      specialInstructions: item.notes
    }))
  );

  const location = await prisma.location.findUnique({
    where: { slug: "dordrecht" },
    select: { id: true }
  });

  if (!location) {
    throw new Error("Biryani House Dordrecht location has not been seeded");
  }

  const menuItems = await prisma.menuItem.findMany({
    where: {
      locationId: location.id,
      slug: { in: input.items.map((item) => item.itemSlug) }
    },
    select: {
      id: true,
      slug: true
    }
  });
  const persistedMenuItemBySlug = new Map(menuItems.map((item) => [item.slug, item]));

  const missingItems = input.items.filter((item) => !persistedMenuItemBySlug.has(item.itemSlug));
  if (missingItems.length > 0) {
    throw new Error(`Menu items are not available in the database: ${missingItems.map((item) => item.itemSlug).join(", ")}`);
  }

  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { email: input.customer.email.toLowerCase() },
      update: {
        name: input.customer.name,
        phone: input.customer.phone
      },
      create: {
        name: input.customer.name,
        email: input.customer.email.toLowerCase(),
        phone: input.customer.phone
      }
    });

    if (input.serviceType === "DELIVERY" && input.deliveryAddress) {
      await tx.address.create({
        data: {
          customerId: customer.id,
          label: "Delivery",
          street: `${input.deliveryAddress.street} ${input.deliveryAddress.houseNumber}`,
          postalCode: input.deliveryAddress.postalCode,
          city: input.deliveryAddress.city
        }
      });
    }

    return tx.order.create({
      data: {
        orderNumber: createOrderNumber(),
        locationId: location.id,
        customerId: customer.id,
        status: "SUBMITTED_TO_POS",
        serviceType: input.serviceType,
        scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
        subtotal: centsToDecimal(quote.subtotalCents),
        deliveryFee: centsToDecimal(input.serviceType === "DELIVERY" ? 250 : 0),
        discountTotal: centsToDecimal(0),
        total: centsToDecimal(
          quote.totalCents + (input.serviceType === "DELIVERY" ? 250 : 0)
        ),
        idempotencyKey,
        items: {
          create: input.items.map((line) => {
            const menuItem = menuBySlug.get(line.itemSlug);
            const persistedMenuItem = persistedMenuItemBySlug.get(line.itemSlug);
            if (!menuItem || !persistedMenuItem) {
              throw new Error(`Menu item is unavailable: ${line.itemSlug}`);
            }

            const addonTotalCents = line.addonSlugs.reduce((sum, addonSlug) => {
              const addon = menuItem.addons.find((candidate) => candidate.slug === addonSlug);
              return sum + (addon?.priceCents ?? 0);
            }, 0);

            return {
              menuItemId: persistedMenuItem.id,
              name: menuItem.name,
              quantity: line.quantity,
              unitPrice: centsToDecimal(menuItem.basePriceCents + addonTotalCents),
              notes: line.notes
            };
          })
        }
      }
    });
  });

  const pos = await submitOrderToPos(order);

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalCents: decimalToCents(order.total),
    pos
  } satisfies CreateOrderResult;
}

function centsToDecimal(cents: number) {
  return new Prisma.Decimal(cents).div(100);
}

function decimalToCents(value: Prisma.Decimal) {
  return value.mul(100).toNumber();
}
