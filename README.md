# Miruna Magar: fan tribute

An **unofficial fan tribute** to Nepali actress Miruna Magar. The hero portrait follows your cursor: she turns her head toward wherever the mouse is. Built with **Next.js 16**, **Tailwind CSS v4** and **GSAP**.

> Not affiliated with or endorsed by Miruna Magar. Facts come from the sources listed on the site; the portrait is an AI-assisted illustration.

## Run it

```bash
npm install
npm run dev
```

## Content

Everything on the page lives in **`src/content/profile.ts`**: tagline, biography, stats, featured films, full filmography, timeline, signature roles and sources. Please keep the `sources` list in step with any facts you add.

## How the cursor tracking works

`public/character/` holds nine pre-rendered head poses in a 3×3 grid (up / middle / down × left / centre / right). `src/components/pose-character.tsx`:

1. stacks all nine images so they're preloaded and swap with no flicker
2. works out which of the nine directions the cursor is in relative to her eyes, with a little hysteresis so it doesn't flicker on a boundary
3. crossfades to that pose
4. adds a small continuous tilt and drift so movement feels smooth between poses
5. breathes, and glances around on its own after a few idle seconds

All motion respects `prefers-reduced-motion`.

### Replacing the poses

Generate a new transparent 3×3 pose sheet (same layout: row 1 looks up, row 3 looks down, left column looks to the viewer's left), download the [FSRCNN x2 model](https://github.com/Saafke/FSRCNN_Tensorflow/raw/master/models/FSRCNN_x2.pb), then run:

```bash
pip install pillow numpy scipy opencv-contrib-python-headless
python scripts/process-poses.py path/to/pose-sheet.webp public/character FSRCNN_x2.pb
```

The script:

1. upscales 2× with a super-resolution model
2. colour-grades for screen recording (vibrance, gentle contrast curve, midtone lift, slight warmth and fine sharpening, so the portrait stays vivid when a phone films a laptop)
3. separates the figures along their outlines so shoulders are never clipped
4. aligns every pose's torso to the centre pose
5. blends the bottom edge so it never jumps between poses
6. crops all nine to one shared box

If the printed size changes, update `POSE_W` / `POSE_H` in `src/components/pose-character.tsx`.
