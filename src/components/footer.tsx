import { ArrowUp } from "lucide-react";
import { profile } from "@/content/profile";

/** Footer as a cinema ticket stub. */
export function Footer() {
  return (
    <footer className="bg-ink px-5 py-14 text-cream sm:px-8">
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-6 border border-dashed border-cream/25 p-8 sm:flex-row sm:items-center sm:justify-between">
        {/* punched notches */}
        <span aria-hidden className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-ink" />
        <span aria-hidden className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-ink" />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">Admit one · Fan screening</p>
          <p className="mt-2 font-serif text-3xl italic">{profile.name}</p>
          <p className="mt-3 max-w-xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-cream/50">
            {profile.disclaimer} Built with Next.js &amp; GSAP.
          </p>
        </div>
        <a
          href="#top"
          className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.25em] text-cream/70 transition-ui hover:text-gold sm:self-center"
        >
          Back to the top <ArrowUp className="size-4" />
        </a>
      </div>
    </footer>
  );
}
