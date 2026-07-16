import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCoupon } from "@/lib/coupons";

// Read-only preview for the order form's live discount display. Never
// increments usedCount — the real, authoritative check + increment happens
// atomically inside the /api/orders transaction at submit time.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const code = String(body.code || "").trim().toUpperCase();
  const subtotal = Math.max(0, Number(body.subtotal) || 0);
  if (!code) return NextResponse.json({ ok: false, error: "Enter a coupon code." }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  const check = evaluateCoupon(coupon, subtotal);

  if (!check.ok) return NextResponse.json({ ok: false, error: check.reason }, { status: 400 });
  return NextResponse.json({ ok: true, discount: check.discount });
}
