import { z } from "zod";

export const orderItemInputSchema = z.object({
  itemSlug: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  addonSlugs: z.array(z.string().min(1)).default([]),
  notes: z.string().max(500).optional()
});

export const createOrderSchema = z.object({
  serviceType: z.enum(["DELIVERY", "TAKEAWAY"]),
  scheduledFor: z.string().datetime().optional(),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8)
  }),
  deliveryAddress: z
    .object({
      street: z.string().min(2),
      houseNumber: z.string().min(1),
      postalCode: z.string().min(4),
      city: z.string().min(2)
    })
    .optional(),
  items: z.array(orderItemInputSchema).min(1),
  promotionCode: z.string().max(64).optional()
}).superRefine((input, context) => {
  if (input.serviceType === "DELIVERY" && !input.deliveryAddress) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Delivery address is required for delivery orders",
      path: ["deliveryAddress"]
    });
  }
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
