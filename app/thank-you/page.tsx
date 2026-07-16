import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data";
import { formatTaka, toWhatsAppNumber } from "@/lib/utils";
import { Check, Whatsapp } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const sp = await searchParams;
  const orderNumber = sp.order?.trim();
  const settings = await getSettings();

  // Only ever select safe, non-sensitive fields — never phone/address/note.
  const order = orderNumber
    ? await prisma.order.findUnique({
        where: { orderNumber },
        select: {
          orderNumber: true,
          productName: true,
          quantity: true,
          total: true,
          area: true,
          createdAt: true,
        },
      })
    : null;

  const wa = order
    ? `https://wa.me/${toWhatsAppNumber(settings.whatsapp)}?text=${encodeURIComponent(
        `Hello, I placed an order.\nOrder no: ${order.orderNumber}\nProduct: ${order.productName}`
      )}`
    : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      {order ? (
        <div className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold uppercase sm:text-3xl">Order placed!</h1>
          <p className="mt-2 text-muted">
            Your order number is{" "}
            <span className="font-semibold text-emerald-300">{order.orderNumber}</span>.
            <br />
            We&apos;ll call you shortly to confirm.
          </p>

          <div className="mt-6 space-y-2 rounded-xl border border-line bg-ink-2 p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Product</span>
              <span className="font-medium">{order.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Quantity</span>
              <span className="font-medium">{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery area</span>
              <span className="font-medium">
                {order.area === "outside" ? "Outside Dhaka" : "Inside Dhaka"}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-gold">{formatTaka(order.total, settings.currency)}</span>
            </div>
          </div>

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white"
            >
              <Whatsapp className="h-5 w-5" /> Confirm on WhatsApp
            </a>
          )}
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-line bg-ink-2 p-8">
          <h1 className="font-display text-2xl font-bold">We couldn&apos;t find that order</h1>
          <p className="mt-2 text-muted">The order number in the link looks incorrect or has expired.</p>
        </div>
      )}

      <Link href="/" className="mt-8 text-sm text-gold hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}
