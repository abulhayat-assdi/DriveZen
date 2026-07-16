export function withCommas(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format a Taka amount, e.g. formatTaka(2490) => "৳2,490" */
export function formatTaka(n: number, currency = "৳"): string {
  return `${currency}${withCommas(Math.round(n))}`;
}

export function discountPercent(price: number, oldPrice?: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Pad a number as a two-digit string, e.g. 1 => "01" */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Normalize a BD phone number to a wa.me-compatible string (8801XXXXXXXXX). */
export function toWhatsAppNumber(raw: string): string {
  let n = (raw || "").replace(/[^0-9]/g, "");
  if (n.startsWith("880")) return n;
  if (n.startsWith("0")) return "88" + n;
  if (n.startsWith("1")) return "880" + n;
  return n;
}
