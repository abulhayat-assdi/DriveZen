"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import { saveProduct, type ProductPayload } from "@/app/admin/(panel)/products/actions";
import { Plus, Trash } from "@/components/icons";

type EditorProduct = ProductPayload;

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/15";
const label = "mb-1.5 block text-sm text-muted";

export default function ProductEditor({ initial }: { initial: EditorProduct }) {
  const [p, setP] = useState<EditorProduct>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function set<K extends keyof EditorProduct>(key: K, val: EditorProduct[K]) {
    setP((prev) => ({ ...prev, [key]: val }));
  }

  function save() {
    setError(null);
    start(async () => {
      const res = await saveProduct(p);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {initial.id ? "Edit product" : "New product"}
          </h1>
          <p className="text-sm text-muted">The product shown on your landing page</p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-xl border border-line bg-surface px-4 py-2 text-sm text-muted hover:text-fg"
        >
          Cancel
        </Link>
      </div>

      <Section title="Basic info">
        <div className="grid gap-4">
          <div>
            <label className={label}>Product name *</label>
            <input className={input} value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Premium Customised Armrest" />
          </div>
          <div>
            <label className={label}>Tagline / subtitle</label>
            <input className={input} value={p.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Perfect-fitting armrest for your Toyota Aqua" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Badge (e.g. Best Seller)</label>
              <input className={input} value={p.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Best Seller" />
            </div>
            <label className="flex items-end gap-3 pb-1">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="h-5 w-5 accent-[#e0b04f]"
                />
                <span className="text-sm">
                  <span className="font-medium">Active</span> — show this product on the landing page
                </span>
              </span>
            </label>
          </div>
        </div>
      </Section>

      <Section title="Pricing">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Current price (৳) *</label>
            <input type="number" className={input} value={p.price} onChange={(e) => set("price", Number(e.target.value))} placeholder="2490" />
          </div>
          <div>
            <label className={label}>Old price (৳)</label>
            <input type="number" className={input} value={p.oldPrice ?? ""} onChange={(e) => set("oldPrice", e.target.value ? Number(e.target.value) : null)} placeholder="3200" />
          </div>
          <div>
            <label className={label}>Price note</label>
            <input className={input} value={p.priceNote} onChange={(e) => set("priceNote", e.target.value)} placeholder="Home delivery nationwide" />
          </div>
        </div>
      </Section>

      <Section title="Description">
        <div className="grid gap-4">
          <div>
            <label className={label}>Short description</label>
            <textarea className={input} rows={2} value={p.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} />
          </div>
          <div>
            <label className={label}>Full description</label>
            <textarea className={input} rows={4} value={p.description} onChange={(e) => set("description", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Hero image">
        <ImageUpload value={p.heroImage} onChange={(url) => set("heroImage", url)} label="Upload hero image" className="max-w-md" />
      </Section>

      <Section
        title="Gallery images"
        action={<AddBtn onClick={() => set("images", [...p.images, { url: "", alt: "" }])} />}
      >
        {p.images.length === 0 && <Empty text="No images added yet." />}
        <div className="grid gap-4 sm:grid-cols-2">
          {p.images.map((img, i) => (
            <div key={i} className="rounded-xl border border-line bg-ink-2/50 p-3">
              <ImageUpload
                value={img.url || null}
                onChange={(url) => {
                  const next = [...p.images];
                  next[i] = { ...next[i], url: url ?? "" };
                  set("images", next);
                }}
              />
              <div className="mt-2 flex gap-2">
                <input
                  className={input}
                  placeholder="Alt text (optional)"
                  value={img.alt}
                  onChange={(e) => {
                    const next = [...p.images];
                    next[i] = { ...next[i], alt: e.target.value };
                    set("images", next);
                  }}
                />
                <RemoveBtn onClick={() => set("images", p.images.filter((_, j) => j !== i))} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Features (checklist)"
        action={<AddBtn onClick={() => set("features", [...p.features, { text: "" }])} />}
      >
        {p.features.length === 0 && <Empty text="No features added yet." />}
        <div className="grid gap-2">
          {p.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input}
                placeholder="e.g. No drilling required"
                value={f.text}
                onChange={(e) => {
                  const next = [...p.features];
                  next[i] = { text: e.target.value };
                  set("features", next);
                }}
              />
              <RemoveBtn onClick={() => set("features", p.features.filter((_, j) => j !== i))} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Highlight sections (image + text)"
        action={
          <AddBtn
            onClick={() =>
              set("highlights", [...p.highlights, { title: "", description: "", imageUrl: null }])
            }
          />
        }
      >
        {p.highlights.length === 0 && <Empty text="No highlights added yet." />}
        <div className="grid gap-4">
          {p.highlights.map((h, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-line bg-ink-2/50 p-3 sm:grid-cols-[220px_1fr]">
              <ImageUpload
                value={h.imageUrl}
                onChange={(url) => {
                  const next = [...p.highlights];
                  next[i] = { ...next[i], imageUrl: url };
                  set("highlights", next);
                }}
              />
              <div className="grid gap-2">
                <div className="flex gap-2">
                  <input
                    className={input}
                    placeholder="Highlight title"
                    value={h.title}
                    onChange={(e) => {
                      const next = [...p.highlights];
                      next[i] = { ...next[i], title: e.target.value };
                      set("highlights", next);
                    }}
                  />
                  <RemoveBtn onClick={() => set("highlights", p.highlights.filter((_, j) => j !== i))} />
                </div>
                <textarea
                  className={input}
                  rows={3}
                  placeholder="Description"
                  value={h.description}
                  onChange={(e) => {
                    const next = [...p.highlights];
                    next[i] = { ...next[i], description: e.target.value };
                    set("highlights", next);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 backdrop-blur lg:pl-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : (
            <p className="hidden text-sm text-muted sm:block">Don&apos;t forget to save your changes</p>
          )}
          <div className="flex gap-2">
            <Link href="/admin/products" className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
              Cancel
            </Link>
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
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted transition hover:border-gold/50 hover:text-fg"
    >
      <Plus className="h-4 w-4" /> Add
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-line text-muted transition hover:border-red-500/50 hover:text-red-400"
    >
      <Trash className="h-4 w-4" />
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="mb-3 text-sm text-muted-2">{text}</p>;
}
