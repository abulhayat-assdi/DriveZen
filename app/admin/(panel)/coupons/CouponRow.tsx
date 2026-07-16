"use client";

import { useState, useTransition } from "react";
import { formatTaka } from "@/lib/utils";
import { deleteCoupon, toggleCouponActive } from "./actions";
import { Trash } from "@/components/icons";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
};

export default function CouponRow({ coupon }: { coupon: Coupon }) {
  const [pending, start] = useTransition();
  const [active, setActive] = useState(coupon.isActive);

  const expired = coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false;
  const maxedOut = coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;

  function onToggle() {
    const next = !active;
    setActive(next);
    start(async () => {
      await toggleCouponActive(coupon.id, next);
    });
  }

  function onDelete() {
    if (!confirm(`Delete coupon "${coupon.code}"? This can't be undone.`)) return;
    start(async () => {
      await deleteCoupon(coupon.id);
    });
  }

  return (
    <div className="card rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono font-semibold">{coupon.code}</p>
            {!active && (
              <span className="rounded-full bg-line px-2 py-0.5 text-[11px] text-muted">Inactive</span>
            )}
            {expired && (
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] text-red-400">Expired</span>
            )}
            {maxedOut && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-400">Maxed out</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {coupon.type === "percent" ? `${coupon.value}% off` : `${formatTaka(coupon.value)} off`}
            {coupon.minOrderAmount > 0 && ` · min order ${formatTaka(coupon.minOrderAmount)}`}
            {" · used "}
            {coupon.usedCount}
            {coupon.maxUses !== null ? ` / ${coupon.maxUses}` : ""}
            {coupon.expiresAt && ` · expires ${new Date(coupon.expiresAt).toLocaleDateString("en-GB")}`}
          </p>
        </div>

        <button
          onClick={onToggle}
          disabled={pending}
          className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50 ${
            active
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-line text-muted hover:border-line-2"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </button>

        <button
          onClick={onDelete}
          disabled={pending}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition hover:border-red-500/50 hover:text-red-400"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
