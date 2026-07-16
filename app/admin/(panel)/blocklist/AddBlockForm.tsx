"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addBlockedEntry, type AddBlockState } from "./actions";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AddBlockForm() {
  const [state, formAction, pending] = useActionState<AddBlockState, FormData>(addBlockedEntry, {});
  const [type, setType] = useState<"phone" | "ip">("phone");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-muted">Type</label>
          <select
            name="type"
            className={input}
            value={type}
            onChange={(e) => setType(e.target.value as "phone" | "ip")}
          >
            <option value="phone">Phone number</option>
            <option value="ip">IP address</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">
            {type === "phone" ? "Phone number" : "IP address"}
          </label>
          <input
            name="value"
            type="text"
            className={input}
            placeholder={type === "phone" ? "01XXXXXXXXX" : "203.0.113.9"}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Reason (optional)</label>
        <input name="reason" type="text" className={input} placeholder="e.g. Repeated fake orders" />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Blocked.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to blocklist"}
      </button>
    </form>
  );
}
