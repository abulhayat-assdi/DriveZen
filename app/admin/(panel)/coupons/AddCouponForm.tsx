"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addCoupon, type AddCouponState } from "./actions";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AddCouponForm() {
  const [state, formAction, pending] = useActionState<AddCouponState, FormData>(addCoupon, {});
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm text-muted">Code</label>
          <input
            name="code"
            type="text"
            className={`${input} uppercase`}
            placeholder="e.g. SAVE10"
            autoCapitalize="characters"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">Type</label>
          <select
            name="type"
            className={input}
            value={type}
            onChange={(e) => setType(e.target.value as "percent" | "fixed")}
          >
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed amount off</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">
            {type === "percent" ? "Percent (1-100)" : "Amount (Taka)"}
          </label>
          <input
            name="value"
            type="number"
            min={1}
            className={input}
            placeholder={type === "percent" ? "10" : "100"}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm text-muted">Min order amount</label>
          <input name="minOrderAmount" type="number" min={0} className={input} placeholder="0" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">Max uses (blank = unlimited)</label>
          <input name="maxUses" type="number" min={1} className={input} placeholder="e.g. 100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">Expires on (blank = never)</label>
          <input name="expiresAt" type="date" className={input} />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Coupon created.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add coupon"}
      </button>
    </form>
  );
}
