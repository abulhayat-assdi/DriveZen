"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash } from "@/components/icons";

export default function ImageUpload({
  value,
  onChange,
  label = "Upload image",
  className = "",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handle(file: File) {
    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Upload failed");
      } else {
        onChange(data.url);
      }
    } catch {
      setErr("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="group relative h-40 w-full overflow-hidden rounded-xl border border-line bg-ink-2">
          <Image src={value} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/80"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-2 bg-ink-2 text-muted transition hover:border-gold/50 hover:text-fg disabled:opacity-60"
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm">{busy ? "Uploading…" : label}</span>
        </button>
      )}
      {err && <p className="mt-1.5 text-xs text-red-400">{err}</p>}
    </div>
  );
}
