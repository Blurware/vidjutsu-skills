#!/usr/bin/env python3
"""Turn a short demo clip (GIF or video) into a sprite sheet for the `demo` card.

The renderer draws scenes in a locked-down browser with no video playback, so a
moving demo travels as one image: 16 frames in a 4 x 4 grid, each 980 px wide.
The card shows frame floor(t * fps) of it.

    python3 make_sheet.py demo.gif assets/cut.jpg [--fps 12] [--frames 16] [--start 0]

Prints the card keys to use: sheet, cols, rows, frames, fw, fh, fps.
Needs ffmpeg on PATH.
"""
import argparse, json, os, subprocess
ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--fps", type=float, default=12); ap.add_argument("--frames", type=int, default=16)
ap.add_argument("--start", type=float, default=0); ap.add_argument("--width", type=int, default=980)
a = ap.parse_args()
cols = 4; rows = (a.frames + cols - 1) // cols
probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json", a.src]))["streams"][0]
os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
fh = round(a.width * probe["height"] / probe["width"] / 2) * 2
subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-ss", str(a.start), "-i", a.src,
    "-vf", f"fps={a.fps},scale={a.width}:{fh}:flags=lanczos,tile={cols}x{rows}", "-frames:v", "1", "-q:v", "3", a.out])
print(json.dumps({"sheet": "img/" + a.out.split("/")[-1], "cols": cols, "rows": rows, "frames": a.frames, "fw": a.width, "fh": fh, "fps": a.fps}))
