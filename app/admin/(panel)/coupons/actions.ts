"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

export type AddCouponState = { error?: string; ok?: boolean };

export async function addCoupon(
  _prev: AddCouponState,
  formData: FormData
): Promise<AddCouponState> {
  await requireAuth();

  const code = String(formData.get("code") || "").trim().toUpperCase();
  const type = formData.get("type") === "fixed" ? "fixed" : "percent";
  const value = Math.max(0, Math.round(Number(formData.get("value")) || 0));
  const minOrderAmount = Math.max(0, Math.round(Number(formData.get("minOrderAmount")) || 0));
  const maxUsesRaw = String(formData.get("maxUses") || "").trim();
  const maxUses = maxUsesRaw ? Math.max(1, Math.round(Number(maxUsesRaw))) : null;
  const expiresAtRaw = String(formData.get("expiresAt") || "").trim();
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (!/^[A-Z0-9_-]{3,30}$/.test(code)) {
    return { error: "Code must be 3-30 characters: letters, numbers, - or _." };
  }
  if (type === "percent" && (value < 1 || value > 100)) {
    return { error: "Percent discount must be between 1 and 100." };
  }
  if (type === "fixed" && value < 1) {
    return { error: "Fixed discount must be a positive amount." };
  }

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return { error: "This coupon code already exists." };

  await prisma.coupon.create({
    data: { code, type, value, minOrderAmount, maxUses, expiresAt },
  });

  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(id: string) {
  await requireAuth();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  await requireAuth();
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/coupons");
}
