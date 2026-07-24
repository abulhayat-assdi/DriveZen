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
      {/* Main image — small, centred square */}
      <div className="card-light relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden !p-0 sm:max-w-none">
        <ImageZoom
          key={current.url}
          src={current.url}
          alt={current.caption}
          wrapperClassName="absolute inset-0 block h-full w-full cursor-zoom-in"
          imageClassName="animate-fade-up rounded-2xl object-cover"
          sizes="(max-width: 1024px) 300px, 50vw"
          quality={85}
        />
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          {current.caption}
        </span>
      </div>

      {/* Thumbnails — compact list of small squares */}
      <div className="no-scrollbar mt-3 flex justify-center gap-2 overflow-x-auto pb-1">
        {items.map((it, i) => (
          <button
            key={it.url + i}
            type="button"
            onClick={() => setActive(i)}
            className={`group relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 sm:h-16 sm:w-16 ${
              active === i ? "border-brand" : "border-transparent opacity-80 hover:opacity-100"
            }`}
            aria-label={it.caption}
          >
            <Image
              src={it.url}
              alt={it.caption}
              fill
              loading="lazy"
              sizes="64px"
              quality={75}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
