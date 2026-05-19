import { ok } from "@/lib/api/responses";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  await prisma.$queryRaw`SELECT 1`;

  return ok({
    status: "ok",
    service: "biryani-house-platform",
    timestamp: new Date().toISOString()
  });
}
