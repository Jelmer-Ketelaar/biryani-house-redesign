import "server-only";

import type { Order } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logging/logger";

export type PosSubmissionResult =
  | {
      status: "QUEUED";
      jobId: string;
    }
  | {
      status: "ACCEPTED";
      posOrderId: string;
    };

export async function submitOrderToPos(order: Pick<Order, "id" | "orderNumber">) {
  const job = await prisma.integrationJob.create({
    data: {
      type: "SUBMIT_ORDER_TO_POS",
      payload: {
        orderId: order.id,
        orderNumber: order.orderNumber
      }
    }
  });

  logger.info(
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      jobId: job.id
    },
    "Queued order for POS submission"
  );

  return {
    status: "QUEUED",
    jobId: job.id
  } satisfies PosSubmissionResult;
}
