"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Close, Whatsapp } from "@/components/icons";
import { toWhatsAppNumber } from "@/lib/utils";

export default function Navbar({
  brandName,
  logoUrl,
  whatsapp,
  content,
}: {
  brandName: string;
  logoUrl?: string | null;
  whatsapp: string;
  content: Record<string, string>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const wa = `https://wa.me/${toWhatsAppNumber(whatsapp)}`;

  const LINKS = [
    { href: "#features", label: content.nav_features },
    { href: "#highlights", label: content.nav_highlights },
    { href: "#gallery", label: content.nav_gallery },
    { href: "#reviews", label: content.nav_reviews },
    { href: "#faq", label: content.nav_faq },
    { href: "#order", label: content.nav_order },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-black/70 backdrop-blur-xl" : "bg-gradient-to-b from-black/60 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8">
          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 text-fg"
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="h-[2px] w-6 bg-current" />
              <span className="h-[2px] w-6 bg-current" />
              <span className="h-[2px] w-4 bg-current" />
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted sm:inline">
              {content.nav_menu_label}
            </span>
          </button>

          {/* Center wordmark */}
          <a
            href="#top"
            className="absolute left-1/2 -translate-x-1/2 font-display text-lg font-extrabold uppercase tracking-[0.35em] sm:text-2xl sm:tracking-[0.4em]"
          >
            {logoUrl ? (
              <Image src={logoUrl} alt={brandName} width={140} height={32} className="h-8 w-auto" priority />
            ) : (
              brandName
            )}
          </a>

          {/* Right: WhatsApp */}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-fg"
            aria-label="WhatsApp"
          >
            <Whatsapp className="h-5 w-5" />
            <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted md:inline">
              {whatsapp}
            </span>
          </a>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col px-4 py-6 sm:px-8">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.35em]">
              {brandName}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-fg transition hover:border-gold/60"
              aria-label="Close menu"
            >
              <Close className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-2"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span className="font-mono text-xs text-muted-2">0{i + 1}</span>
                <span className="font-display text-2xl font-extrabold uppercase tracking-tight text-muted transition-colors duration-300 group-hover:text-fg sm:text-5xl">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-sm text-muted">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
              <Whatsapp className="h-4 w-4 text-[#25D366]" /> {whatsapp}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
