"use client";

import { useState, useTransition } from "react";
import { saveContent } from "./actions";
import type { ContentField } from "@/lib/content";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/15";

export default function ContentEditor({
  groups,
  fieldsByGroup,
  initial,
}: {
  groups: string[];
  fieldsByGroup: Record<string, ContentField[]>;
  initial: Record<string, string>;
}) {
  const [values, setValues] = useState(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [activeGroup, setActiveGroup] = useState(groups[0]);

  function set(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveContent(values);
      setMsg(res);
      if (res.ok) setTimeout(() => setMsg(null), 2500);
    });
  }

  return (
    <div className="pb-24">
      <div className="mb-5 flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              activeGroup === g
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-line bg-surface text-muted hover:text-fg"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <section
          key={g}
          className={`card grid gap-4 rounded-2xl p-5 ${activeGroup === g ? "" : "hidden"}`}
        >
          <h2 className="font-display font-bold">{g}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {fieldsByGroup[g].map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm text-muted">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    className={input}
                    rows={2}
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.default}
                  />
                ) : (
                  <input
                    className={input}
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.default}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 backdrop-blur lg:pl-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm">
            {msg?.error ? (
              <span className="text-red-400">{msg.error}</span>
            ) : msg?.ok ? (
              <span className="text-emerald-400">✓ Content saved — live on the site now</span>
            ) : (
              <span className="hidden text-muted sm:inline">
                Editing: <span className="text-fg">{activeGroup}</span>
              </span>
            )}
          </p>
          <button
            onClick={save}
            disabled={pending}
            className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save all"}
          </button>
        </div>
      </div>
    </div>
  );
}
