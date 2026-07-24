"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Close, ZoomIn } from "@/components/icons";

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
}: {
  beforeSrc: string;
  afterSrc: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [zoomOpen]);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const stop = () => {
    dragging.current = false;
  };

  return (
    <>
    {/* 4:3 at every breakpoint: the BEFORE shot is native 4:3 and the AFTER shot
        is 3:4 portrait, so a 16:9 frame would crop the armrest away. */}
    <div
      ref={trackRef}
      className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-tline shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {/* After (full, underneath) */}
      <Image
        src={afterSrc}
        alt="With DriveZen Armrest"
        fill
        loading="lazy"
        sizes="(max-width: 1024px) 100vw, 60vw"
        quality={85}
        className="object-cover"
        draggable={false}
      />

      {/* Before (clipped on top) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt="Without Armrest"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 60vw"
          quality={85}
          className="object-cover grayscale-[35%]"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
        Without Armrest
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold text-white">
        With DriveZen Armrest
      </span>

      {/* Zoom trigger — separate from the drag handle so it doesn't fight the slider */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setZoomOpen(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-brand"
        aria-label="Zoom image"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -ml-px w-[2px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-1/2 -ml-[22px] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-brand text-white shadow-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
          </svg>
        </div>
      </div>
    </div>

    {/* Lightbox */}
    {zoomOpen && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={() => setZoomOpen(false)}
        />
        <div className="animate-fade-up relative w-full max-w-3xl">
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brand"
            aria-label="Close image"
          >
            <Close className="h-5 w-5" />
          </button>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-night-2">
            <Image
              src={afterSrc}
              alt="With DriveZen Armrest"
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
