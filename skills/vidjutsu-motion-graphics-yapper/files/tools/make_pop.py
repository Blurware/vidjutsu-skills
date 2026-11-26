#!/usr/bin/env python3
"""Head pop-out strips for the Yapper's split scenes. Runs on your machine.

For every film frame of each split scene it takes the presenter frame the
timeline shows at that moment, cuts the presenter out of the background, keeps
the rows just above the window crop and writes them as one RGBA still, then
packs the stills into <scenes>/<scene>/pop.mov (PNG codec, keeps the alpha).

    pip install rembg pillow numpy        # plus ffmpeg on PATH
    python3 make_pop.py --video avatar.mp4 --cuts cuts.json --crop-y 299 \\
        --scene 01-hook:0:5.34 --scene 03-setup:11.18:4.7 --scenes ../scenes

--cuts is a JSON list of the [start, end] source ranges you cut with
cut_pauses (source seconds, in order); timeline 0 is source 0 minus those.
--crop-y is the window crop's y on the 1000 grid (see SKILL.md, Head room).
Each scene's config then gets pop: {fps: 30, frames: <count printed here>}.
"""
import argparse, json, math, os, shutil, subprocess, tempfile
import numpy as np
from PIL import Image
from rembg import new_session, remove

WIN_W, POP_H, FPS = 960, 260, 30

ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True)
ap.add_argument("--cuts", required=True)
ap.add_argument("--crop-y", type=float, required=True)
ap.add_argument("--scene", action="append", required=True, help="dir:start:seconds (timeline seconds)")
ap.add_argument("--scenes", required=True, help="folder holding the scene folders")
ap.add_argument("--model", default="isnet-general-use")
a = ap.parse_args()

probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=r_frame_rate:format=duration", "-of", "json", a.video]))
st = probe["streams"][0]
num, den = st["r_frame_rate"].split("/")
SRC_FPS = float(num) / float(den)
END = float(probe["format"]["duration"])

keeps, t0 = [], 0.0
for c0, c1 in json.load(open(a.cuts)):
    if c0 > t0: keeps.append((t0, c0))
    t0 = max(t0, c1)
keeps.append((t0, END))

def src_time(t):
    acc = 0.0
    for k0, k1 in keeps:
        if t < acc + (k1 - k0): return k0 + (t - acc)
        acc += k1 - k0
    return keeps[-1][1]

tmp = tempfile.mkdtemp()
subprocess.check_call(["ffmpeg", "-loglevel", "error", "-i", a.video, "-start_number", "0", "-q:v", "1",
                       os.path.join(tmp, "%06d.jpg")])
count = len([f for f in os.listdir(tmp) if f.endswith(".jpg")])
# Size of the frames as decoded (after any rotation tag), not the coded size.
W, H = Image.open(os.path.join(tmp, "000000.jpg")).size
S = WIN_W / W
crop_top = a.crop_y * H / 1000
strip_top = crop_top - POP_H / S
if strip_top < 0:
    shutil.rmtree(tmp)
    raise SystemExit("crop y too small: the strip would start above the source")
sess = new_session(a.model)
cache = {}

def strip(k):
    if k not in cache:
        im = Image.open(os.path.join(tmp, f"{k:06d}.jpg")).convert("RGB")
        ctx = im.crop((0, 0, W, min(H, int(crop_top + H * 0.2))))   # head and shoulders, for the matte
        rgba = ctx.copy()
        rgba.putalpha(remove(ctx, session=sess, only_mask=True))
        px = np.array(rgba.resize((WIN_W, POP_H), Image.LANCZOS, box=(0, strip_top, W, crop_top)))
        px[..., 3] = np.where(px[..., 3] < 8, 0, px[..., 3])
        px[px[..., 3] == 0, :3] = 0
        cache[k] = Image.fromarray(px)
    return cache[k]

for spec in a.scene:
    name, start, secs = spec.split(":")
    start, secs = float(start), float(secs)
    n = int(round(secs * FPS))
    out = tempfile.mkdtemp()
    for i in range(n):
        k = min(int(math.floor(src_time(start + i / FPS) * SRC_FPS + 1e-6)), count - 1)
        strip(k).save(os.path.join(out, f"{i + 1:04d}.png"))
    mov = os.path.join(a.scenes, name, "pop.mov")
    subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i",
                           os.path.join(out, "%04d.png"), "-c:v", "png", "-pix_fmt", "rgba", mov])
    shutil.rmtree(out)
    print(f"{name}: pop.mov, frames {n} -> pop: {{fps: {FPS}, frames: {n}}}", flush=True)
shutil.rmtree(tmp)
