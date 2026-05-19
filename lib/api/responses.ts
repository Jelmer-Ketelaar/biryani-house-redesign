import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/logging/logger";

type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(code: ApiErrorCode, message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError("BAD_REQUEST", "Request validation failed", 400, error.flatten());
  }

  logger.error({ error }, "Unhandled API error");
  return apiError("INTERNAL_ERROR", "Unexpected server error", 500);
}
