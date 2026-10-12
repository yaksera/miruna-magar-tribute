"""High-quality pose extraction from a 3x3 transparent pose sheet.

1. Bleed edge colours into transparent pixels (avoids dark fringes when resampling).
2. 2x super-resolution (FSRCNN, tiled) on colour, Lanczos on alpha.
3. Colour grade for screen recording: vibrance, gentle S-curve, midtone lift, warmth, fine sharpening.
4. Split figures along their outlines (watershed seeded per cell) instead of straight cuts.
5. Align every pose's torso to the centre pose on a roomy canvas (no clipped shoulders).
6. Blend the bottom band into the centre pose so the bottom crop never jumps between poses.
7. Crop all poses to one shared tight box.

usage: python scripts/process-poses.py SHEET OUT_DIR FSRCNN_x2.pb [--preview DIR]

The FSRCNN x2 model is at https://github.com/Saafke/FSRCNN_Tensorflow (models/FSRCNN_x2.pb).
Requires: pillow, numpy, scipy, opencv-contrib-python-headless.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

sheet_path, out_dir, model_path = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
preview_dir = Path(sys.argv[sys.argv.index("--preview") + 1]) if "--preview" in sys.argv else None
out_dir.mkdir(parents=True, exist_ok=True)

NAMES = [
    ["up-left", "up", "up-right"],
    ["left", "center", "right"],
    ["down-left", "down", "down-right"],
]
ROW_CUTS = [0, 424, 842, 1254]
COL_CUTS = [0, 422, 831, 1254]
SCALE = 2
CANVAS = 1120  # output size; leaves ~130px each side for alignment shifts
BLEND_FROM, BLEND_TO = 0.80, 0.90  # fraction of canvas height: pose -> centre-pose body

# ---------------------------------------------------------------- 1. load + bleed
rgba = np.asarray(Image.open(sheet_path).convert("RGBA")).astype(np.float32) / 255
rgb, alpha = rgba[:, :, :3], rgba[:, :, 3]
solid = alpha > 0.5
_, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
bled = rgb[iy, ix]
bled[solid] = rgb[solid]

# ---------------------------------------------------------------- 2. super-resolution
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(model_path)
sr.setModel("fsrcnn", SCALE)
bgr8 = cv2.cvtColor((bled * 255).round().astype(np.uint8), cv2.COLOR_RGB2BGR)
def upsample_tiled(img, tile=256, pad=16):
    """Super-resolution in overlapping tiles (the full sheet doesn't fit in memory at once)."""
    h, w = img.shape[:2]
    out = np.zeros((h * SCALE, w * SCALE, 3), np.uint8)
    for y in range(0, h, tile):
        for x in range(0, w, tile):
            y0, x0 = max(y - pad, 0), max(x - pad, 0)
            y1, x1 = min(y + tile + pad, h), min(x + tile + pad, w)
            res = sr.upsample(np.ascontiguousarray(img[y0:y1, x0:x1]))
            ty, tx = (y - y0) * SCALE, (x - x0) * SCALE
            th, tw = (min(y + tile, h) - y) * SCALE, (min(x + tile, w) - x) * SCALE
            out[y * SCALE : y * SCALE + th, x * SCALE : x * SCALE + tw] = res[ty : ty + th, tx : tx + tw]
    return out


up = cv2.cvtColor(upsample_tiled(bgr8), cv2.COLOR_BGR2RGB).astype(np.float32) / 255
H, W = up.shape[:2]
alpha_up = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
alpha_up = np.clip((alpha_up - 0.02) / 0.96, 0, 1)  # trim resampling haze
print("upscaled", (W, H))

# ---------------------------------------------------------------- 3. colour grade
def grade(img: np.ndarray) -> np.ndarray:
    hls = cv2.cvtColor(img, cv2.COLOR_RGB2HLS)  # float32: H 0-360, L 0-1, S 0-1
    s = hls[:, :, 2]
    hls[:, :, 2] = np.clip(s * (1 + 0.20 * (1 - s)), 0, 1)  # vibrance: lifts muted colours most
    out = cv2.cvtColor(hls, cv2.COLOR_HLS2RGB)
    smooth = out * out * (3 - 2 * out)  # S-curve
    out = out + 0.14 * (smooth - out)
    out = np.power(np.clip(out, 0, 1), 0.94)  # midtone lift
    out[:, :, 0] *= 1.012  # a touch warmer
    out[:, :, 2] *= 0.985
    blur = cv2.GaussianBlur(out, (0, 0), 1.6)
    out = out + 0.45 * (out - blur)  # fine sharpening (unsharp mask)
    return np.clip(out, 0, 1)

graded = grade(up)

# ---------------------------------------------------------------- 4. split figures
rows = [r * SCALE for r in ROW_CUTS]
cols = [c * SCALE for c in COL_CUTS]
# Geodesic split (on the original-size alpha, then scaled up): grow each figure from its core one
# pixel ring at a time, only through opaque pixels, until neighbours meet at their shared seam.
opaque1 = alpha > 0.04
labels1 = np.zeros(alpha.shape, np.int16)
for r in range(3):
    for c in range(3):
        y0, y1, x0, x1 = ROW_CUTS[r], ROW_CUTS[r + 1], COL_CUTS[c], COL_CUTS[c + 1]
        core = np.zeros(alpha.shape, bool)
        core[y0 + int((y1 - y0) * 0.08) : y1 - int((y1 - y0) * 0.08), x0 + int((x1 - x0) * 0.30) : x1 - int((x1 - x0) * 0.30)] = True
        labels1[core & opaque1] = r * 3 + c + 1
while True:
    grown = ndimage.grey_dilation(labels1, size=3)
    new = (labels1 == 0) & opaque1 & (grown > 0)
    if not new.any():
        break
    labels1[new] = grown[new]
labels = np.asarray(Image.fromarray(labels1.astype(np.uint8)).resize((W, H), Image.NEAREST)).astype(np.int16)


def figure(k: int):
    r, c = divmod(k, 3)
    mask = (labels == k + 1).astype(np.float32) * alpha_up
    # keep each figure roughly to its own cell (+ a generous margin for hair and shoulders)
    y0, y1 = max(rows[r] - 60, 0), min(rows[r + 1] + 60, H)
    x0, x1 = max(cols[c] - 120, 0), min(cols[c + 1] + 120, W)
    crop = np.dstack([graded[y0:y1, x0:x1], mask[y0:y1, x0:x1]])
    cell_cx = (cols[c] + cols[c + 1]) / 2 - x0
    cell_bottom = rows[r + 1] - y0
    return crop, cell_cx, cell_bottom


def place(crop, cx, bottom, dx=0, dy=0):
    canvas = np.zeros((CANVAS, CANVAS, 4), np.float32)
    ox = int(round(CANVAS / 2 - cx)) + dx
    oy = int(round(CANVAS - 70 - bottom)) + dy
    h, w = crop.shape[:2]
    sy0, sx0 = max(-oy, 0), max(-ox, 0)
    dy0, dx0 = max(oy, 0), max(ox, 0)
    hh, ww = min(h - sy0, CANVAS - dy0), min(w - sx0, CANVAS - dx0)
    canvas[dy0 : dy0 + hh, dx0 : dx0 + ww] = crop[sy0 : sy0 + hh, sx0 : sx0 + ww]
    return canvas


def feats(img):
    lum = img[:, :, :3] @ np.array([0.299, 0.587, 0.114], np.float32)
    return np.dstack([lum * img[:, :, 3], img[:, :, 3]])


# ---------------------------------------------------------------- 5. align torsos
figs = {NAMES[k // 3][k % 3]: figure(k) for k in range(9)}
ref = place(*figs["center"])
ty0, ty1, tx0, tx1 = int(CANVAS * 0.62), int(CANVAS * 0.86), int(CANVAS * 0.30), int(CANVAS * 0.70)
ref_f = feats(ref)


def match(base_f, cands):
    best = (1e9, 0, 0)
    win_ref = ref_f[ty0:ty1, tx0:tx1]
    for dx, dy in cands:
        win = base_f[ty0 - dy : ty1 - dy, tx0 - dx : tx1 - dx]
        if win.shape != win_ref.shape:
            continue
        e = float(np.abs(win - win_ref).mean())
        if e < best[0]:
            best = (e, dx, dy)
    return best


placed = {}
for name, (crop, cx, bottom) in figs.items():
    base_f = feats(place(crop, cx, bottom))
    coarse = match(base_f, [(dx, dy) for dx in range(-60, 61, 4) for dy in range(-60, 61, 4)])
    fine = match(base_f, [(coarse[1] + dx, coarse[2] + dy) for dx in range(-3, 4) for dy in range(-3, 4)])
    _, dx, dy = fine
    placed[name] = place(crop, cx, bottom, dx, dy)
    print(f"{name:10s} dx={dx:+4d} dy={dy:+4d} residual={fine[0]:.4f}")

# ---------------------------------------------------------------- 6. shared bottom band
center = placed["center"]
ys = np.arange(CANVAS, dtype=np.float32)[:, None] / CANVAS
t = np.clip((ys - BLEND_FROM) / (BLEND_TO - BLEND_FROM), 0, 1)[..., None]  # 0 = pose, 1 = centre


def premul(img):
    return np.dstack([img[:, :, :3] * img[:, :, 3:], img[:, :, 3:]])


for name, img in placed.items():
    blended = premul(img) * (1 - t) + premul(center) * t
    a = blended[:, :, 3:]
    rgb_out = np.where(a > 1e-4, blended[:, :, :3] / np.maximum(a, 1e-4), 0)
    out = np.dstack([rgb_out, a])
    Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8), "RGBA").save(
        out_dir / f"{name}.webp", quality=90, method=6
    )
    placed[name] = out

# ---------------------------------------------------------------- 7. shared tight crop
union = np.zeros((CANVAS, CANVAS), bool)
for img in placed.values():
    union |= img[:, :, 3] > 4 / 255
ys, xs = np.where(union)
x0, y0 = max(xs.min() - 6, 0), max(ys.min() - 6, 0)
x1, y1 = min(xs.max() + 7, CANVAS), min(ys.max() + 7, CANVAS)
for name, img in placed.items():
    Image.fromarray((np.clip(img[y0:y1, x0:x1], 0, 1) * 255).round().astype(np.uint8), "RGBA").save(
        out_dir / f"{name}.webp", quality=90, method=6
    )
print("cropped to", (x1 - x0, y1 - y0), "- update POSE_W/POSE_H in pose-character.tsx if this changes")

# ---------------------------------------------------------------- previews
if preview_dir:
    preview_dir.mkdir(parents=True, exist_ok=True)
    small = CANVAS // 3
    grid = Image.new("RGBA", (small * 3, small * 3), (20, 60, 48, 255))
    onion = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 255))
    for k in range(9):
        name = NAMES[k // 3][k % 3]
        im = Image.fromarray((placed[name] * 255).astype(np.uint8), "RGBA")
        grid.alpha_composite(im.resize((small, small), Image.LANCZOS), ((k % 3) * small, (k // 3) * small))
        ghost = im.copy()
        ghost.putalpha(ghost.getchannel("A").point(lambda v: v // 5))
        onion.alpha_composite(ghost)
    grid.save(preview_dir / "grid.png")
    onion.resize((560, 560), Image.LANCZOS).save(preview_dir / "onion.png")
    Image.fromarray((placed["center"] * 255).astype(np.uint8), "RGBA").save(preview_dir / "center-full.png")
print("done ->", out_dir)
