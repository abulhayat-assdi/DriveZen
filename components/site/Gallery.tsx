"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Close } from "@/components/icons";

type Img = { id: string; url: string; alt: string };

export default function Gallery({ images }: { images: Img[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 400px"
              quality={80}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <Close className="h-6 w-6" />
          </button>
          <Image
            src={images[active].url}
            alt={images[active].alt}
            width={1600}
            height={1200}
            quality={85}
            sizes="(max-width: 768px) 92vw, 80vw"
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            style={{ width: "auto", height: "auto" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
