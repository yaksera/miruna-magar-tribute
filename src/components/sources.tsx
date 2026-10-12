"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { useReveal } from "@/lib/use-reveal";

/** Sources and disclaimer, set like the notes at the back of a film programme. */
export function Sources() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="sources" ref={root} className="paper text-ink">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
            {profile.copy.sourcesEyebrow}
          </p>
          <h2 data-reveal className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Programme <em className="font-light text-red">notes</em>
          </h2>
          <p data-reveal className="mt-6 max-w-md font-serif text-lg leading-relaxed text-ink/75">
            A fan-made tribute celebrating {profile.name}&rsquo;s work. It is not her official website and is not
            affiliated with her or her representatives. The portrait is an AI-assisted illustration; trailers are
            embedded from the films&rsquo; official YouTube channels.
          </p>
        </div>

        <ol className="self-end border-t border-ink">
          {profile.sources.map((s, i) => (
            <li key={s.href} data-reveal="right" className="border-b border-ink/20">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-5 py-5 transition-ui hover:text-red"
              >
                <span className="font-mono text-xs text-ink/50">[{i + 1}]</span>
                <span className="font-serif text-2xl">{s.label}</span>
                <span aria-hidden className="leader" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">{s.publisher}</span>
                <ArrowUpRight className="size-4 shrink-0 self-center transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
