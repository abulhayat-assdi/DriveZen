import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFacebookPurchaseEvent } from "@/lib/facebook-conversions";
import crypto from "node:crypto";

function badPhone(p: string) {
  const digits = p.replace(/[^0-9]/g, "");
  return !/^01[3-9]\d{8}$/.test(digits);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const customerName = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const address = String(body.address || "").trim();
  const area = body.area === "outside" ? "outside" : "inside";
  const note = String(body.note || "").trim() || null;
  const quantity = Math.max(1, Math.min(99, Number(body.quantity) || 1));
  const productId = body.productId ? String(body.productId) : null;
  const eventId = String(body.eventId || "") || crypto.randomUUID();
  const fbp = body.fbp ? String(body.fbp) : undefined;
  const fbc = body.fbc ? String(body.fbc) : undefined;

  if (customerName.length < 2)
    return NextResponse.json({ ok: false, error: "Please enter a valid name." }, { status: 400 });
  if (badPhone(phone))
    return NextResponse.json(
      { ok: false, error: "Please enter a valid 11-digit mobile number." },
      { status: 400 }
    );
  if (address.length < 5)
    return NextResponse.json({ ok: false, error: "Please enter your full address." }, { status: 400 });

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
  const total = unitPrice * quantity + deliveryCharge;

  const count = await prisma.order.count();
  const orderNumber = `DZ-${String(count + 1).padStart(5, "0")}`;

  await prisma.order.create({
    data: {
      orderNumber,
      productId: product.id,
      productName: product.name,
      customerName,
      phone: phone.replace(/[^0-9]/g, ""),
      address,
      area,
      quantity,
      unitPrice,
      deliveryCharge,
      total,
      note,
      status: "new",
    },
  });

  if (settings?.fbPixelId && settings?.fbAccessToken) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    await sendFacebookPurchaseEvent(
      {
        eventId,
        value: total,
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

  return NextResponse.json({ ok: true, orderNumber, total, eventId });
}
