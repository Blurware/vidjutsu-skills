#!/usr/bin/env python3
"""Scene lengths from the post-cut words, so every scene starts on its line.

    python3 beats.py words.json plan.json [--out .]

words.json: timeline_words after cut_pauses (its items), or a plain list of
{text, start, end} in seconds. plan.json: the beats in order,
[{"dir": "01-hook", "layout": "split", "first": "This"}, ...] where `first` is
the beat's opening words (two or three when the first is a common word like
"the"), or the first word's index in the words, as a number. The first beat
starts at 0.

A scene starts 2 frames (30 fps) before its first word, so the card is already
moving when the word lands; the film ends 0.2 s after the last word.
Writes beats.json ([{dir, layout, start, frames, seconds, first}]) and
film.json for make_graphics.
"""
import argparse, json, math
ap = argparse.ArgumentParser(); ap.add_argument("words"); ap.add_argument("plan"); ap.add_argument("--out", default=".")
a = ap.parse_args()
raw = json.load(open(a.words)); raw = raw.get("items", raw) if isinstance(raw, dict) else raw
sec = lambda t: t["ticks"] / t["rate"] if isinstance(t, dict) else float(t)
words = [{"text": w.get("text", w.get("t")), "start": sec(w.get("start", w.get("s"))), "end": sec(w.get("end", w.get("e")))}
         for w in raw if w.get("kind", "word") == "word"]
plan = json.load(open(a.plan))
norm = lambda s: "".join(c for c in s.lower() if c.isalnum())
idx, k = [], 0
for i, b in enumerate(plan):
    if isinstance(b["first"], int): k = b["first"]
    else:  # the beat's opening words, e.g. "the length": several words keep a short one unambiguous
        want = [norm(x) for x in b["first"].split()]
        while k < len(words) and [norm(w["text"]) for w in words[k:k + len(want)]] != want: k += 1
        if k >= len(words): raise SystemExit(f"beat {b['dir']}: first word {b['first']!r} not found after word {idx[-1] if idx else 0}")
    idx.append(k); k += 1
bounds = [0 if i == 0 else math.floor(words[w]["start"] * 30) - 2 for i, w in enumerate(idx)]
bounds.append(math.ceil((words[-1]["end"] + 0.2) * 30))
beats = []
for i, b in enumerate(plan):
    f = bounds[i + 1] - bounds[i]
    if f < 30: print(f"warning: {b['dir']} is only {f} frames")
    beats.append({"dir": b["dir"], "layout": b["layout"], "start": round(bounds[i] / 30, 4), "frames": f, "seconds": round(f / 30, 4), "first": idx[i]})
film = {"width": 1080, "height": 1920, "fps": 30, "subframes": 1,
        "scenes": [{"dir": b["dir"], "seconds": b["seconds"], **({"extract": [{"video": "pop.mov", "frames": "pop/%04d.png"}]} if b["layout"] == "split" else {})} for b in beats]}
json.dump(beats, open(f"{a.out}/beats.json", "w"), indent=1)
json.dump(film, open(f"{a.out}/film.json", "w"), indent=1)
for b in beats: print(f"{b['dir']:<14} {b['layout']:<6} start {b['start']:7.3f}  {b['frames']:4d} frames  first word #{b['first']} {words[b['first']]['text']!r}")
print("total", round(bounds[-1] / 30, 3), "s")
