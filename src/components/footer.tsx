"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-footer-name]", {
          yPercent: 100,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="bg-text text-paper">
      <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-16 sm:px-8">
        <p className="overflow-hidden">
          <span data-footer-name className="display block text-[18vw] leading-[0.8] lg:text-[200px]">
            {profile.name}
          </span>
        </p>
        <div className="mt-10 flex flex-col gap-2 border-t border-paper/20 pt-5 text-sm text-paper/60 sm:flex-row sm:justify-between">
          <p>{profile.disclaimer}</p>
          <p>
            Built with Next.js and GSAP ·{" "}
            <a href="#top" className="underline underline-offset-4 hover:text-paper">
              Back to top
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
