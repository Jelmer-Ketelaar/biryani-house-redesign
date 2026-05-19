import { NextResponse } from "next/server";

import { getMenu } from "@/lib/menu/service";
import { menuQuerySchema } from "@/lib/validation/menu";

export const revalidate = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = menuQuerySchema.safeParse(Object.fromEntries(url.searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid menu filters",
        issues: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const menu = await getMenu(parsed.data);

  return NextResponse.json(menu, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
    }
  });
}
