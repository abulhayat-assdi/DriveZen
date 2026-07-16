import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cap(v: unknown, max: number): string | undefined {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : undefined;
}

// Best-effort abandoned-cart capture, fired in the background while a visitor
// fills out the checkout form. Never surfaces an error to the visitor — a
// failure here must not affect their checkout experience.
export async function POST(req: Request) {
  try {
    const body: Record<string, unknown> = await req.json();
    const sessionId = cap(body.sessionId, 100);
    if (!sessionId) return NextResponse.json({ ok: true });

    const data = {
      productId: cap(body.productId, 100) ?? null,
      productName: cap(body.productName, 200) ?? null,
      name: cap(body.name, 100) ?? null,
      phone: cap(body.phone, 20) ?? null,
      address: cap(body.address, 500) ?? null,
      note: cap(body.note, 300) ?? null,
      area: cap(body.area, 20) ?? null,
      quantity: Number.isFinite(Number(body.quantity))
        ? Math.max(1, Math.min(99, Math.round(Number(body.quantity))))
        : null,
    };

    await prisma.draftOrder.upsert({
      where: { sessionId },
      update: data,
      create: { sessionId, ...data },
    });
  } catch {
    // swallow — best-effort only
  }
  return NextResponse.json({ ok: true });
}
