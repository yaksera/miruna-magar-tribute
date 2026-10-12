"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import type { Film } from "@/content/profile";

type Playing = Pick<Film, "title" | "year"> & { trailer: NonNullable<Film["trailer"]> };

const Ctx = createContext<(film: Film) => void>(() => {});

/** Lets any section open an official trailer in one shared, lazily-loaded player. */
export function TrailerProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState<Playing | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const open = useCallback((film: Film) => {
    if (film.trailer) setPlaying({ title: film.title, year: film.year, trailer: film.trailer });
  }, []);

  const close = useCallback(() => {
    const el = dialog.current;
    if (!el) return;
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.25,
      onComplete: () => {
        el.close();
        setPlaying(null); // unmounts the iframe, stopping playback
      },
    });
  }, []);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !playing || el.open) return;
    el.showModal();
    gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    gsap.fromTo("[data-trailer-frame]", { scale: 0.92, y: 30 }, { scale: 1, y: 0, duration: 0.6, ease: "expo.out" });
  }, [playing]);

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        aria-label={playing ? `${playing.title} ${playing.trailer.kind.toLowerCase()}` : "Trailer"}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto w-[min(94vw,1100px)] max-w-none bg-transparent p-0 text-cream backdrop:bg-black/90"
      >
        {playing && (
          <figure data-trailer-frame>
            <figcaption className="mb-3 flex items-end justify-between gap-4 font-mono text-xs uppercase tracking-[0.2em] text-cream/70">
              <span>
                <span className="text-gold">{playing.trailer.kind}</span> · {playing.title} ({playing.year}) · via{" "}
                {playing.trailer.channel}
              </span>
              <button type="button" onClick={close} aria-label="Close trailer" className="rounded-full p-2 text-cream hover:bg-white/10">
                <X className="size-5" />
              </button>
            </figcaption>
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${playing.trailer.id}?autoplay=1&rel=0&modestbranding=1`}
                title={`${playing.title} official ${playing.trailer.kind.toLowerCase()}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
          </figure>
        )}
      </dialog>
    </Ctx.Provider>
  );
}

export const usePlayTrailer = () => useContext(Ctx);
