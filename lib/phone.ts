const BD_MOBILE_RE = /^01[3-9]\d{8}$/;

/**
 * Normalize a Bangladeshi mobile number to canonical 01XXXXXXXXX.
 * Accepts +8801XXXXXXXXX, 8801XXXXXXXXX, 01XXXXXXXXX, and bare 1XXXXXXXXX.
 * Returns null if the input can't be resolved to a valid BD mobile number.
 */
export function normalizeBdPhone(raw: string): string | null {
  let digits = (raw || "").replace(/[^0-9]/g, "");
  if (digits.length === 13 && digits.startsWith("880")) digits = "0" + digits.slice(3);
  else if (digits.length === 10 && digits.startsWith("1")) digits = "0" + digits;
  return BD_MOBILE_RE.test(digits) ? digits : null;
}
