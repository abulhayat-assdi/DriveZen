"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export default function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />

      <div>
        <label className="mb-1.5 block text-sm text-muted">Email</label>
        <input
          name="email"
          type="email"
          autoComplete="username"
          className="w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-fg outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
          placeholder="admin@drivezen.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Password</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-fg outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-gold w-full rounded-xl px-4 py-3 font-semibold transition disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
