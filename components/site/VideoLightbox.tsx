"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Close, Play } from "@/components/icons";

export default function VideoLightbox({
  thumbnail,
  videoUrl,
}: {
  thumbnail: string;
  videoUrl?: string | null;
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
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-tline shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        aria-label="Play installation video"
      >
        <Image
          src={thumbnail}
          alt="DriveZen Armrest installation video"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={85}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/25" />
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-30" />
          <Play className="relative ml-1 h-7 w-7 sm:h-8 sm:w-8" />
        </span>
      </button>

      {/* Lightbox */}
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
              aria-label="Close video"
            >
              <Close className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-night-2">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  title="DriveZen installation video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* <!-- video embed here --> */
                <div className="grid h-full w-full place-items-center px-6 text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-brand">
                      <Play className="ml-0.5 h-6 w-6" />
                    </span>
                    <p className="mt-4 font-semibold text-white">Installation ভিডিও শীঘ্রই আসছে</p>
                    <p className="mt-1 text-sm text-white/50">Video embed placeholder</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
