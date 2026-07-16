"use client";

import { useState, useTransition } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { saveSettings, type SettingsPayload } from "./actions";

const input =
  "w-full rounded-xl border border-line bg-ink-2 px-4 py-2.5 text-fg outline-none transition placeholder:text-muted-2 focus:border-gold/60 focus:ring-2 focus:ring-gold/15";
const label = "mb-1.5 block text-sm text-muted";

export default function SettingsForm({ initial }: { initial: SettingsPayload }) {
  const [s, setS] = useState<SettingsPayload>(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);

  function set<K extends keyof SettingsPayload>(k: K, v: SettingsPayload[K]) {
    setS((p) => ({ ...p, [k]: v }));
  }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveSettings(s);
      setMsg(res);
      if (res.ok) setTimeout(() => setMsg(null), 2500);
    });
  }

  return (
    <div className="space-y-5 pb-24">
      <Section title="Brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Brand name *</label>
            <input className={input} value={s.brandName} onChange={(e) => set("brandName", e.target.value)} />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <input className={input} value={s.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Logo</label>
            <ImageUpload value={s.logoUrl} onChange={(url) => set("logoUrl", url)} label="Upload logo" className="max-w-[200px]" />
          </div>
          <div>
            <label className={label}>Primary colour</label>
            <div className="flex items-center gap-3">
              <input type="color" value={s.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-11 w-16 cursor-pointer rounded-lg border border-line bg-ink-2" />
              <input className={input} value={s.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>WhatsApp number</label>
            <input className={input} value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="01608221914" />
          </div>
          <div>
            <label className={label}>Phone number</label>
            <input className={input} value={s.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={label}>Email</label>
            <input className={input} value={s.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={label}>Address</label>
            <input className={input} value={s.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className={label}>Facebook page URL</label>
            <input className={input} value={s.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} />
          </div>
          <div>
            <label className={label}>Messenger URL</label>
            <input className={input} value={s.messengerUrl} onChange={(e) => set("messengerUrl", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Home page copy">
        <div className="grid gap-4">
          <div>
            <label className={label}>Hero headline (big statement)</label>
            <input className={input} value={s.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="The comfort your drive deserves." />
          </div>
          <div>
            <label className={label}>Hero kicker (small label)</label>
            <input className={input} value={s.heroKicker} onChange={(e) => set("heroKicker", e.target.value)} placeholder="Premium Car Accessories" />
          </div>
          <div>
            <label className={label}>Announcement bar</label>
            <input className={input} value={s.announcement} onChange={(e) => set("announcement", e.target.value)} placeholder="Cash on delivery nationwide" />
          </div>
          <div>
            <label className={label}>Footer text</label>
            <textarea className={input} rows={2} value={s.footerText} onChange={(e) => set("footerText", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Delivery charges">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Inside Dhaka (৳)</label>
            <input type="number" className={input} value={s.deliveryInside} onChange={(e) => set("deliveryInside", Number(e.target.value))} />
          </div>
          <div>
            <label className={label}>Outside Dhaka (৳)</label>
            <input type="number" className={input} value={s.deliveryOutside} onChange={(e) => set("deliveryOutside", Number(e.target.value))} />
          </div>
          <div>
            <label className={label}>Currency symbol</label>
            <input className={input} value={s.currency} onChange={(e) => set("currency", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Steadfast Courier">
        <p className="mb-4 text-sm text-muted">
          Add your Steadfast API credentials to enable the &quot;Send to Courier&quot; button on orders.
          Get these from your Steadfast merchant panel.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>API Key</label>
            <input className={input} value={s.steadfastApiKey} onChange={(e) => set("steadfastApiKey", e.target.value)} placeholder="Not set" />
          </div>
          <div>
            <label className={label}>Secret Key</label>
            <input className={input} value={s.steadfastSecretKey} onChange={(e) => set("steadfastSecretKey", e.target.value)} placeholder="Not set" />
          </div>
        </div>
      </Section>

      <Section title="Facebook Pixel & Conversions API">
        <p className="mb-4 text-sm text-muted">
          Add your Pixel ID and Conversions API access token to track orders both from the
          browser (Pixel) and from the server (Conversions API) for more accurate ad results.
          Get these from Meta Events Manager → Data Sources → your pixel → Settings, and the
          &quot;Generate access token&quot; option under Conversions API.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Pixel ID</label>
            <input className={input} value={s.fbPixelId} onChange={(e) => set("fbPixelId", e.target.value)} placeholder="Not set" />
          </div>
          <div>
            <label className={label}>Conversions API access token</label>
            <input
              type="password"
              className={input}
              value={s.fbAccessToken}
              onChange={(e) => set("fbAccessToken", e.target.value)}
              placeholder="Not set"
            />
          </div>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 backdrop-blur lg:pl-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm">
            {msg?.error ? (
              <span className="text-red-400">{msg.error}</span>
            ) : msg?.ok ? (
              <span className="text-emerald-400">✓ Settings saved</span>
            ) : (
              <span className="hidden text-muted sm:inline">Save your changes</span>
            )}
          </p>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card rounded-2xl p-5">
      <h2 className="mb-4 font-display font-bold">{title}</h2>
      {children}
    </section>
  );
}
