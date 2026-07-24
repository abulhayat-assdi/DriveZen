"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Close } from "@/components/icons";

export default function ImageZoom({
  src,
  alt,
  wrapperClassName,
  imageClassName,
  sizes,
  quality = 85,
}: {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  sizes: string;
  quality?: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={wrapperClassName}
        aria-label={`Zoom: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          sizes={sizes}
          quality={quality}
          className={imageClassName}
        />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="animate-fade-up relative w-full max-w-3xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brand"
              aria-label="Close image"
            >
              <Close className="h-5 w-5" />
            </button>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-night-2 sm:aspect-[4/3]">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                quality={90}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
