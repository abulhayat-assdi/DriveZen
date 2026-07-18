"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "@/components/icons";

export type Review = { name: string; text: string; tag?: string };

const AUTO_ADVANCE_MS = 4000;

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [heldIndex, setHeldIndex] = useState<number | null>(null);

  const heldRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const count = reviews.length;

  // Step = distance between two consecutive cards (card width + gap).
  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const a = track.children[0] as HTMLElement;
    const b = track.children[1] as HTMLElement;
    return b.offsetLeft - a.offsetLeft;
  }, []);

  const scrollToIndex = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const step = getStep();
      if (!track || !step) return;
      const next = ((i % count) + count) % count;
      track.scrollTo({ left: next * step, behavior: "smooth" });
      setIndex(next);
    },
    [count, getStep]
  );

  const goManual = useCallback(
    (i: number) => {
      lastInteractionRef.current = Date.now();
      scrollToIndex(i);
    },
    [scrollToIndex]
  );

  // Auto-advance every 4s; paused while a card is held or right after any
  // manual interaction (buttons / touch swipe), and skipped for reduced motion.
  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastAdvance = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      if (heldRef.current) return;
      if (now - lastInteractionRef.current < AUTO_ADVANCE_MS) return;
      if (now - lastAdvance < AUTO_ADVANCE_MS - 100) return;
      if (document.hidden) return;
      lastAdvance = now;
      scrollToIndex(indexRef.current + 1);
    }, 500);
    return () => clearInterval(timer);
  }, [count, scrollToIndex]);

  // Keep the index in sync when the user swipes natively on touch.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const step = getStep();
    if (!track || !step) return;
    const i = Math.round(track.scrollLeft / step);
    if (i !== indexRef.current) setIndex(Math.max(0, Math.min(count - 1, i)));
  }, [count, getStep]);

  // Press-and-hold pauses the carousel so the review can be read.
  const hold = (i: number) => {
    heldRef.current = true;
    setHeldIndex(i);
  };
  const release = () => {
    heldRef.current = false;
    lastInteractionRef.current = Date.now();
    setHeldIndex(null);
  };

  if (!count) return null;

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onTouchStart={() => {
          lastInteractionRef.current = Date.now();
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-2 sm:gap-5"
      >
        {reviews.map((r, i) => (
          <div
            key={r.name + i}
            onPointerDown={() => hold(i)}
            onPointerUp={release}
            onPointerLeave={() => heldIndex === i && release()}
            onPointerCancel={release}
            onContextMenu={(e) => e.preventDefault()}
            className={`card-light w-[88%] shrink-0 select-none snap-start p-6 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] ${
              heldIndex === i
                ? "scale-[1.02] border-brand shadow-[0_14px_40px_rgba(245,130,10,0.18)]"
                : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/15 font-display font-bold text-brand">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-tdark">{r.name}</p>
                  <div className="mt-0.5 flex items-center gap-0.5 text-brand">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5" />
                    ))}
                  </div>
                </div>
              </div>
              {heldIndex === i && (
                <span className="rounded-full bg-brand/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
                  Paused
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-tmuted">&ldquo;{r.text}&rdquo;</p>
            {r.tag && <p className="mt-3 text-xs font-semibold text-tmuted/80">{r.tag}</p>}
          </div>
        ))}
      </div>

      {/* Prev / next buttons */}
      <button
        type="button"
        onClick={() => goManual(index - 1)}
        aria-label="Previous review"
        className="absolute -left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-tline bg-white text-tdark shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-all duration-300 hover:border-brand hover:text-brand active:scale-95 sm:-left-4"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => goManual(index + 1)}
        aria-label="Next review"
        className="absolute -right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-tline bg-white text-tdark shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-all duration-300 hover:border-brand hover:text-brand active:scale-95 sm:-right-4"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goManual(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-brand" : "w-2 bg-tdark/15 hover:bg-tdark/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
