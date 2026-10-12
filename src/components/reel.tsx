"use client";

import Image from "next/image";
import { useRef } from "react";
import { Play } from "lucide-react";
import { profile, type Film } from "@/content/profile";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePlayTrailer } from "./trailer-context";

const PIN_QUERY = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

/** Films with official trailers as cinema posters on a strip that scrolls sideways while pinned. */
export function Reel() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const films = profile.films.filter((f) => f.trailer);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.fromTo(
          "[data-reel-progress]",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } },
        );
        // Stills drift inside their frames as each poster crosses the screen.
        gsap.utils.toArray<HTMLElement>("[data-still]").forEach((still) =>
          gsap.fromTo(
            still,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: still.closest("article"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          ),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="films" ref={root} className="sprockets relative overflow-hidden bg-ink pb-16 pt-24 text-cream lg:min-h-svh lg:pb-12">
      <header className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold">{profile.copy.reelEyebrow}</p>
          <h2 className="mt-2 font-serif text-6xl font-light italic leading-none tracking-tight sm:text-8xl">
            {profile.copy.reelTitle}
          </h2>
        </div>
        <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.15em] text-cream/55">{profile.copy.reelIntro}</p>
      </header>

      <div
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:pb-0 lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pr-[30vw]"
      >
        {films.map((film, i) => (
          <Poster key={film.title} film={film} index={i} total={films.length} />
        ))}
      </div>

      <div className="mx-auto mt-8 hidden max-w-[1240px] items-center gap-4 px-8 font-mono text-[11px] uppercase tracking-[0.3em] text-cream/50 lg:flex">
        <span>2018</span>
        <span className="relative h-px flex-1 bg-cream/15">
          <span data-reel-progress className="absolute inset-0 origin-left bg-gold" />
        </span>
        <span>2025</span>
      </div>
    </section>
  );
}

function Poster({ film, index, total }: { film: Film; index: number; total: number }) {
  const play = usePlayTrailer();
  const featured = Boolean(film.blurb);

  return (
    <article
      className={`group relative flex h-[68svh] min-h-[520px] shrink-0 snap-center flex-col overflow-hidden border border-cream/15 bg-ink-soft ${
        featured ? "w-[86vw] sm:w-[520px]" : "w-[78vw] sm:w-[400px]"
      }`}
    >
      {/* trailer still, graded to the site palette */}
      <div className="relative h-[46%] overflow-hidden bg-red-deep">
        <Image
          data-still
          src={`https://i.ytimg.com/vi/${film.trailer!.id}/hqdefault.jpg`}
          alt=""
          fill
          sizes="520px"
          className="duotone scale-125 object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/20 to-transparent" />
        <span className="absolute left-5 top-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cream/80">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="outline-type absolute -bottom-4 right-3 font-serif text-[120px] font-black leading-none opacity-80">
          {film.year}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-2">
        {film.note && (
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{film.note}</p>
        )}
        <h3 className={`mt-2 font-serif font-semibold leading-[0.95] tracking-tight ${featured ? "text-5xl" : "text-4xl"}`}>
          {film.title}
        </h3>
        {film.role && <p className="mt-2 font-serif text-xl italic text-magenta">as {film.role}</p>}
        {film.credits && <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-cream/55">{film.credits}</p>}
        {film.blurb && <p className="mt-3 leading-relaxed text-cream/80">{film.blurb}</p>}

        <button
          type="button"
          onClick={() => play(film)}
          className="mt-auto flex items-center gap-3 self-start whitespace-nowrap border-t border-cream/15 pt-4 font-mono text-xs uppercase tracking-[0.25em] text-cream transition-ui hover:text-gold"
        >
          <span className="grid size-10 place-items-center rounded-full bg-red text-cream transition-ui group-hover:bg-gold group-hover:text-ink">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
          Play {film.trailer!.kind.toLowerCase()}
          <span className="hidden normal-case tracking-normal text-cream/40 sm:inline">· {film.trailer!.channel}</span>
        </button>
      </div>
    </article>
  );
}
