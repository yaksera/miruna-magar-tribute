"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/use-reveal";

/** Biography, key numbers and timeline: plain text on paper, organised by rules and a grid. */
export function Biography() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: Number(el.dataset.count),
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="bg-paper text-text">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8 lg:pb-32">
        <header className="border-b-2 border-text pb-5">
          <h2 data-reveal className="display text-6xl sm:text-8xl lg:text-[120px]">
            {profile.copy.aboutTitle}
          </h2>
        </header>

        <div className="grid gap-12 pt-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <dl className="grid grid-cols-3 gap-6 self-start lg:grid-cols-1 lg:gap-8">
            {profile.stats.map((s) => (
              <div key={s.label} data-reveal className="border-t border-text pt-3">
                <dt className="sr-only">{s.label}</dt>
                <dd className="display text-5xl sm:text-6xl">
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix}
                </dd>
                <dd aria-hidden className="mt-2 text-sm text-grey">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

          <div className="space-y-6 text-lg leading-relaxed sm:text-xl">
            <p data-reveal className="text-sm font-semibold uppercase tracking-wide text-grey">
              {profile.origin}
            </p>
            {profile.about.map((para) => (
              <p key={para.slice(0, 24)} data-reveal>
                {para}
              </p>
            ))}
          </div>
        </div>

        <h3 data-reveal className="mt-24 border-b border-text pb-3 text-sm font-semibold uppercase tracking-wide">
          {profile.copy.timelineLabel}
        </h3>
        <ol>
          {profile.timeline.map((step) => (
            <li
              key={step.period}
              data-reveal
              className="grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-1 border-b border-rule py-5 md:grid-cols-[6rem_16rem_1fr]"
            >
              <span className="font-semibold tabular-nums">{step.period}</span>
              <span className="font-semibold">{step.title}</span>
              <span className="col-start-2 text-text/75 md:col-start-3">{step.summary}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
