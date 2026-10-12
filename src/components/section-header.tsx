"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type Props = { index: string; title: string; meta?: string };

/** Numbered section heading: the title rises line by line out of a mask while its rule draws across. */
export function SectionHeader({ index, title, meta }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } });
        tl.from("[data-title] > span", { yPercent: 105, duration: 1, ease: "power4.out" })
          .from("[data-rule]", { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.inOut" }, 0)
          .from("[data-meta]", { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.4);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <header ref={root} className="relative pb-5">
      <div className="flex items-baseline justify-between gap-4">
        <span data-meta className="label text-red">
          {index}
        </span>
        {meta && (
          <span data-meta className="max-w-xs text-right text-sm text-grey">
            {meta}
          </span>
        )}
      </div>
      {/* the inner span rises out of the clipped heading */}
      <h2 data-title className="display mt-3 overflow-hidden text-6xl sm:text-8xl lg:text-[112px]">
        <span className="block">{title}</span>
      </h2>
      <span data-rule aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-text" />
    </header>
  );
}
