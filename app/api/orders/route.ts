import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendFacebookPurchaseEvent } from "@/lib/facebook-conversions";
import { normalizeBdPhone } from "@/lib/phone";
import { generateOrderNumber } from "@/lib/order-number";
import { evaluateCoupon } from "@/lib/coupons";
import { getClientIp } from "@/lib/request";
import crypto from "node:crypto";

class CouponRejected extends Error {}

type OrderScalarFields = {
  productId: string;
  productName: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  quantity: number;
  unitPrice: number;
  deliveryCharge: number;
  note: string | null;
};

async function createOrder(orderData: OrderScalarFields, couponCode: string | null, subtotal: number) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderNumber = generateOrderNumber();
    try {
      return await prisma.$transaction(
        async (tx) => {
          let discount = 0;
          let appliedCode: string | null = null;

          if (couponCode) {
            const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
            const check = evaluateCoupon(coupon, subtotal);
            if (!check.ok) throw new CouponRejected(check.reason);

            // Guarded conditional update: atomic per-row under Postgres even at
            // Read Committed, since a concurrent writer's UPDATE re-checks this
            // WHERE clause against the just-committed row before applying.
            const inc = await tx.coupon.updateMany({
              where: {
                code: couponCode,
                isActive: true,
                usedCount: coupon!.maxUses === null ? undefined : { lt: coupon!.maxUses },
              },
              data: { usedCount: { increment: 1 } },
            });
            if (inc.count === 0) {
              throw new CouponRejected(
                "This coupon just reached its usage limit. Please remove it and try again."
              );
            }
            discount = check.discount;
            appliedCode = couponCode;
          }

          const total = Math.max(0, subtotal - discount) + orderData.deliveryCharge;

          return tx.order.create({
            data: {
              ...orderData,
              orderNumber,
              couponCode: appliedCode,
              discountAmount: discount,
              total,
              status: "new",
            },
          });
        },
        { timeout: 10_000 }
      );
    } catch (err) {
      if (err instanceof CouponRejected) throw err;
      // Only retry on an orderNumber collision — everything else (including a
      // rejected coupon) should surface immediately, not regenerate silently.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" && attempt < 4) continue;
      throw err;
    }
  }
  throw new Error("Could not generate a unique order number after several attempts.");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const customerName = String(body.name || "").trim();
  const rawPhone = String(body.phone || "").trim();
  const address = String(body.address || "").trim();
  const area = body.area === "outside" ? "outside" : "inside";
  const note = String(body.note || "").trim() || null;
  const quantity = Math.max(1, Math.min(99, Number(body.quantity) || 1));
  const productId = body.productId ? String(body.productId) : null;
  const eventId = String(body.eventId || "") || crypto.randomUUID();
  const fbp = body.fbp ? String(body.fbp) : undefined;
  const fbc = body.fbc ? String(body.fbc) : undefined;
  const couponCode = body.couponCode ? String(body.couponCode).trim().toUpperCase() : null;
  const sessionId = body.sessionId ? String(body.sessionId) : null;

  if (customerName.length < 2)
    return NextResponse.json({ ok: false, error: "Please enter a valid name." }, { status: 400 });

  const phone = normalizeBdPhone(rawPhone);
  if (!phone)
    return NextResponse.json(
      { ok: false, error: "Please enter a valid 11-digit mobile number." },
      { status: 400 }
    );
  if (address.length < 5)
    return NextResponse.json({ ok: false, error: "Please enter your full address." }, { status: 400 });

  // Manual phone/IP blocklist — reject with a generic message so a blocked
  // visitor can't confirm they've been specifically flagged.
  const clientIp = getClientIp(req);
  const [phoneBlocked, ipBlocked] = await Promise.all([
    prisma.blockedEntry.findUnique({ where: { type_value: { type: "phone", value: phone } } }),
    clientIp
      ? prisma.blockedEntry.findUnique({ where: { type_value: { type: "ip", value: clientIp } } })
      : Promise.resolve(null),
  ]);
  if (phoneBlocked || ipBlocked) {
    return NextResponse.json(
      { ok: false, error: "We couldn't process this order. Please contact us on WhatsApp." },
      { status: 403 }
    );
  }

  // Resolve product server-side
  const product = productId
    ? await prisma.product.findUnique({ where: { id: productId } })
    : await prisma.product.findFirst({ where: { isActive: true } });

  if (!product)
    return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const deliveryCharge =
    area === "outside"
      ? settings?.deliveryOutside ?? 120
      : settings?.deliveryInside ?? 60;

  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;

  let order;
  try {
    order = await createOrder(
      {
        productId: product.id,
        productName: product.name,
        customerName,
        phone,
        address,
        area,
        quantity,
        unitPrice,
        deliveryCharge,
        note,
      },
      couponCode,
      subtotal
    );
  } catch (err) {
    if (err instanceof CouponRejected) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    throw err;
  }

  if (sessionId) {
    await prisma.draftOrder
      .updateMany({ where: { sessionId }, data: { completedOrderId: order.id } })
      .catch(() => {});
  }

  if (settings?.fbPixelId && settings?.fbAccessToken) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    await sendFacebookPurchaseEvent(
      {
        eventId,
        value: order.total,
        currency: settings.currency === "৳" ? "BDT" : settings.currency,
        phone,
        eventSourceUrl: req.headers.get("referer") || new URL(req.url).origin,
        clientIp: forwardedFor?.split(",")[0]?.trim(),
        userAgent: req.headers.get("user-agent") || undefined,
        fbp,
        fbc,
      },
      { pixelId: settings.fbPixelId, accessToken: settings.fbAccessToken }
    );
  }

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber, total: order.total, eventId });
}
