"use client";

import { useState, useTransition } from "react";
import { replaceFaqs } from "./actions";
import { Plus, Trash } from "@/components/icons";

type Item = { question: string; answer: string };

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function FaqEditor({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(i: number, key: keyof Item, val: string) {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    setItems(next);
  }

  function save() {
    setSaved(false);
    start(async () => {
      await replaceFaqs(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="card rounded-2xl p-8 text-center text-muted">
          No questions added yet.
        </p>
      )}

      {items.map((it, i) => (
        <div key={i} className="card rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Question {i + 1}</span>
            <button
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
          <input
            className={`${input} mb-2`}
            placeholder="Question"
            value={it.question}
            onChange={(e) => update(i, "question", e.target.value)}
          />
          <textarea
            className={input}
            rows={2}
            placeholder="Answer"
            value={it.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
          />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setItems([...items, { question: "", answer: "" }])}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-muted hover:border-gold/50 hover:text-fg"
        >
          <Plus className="h-4 w-4" /> Add question
        </button>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-400">✓ Saved</span>}
          <button
            onClick={save}
            disabled={pending}
            className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
