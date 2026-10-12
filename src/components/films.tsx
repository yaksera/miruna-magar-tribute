"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile, type Film } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionHeader } from "./section-header";
import { usePlayTrailer } from "./trailer-context";

/** Complete filmography as an archive index: one ruled row per film, newest first. */
export function Films() {
  const root = useRef<HTMLElement>(null);
  const films = [...profile.films].reverse();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-film-row]").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
          tl.from(row.querySelector("[data-row-rule]"), { scaleX: 0, transformOrigin: "left", duration: 0.9, ease: "power3.inOut" })
            .from(row.querySelector("[data-year]"), { yPercent: 100, duration: 0.7, ease: "power3.out" }, 0.1)
            .fromTo(
              row.querySelector("[data-still-frame]"),
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut" },
              0.1,
            )
            .from(row.querySelector("[data-still-frame] img"), { scale: 1.18, duration: 1.4, ease: "power3.out" }, 0.1)
            .from(row.querySelectorAll("[data-text] > *"), { y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.07 }, 0.25);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="films" ref={root} className="bg-paper text-text">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-24 sm:px-8 lg:pb-32 lg:pt-32">
        <SectionHeader index="01" title={profile.copy.filmsTitle} meta={profile.copy.filmsMeta} />
        <ol>
          {films.map((film) => (
            <FilmRow key={film.title} film={film} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function FilmRow({ film }: { film: Film }) {
  const play = usePlayTrailer();
  const t = film.trailer;
  const featured = Boolean(film.blurb);

  return (
    <li
      data-film-row
      className="group relative grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-5 py-8 sm:grid-cols-[6rem_1fr] md:grid-cols-[6rem_300px_1fr] md:gap-x-8 lg:grid-cols-[7rem_340px_1fr_auto]"
    >
      <span data-row-rule aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-rule" />

      <span className="overflow-hidden">
        <span data-year className="display block text-3xl text-grey transition-colors duration-300 group-hover:text-red sm:text-4xl">
          {film.year}
        </span>
      </span>

      {t ? (
        <button
          type="button"
          data-still-frame
          onClick={() => play(film)}
          aria-label={`Watch ${film.title} ${t.kind.toLowerCase()}`}
          className="relative col-span-2 col-start-1 block aspect-video w-full overflow-hidden bg-text/10 md:col-span-1 md:col-start-2"
        >
          {/* hover zoom lives on the wrapper; GSAP scales the image itself on reveal */}
          <span className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <Image
              src={`https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 340px, (min-width: 768px) 300px, 100vw"
              className="still object-cover"
            />
          </span>
        </button>
      ) : (
        <div aria-hidden className="hidden md:col-start-2 md:block" />
      )}

      <div data-text className="col-span-2 md:col-span-1 md:col-start-3">
        <h3 className={`display ${featured ? "text-5xl sm:text-6xl" : "text-4xl sm:text-[44px]"}`}>{film.title}</h3>
        {(film.role || film.note) && (
          <p className="mt-3 text-base">
            {film.role && (
              <>
                as <span className="font-semibold">{film.role}</span>
              </>
            )}
            {film.note && (
              <span className={`label ${film.role ? "ml-3 " : ""}border border-text/70 px-1.5 py-0.5 text-[11px]`}>{film.note}</span>
            )}
          </p>
        )}
        {film.credits && <p className="mt-2 text-sm text-grey">{film.credits}</p>}
        {film.blurb && <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-text/85">{film.blurb}</p>}
      </div>

      {t && (
        <div data-text className="col-span-2 md:col-start-3 lg:col-span-1 lg:col-start-4 lg:text-right">
          <button
            type="button"
            onClick={() => play(film)}
            className="label inline-flex items-center gap-1.5 border-b border-text pb-1 transition-ui hover:border-red hover:text-red"
          >
            Watch {t.kind.toLowerCase()}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <p className="mt-1.5 text-xs text-grey">via {t.channel}</p>
        </div>
      )}
    </li>
  );
}
