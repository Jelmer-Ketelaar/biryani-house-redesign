import { headers } from "next/headers";

import { apiError, handleApiError, ok } from "@/lib/api/responses";
import { logger } from "@/lib/logging/logger";
import { getStripe } from "@/lib/payments/stripe";
import { getEnv } from "@/config/env";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return apiError("BAD_REQUEST", "Missing Stripe signature", 400);
    }

    const event = getStripe().webhooks.constructEvent(body, signature, getEnv().STRIPE_WEBHOOK_SECRET);

    logger.info({ eventId: event.id, eventType: event.type }, "Stripe webhook received");

    return ok({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
