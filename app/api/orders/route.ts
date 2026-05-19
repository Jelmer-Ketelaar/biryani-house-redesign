import { handleApiError, ok } from "@/lib/api/responses";
import { logger } from "@/lib/logging/logger";
import { createOrder } from "@/lib/orders/create-order";
import { createOrderSchema } from "@/lib/validation/orders";

export async function POST(request: Request) {
  try {
    const idempotencyKey = request.headers.get("Idempotency-Key") ?? crypto.randomUUID();
    const input = createOrderSchema.parse(await request.json());

    logger.info(
      {
        serviceType: input.serviceType,
        itemCount: input.items.length,
        hasPromotionCode: Boolean(input.promotionCode)
      },
      "Order intake request validated"
    );

    const order = await createOrder(input, idempotencyKey);

    return ok(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
