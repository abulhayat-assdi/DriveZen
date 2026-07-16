"use client";

import { useState } from "react";
import { formatTaka, toWhatsAppNumber } from "@/lib/utils";
import { Check, Whatsapp } from "@/components/icons";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

type Props = {
  productId: string;
  productName: string;
  unitPrice: number;
  deliveryInside: number;
  deliveryOutside: number;
  currency: string;
  whatsapp: string;
  content: Record<string, string>;
};

export default function OrderForm({
  productId,
  productName,
  unitPrice,
  deliveryInside,
  deliveryOutside,
  currency,
  whatsapp,
  content,
}: Props) {
  const [qty, setQty] = useState(1);
  const [area, setArea] = useState<"inside" | "outside">("inside");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState<string | null>(null);

  const delivery = area === "outside" ? deliveryOutside : deliveryInside;
  const subtotal = unitPrice * qty;
  const total = subtotal + delivery;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const eventId = crypto.randomUUID();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: qty,
          area,
          ...form,
          eventId,
          fbp: readCookie("_fbp"),
          fbc: readCookie("_fbc"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Order failed. Please try again.");
        setStatus("idle");
        return;
      }
      window.fbq?.(
        "track",
        "Purchase",
        { value: total, currency: "BDT" },
        { eventID: eventId }
      );
      setOrderNo(data.orderNumber);
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    const wa = `https://wa.me/${toWhatsAppNumber(whatsapp)}?text=${encodeURIComponent(
      `Hello, I placed an order.\nOrder no: ${orderNo}\nProduct: ${productName}`
    )}`;
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl font-bold uppercase">{content.order_form_success_heading}</h3>
        <p className="mt-2 text-muted">
          Your order number is{" "}
          <span className="font-semibold text-emerald-300">{orderNo}</span>.
          <br />
          We&apos;ll call you shortly to confirm.
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white"
        >
          <Whatsapp className="h-5 w-5" /> {content.order_form_whatsapp_button}
        </a>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/15";

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-5">
      <div className="grid gap-4 lg:col-span-3">
        <div>
          <label className="mb-1.5 block text-sm text-muted">{content.order_form_name_label}</label>
          <input
            className={input}
            placeholder="e.g. John Rahman"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">{content.order_form_phone_label}</label>
          <input
            className={input}
            placeholder="01XXXXXXXXX"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">{content.order_form_address_label}</label>
          <textarea
            className={input}
            rows={3}
            placeholder="House/road, area, thana, district"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted">{content.order_form_area_label}</label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: "inside", label: content.order_form_inside_label, charge: deliveryInside },
                { key: "outside", label: content.order_form_outside_label, charge: deliveryOutside },
              ] as const
            ).map((o) => (
              <button
                type="button"
                key={o.key}
                onClick={() => setArea(o.key)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  area === o.key
                    ? "border-gold bg-gold/10 ring-gold"
                    : "border-line bg-ink-2 hover:border-line-2"
                }`}
              >
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="text-xs text-muted">
                  Delivery {formatTaka(o.charge, currency)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-muted">{content.order_form_note_label}</label>
          <input
            className={input}
            placeholder="Any special instructions"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-line bg-ink-2 p-5">
          <h3 className="font-display text-lg font-bold uppercase">{content.order_form_summary_heading}</h3>
          <p className="mt-1 truncate text-sm text-muted">{productName}</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted">{content.order_form_quantity_label}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-lg leading-none hover:border-gold/50"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-lg leading-none hover:border-gold/50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{content.order_form_subtotal_label}</span>
              <span>{formatTaka(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{content.order_form_delivery_label}</span>
              <span>{formatTaka(delivery, currency)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
              <span>{content.order_form_total_label}</span>
              <span className="text-gold">{formatTaka(total, currency)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-gold mt-4 w-full rounded-xl py-3.5 font-bold uppercase tracking-wide disabled:opacity-60"
          >
            {status === "loading" ? "Placing order…" : content.order_form_confirm_button}
          </button>
          <p className="mt-3 text-center text-xs text-muted-2">
            {content.order_form_cod_note}
          </p>
        </div>
      </div>
    </form>
  );
}
