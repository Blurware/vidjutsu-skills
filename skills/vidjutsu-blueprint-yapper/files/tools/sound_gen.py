#!/usr/bin/env python3
"""Make the sound-effect library and a music bed with ElevenLabs (paid: each
call uses the account's credits, so say what you will make before you run it).

    ELEVENLABS_API_KEY=... python3 sound_gen.py [--out sound] [--music-seconds 40] [--only whoosh,pop]

Writes <out>/<name>.mp3 for every sound in SOUNDS below and <out>/music.mp3.
A file that exists is kept, never overwritten, so a rerun only fills gaps.
Listen to each one: regenerate a bad one by deleting it and running again.
"""
import argparse, json, os, urllib.request
SOUNDS = {  # name: (prompt, seconds or None for natural length, prompt_influence)
    "whoosh": ("wind swoosh transition, breathy white noise sweep passing left to right, video editing whoosh", 1, 0.75),
    "swish": ("fast scrolling whir, paper pages flicking past quickly, short", 0.6, 0.6),
    "scroll": ("fast scrolling whir, paper pages flicking past quickly, rising then settling", 1.5, 0.5),
    "hit": ("tight punchy drum hit with a bright snappy attack, short modern transition impact, no long tail", 1, 0.75),
    "click": ("single crisp computer mouse click, close and dry", 0.5, 0.8),
    "pop": ("single short water drop bloop, one soft plop", 1, 0.75),
    "blip": ("short soft digital blip, UI tick, dry", 0.5, 0.7),
    "marker": ("highlighter marker pen swiping once across paper, short squeaky felt-tip stroke", 0.6, 0.6),
    "ticker": ("rapid digital counter ticking upward, fast mechanical odometer clicks speeding up", 1.0, 0.6),
    "ding": ("bright clean success bell chime, single pleasant ding", 1.2, 0.7),
    "ping": ("small soft high digital ping, subtle confirmation blip", 0.5, 0.7),
    "keys": ("short burst of fast mechanical keyboard typing, a few quick keystrokes", 0.8, 0.7),
}
MUSIC = ("chill modern lo-fi tech beat for a short product explainer: warm Rhodes chords, soft kick and rimshot, light shaker, "
         "subtle bass, 92 bpm, upbeat but relaxed, instrumental only, no vocals, steady from the first second, no long intro")
ap = argparse.ArgumentParser(); ap.add_argument("--out", default="sound"); ap.add_argument("--music-seconds", type=int, default=40)
ap.add_argument("--only", default=""); ap.add_argument("--no-music", action="store_true")
a = ap.parse_args(); key = os.environ["ELEVENLABS_API_KEY"]; os.makedirs(a.out, exist_ok=True)
def post(path, body, out):
    if os.path.exists(out): print("have", out); return
    req = urllib.request.Request("https://api.elevenlabs.io/v1/" + path + "?output_format=mp3_44100_128", json.dumps(body).encode(),
                                 {"xi-api-key": key, "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r: open(out, "wb").write(r.read()); print("ok", out)
    except urllib.error.HTTPError as e: print("FAIL", out, e.code, e.read()[:300])
for name, (text, secs, infl) in SOUNDS.items():
    if a.only and name not in a.only.split(","): continue
    post("sound-generation", {"text": text, **({"duration_seconds": secs} if secs else {}), "prompt_influence": infl}, f"{a.out}/{name}.mp3")
if not a.no_music and not a.only:
    post("music", {"prompt": MUSIC, "music_length_ms": a.music_seconds * 1000}, f"{a.out}/music.mp3")
