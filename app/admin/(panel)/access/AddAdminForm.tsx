"use client";

import { useActionState, useEffect, useRef } from "react";
import { addAdminUser, type AddAdminState } from "./actions";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AddAdminForm() {
  const [state, formAction, pending] = useActionState<AddAdminState, FormData>(
    addAdminUser,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-muted">Name</label>
          <input name="name" type="text" className={input} placeholder="e.g. Rahim Uddin" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">Email</label>
          <input name="email" type="email" autoComplete="off" className={input} placeholder="name@example.com" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Password</label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          className={input}
          placeholder="At least 6 characters"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Admin added — they can now log in with this email and password.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add admin"}
      </button>
    </form>
  );
}
