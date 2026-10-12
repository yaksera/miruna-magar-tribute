"use client";

import { useRef } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { profile } from "@/content/profile";
import { useReveal } from "@/lib/use-reveal";

export function Sources() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="sources" ref={root} className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p data-reveal className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            {profile.copy.sourcesEyebrow}
          </p>
          <h2 data-reveal className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {profile.copy.sourcesTitle}
          </h2>
          <p data-reveal className="mt-6 max-w-md text-cream/70">
            This is a fan-made tribute celebrating {profile.name}&rsquo;s work. It is not her official website, and it
            isn&rsquo;t affiliated with her or her representatives. The portrait is an AI-assisted illustration.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {profile.sources.map((s) => (
            <li key={s.href} data-reveal="right">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-white/10 bg-ink-soft p-6 transition-ui hover:border-gold/50"
              >
                <span className="flex gap-4">
                  <BookOpen className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    <span className="block text-lg font-semibold">{s.label}</span>
                    <span className="mt-1 block text-sm text-muted">{s.publisher}</span>
                  </span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
