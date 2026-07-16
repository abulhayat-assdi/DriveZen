"use client";

import { useTransition } from "react";
import { deleteBlockedEntry } from "./actions";
import { Trash, Phone, Ban } from "@/components/icons";

type Entry = { id: string; type: string; value: string; reason: string | null; createdAt: string };

export default function BlockedRow({ entry }: { entry: Entry }) {
  const [pending, start] = useTransition();

  function onDelete() {
    if (!confirm(`Unblock ${entry.value}?`)) return;
    start(async () => {
      await deleteBlockedEntry(entry.id);
    });
  }

  const added = new Date(entry.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
          {entry.type === "phone" ? <Phone className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-mono font-medium">{entry.value}</p>
            <span className="rounded-full bg-line px-2 py-0.5 text-[11px] uppercase text-muted">
              {entry.type}
            </span>
          </div>
          {entry.reason && <p className="truncate text-sm text-muted">{entry.reason}</p>}
        </div>

        <p className="hidden shrink-0 text-xs text-muted-2 sm:block">Added {added}</p>

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
