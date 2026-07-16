"use client";

import { useState, useTransition } from "react";
import { formatTaka } from "@/lib/utils";
import { STATUS_META, STATUS_ORDER } from "./status";
import { updateOrder, deleteOrder, sendOrderToCourier, updateOrderStatus, type OrderEditFields } from "./actions";
import { X, Trash, Truck, Check } from "@/components/icons";

export type OrderDetail = {
  id: string;
  orderNumber: string;
  productName: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  quantity: number;
  unitPrice: number;
  deliveryCharge: number;
  total: number;
  note: string | null;
  status: string;
  createdAt: string;
  courierConsignmentId: string | null;
  courierTrackingCode: string | null;
  courierStatus: string | null;
  courierSentAt: string | null;
};

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-3.5 py-2.5 text-sm text-fg outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/15";
const label = "mb-1.5 block text-xs font-medium text-muted";

export default function OrderDetailModal({
  order,
  onClose,
}: {
  order: OrderDetail;
  onClose: () => void;
}) {
  const [fields, setFields] = useState<OrderEditFields>({
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    note: order.note ?? "",
    quantity: order.quantity,
    area: order.area === "outside" ? "outside" : "inside",
    status: order.status,
  });
  const [status, setStatus] = useState(order.status);
  const [pending, start] = useTransition();
  const [courierPending, startCourier] = useTransition();
  const [statusPending, startStatus] = useTransition();
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [courierMsg, setCourierMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [courier, setCourier] = useState({
    consignmentId: order.courierConsignmentId,
    trackingCode: order.courierTrackingCode,
    status: order.courierStatus,
  });

  function set<K extends keyof OrderEditFields>(k: K, v: OrderEditFields[K]) {
    setFields((f) => ({ ...f, [k]: v }));
  }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await updateOrder(order.id, fields);
      setMsg(res);
      if (res.ok) setTimeout(() => setMsg(null), 2000);
    });
  }

  function remove() {
    if (!confirm(`Delete order ${order.orderNumber}? This can't be undone.`)) return;
    start(async () => {
      await deleteOrder(order.id);
      onClose();
    });
  }

  function sendToCourier() {
    setCourierMsg(null);
    startCourier(async () => {
      const res = await sendOrderToCourier(order.id);
      if (res.error) {
        setCourierMsg({ error: res.error });
      } else {
        setCourierMsg({ ok: true });
        setCourier((c) => ({ ...c, trackingCode: res.trackingCode ?? c.trackingCode }));
        setStatus("on_the_way");
        set("status", "on_the_way");
      }
    });
  }

  function markDelivered() {
    startStatus(async () => {
      await updateOrderStatus(order.id, "confirmed");
      setStatus("confirmed");
      set("status", "confirmed");
    });
  }

  function returnOrCancel() {
    startStatus(async () => {
      await updateOrderStatus(order.id, "cancelled");
      setStatus("cancelled");
      set("status", "cancelled");
    });
  }

  const alreadySent = !!courier.consignmentId;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-ink-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink-2/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-xs text-muted">{order.orderNumber}</p>
            <h2 className="font-display text-lg font-bold">{order.customerName}</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-fg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Product / totals (read-only) */}
          <div className="rounded-xl border border-line bg-ink/40 p-4 text-sm">
            <p className="text-muted">Product</p>
            <p className="font-medium">{order.productName}</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-muted">Unit price</p>
                <p className="font-semibold">{formatTaka(order.unitPrice)}</p>
              </div>
              <div>
                <p className="text-muted">Delivery</p>
                <p className="font-semibold">{formatTaka(order.deliveryCharge)}</p>
              </div>
              <div>
                <p className="text-muted">Total</p>
                <p className="font-semibold text-gold">{formatTaka(order.total)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-2">
              Placed {new Date(order.createdAt).toLocaleString("en-GB")}
            </p>
          </div>

          {/* Editable fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Customer name</label>
              <input className={input} value={fields.customerName} onChange={(e) => set("customerName", e.target.value)} />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={input} value={fields.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={label}>Address</label>
            <textarea className={input} rows={2} value={fields.address} onChange={(e) => set("address", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>Quantity</label>
              <input
                type="number"
                min={1}
                className={input}
                value={fields.quantity}
                onChange={(e) => set("quantity", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={label}>Delivery area</label>
              <select className={input} value={fields.area} onChange={(e) => set("area", e.target.value as "inside" | "outside")}>
                <option value="inside">Inside Dhaka</option>
                <option value="outside">Outside Dhaka</option>
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={input} value={fields.status} onChange={(e) => set("status", e.target.value)}>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={label}>Note</label>
            <textarea className={input} rows={2} value={fields.note} onChange={(e) => set("note", e.target.value)} />
          </div>

          {msg?.error && <p className="text-sm text-red-400">{msg.error}</p>}
          {msg?.ok && <p className="text-sm text-emerald-400">✓ Saved</p>}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <button
              onClick={remove}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-muted hover:border-red-500/50 hover:text-red-400"
            >
              <Trash className="h-4 w-4" /> Delete order
            </button>
            <button
              onClick={save}
              disabled={pending}
              className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>

          {/* Courier */}
          <div className="rounded-xl border border-line bg-ink/40 p-4">
            <p className="mb-3 text-sm font-semibold">Steadfast Courier</p>
            {alreadySent || courier.trackingCode ? (
              <>
                <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3 text-sm">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-emerald-300">Sent to courier</p>
                    {courier.trackingCode && (
                      <p className="text-xs text-muted">Tracking code: <span className="font-mono text-fg">{courier.trackingCode}</span></p>
                    )}
                  </div>
                </div>

                {status === "on_the_way" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={markDelivered}
                      disabled={statusPending}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" /> Confirm Delivered
                    </button>
                    <button
                      onClick={returnOrCancel}
                      disabled={statusPending}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" /> Return / Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={sendToCourier}
                  disabled={courierPending || status === "cancelled"}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-gold/50 disabled:opacity-50"
                >
                  <Truck className="h-4 w-4" />
                  {courierPending ? "Sending…" : "Send to Courier"}
                </button>
                {courierMsg?.error && (
                  <p className="mt-2 text-sm text-red-400">{courierMsg.error}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
