"use client";

import { useRef } from "react";
import { Clapperboard } from "lucide-react";
import { profile, type FeaturedFilm } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/use-reveal";

export function Films() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="films" ref={root} className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p data-reveal className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            {profile.copy.filmsEyebrow}
          </p>
          <h2 data-reveal className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
            {profile.copy.filmsTitle}{" "}
            <span className="font-script text-6xl font-bold text-magenta sm:text-7xl">{profile.copy.filmsTitleScript}</span>
          </h2>
        </div>
        <p data-reveal className="max-w-sm text-muted">
          {profile.copy.filmsIntro}
        </p>
      </div>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {profile.featured.map((film, i) => (
          <FilmCard key={film.title} film={film} index={i} />
        ))}
      </ul>

      <h3 data-reveal className="mt-24 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted">
        <Clapperboard className="size-5 text-gold" />
        {profile.copy.allFilmsLabel}
      </h3>
      <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {profile.filmography.map((f) => (
          <li
            key={f.title}
            data-reveal
            className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-5 transition-ui hover:bg-white/[0.03] sm:grid-cols-[6rem_1fr_auto] sm:px-3"
          >
            <span className="font-script text-3xl text-gold">{f.year}</span>
            <span className="text-xl font-semibold text-cream transition-ui group-hover:text-magenta sm:text-2xl">
              {f.title}
              {f.note && (
                <span className="ml-3 align-middle rounded-full border border-gold/40 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-gold">
                  {f.note}
                </span>
              )}
            </span>
            {f.role && <span className="col-start-2 text-muted sm:col-start-3">as {f.role}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function FilmCard({ film, index }: { film: FeaturedFilm; index: number }) {
  const card = useRef<HTMLLIElement>(null);

  // Tilt toward the pointer and move a soft spotlight with it.
  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const el = card.current!;
        const inner = el.querySelector("[data-tilt]");
        const rx = gsap.quickTo(inner, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(inner, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(inner, { transformPerspective: 900 });
        const move = contextSafe!((e: PointerEvent) => {
          const b = el.getBoundingClientRect();
          const px = (e.clientX - b.left) / b.width;
          const py = (e.clientY - b.top) / b.height;
          ry((px - 0.5) * 8);
          rx((0.5 - py) * 6);
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
        });
        const leave = contextSafe!(() => {
          rx(0);
          ry(0);
        });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: card },
  );

  return (
    <li ref={card} data-reveal={index % 2 ? "right" : "left"} className="group">
      <article
        data-tilt
        className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-soft p-7 transition-ui group-hover:border-gold/40 sm:p-9"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(420px circle at var(--mx,50%) var(--my,50%), ${film.accent}66, transparent 60%)` }}
        />
        <div
          aria-hidden
          className="relative mb-8 flex aspect-[16/8] items-end overflow-hidden rounded-2xl p-6"
          style={{ background: `linear-gradient(135deg, ${film.accent}, #0a221c 115%)` }}
        >
          <span className="absolute -right-2 -top-8 font-script text-[150px] leading-none text-white/10">{film.year}</span>
          <span className="relative">
            <span className="block text-sm uppercase tracking-[0.25em] text-gold">as {film.role}</span>
            <span className="mt-1 block text-3xl font-semibold text-white sm:text-4xl">{film.title}</span>
          </span>
        </div>
        <p className="relative text-sm uppercase tracking-[0.2em] text-muted">
          {film.year} · {film.credits}
        </p>
        <h3 className="sr-only">
          {film.title} ({film.year}), as {film.role}
        </h3>
        <p className="relative mt-4 leading-relaxed text-cream/80">{film.description}</p>
        <ul className="relative mt-6 flex flex-wrap gap-2">
          {film.tags.map((t) => (
            <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-cream/80">
              {t}
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}
