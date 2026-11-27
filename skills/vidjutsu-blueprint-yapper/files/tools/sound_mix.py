#!/usr/bin/env python3
"""Lay the sound effects on the cut's timeline and trim the music bed.

    python3 sound_mix.py beats.json events.json [--sound sound] [--music sound/music.mp3]

events.json: [[scene, t, sound, extra_dB?], ...], t in seconds inside the scene
(the same times as the scene's cards, so a click lands on the cursor's click).
Use a small negative t (-0.1) for whooshes: they lead the cut so the peak
lands on it. sound is a file name in --sound without .mp3.

Writes sfx_stem.wav and music_bed.wav, both exactly the film's length, for
tracks a2 and a3. Levels: effects sit about 20 dB under the voice, the bed
lower still (-18 dB), and the bed fades out over the last 1.2 s.
"""
import argparse, json, subprocess
ap = argparse.ArgumentParser(); ap.add_argument("beats"); ap.add_argument("events")
ap.add_argument("--sound", default="sound"); ap.add_argument("--music", default=None); ap.add_argument("--gain", type=float, default=-7)
a = ap.parse_args()
beats = json.load(open(a.beats)); start = {b["dir"]: b["start"] for b in beats}
total = sum(b["frames"] for b in beats) / 30
if not 1 < total < 180: raise SystemExit(f"film length {total} looks wrong")  # an untrimmed apad would write forever
LEAD = {"whoosh": 0.10, "swish": 0.05, "keys": 0.04, "click": 0.04}  # silence at the head of these files
LEVEL = {"whoosh": -9, "swish": -9, "scroll": 3, "hit": -6, "click": -3, "pop": -3, "blip": -2, "marker": -8, "ticker": -6, "ding": -12, "ping": -8, "keys": -8}
ins, fl = [], []
events = json.load(open(a.events))
for i, ev in enumerate(events):
    scene, t, name = ev[0], ev[1], ev[2]; extra = ev[3] if len(ev) > 3 else 0
    at = max(0, start[scene] + t)
    ins += ["-i", f"{a.sound}/{name}.mp3"]
    fl.append(f"[{i}:a]atrim=start={LEAD.get(name, 0)},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=stereo,"
              f"volume={LEVEL.get(name, -6) + extra}dB,afade=t=in:d=0.005,adelay={round(at * 1000)}:all=1[a{i}]")
fl.append("".join(f"[a{i}]" for i in range(len(events))) + f"amix=inputs={len(events)}:normalize=0:dropout_transition=0,"
          f"highpass=f=110,volume={a.gain}dB,apad,atrim=end={total:.4f}[out]")
subprocess.check_call(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fl), "-map", "[out]", "-ar", "44100", "-ac", "2", "sfx_stem.wav"])
if a.music:
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", a.music, "-af",
        f"atrim=end={total:.4f},afade=t=in:d=0.3,afade=t=out:st={total - 1.2:.4f}:d=1.2,volume=-18dB,apad,atrim=end={total:.4f}",
        "-ar", "44100", "-ac", "2", "music_bed.wav"])
print(f"{len(events)} effects, {total:.3f} s: sfx_stem.wav" + (", music_bed.wav" if a.music else ""))
