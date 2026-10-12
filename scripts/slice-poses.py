"""Slice a 3x3 transparent pose sheet into 9 aligned poses.

Alignment: the torso (necklace, blouse pattern, shawl) should stay still while the head turns, so each
pose is shifted to best match the centre pose's torso region (brute-force search of small offsets,
mean absolute difference on luminance + alpha). All poses are written on identical canvases.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)

ROW_CUTS = [0, 424, 842, None]
COL_CUTS = [0, 422, 831, None]
NAMES = [
    ["up-left", "up", "up-right"],
    ["left", "center", "right"],
    ["down-left", "down", "down-right"],
]
SIZE = 440
SEARCH = 24

sheet = Image.open(src).convert("RGBA")
W, H = sheet.size
rows = [c if c is not None else H for c in ROW_CUTS]
cols = [c if c is not None else W for c in COL_CUTS]


def place(cell: Image.Image, dx: int, dy: int) -> Image.Image:
    """Cell centred on the canvas, then shifted by (dx, dy)."""
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    x = (SIZE - cell.width) // 2 + dx
    y = (SIZE - cell.height) // 2 + dy
    canvas.alpha_composite(cell.crop((max(-x, 0), max(-y, 0), cell.width, cell.height)), (max(x, 0), max(y, 0)))
    return canvas


def features(img: Image.Image) -> np.ndarray:
    a = np.asarray(img).astype(np.float32) / 255
    lum = a[:, :, :3] @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    return np.dstack([lum * a[:, :, 3], a[:, :, 3]])


cells = {
    NAMES[r][c]: sheet.crop((cols[c], rows[r], cols[c + 1], rows[r + 1]))
    for r in range(3)
    for c in range(3)
}

ref = features(place(cells["center"], 0, 0))
# torso window: below the chin, away from the cell edges where neighbours were clipped
y0, y1 = int(SIZE * 0.66), int(SIZE * 0.93)
x0, x1 = int(SIZE * 0.22), int(SIZE * 0.78)
ref_win = ref[y0:y1, x0:x1]

for name, cell in cells.items():
    best = (1e9, 0, 0)
    base = features(place(cell, 0, 0))
    for dy in range(-SEARCH, SEARCH + 1):
        for dx in range(-SEARCH, SEARCH + 1):
            win = base[y0 - dy : y1 - dy, x0 - dx : x1 - dx]
            if win.shape != ref_win.shape:
                continue
            err = float(np.abs(win - ref_win).mean())
            if err < best[0]:
                best = (err, dx, dy)
    err, dx, dy = best
    place(cell, dx, dy).save(out_dir / f"{name}.webp", quality=92, method=6)
    print(f"{name:10s} dx={dx:+3d} dy={dy:+3d}  residual={err:.4f}")

print("canvas", SIZE, "->", out_dir)
