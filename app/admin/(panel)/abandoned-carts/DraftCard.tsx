"use client";

import { useTransition } from "react";
import { toWhatsAppNumber } from "@/lib/utils";
import { dismissDraft } from "./actions";
import { Trash, Whatsapp } from "@/components/icons";

type Draft = {
  sessionId: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  productName: string | null;
  updatedAt: string;
};

export default function DraftCard({ draft }: { draft: Draft }) {
  const [pending, start] = useTransition();

  function onDismiss() {
    if (!confirm("Remove this abandoned cart entry?")) return;
    start(async () => {
      await dismissDraft(draft.sessionId);
    });
  }

  const wa = draft.phone
    ? `https://wa.me/${toWhatsAppNumber(draft.phone)}?text=${encodeURIComponent(
        `Hi${draft.name ? " " + draft.name : ""}, I noticed you were checking out on our site — would you like help completing your order?`
      )}`
    : null;

  return (
    <div className="card flex flex-wrap items-center gap-3 rounded-2xl p-4">
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{draft.name || "Unnamed visitor"}</div>
        <div className="truncate text-xs text-muted">
          {draft.phone || "No phone yet"}
          {draft.productName && ` · ${draft.productName}`}
        </div>
        {draft.address && <div className="mt-1 truncate text-xs text-muted-2">{draft.address}</div>}
      </div>

      <div className="shrink-0 text-right text-xs text-muted">
        Last seen {new Date(draft.updatedAt).toLocaleString("en-GB")}
      </div>

      <div className="flex shrink-0 gap-2">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
          >
            <Whatsapp className="h-3.5 w-3.5" /> Message
          </a>
        )}
        <button
          onClick={onDismiss}
          disabled={pending}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:border-red-500/50 hover:text-red-400"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
