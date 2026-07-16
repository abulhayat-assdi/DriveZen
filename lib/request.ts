/** Best-effort client IP from the standard proxy header (no middleware/edge IP source exists in this app). */
export function getClientIp(req: Request): string | undefined {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
}
