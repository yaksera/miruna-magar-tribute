"use client";

import { useRef } from "react";
import { Play } from "lucide-react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { usePlayTrailer } from "./trailer-context";

/** Complete filmography styled as an end-credits roll that drifts upward with the scroll. */
export function Credits() {
  const root = useRef<HTMLElement>(null);
  const play = usePlayTrailer();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-roll]",
          { y: 120 },
          { y: -120, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>("[data-credit]").forEach((row) =>
          gsap.fromTo(
            row,
            { autoAlpha: 0.15 },
            { autoAlpha: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 95%", end: "top 60%", scrub: true } },
          ),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="filmography" ref={root} className="relative overflow-hidden bg-black py-32 text-cream">
      <div data-roll className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cream/50">Starring</p>
        <p className="mt-3 font-serif text-5xl font-light italic sm:text-6xl">{profile.name}</p>
        <h2 className="mt-20 font-mono text-[11px] uppercase tracking-[0.4em] text-gold">{profile.copy.creditsTitle}</h2>

        <ol className="mt-10 space-y-6 text-left">
          {profile.films.map((f) => (
            <li key={f.title} data-credit className="flex items-baseline gap-4">
              <span className="w-12 shrink-0 font-mono text-xs text-cream/45">{f.year}</span>
              <span className="font-serif text-xl uppercase tracking-[0.08em] sm:text-2xl">{f.title}</span>
              <span aria-hidden className="leader" />
              <span className="shrink-0 font-serif text-lg italic text-cream/75">{f.role ?? "—"}</span>
              {f.trailer ? (
                <button
                  type="button"
                  onClick={() => play(f)}
                  aria-label={`Play ${f.title} ${f.trailer.kind.toLowerCase()}`}
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-cream/25 text-cream/70 transition-ui hover:border-gold hover:text-gold"
                >
                  <Play className="size-3 translate-x-px fill-current" />
                </button>
              ) : (
                <span aria-hidden className="size-8 shrink-0" />
              )}
            </li>
          ))}
        </ol>

        <p className="mt-20 font-mono text-[11px] uppercase tracking-[0.4em] text-cream/40">
          {profile.films.length} films · 2018 — 2025
        </p>
      </div>
    </section>
  );
}
