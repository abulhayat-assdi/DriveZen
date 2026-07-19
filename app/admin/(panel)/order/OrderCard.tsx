"use client";

import { useState, useTransition } from "react";
import { formatTaka } from "@/lib/utils";
import { STATUS_META } from "./status";
import { updateOrderStatus, sendOrderToCourier } from "./actions";
import OrderDetailModal, { type OrderDetail } from "./OrderDetailModal";
import { ArrowRight, Check, Truck, X } from "@/components/icons";

export default function OrderCard({ order }: { order: OrderDetail }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [courierPending, startCourier] = useTransition();
  const [courierError, setCourierError] = useState<string | null>(null);
  const meta = STATUS_META[order.status] ?? STATUS_META.new;

  function setStatus(status: string) {
    start(async () => {
      await updateOrderStatus(order.id, status);
    });
  }

  function sendToCourier() {
    if (!confirm(`Send order ${order.orderNumber} (${order.customerName}) to Steadfast courier?`)) return;
    setCourierError(null);
    startCourier(async () => {
      const res = await sendOrderToCourier(order.id);
      if (res.error) setCourierError(res.error);
    });
  }

  const canSendToCourier =
    !order.courierConsignmentId && order.status !== "cancelled" && order.status !== "confirmed";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="card flex w-full cursor-pointer items-center gap-3 rounded-2xl p-4 text-left transition hover:border-gold/40"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted">{order.orderNumber}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${meta.badge}`}>{meta.label}</span>
            {order.courierConsignmentId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] text-sky-300">
                <Truck className="h-3 w-3" /> Courier
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate font-medium">{order.customerName}</div>
          <div className="truncate text-xs text-muted">{order.phone} · {order.productName}</div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-display font-bold text-gold">{formatTaka(order.total)}</div>
          <div className="text-xs text-muted">
            {order.quantity} pc · {order.area === "outside" ? "Outside Dhaka" : "Inside Dhaka"}
          </div>
        </div>

        {canSendToCourier && (
          <div className="flex shrink-0 flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={sendToCourier}
              disabled={courierPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20 disabled:opacity-50"
            >
              <Truck className="h-3.5 w-3.5" />
              {courierPending ? "Sending…" : "Send to Courier"}
            </button>
            {courierError && <p className="max-w-[240px] text-right text-[11px] text-red-400">{courierError}</p>}
          </div>
        )}

        {order.status === "on_the_way" && (
          <div className="flex shrink-0 gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setStatus("confirmed")}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" /> Confirm Delivered
            </button>
            <button
              onClick={() => setStatus("cancelled")}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" /> Return / Cancel
            </button>
          </div>
        )}

        <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
      </div>

      {open && <OrderDetailModal order={order} onClose={() => setOpen(false)} />}
    </>
  );
}
