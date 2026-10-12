"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile, type Film } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { usePlayTrailer } from "./trailer-context";

/** Complete filmography as an archive index: one ruled row per film, newest first. */
export function Films() {
  const root = useRef<HTMLElement>(null);
  const films = [...profile.films].reverse();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-films-title] > span", {
          yPercent: 100,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-films-title]", start: "top 85%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-film-row]").forEach((row) =>
          gsap.from(row, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 92%", once: true },
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="films" ref={root} className="bg-paper text-text">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-24 sm:px-8 lg:pb-32 lg:pt-32">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-text pb-5">
          <h2 data-films-title className="display overflow-hidden text-6xl sm:text-8xl lg:text-[120px]">
            <span className="block">{profile.copy.filmsTitle}</span>
          </h2>
          <p className="text-sm text-grey">{profile.copy.filmsMeta}</p>
        </header>

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

  return (
    <li
      data-film-row
      className="group grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-4 border-b border-rule py-7 sm:grid-cols-[5rem_1fr] md:grid-cols-[5rem_280px_1fr] md:gap-x-8 lg:grid-cols-[6rem_320px_1fr_auto]"
    >
      <span className="pt-1 text-sm font-semibold tabular-nums text-grey">{film.year}</span>

      {/* still */}
      <div className={`col-span-2 col-start-1 md:col-span-1 md:col-start-2 ${t ? "" : "hidden md:block"}`}>
        {t ? (
          <button
            type="button"
            onClick={() => play(film)}
            aria-label={`Watch ${film.title} ${t.kind.toLowerCase()}`}
            className="relative block aspect-video w-full overflow-hidden bg-text/10"
          >
            <Image
              src={`https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </button>
        ) : (
          <div aria-hidden className="hidden md:block" />
        )}
      </div>

      <div className="col-span-2 md:col-span-1 md:col-start-3">
        <h3 className="display text-4xl sm:text-5xl">{film.title}</h3>
        {(film.role || film.note) && (
          <p className="mt-3 text-[15px]">
            {film.role && (
              <>
                as <span className="font-semibold">{film.role}</span>
              </>
            )}
            {film.note && (
              <span className={`${film.role ? "ml-3 " : ""}border border-text px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide`}>
                {film.note}
              </span>
            )}
          </p>
        )}
        {film.credits && <p className="mt-2 text-sm text-grey">{film.credits}</p>}
        {film.blurb && <p className="mt-4 max-w-xl leading-relaxed text-text/80">{film.blurb}</p>}
      </div>

      {t && (
        <div className="col-span-2 md:col-start-3 lg:col-span-1 lg:col-start-4 lg:text-right">
          <button
            type="button"
            onClick={() => play(film)}
            className="inline-flex items-center gap-1.5 border-b border-text pb-0.5 text-sm font-semibold transition-ui hover:border-transparent"
          >
            Watch {t.kind.toLowerCase()}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <p className="mt-1 text-xs text-grey">{t.channel}</p>
        </div>
      )}
    </li>
  );
}
