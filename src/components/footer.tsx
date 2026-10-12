import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="bg-text text-paper">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <p className="display text-5xl sm:text-6xl">{profile.name}</p>
        <div className="space-y-1 text-sm text-paper/60 sm:text-right">
          <p>{profile.disclaimer}</p>
          <p>
            Built with Next.js and GSAP ·{" "}
            <a href="#top" className="underline underline-offset-4 hover:text-paper">
              Back to top
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
