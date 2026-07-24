"use client";

import { useState } from "react";
import Image from "next/image";
import ImageZoom from "@/components/site/ImageZoom";

export type GalleryItem = { url: string; caption: string };

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);

  if (!items.length) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <div>
      {/* Main image — 4:5 portrait. The product shots are taller than they are
          wide, so a landscape frame centre-crops the lid and cup holder away. */}
      <div className="card-light relative aspect-[4/5] overflow-hidden !p-0">
        <ImageZoom
          key={current.url}
          src={current.url}
          alt={current.caption}
          wrapperClassName="absolute inset-0 block h-full w-full cursor-zoom-in"
          imageClassName="animate-fade-up rounded-2xl object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={85}
        />
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          {current.caption}
        </span>
      </div>

      {/* Thumbnails — swipeable strip on mobile, grid on larger screens */}
      <div className="no-scrollbar -mx-1 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
        {items.map((it, i) => (
          <button
            key={it.url + i}
            type="button"
            onClick={() => setActive(i)}
            className={`group w-[38%] shrink-0 snap-start text-left transition-all duration-300 sm:w-auto ${
              active === i ? "" : "opacity-80 hover:opacity-100"
            }`}
            aria-label={it.caption}
          >
            <span
              className={`relative block aspect-[4/5] overflow-hidden rounded-xl border-2 transition-colors duration-300 ${
                active === i ? "border-brand" : "border-transparent"
              }`}
            >
              <Image
                src={it.url}
                alt={it.caption}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 40vw, 12vw"
                quality={75}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span
              className={`mt-1.5 block text-center text-[11px] font-semibold transition-colors duration-300 sm:text-xs ${
                active === i ? "text-brand" : "text-tmuted"
              }`}
            >
              {it.caption}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
