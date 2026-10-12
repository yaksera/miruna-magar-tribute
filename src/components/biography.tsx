"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionHeader } from "./section-header";

/** Biography, key numbers and timeline: plain text on paper, organised by rules and a grid. */
export function Biography() {
  const root = useRef<HTMLElement>(null);
  const [lead, ...rest] = profile.about;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The opening paragraph lights up word by word as you read down the page.
        gsap.fromTo(
          "[data-lead] > span",
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.04,
            scrollTrigger: { trigger: "[data-lead]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );

        gsap.from("[data-body] > p", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-body]", start: "top 80%", once: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((stat) => {
          const num = stat.querySelector<HTMLElement>("[data-count]")!;
          const obj = { v: 0 };
          gsap
            .timeline({ scrollTrigger: { trigger: stat, start: "top 90%", once: true } })
            .from(stat.querySelector("[data-stat-rule]"), { scaleX: 0, transformOrigin: "left", duration: 0.9, ease: "power3.inOut" })
            .to(obj, { v: Number(num.dataset.count), duration: 1.6, ease: "power2.out", onUpdate: () => (num.textContent = String(Math.round(obj.v))) }, 0.1);
        });

        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) =>
          gsap
            .timeline({ scrollTrigger: { trigger: step, start: "top 90%", once: true } })
            .from(step.querySelector("[data-step-rule]"), { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "power3.inOut" })
            .from(step.querySelectorAll("[data-step-cell]"), { x: -24, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.15),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="bg-paper text-text">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8 lg:pb-32">
        <SectionHeader index="02" title={profile.copy.aboutTitle} meta={profile.origin} />

        <div className="grid gap-14 pt-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <dl className="grid grid-cols-3 gap-5 self-start lg:grid-cols-1 lg:gap-9">
            {profile.stats.map((s) => (
              <div key={s.label} data-stat className="relative pt-3">
                <span data-stat-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-text" />
                <dt className="sr-only">{s.label}</dt>
                <dd className="display text-5xl sm:text-6xl">
                  <span data-count={s.value}>{s.value}</span>
                  <span className="text-red">{s.suffix}</span>
                </dd>
                <dd aria-hidden className="label mt-2 text-grey">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

          <div data-body className="max-w-[62ch] space-y-6 text-lg leading-[1.7] text-text/85">
            <p data-lead className="text-2xl font-medium leading-snug text-text sm:text-[28px]">
              {/* one span per word so the paragraph can light up as you read */}
              {lead.split(" ").map((word, i) => (
                <span key={i}>{word} </span>
              ))}
            </p>
            {rest.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>

        <h3 className="label mt-24 pb-3 text-grey">{profile.copy.timelineLabel}</h3>
        <ol className="border-t border-text">
          {profile.timeline.map((step) => (
            <li
              key={step.period}
              data-step
              className="relative grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-1 py-5 md:grid-cols-[7rem_16rem_1fr]"
            >
              <span data-step-rule aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-rule" />
              <span data-step-cell className="display text-2xl text-red">
                {step.period}
              </span>
              <span data-step-cell className="font-semibold md:pt-0.5">
                {step.title}
              </span>
              <span data-step-cell className="col-start-2 text-text/75 md:col-start-3 md:pt-0.5">
                {step.summary}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
