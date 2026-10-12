"use client";

import Image from "next/image";
import { useRef } from "react";
import { POSES, profile } from "@/content/profile";
import { gsap, useGSAP } from "@/lib/gsap";

type Pose = (typeof POSES)[number][number];

/** How far (as a fraction of half the viewport) the cursor must move before the head turns. */
const THRESHOLD = { x: 0.2, y: 0.22 };
/** Extra distance needed to turn back, so the pose doesn't flicker on a boundary. */
const HYSTERESIS = 0.06;
const IDLE_AFTER_MS = 4000;
const CANVAS = 440;

/**
 * An AI-painted character with nine pre-rendered head poses (3×3). The pose closest to the cursor's
 * direction crossfades in, and a small continuous tilt fills the gaps between poses.
 */
export function PoseCharacter({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fade = reduce ? 0 : 0.22;
      const imgs = Object.fromEntries(
        Array.from(el.querySelectorAll<HTMLElement>("[data-pose]")).map((n) => [n.dataset.pose as Pose, n]),
      ) as Record<Pose, HTMLElement>;

      let current: Pose = "center";
      let col = 1;
      let row = 1;

      const show = (next: Pose) => {
        if (next === current) return;
        gsap.to(imgs[next], { autoAlpha: 1, duration: fade, ease: "power1.out", overwrite: true });
        gsap.to(imgs[current], { autoAlpha: 0, duration: fade * 1.4, ease: "power1.in", overwrite: true });
        current = next;
      };

      // Continuous tilt between poses.
      const stage = el.querySelector("[data-stage]");
      const tx = gsap.quickTo(stage, "x", { duration: reduce ? 0 : 0.8, ease: "power3.out" });
      const ty = gsap.quickTo(stage, "y", { duration: reduce ? 0 : 0.8, ease: "power3.out" });
      const tr = gsap.quickTo(stage, "rotate", { duration: reduce ? 0 : 0.8, ease: "power3.out" });

      /** Pick a cell index (0,1,2) for a normalised offset with hysteresis around the current cell. */
      const bucket = (v: number, prev: number, t: number) => {
        const lo = prev === 0 ? -t + HYSTERESIS : -t;
        const hi = prev === 2 ? t - HYSTERESIS : t;
        return v < lo ? 0 : v > hi ? 2 : 1;
      };

      const lookAt = (nx: number, ny: number) => {
        col = bucket(nx, col, THRESHOLD.x);
        row = bucket(ny, row, THRESHOLD.y);
        show(POSES[row][col]);
        tx(nx * 6);
        ty(ny * 4);
        tr(nx * 1.2);
      };

      // Idle: glance around now and then.
      let idleTimer = 0;
      let idleTl: gsap.core.Timeline | null = null;
      const stopIdle = () => {
        idleTl?.kill();
        idleTl = null;
      };
      const startIdle = () => {
        if (reduce) return;
        stopIdle();
        idleTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
        [
          [-0.6, 0.1],
          [0, 0],
          [0.6, -0.4],
          [0, 0],
          [-0.5, 0.5],
          [0, 0],
        ].forEach(([x, y]) => idleTl!.call(() => lookAt(x, y)).to({}, { duration: 1.4 }));
      };

      const onMove = contextSafe!((e: PointerEvent) => {
        const box = el.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height * 0.32; // her eyes
        const nx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / (window.innerWidth * 0.5));
        const ny = gsap.utils.clamp(-1, 1, (e.clientY - cy) / (window.innerHeight * 0.5));
        stopIdle();
        lookAt(nx, ny);
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(startIdle, IDLE_AFTER_MS);
      });

      window.addEventListener("pointermove", onMove, { passive: true });
      idleTimer = window.setTimeout(startIdle, 2500);

      if (!reduce) {
        gsap.to("[data-breathe]", { scale: 1.008, y: -2, transformOrigin: "50% 100%", duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.clearTimeout(idleTimer);
        stopIdle();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} role="img" aria-label={`Illustrated portrait of ${profile.name}`} className={className}>
      <div data-breathe>
        <div data-stage className="relative aspect-square w-full" style={{ transformOrigin: "50% 85%" }}>
          {POSES.flat().map((pose) => (
            <Image
              key={pose}
              data-pose={pose}
              src={`/character/${pose}.webp`}
              alt=""
              width={CANVAS}
              height={CANVAS}
              sizes="(min-width: 1024px) 520px, 90vw"
              preload={pose === "center"}
              loading="eager"
              draggable={false}
              className={`absolute inset-0 h-full w-full select-none ${pose === "center" ? "" : "invisible opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
