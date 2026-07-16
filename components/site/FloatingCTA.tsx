"use client";

import { useEffect, useState } from "react";
import { Whatsapp } from "@/components/icons";
import { toWhatsAppNumber } from "@/lib/utils";

export default function FloatingCTA({
  whatsapp,
  priceLabel,
  content,
}: {
  whatsapp: string;
  priceLabel: string;
  content: Record<string, string>;
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
        className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition hover:scale-105 sm:bottom-6"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
        <Whatsapp className="relative h-7 w-7" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-black/95 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-wide text-muted">{content.floating_from_label}</p>
            <p className="font-display text-lg font-bold text-fg">{priceLabel}</p>
          </div>
          <a
            href="#order"
            className="btn-gold flex-1 rounded-xl py-3 text-center font-semibold uppercase tracking-wide"
          >
            {content.floating_order_button}
          </a>
        </div>
      </div>
    </>
  );
}
