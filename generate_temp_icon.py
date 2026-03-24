"""
Icon generator for Smart Transcription Daemon.
Produces a macOS-style squircle icon (superellipse n=4) with a microphone glyph.
Outputs: public/image/icon-1024.png, icon.iconset/*, icon.icns
"""

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE = 1024
out_dir = Path("public/image")
out_dir.mkdir(parents=True, exist_ok=True)


# ── Squircle mask (superellipse, n=4) ────────────────────────────────────────

def make_squircle_mask(size: int, n: float = 4.0, padding_ratio: float = 0.0) -> Image.Image:
    """Return a grayscale mask of a superellipse inscribed in a (size x size) canvas."""
    mask = Image.new("L", (size, size), 0)
    cx = cy = size / 2
    r = (size / 2) * (1.0 - padding_ratio)
    pixels = mask.load()
    for y in range(size):
        for x in range(size):
            dx = abs((x - cx) / r)
            dy = abs((y - cy) / r)
            if dx**n + dy**n <= 1.0:
                pixels[x, y] = 255
    return mask


# ── Background gradient (emerald dark → emerald light) ───────────────────────

def make_gradient(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), 0)
    top    = (52, 211, 153, 255)   # #34D399 — emerald-400
    bottom = ( 4, 120,  87, 255)   # #047857 — emerald-700
    draw = ImageDraw.Draw(img)
    for y in range(size):
        t = y / (size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (size - 1, y)], fill=(r, g, b, 255))
    return img


# ── Microphone glyph ─────────────────────────────────────────────────────────

def draw_microphone(draw: ImageDraw.ImageDraw, size: int, color: tuple) -> None:
    s = size
    lw = max(2, s // 42)

    # Capsule body
    bw = s * 0.22
    bh = s * 0.32
    bx = (s - bw) / 2
    by = s * 0.14
    draw.rounded_rectangle(
        [bx, by, bx + bw, by + bh],
        radius=bw / 2,
        fill=color,
    )

    # Arc stand
    arc_r  = s * 0.26
    arc_cx = s / 2
    arc_cy = by + bh * 0.5 + s * 0.02
    for offset in range(-lw // 2, lw // 2 + 1):
        r = arc_r + offset
        b = [arc_cx - r, arc_cy - r, arc_cx + r, arc_cy + r]
        draw.arc(b, start=0, end=180, fill=color, width=lw)

    # Vertical stem
    stem_top    = arc_cy + arc_r - lw // 2
    stem_bottom = s * 0.82
    stem_x      = s / 2
    draw.line(
        [(stem_x, stem_top), (stem_x, stem_bottom)],
        fill=color,
        width=lw * 2,
    )

    # Base bar
    base_w  = s * 0.24
    base_bx = (s - base_w) / 2
    base_by = stem_bottom - lw
    draw.rounded_rectangle(
        [base_bx, base_by, base_bx + base_w, base_by + lw * 3],
        radius=lw * 1.5,
        fill=color,
    )


# ── Compose final image ───────────────────────────────────────────────────────

def generate_icon(size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), 0)

    bg   = make_gradient(size)
    mask = make_squircle_mask(size, n=4.0)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(1, size // 256)))
    bg.putalpha(mask)
    canvas = Image.alpha_composite(canvas, bg)

    overlay = Image.new("RGBA", (size, size), 0)
    d = ImageDraw.Draw(overlay)
    draw_microphone(d, size, (255, 255, 255, 230))
    canvas = Image.alpha_composite(canvas, overlay)

    return canvas


# ── Generate all sizes ────────────────────────────────────────────────────────

print("Generating squircle icon…")
icon_1024 = generate_icon(SIZE)

png_path = out_dir / "icon-1024.png"
icon_1024.save(png_path, "PNG")
print(f"  Saved {png_path}")

iconset_dir = out_dir / "icon.iconset"
if iconset_dir.exists():
    shutil.rmtree(iconset_dir)
iconset_dir.mkdir()

sizes = [16, 32, 64, 128, 256, 512]
for s in sizes:
    resized = generate_icon(s)
    resized.save(iconset_dir / f"icon_{s}x{s}.png", "PNG")
    if s != 512:
        resized2 = generate_icon(s * 2)
        resized2.save(iconset_dir / f"icon_{s}x{s}@2x.png", "PNG")
    print(f"  icon_{s}x{s}")

icon_1024.save(iconset_dir / "icon_512x512@2x.png", "PNG")

# ── Build .icns ───────────────────────────────────────────────────────────────

icns_path = out_dir / "icon.icns"
subprocess.run(
    ["iconutil", "-c", "icns", str(iconset_dir), "-o", str(icns_path)],
    check=True,
)
print(f"  Saved {icns_path}")
print("Done.")
