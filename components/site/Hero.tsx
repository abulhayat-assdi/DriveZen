"use client";

import Image from "next/image";
import { ArrowRight, Play, Check, Truck, Shield, Star } from "@/components/icons";

const CHIPS = [
  "Cash On Delivery",
  "সারা বাংলাদেশে Delivery",
  "Toyota Aqua-এর জন্য Perfect Fit",
];

const SIDE_BADGES = [
  { icon: Truck, label: "Fast Delivery" },
  { icon: Shield, label: "Quality Tested" },
  { icon: Star, label: "Customer Favorite" },
];

export default function Hero({ image }: { image: string }) {
  return (
    <section id="top" className="relative overflow-hidden bg-night">
      {/* Background image + overlays — full-bleed behind the whole section
          at every size, text on top. Mobile is dimmed less than desktop
          (opacity-90 vs opacity-60) so the cropped photo actually reads
          instead of disappearing into the dark gradients. */}
      <div className="absolute inset-0">
        {/* LCP element: preloaded in <head> and loaded eagerly. `priority` is
            deprecated in Next 16 in favour of the explicit pair below. */}
        <Image
          src={image}
          alt="DriveZen Premium Armrest — Toyota Aqua interior"
          fill
          preload
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={85}
          className="animate-hero-zoom object-cover object-center opacity-90"
        />
        {/* Mobile/tablet: one soft vertical vignette — dark enough at the
            edges for text/nav contrast, light enough in the middle for the
            photo to actually read */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/25 to-night lg:hidden" />
        {/* Desktop: lighter two-layer overlay — just enough for text contrast
            on the left without washing the photo out */}
        <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-r lg:from-night lg:via-night/55 lg:to-night/10" />
        <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-t lg:from-night lg:via-transparent lg:to-night/35" />
        <div className="pointer-events-none absolute -right-24 top-1/3 hidden h-80 w-80 rounded-full bg-brand/15 blur-[130px] lg:block" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-36 lg:flex-row lg:items-center lg:gap-10 lg:pb-24">
        {/* Text */}
        <div className="max-w-2xl">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Premium Toyota Aqua Armrest
          </span>

          <h1
            className="animate-fade-up mt-4 font-display font-extrabold leading-[1.12] text-white [animation-delay:100ms] sm:mt-5"
            style={{ fontSize: "clamp(1.65rem, 7vw, 3.6rem)" }}
          >
            আপনার Aqua-টা কি সত্যিই <span className="text-brand">Complete</span>?
          </h1>

          <div className="animate-fade-up mt-4 space-y-2 text-sm leading-relaxed text-white/75 [animation-delay:200ms] sm:mt-5 sm:space-y-3 sm:text-base lg:text-lg">
            <p>মাইলেজ নিয়ে কোনো অভিযোগ নেই। ইঞ্জিন নিয়েও না।</p>
            <p>
              কিন্তু প্রতিদিন গাড়িতে উঠে যদি হাত রাখার একটা আরামদায়ক জায়গা খুঁজতে হয়,
              তাহলে হয়তো আপনার Aqua-তে এখনও একটা গুরুত্বপূর্ণ জিনিসের অভাব আছে।
            </p>
            <p className="text-white">
              <strong className="font-bold text-brand">DriveZen Premium Armrest</strong> সেই
              অভাবটাই পূরণ করে।
            </p>
          </div>

          <div className="animate-fade-up mt-5 flex flex-col gap-3 [animation-delay:300ms] sm:mt-7 sm:flex-row">
            <a href="#order" className="btn-brand px-7 py-3.5 text-base">
              আমার Aqua Upgrade করবো <ArrowRight className="h-5 w-5" />
            </a>
            <a href="#install" className="btn-ghost-dark px-7 py-3.5 text-base">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                <Play className="h-3.5 w-3.5" />
              </span>
              Installation Video দেখুন
            </a>
          </div>

          <div className="animate-fade-up mt-5 flex flex-wrap gap-2.5 [animation-delay:400ms] sm:mt-7">
            {CHIPS.map((c) => (
              <span key={c} className="chip-dark">
                <Check className="h-3.5 w-3.5 text-brand" /> {c}
              </span>
            ))}
          </div>
        </div>

        {/* Side badges — desktop only */}
        <div className="ml-auto hidden shrink-0 flex-col gap-4 lg:flex">
          {SIDE_BADGES.map((b, i) => (
            <div
              key={b.label}
              className="animate-fade-up flex w-44 flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-night-2/80 px-4 py-5 text-center backdrop-blur-sm"
              style={{ animationDelay: `${450 + i * 120}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                <b.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-white/90">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
