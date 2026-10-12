"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/use-reveal";

/** Her biography laid out like a magazine spread on warm paper. */
export function Story() {
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
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          });
        });
        // Rules draw in like a printer's layout.
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((rule) =>
          gsap.from(rule, { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: rule, start: "top 92%", once: true } }),
        );
        // Chapter years slide against the scroll for depth.
        gsap.utils.toArray<HTMLElement>("[data-chapter-year]").forEach((year) =>
          gsap.fromTo(year, { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: year, start: "top bottom", end: "bottom top", scrub: true } }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const [first, ...rest] = profile.about;

  return (
    <section id="about" ref={root} className="paper relative text-ink">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-24 sm:px-8 lg:pb-32 lg:pt-32">
        {/* masthead */}
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
          <span>{profile.copy.aboutEyebrow}</span>
          <span>{profile.origin}</span>
        </div>
        <span data-rule className="mt-3 block h-[3px] bg-ink" />
        <span data-rule className="mt-1 block h-px bg-ink" />

        <h2 data-reveal className="mt-12 max-w-5xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-[92px]">
          {profile.copy.aboutTitle} <em className="font-light text-red">{profile.copy.aboutTitleScript}</em>
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div data-reveal className="font-serif text-xl leading-[1.65] text-ink/85 lg:columns-2 lg:gap-10">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[5.2rem] first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-red">
              {first}
            </p>
            {rest.map((para) => (
              <p key={para.slice(0, 24)} className="mt-5">
                {para}
              </p>
            ))}
          </div>

          <aside className="flex flex-col justify-between gap-10">
            <p data-reveal className="border-l-4 border-red pl-6 font-serif text-3xl font-light italic leading-snug text-ink sm:text-4xl">
              Changing how women are portrayed in Nepali cinema, one role at a time.
            </p>
            <dl className="grid grid-cols-3 border-y border-ink/20">
              {profile.stats.map((s, i) => (
                <div key={s.label} data-reveal className={`py-6 ${i ? "border-l border-ink/20 pl-4" : "pr-4"}`}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                    <span data-count={s.value}>{s.value}</span>
                    <span className="text-red">{s.suffix}</span>
                  </dd>
                  <dd aria-hidden className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-[0.15em] text-ink/60">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* chapters */}
        <div className="mt-24">
          <div className="flex items-end justify-between">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">{profile.copy.timelineLabel}</h3>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">1994 — 2025</span>
          </div>
          <span data-rule className="mt-3 block h-px bg-ink" />
          <ol className="divide-y divide-ink/15">
            {profile.timeline.map((step, i) => (
              <li key={step.period} data-reveal className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 py-7 sm:grid-cols-[11rem_3rem_1fr_1.4fr] sm:gap-6">
                <span data-chapter-year className="outline-type font-serif text-5xl font-bold [--outline:var(--pf-red)] sm:text-7xl">
                  {step.period}
                </span>
                <span className="hidden font-mono text-xs text-ink/50 sm:block">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="font-serif text-2xl font-semibold sm:text-3xl">{step.title}</h4>
                <p className="col-start-2 leading-relaxed text-ink/75 sm:col-start-4">{step.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
