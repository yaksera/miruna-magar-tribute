"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Tilted "now showing" banner between the hero and the reel. Speeds up with scroll velocity. */
export function Ticker() {
  const root = useRef<HTMLDivElement>(null);
  const titles = profile.films.filter((f) => f.trailer).map((f) => f.title.split(":")[0]);
  const items = [...titles, ...titles];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to("[data-ticker-track]", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
            gsap.to(loop, { timeScale: boost * (self.direction < 0 ? -1 : 1), duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: self.direction < 0 ? -1 : 1, duration: 1.2, delay: 0.2 });
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="relative z-10 -my-6 -rotate-2 bg-red py-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
      <div className="overflow-hidden">
        <div data-ticker-track className="flex w-max items-center gap-8 whitespace-nowrap font-serif text-3xl italic text-cream sm:text-4xl">
          {items.map((t, i) => (
            <span key={`${t}-${i}`} className="flex items-center gap-8">
              <span className="font-mono text-xs not-italic uppercase tracking-[0.3em] text-gold">Now showing</span>
              {t}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
