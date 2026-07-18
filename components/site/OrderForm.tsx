"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatTaka } from "@/lib/utils";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function getSessionId(): string {
  const KEY = "dz_checkout_session";
  try {
    let id = window.sessionStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
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
  content,
}: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [area, setArea] = useState<"inside" | "outside">("inside");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delivery = area === "outside" ? deliveryOutside : deliveryInside;
  const subtotal = unitPrice * qty;
  const total = Math.max(0, subtotal - discount) + delivery;

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  // Best-effort abandoned-cart capture: debounced while typing, plus a
  // beacon fallback so a tab close before the debounce fires still lands.
  useEffect(() => {
    const hasSignal = form.name.trim() || form.phone.trim() || form.address.trim();
    if (!hasSignal) return;

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;
      fetch("/api/draft-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          sessionId,
          productId,
          productName,
          name: form.name,
          phone: form.phone,
          address: form.address,
          note: form.note,
          quantity: qty,
          area,
        }),
      }).catch(() => {});
    }, 1200);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [form, qty, area, productId, productName]);

  useEffect(() => {
    function sendBeaconDraft() {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;
      const hasSignal = form.name.trim() || form.phone.trim() || form.address.trim();
      if (!hasSignal) return;
      const blob = new Blob(
        [
          JSON.stringify({
            sessionId,
            productId,
            productName,
            name: form.name,
            phone: form.phone,
            address: form.address,
            note: form.note,
            quantity: qty,
            area,
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon?.("/api/draft-orders", blob);
    }
    document.addEventListener("visibilitychange", sendBeaconDraft);
    window.addEventListener("pagehide", sendBeaconDraft);
    return () => {
      document.removeEventListener("visibilitychange", sendBeaconDraft);
      window.removeEventListener("pagehide", sendBeaconDraft);
    };
  }, [form, qty, area, productId, productName]);

  function onCouponInputChange(v: string) {
    setCouponInput(v);
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setDiscount(0);
    }
    setCouponError(null);
  }

  async function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError(null);
    setCouponChecking(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setCouponError(data.error || "This coupon can't be applied.");
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }
      setAppliedCoupon(code);
      setDiscount(data.discount);
    } catch {
      setCouponError("Network error. Please try again.");
    } finally {
      setCouponChecking(false);
    }
  }

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
          couponCode: appliedCoupon,
          sessionId: sessionIdRef.current,
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
        { value: data.total, currency: "BDT" },
        { eventID: eventId }
      );
      router.push(`/thank-you?order=${encodeURIComponent(data.orderNumber)}`);
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  const input =
    "w-full rounded-[10px] border border-white/12 bg-night px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-brand/70 focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-5">
      <div className="grid gap-4 lg:col-span-3">
        <div>
          <label className="mb-1.5 block text-sm text-white/60">{content.order_form_name_label}</label>
          <input
            className={input}
            placeholder="e.g. John Rahman"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-white/60">{content.order_form_phone_label}</label>
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
          <label className="mb-1.5 block text-sm text-white/60">{content.order_form_address_label}</label>
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
          <label className="mb-2 block text-sm text-white/60">{content.order_form_area_label}</label>
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
                    ? "border-brand bg-brand/10 ring-gold"
                    : "border-white/12 bg-night hover:border-white/25"
                }`}
              >
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="text-xs text-white/50">
                  Delivery {formatTaka(o.charge, currency)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">{content.order_form_note_label}</label>
          <input
            className={input}
            placeholder="Any special instructions"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">{content.order_form_coupon_label}</label>
          <div className="flex gap-2">
            <input
              className={`${input} uppercase`}
              placeholder={content.order_form_coupon_placeholder}
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value)}
            />
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponChecking || !couponInput.trim()}
              className="shrink-0 rounded-[10px] border border-brand/40 bg-brand/10 px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand/20 disabled:opacity-50"
            >
              {couponChecking ? "…" : content.order_form_coupon_apply_button}
            </button>
          </div>
          {couponError && <p className="mt-1.5 text-sm text-red-300">{couponError}</p>}
          {appliedCoupon && !couponError && (
            <p className="mt-1.5 text-sm text-emerald-300">
              Applied &quot;{appliedCoupon}&quot; — {formatTaka(discount, currency)} off
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-white/10 bg-night p-5">
          <h3 className="font-display text-lg font-extrabold text-white">{content.order_form_summary_heading}</h3>
          <p className="mt-1 truncate text-sm text-white/55">{productName}</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-white/60">{content.order_form_quantity_label}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 text-lg leading-none transition hover:border-brand/60"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 text-lg leading-none transition hover:border-brand/60"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">{content.order_form_subtotal_label}</span>
              <span>{formatTaka(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-300">
                <span>{content.order_form_discount_label}</span>
                <span>-{formatTaka(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/60">{content.order_form_delivery_label}</span>
              <span>{formatTaka(delivery, currency)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold">
              <span>{content.order_form_total_label}</span>
              <span className="text-brand">{formatTaka(total, currency)}</span>
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
            className="btn-brand mt-4 w-full py-3.5 text-base font-bold disabled:opacity-60"
          >
            {status === "loading" ? "Placing order…" : content.order_form_confirm_button}
          </button>
          <p className="mt-3 text-center text-xs text-white/40">
            {content.order_form_cod_note}
          </p>
        </div>
      </div>
    </form>
  );
}
