"use client";

import { useState, useTransition } from "react";
import { replaceTestimonials, type TestimonialInput } from "./actions";
import { Plus, Trash, Star, ChevronDown } from "@/components/icons";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const EMPTY: TestimonialInput = {
  name: "",
  text: "",
  tag: "Toyota Aqua Owner",
  rating: 5,
  isActive: true,
};

export default function TestimonialsEditor({
  initial,
}: {
  initial: TestimonialInput[];
}) {
  const [items, setItems] = useState<TestimonialInput[]>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function update<K extends keyof TestimonialInput>(
    i: number,
    key: K,
    val: TestimonialInput[K]
  ) {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    setItems(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }

  function save() {
    setSaved(false);
    start(async () => {
      await replaceTestimonials(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="card rounded-2xl p-8 text-center text-muted">
          No testimonials yet. Add one — until then the site shows the packaged
          sample reviews.
        </p>
      )}

      {items.map((it, i) => (
        <div key={i} className="card rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted">
              Testimonial {i + 1}
            </span>
            <div className="flex items-center gap-1.5">
              <label className="mr-1 flex cursor-pointer items-center gap-1.5 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={it.isActive}
                  onChange={(e) => update(i, "isActive", e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                {it.isActive ? "Active" : "Hidden"}
              </label>
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move up"
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:text-fg disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Move down"
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:text-fg disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setItems(items.filter((_, j) => j !== i))}
                title="Delete"
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className={input}
              placeholder="Customer name"
              value={it.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />
            <input
              className={input}
              placeholder="Tag (e.g. Toyota Aqua Owner)"
              value={it.tag}
              onChange={(e) => update(i, "tag", e.target.value)}
            />
          </div>
          <textarea
            className={`${input} mt-2`}
            rows={2}
            placeholder="Review text"
            value={it.text}
            onChange={(e) => update(i, "text", e.target.value)}
          />

          <div className="mt-2 flex items-center gap-1">
            <span className="mr-1 text-xs text-muted">Rating</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update(i, "rating", n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className={n <= it.rating ? "text-gold" : "text-muted-2"}
              >
                <Star className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setItems([...items, { ...EMPTY }])}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-muted hover:border-gold/50 hover:text-fg"
        >
          <Plus className="h-4 w-4" /> Add testimonial
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
