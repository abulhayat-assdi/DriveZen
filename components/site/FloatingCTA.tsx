"use client";

import { useEffect, useState } from "react";
import { Whatsapp } from "@/components/icons";
import { toWhatsAppNumber } from "@/lib/utils";

export default function FloatingCTA({
  whatsapp,
  priceLabel,
}: {
  whatsapp: string;
  priceLabel: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = `https://wa.me/${toWhatsAppNumber(whatsapp)}`;

  return (
    <>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-105 sm:bottom-6"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
        <Whatsapp className="relative h-7 w-7" />
      </a>

      {/* Mobile sticky order bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/95 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="leading-tight">
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">মূল্য</p>
            <p className="font-display text-lg font-extrabold text-white">{priceLabel}</p>
          </div>
          <a href="#order" className="btn-brand flex-1 px-4 py-3 text-center text-sm">
            আজই Aqua Upgrade করুন
          </a>
        </div>
      </div>
    </>
  );
}
