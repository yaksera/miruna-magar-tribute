"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { PoseCharacter } from "./pose-character";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" }, delay: 0.15 })
          .from("[data-hero-char]", { yPercent: 14, autoAlpha: 0, duration: 1.4, ease: "expo.out" })
          .from("[data-hero-glow]", { scale: 0.6, autoAlpha: 0, duration: 1.6, ease: "expo.out" }, 0)
          .from("[data-hero-hi]", { autoAlpha: 0, y: 20, duration: 0.7 }, 0.35)
          .fromTo(
            "[data-hero-name]",
            // Negative top/bottom insets leave room for descenders; cleared afterwards.
            { clipPath: "inset(-30% 100% -40% -5%)" },
            { clipPath: "inset(-30% 0% -40% -5%)", duration: 1.4, ease: "power2.inOut", clearProps: "clipPath" },
            0.5,
          )
          .from("[data-hero-copy]", { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, 1.1)
          .from("[data-hero-cta]", { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.1 }, 1.3);

        gsap.to("[data-hero-copy-wrap]", {
          yPercent: -30,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-char]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-glow]", { scale: 1.06, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="grain relative isolate flex min-h-svh items-stretch overflow-hidden bg-[radial-gradient(110%_80%_at_75%_35%,#fffaf2_0%,var(--pf-cream)_45%,#efe2cf_100%)] text-ink"
    >

      <div className="mx-auto grid w-full max-w-[1240px] items-end gap-0 px-5 pt-28 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:pt-0">
        <div data-hero-copy-wrap className="relative z-10 self-center pb-10 lg:pb-0">
          <p data-hero-hi className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald sm:text-base">
            {profile.copy.heroGreeting}
          </p>
          <h1
            data-hero-name
            className="-ml-1 mt-2 font-script text-[76px] leading-[0.95] text-red [text-shadow:0_8px_30px_rgba(179,18,46,0.18)] sm:text-[110px] lg:text-[124px]"
          >
            {profile.name}
          </h1>
          <p data-hero-copy className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
            {profile.tagline}
          </p>
          <p data-hero-copy className="mt-4 inline-flex border border-ink/30 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink/70">
            Unofficial fan tribute
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              data-hero-cta
              href={profile.copy.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-cream shadow-lg shadow-emerald/25 transition-ui hover:-translate-y-0.5 hover:bg-ink"
            >
              {profile.copy.primaryCta.label}
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              data-hero-cta
              href={profile.copy.secondaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-red px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-red transition-ui hover:-translate-y-0.5 hover:bg-red hover:text-cream"
            >
              {profile.copy.secondaryCta.label}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[580px] self-end">
          <div
            data-hero-glow
            aria-hidden
            className="absolute bottom-[8%] left-1/2 size-[92%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_closest-side,rgba(15,90,70,0.28),rgba(201,162,74,0.12)_60%,transparent)]"
          />
          <div data-hero-char className="relative -mb-1">
            <PoseCharacter className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
