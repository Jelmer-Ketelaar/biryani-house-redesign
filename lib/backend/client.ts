import "server-only";

import { headers } from "next/headers";

const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:8000";

export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
  options: { allowUnauthorized?: boolean } = {}
): Promise<T | null> {
  const requestHeaders = new Headers(init.headers);
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get("cookie");
  if (cookie) requestHeaders.set("cookie", cookie);

  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(8_000)
  });

  if (options.allowUnauthorized && response.status === 401) return null;
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message ?? payload?.detail ?? `Backend request failed (${response.status})`);
  }
  return (await response.json()) as T;
}
