"use client";

import { useState, useTransition } from "react";
import { deleteAdminUser } from "./actions";
import { Trash } from "@/components/icons";

type User = { id: string; name: string; email: string; createdAt: string };

export default function AdminRow({
  user,
  isSelf,
  canDelete,
}: {
  user: User;
  isSelf: boolean;
  canDelete: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const joined = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function onDelete() {
    if (!confirm(`Remove "${user.name}" (${user.email}) as an admin?`)) return;
    setError("");
    start(async () => {
      const res = await deleteAdminUser(user.id);
      if (res.error) setError(res.error);
    });
  }

  return (
    <div className="card rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-sm font-semibold text-gold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{user.name}</p>
            {isSelf && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] text-gold">You</span>
            )}
          </div>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>

        <p className="hidden shrink-0 text-xs text-muted-2 sm:block">Joined {joined}</p>

        <button
          onClick={onDelete}
          disabled={pending || isSelf || !canDelete}
          title={
            isSelf
              ? "You can't remove your own account"
              : !canDelete
                ? "At least one admin must remain"
                : "Remove admin"
          }
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
