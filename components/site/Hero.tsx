"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "@/components/icons";

export default function Hero({
  images,
  kicker,
  headline,
  productName,
  priceLabel,
  oldPriceLabel,
  discount,
  badge,
  content,
}: {
  images: string[];
  kicker: string;
  headline: string;
  productName: string;
  priceLabel: string;
  oldPriceLabel?: string | null;
  discount: number;
  badge?: string | null;
  content: Record<string, string>;
}) {
  const slides = images.length ? images : ["/seed/armrest-hero.jpg"];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section id="hero" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      {/* Background slides */}
      {slides.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: idx === i ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            quality={85}
            className="object-cover"
            style={{ transform: idx === i ? "scale(1.05)" : "scale(1)", transition: "transform 7s ease-out" }}
          />
        </div>
      ))}
      <div className="absolute inset-0 overlay-b" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-8 sm:pb-20">
          <div className="max-w-3xl animate-fade-up">
            {badge && (
              <span className="mb-3 inline-block rounded-full border border-white/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:mb-5">
                {badge}
              </span>
            )}
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-white/60 sm:mb-4">
              {kicker}
            </p>
            <h1 className="display-xl text-[13vw] leading-[0.92] sm:text-7xl md:text-8xl">
              {headline}
            </h1>

            <div className="mt-4 border-t border-white/15 pt-4 sm:mt-7 sm:pt-5">
              <p className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
                {productName}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-white sm:text-3xl">
                  {content.hero_from_label} {priceLabel}
                </span>
                {oldPriceLabel && (
                  <span className="text-base text-white/40 line-through">{oldPriceLabel}</span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-gold-soft">
                    {discount}% {content.hero_off_label}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
                <a
                  href="#order"
                  className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide"
                >
                  {content.hero_order_button} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#highlights"
                  className="btn-outline inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-wide"
                >
                  {content.hero_discover_button}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-gold" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
