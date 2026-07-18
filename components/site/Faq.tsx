"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/icons";

type Item = { id: string; question: string; answer: string };

export default function Faq({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div
            key={it.id}
            className={`card-light overflow-hidden transition-shadow duration-300 ${
              isOpen ? "shadow-[0_12px_36px_rgba(0,0,0,0.1)]" : ""
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : it.id)}
              className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-tdark">{it.question}</span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-180 bg-brand text-white" : "bg-paper text-tmuted"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-tmuted">{it.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
