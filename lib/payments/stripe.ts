import "server-only";

import Stripe from "stripe";

import { getEnv } from "@/config/env";

export function getStripe() {
  return new Stripe(getEnv().STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    appInfo: {
      name: "Biryani House Platform"
    }
  });
}
