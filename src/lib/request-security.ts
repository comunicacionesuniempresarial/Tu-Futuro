import type { NextRequest } from "next/server";

export const MAX_JSON_BODY_BYTES = 128 * 1024;

export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // native same-origin navigations may omit Origin
  return origin === new URL(request.url).origin;
}

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
