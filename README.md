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

Generate a new transparent 3×3 pose sheet (same layout: row 1 looks up, row 3 looks down, left column looks to the viewer's left), then run:

```bash
python scripts/slice-poses.py path/to/pose-sheet.webp public/character
```

The script cuts the sheet into nine images and aligns each one to the centre pose by matching the torso (necklace, blouse, shawl), so the body stays still while only the head turns. If your sheet's cells are a different size, adjust `ROW_CUTS` / `COL_CUTS` at the top of the script. It needs Python with Pillow, NumPy and SciPy.
