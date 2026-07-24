"use client";

import { useState, useTransition } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { replaceReviewImages, type ReviewImageInput } from "./actions";
import { Plus, Trash, ChevronDown } from "@/components/icons";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const EMPTY: ReviewImageInput = { imageUrl: "", caption: "", isActive: true };

export default function ReviewImagesEditor({
  initial,
}: {
  initial: ReviewImageInput[];
}) {
  const [items, setItems] = useState<ReviewImageInput[]>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function update<K extends keyof ReviewImageInput>(
    i: number,
    key: K,
    val: ReviewImageInput[K]
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
      await replaceReviewImages(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="card rounded-2xl p-8 text-center text-muted">
          No image reviews yet. Add one — until then the site shows the packaged
          sample photos.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="card rounded-2xl p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted">
                Photo {i + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move earlier"
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted hover:text-fg disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  title="Move later"
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted hover:text-fg disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
                <button
                  onClick={() => setItems(items.filter((_, j) => j !== i))}
                  title="Delete"
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ImageUpload
              value={it.imageUrl}
              onChange={(url) => update(i, "imageUrl", url ?? "")}
              label="Upload photo"
            />

            <input
              className={`${input} mt-2`}
              placeholder="Caption (optional)"
              value={it.caption}
              onChange={(e) => update(i, "caption", e.target.value)}
            />

            <label className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                checked={it.isActive}
                onChange={(e) => update(i, "isActive", e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              {it.isActive ? "Active" : "Hidden"}
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setItems([...items, { ...EMPTY }])}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-muted hover:border-gold/50 hover:text-fg"
        >
          <Plus className="h-4 w-4" /> Add photo
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
