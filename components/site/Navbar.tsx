"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Close, ArrowRight, Whatsapp } from "@/components/icons";
import { toWhatsAppNumber } from "@/lib/utils";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({
  brandName,
  logoUrl,
  whatsapp,
}: {
  brandName: string;
  logoUrl?: string | null;
  whatsapp: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-night/85 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
          {/* Logo + tagline */}
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            {logoUrl ? (
              <Image src={logoUrl} alt={brandName} width={140} height={32} className="h-8 w-auto" priority />
            ) : (
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Drive<span className="text-brand">Z</span>en
              </span>
            )}
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-white/50 lg:block">
              Drive Better. Live Comfortably.
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/75 transition-colors duration-300 hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a href="#order" className="btn-brand hidden px-5 py-2.5 text-sm sm:inline-flex">
              Upgrade My Aqua <ArrowRight className="h-4 w-4" />
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-white transition-colors duration-300 hover:border-brand md:hidden"
              aria-label="Open menu"
            >
              <span className="flex flex-col items-end gap-[5px]">
                <span className="h-[2px] w-5 rounded bg-current" />
                <span className="h-[2px] w-5 rounded bg-current" />
                <span className="h-[2px] w-3.5 rounded bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-in drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-night-2 shadow-2xl shadow-black/60 transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              Drive<span className="text-brand">Z</span>en
            </span>
            <button
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-brand"
              aria-label="Close menu"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-5 py-6">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
                className={`rounded-lg px-3 py-3.5 text-lg font-semibold text-white/85 transition-all duration-500 hover:bg-white/5 hover:text-brand ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="space-y-3 border-t border-white/10 px-5 py-5">
            <a href="#order" onClick={() => setOpen(false)} className="btn-brand w-full px-5 py-3 text-base">
              Upgrade My Aqua <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-dark w-full px-5 py-3 text-sm"
            >
              <Whatsapp className="h-5 w-5 text-[#25D366]" /> WhatsApp: {whatsapp}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
