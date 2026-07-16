export type CouponRow = {
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
} | null;

export type CouponCheck = { ok: true; discount: number } | { ok: false; reason: string };

/** Pure evaluation logic shared by the live-preview endpoint and the real order transaction. */
export function evaluateCoupon(coupon: CouponRow, subtotal: number, now = new Date()): CouponCheck {
  if (!coupon) return { ok: false, reason: "This coupon code doesn't exist." };
  if (!coupon.isActive) return { ok: false, reason: "This coupon is no longer active." };
  if (coupon.expiresAt && coupon.expiresAt < now) return { ok: false, reason: "This coupon has expired." };
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
    return { ok: false, reason: "This coupon has reached its usage limit." };
  if (subtotal < coupon.minOrderAmount)
    return { ok: false, reason: `Minimum order amount for this coupon is ${coupon.minOrderAmount}.` };

  const raw = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  return { ok: true, discount: Math.max(0, Math.min(raw, subtotal)) };
}
