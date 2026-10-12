"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { useReveal } from "@/lib/use-reveal";
import { SectionHeader } from "./section-header";

/** Numbered sources and the fan-site disclaimer. */
export function Sources() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="sources" ref={root} className="bg-paper text-text">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8">
        <SectionHeader index="03" title={profile.copy.sourcesTitle} />
        <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <p data-reveal className="max-w-sm text-sm leading-relaxed text-grey">
          A fan-made tribute, not her official website, and not affiliated with her or her representatives. The
          portrait is an AI-assisted illustration. Trailers are embedded from the films&rsquo; official YouTube
          channels.
        </p>
        <ol className="border-t border-text">
          {profile.sources.map((s, i) => (
            <li key={s.href} data-reveal className="border-b border-rule">
              <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-baseline gap-5 py-4">
                <span className="w-6 text-sm tabular-nums text-grey">{i + 1}</span>
                <span className="flex-1 text-lg font-semibold underline-offset-4 group-hover:underline">{s.label}</span>
                <span className="text-sm text-grey">{s.publisher}</span>
                <ArrowUpRight className="size-4 shrink-0 self-center text-grey transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
