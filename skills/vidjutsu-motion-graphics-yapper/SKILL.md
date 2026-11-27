---
name: vidjutsu-motion-graphics-yapper
description: Make a Motion Graphics Yapper short with VidJutsu, a 9:16 reel where a presenter talks in a window under animated graphics that show the tool, repo or library being shared, with the real page, real clicks and the tool's own demo footage, sound effects and a music bed. Use when the person asks for a Yapper, a "this tool does X" short, or a short about a resource, and has a raw talking-head take (or will record one). Recreates one proven reel near verbatim and ships the look, the kit, starter scenes and the tools. Needs the VidJutsu MCP server or CLI.
license: Apache-2.0
metadata:
  version: "1.1.0"
  creator: VidJutsu
---

# Motion Graphics Yapper

A 9:16 short, 30 to 50 seconds, about one resource someone can use today: a
tool, a GitHub repo, a library of skills or prompts. The presenter talks in a
rounded window at the bottom of the frame, and their head breaks out over the
window's top edge. Above them the graphics show what they're talking about,
and they show the real thing: the actual repo page with a camera moving over
it, marker highlights landing on the words being said, a cursor that clicks
the real button, the tool's own demo clips, a star count that counts up. Every
few seconds the graphics take the whole screen, then the presenter comes back.
The last beat is the presenter full frame with the call to action in a pill.
Sound effects land on every move, under a quiet music bed.

The method is simple and strict: **every Yapper is a recreation of one proven
reel**. You don't invent a structure. You take a reel that already beat its
account's median by 3x or more, keep its beats, line lengths and pacing, and
swap only the subject. [references.md](references.md) lists the reels this
look was built from and what each one teaches.

Use the defaults and don't ask first. The first render is the proposal. Ask
only where a step below says to.

## What ships with this skill

| Path | What it is |
| --- | --- |
| [look.md](look.md) | The look: palette, type, motion, the frame's zones. |
| [references.md](references.md) | The proven reels behind the look, as rules you can reuse. |
| `files/kit/yap.css`, `files/kit/yap.js` | The kit: layout, captions, ten drawn card types, motion. Every scene loads it. |
| `files/kit/shots.css`, `files/kit/shots.js` | Shots: the cards that show real things (`page`, `crop`, `demo`, `odo`). |
| `files/kit/fonts/` | Bricolage Grotesque, Inter, Instrument Serif italic, JetBrains Mono (all SIL OFL 1.1). |
| `files/scenes/01-hook` ... `08-cta` | Eight starter scenes, one per beat, from the sample. |
| `files/film.json` | The sample's film: 1080x1920, the eight scenes and their seconds. |
| `files/tools/` | Tools that run on your machine (Node 22+, Python 3, ffmpeg, Chrome); see [The tools](#the-tools). |
| `preset.json` | The gallery entry (name, use, category, tags, sample). |
| [sample/sample.mp4](sample/sample.mp4), `sample/poster.jpg` | The approved sample short (41 s, 1080x1920) and its poster. |
| [sample/script.md](sample/script.md) | The sample's script, beat by beat against the reference reel. |

Watch the sample at its permanent link:
https://github.com/Blurware/vidjutsu-skills/raw/main/skills/vidjutsu-motion-graphics-yapper/sample/sample.mp4
(poster: the same path with `poster.jpg`). Point people at that link, not at a
render's watch link, which expires after seven days.

The starter files are also at
`https://vidjutsu.ai/.well-known/skills/vidjutsu-motion-graphics-yapper/files/<path>`.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `canvas` | 9:16 | `init` the project with `canvas: "9:16"` (1080x1920). |
| `length` | 30 to 50 s | After pauses are cut. About 110 to 150 spoken words. |
| `beats` | 8 to 11 | One scene per beat, 1.5 to 6 s each. |
| `pause_cut` | 0.3 s | Pauses this long or longer are cut, keeping 0.08 s at each side. |
| `look` | paper | Light grid ground. `ink` is the dark variant. |
| `accent` | `#2F6BFF` | One accent color per page. |
| `fps` | 30 | Film frame rate. `subframes` 1 (the moves are short pops). |
| `loudness` | -14 LUFS | Final mix, true peak at most -1 dB. |

## The presenter

The person brings one raw take: the script read straight through, phone
upright, sound and picture in the same file. Ask once for it if they haven't
sent it. What the take needs:

- The face in the top half of the frame, with room above the head: the window
  is cropped at the forehead and the top of the head is drawn over the
  window's edge (see [Head room](#head-room)).
- A steady camera and a plain, quiet room. Small mistakes are fine: a restart
  is cut like any other pause.
- The script as written. If they change a line, the script table follows what
  they said.

## Steps

1. **Pick the reference.** One reel, 3x or more its account's median views,
   in this format (presenter plus graphics about one resource). Start from
   [references.md](references.md), or from the person's own bank of
   outliers. Write down its link, views and multiple of the median.
2. **Write the script near verbatim.** Keep the reference's beats in order,
   its sentence lengths and its turns of phrase ("Here's how you can...",
   "It's called...", "Here's the clever part"). Change only what must change:
   the resource, its numbers, what it does. Save it as a table, one row per
   beat: `Beat | Reference line | Our line`, then two lines under it:
   **Took** (what you kept) and **Changed** (what you swapped and why). Every
   number on screen must be true today: check stars, counts and prices at the
   source on the day.
3. **Pick the call to action.** Rotate per page, per week:

   | Ask | Times a week | Last line |
   | --- | --- | --- |
   | Comment a keyword, get the link by DM | 3 | "comment KEYWORD down below and I'll DM you the link" |
   | DM me a keyword | 1 | "DM me KEYWORD and I'll send it over" |
   | Check the pinned comment | 1 | "the link is in the pinned comment" |
   | Follow for more | 2 | "follow for more tools like this" |

   On YouTube Shorts there are no DMs: swap keyword and DM asks for the
   pinned comment.
4. **Bring the take in.** `create_upload` + `complete_upload` (or `ingest` for
   a link). The answer has the video (`media`) and its sound (`audio`).
   `init` the project with `canvas: "9:16"`; it starts in Editing.
5. **Lay it out and cut the pauses.** One `edit`: `add_media` both, the sound
   on `a1` from 0 and the video on `v2` from 0, full frame
   `{x: 0, y: 0, width: 1000, height: 1000, fit: "cover"}` (layout numbers are
   whole numbers on the 1000x1000 grid; times are strings like `"12.5"` or
   whole seconds). Then `make_transcript` on the take, poll `render_status`,
   and `timeline_words` with `pause: 0.3`. Send every pause as one
   `cut_pauses` edit, each range shortened by 0.08 s at both ends, plus the
   silence before the first word and after the last (keep 0.2 s after it).
   It cuts all tracks at once, so voice and lips stay together. Read
   `timeline_words` again and save it as `words.json`: these post-cut times
   are the ones the scenes use. Keep the ranges you cut as `cuts.json`
   (`[[start, end], ...]` in source seconds) for the head pop-out.
6. **Cut it into beats.** Split the script into beats on sentence ends and
   give each a layout, alternating so the screen changes every 2 to 5
   seconds:

   | Beat | Layout | What's on screen |
   | --- | --- | --- |
   | Hook | split | The real repo page; the camera pushes in on the line that matches the promise, a marker lands on it. |
   | Proof | card | The star count: the cursor clicks the real star button, a lens pops it out, a counter counts up. |
   | Count | card | How many tools: the page's tool table scrolls past behind a big number. |
   | Tour | split | Three to five of the tool's own demo clips, one per thing named, each with its real command typing. |
   | Works with | card | The page's line that lists them, each name popped out with a lens as it's said. |
   | The turn | split | "Here's the clever part": the project's site or docs, highlights on each word of the claim. |
   | Detail | card | The thing it does, shown on its real output (a report, a result card), one lens per item said. |
   | So | split | The README's "why" paragraph, the key phrase highlighted, the old way struck through. |
   | Local / free | card | The page's no-keys or license lines, highlighted one by one. |
   | Install | split | The real install command on the site; the cursor clicks Copy. |
   | CTA | face | Presenter full frame, the ask in a pill. |

   Write `plan.json`, one entry per beat with its opening words:
   `[{"dir": "01-hook", "layout": "split", "first": "This free"}, ...]`, and
   run `python3 tools/beats.py words.json plan.json`. It writes `beats.json`
   and `film.json`: each scene starts 2 frames before its first word, so the
   card is already moving when the word lands, and the film ends 0.2 s after
   the last word. A beat of one short sentence (1.5 s) is fine.
7. **Capture the real things.** For every beat that shows a page, capture it
   with `tools/capture_page.mjs` (see [Real pages and clicks](#real-pages-and-clicks)):
   the repo page, the project's site, the README sections you'll show. Turn
   each demo clip the repo ships (GIFs and videos in its README or docs) into
   a sprite sheet with `tools/make_sheet.py`. Use only what the resource
   itself publishes, and check that every number on it is today's.
8. **Build the scenes.** For each beat, copy the starter scene closest to it,
   load `kit/shots.css` and `kit/shots.js` after the kit, and write its
   `Yap.scene({...})` config (see [The scene config](#the-scene-config) and
   [Shots](#shots)). Put every image it uses in the scene's own `img/`
   folder. Captions come from the post-cut words minus the scene's start:
   1 to 3 words each, broken on punctuation, with the one word that matters
   marked `*word*`. Time each move to the word that names it: a marker lands
   as the word starts, a lens pops 0.1 s before, the cursor arrives 0.1 s
   before its click. Draw stills of the moments that matter with
   `tools/preview.mjs` and look at them.
9. **Make the head pop-outs** with `tools/make_pop.py` (see
   [Head room](#head-room)).
10. **Check the scenes on your machine** with `tools/check_repeat.mjs`. Every
    scene must say `ok` before you pay for a render.
11. **Sound.** Lay sound effects on the moves and a music bed under the voice
    (see [Sound](#sound)). The result is `sfx_stem.wav` and `music_bed.wav`,
    both exactly the film's length.
12. **Send the files.** Name the workspace `<project>-graphics`. Each scene is
    served on its own, so every scene folder holds its own copy of the kit,
    its images and its `pop.mov`: `<scene>/index.html`, `<scene>/kit/*.css`,
    `<scene>/kit/*.js`, `<scene>/kit/fonts/*.woff2`, `<scene>/img/*`,
    `<scene>/pop.mov`. Don't send the extracted `pop/` stills; the renderer
    makes them from `pop.mov`. `graphics_write` lists every path with its
    sha256; identical files upload once, so PUT only the ones it says are
    missing.
13. **Render the graphics.** `make_graphics` with the workspace, the film from
    `beats.py`, `name` `<project>-graphics`, an `idempotency_key` and the
    project. Poll `graphics_status`. On "not repeatable" or a page error, fix
    the scene it names (the error gives `t`) and render again: unchanged
    scenes come from the cache. A slice that failed and then succeeded on the
    job's own retry needs nothing. `output_seconds` must equal the cut's
    length.
14. **Place it.** One `edit`:
    - `add_media` the graphics and the two sound stems, and `add_track` `v3`,
      `a2` and `a3`.
    - The graphics on `v1` from 0 for the whole cut, full frame. It is
      opaque: it is the ground, the cards, the captions, the window's frame
      and the head pop-out.
    - The presenter on `v2` is drawn over it. `set_layout` on `v2` per beat
      range (the ranges from `beats.json`):
      - **split:** the window, `{x: 56, y: 604, width: 889, height: 328,
        shape: "rounded", radius: 24, fit: "cover", crop: {x: 0, y: <crop_y>,
        width: 1000, height: <crop_h>}, cut: true}`. The crop is a box of the
        source with exactly the window's shape: its height is
        `round(1000 * 630 * W / (960 * H))` for a `W` x `H` source (369 for
        any 9:16 take), so `cover` crops nothing more and the head strip meets
        the window without a gap. Its `y` comes from [Head room](#head-room).
      - **card:** `{x: 0, y: 0, width: 1000, height: 1000, hidden: true}`.
      - **face:** full frame `{x: 0, y: 0, width: 1000, height: 1000,
        fit: "cover"}`. From the window it glides to full frame (a third of a
        second), which reads as a push-in.
    - `sfx_stem.wav` on `a2` and `music_bed.wav` on `a3`, both from 0.
    - The CTA pill on `v3`: a second clip of the graphics, source from the
      CTA scene's start for as long as is left, placed at the moment the
      presenter says the ask (the keyword), with layout `{x: 112, y: 631,
      width: 776, height: 123, crop: {x: 112, y: 631, width: 776,
      height: 123}, shape: "rounded", radius: 400}`. The crop sits a unit
      inside the pill so no ground shows at its edge.
15. **Check.** Run the checks below and fix what fails.
16. **Render and hand it over.** `render` with `loudness: -14` and
    `max_peak: -1`, poll `render_status`, then `set_review_state`
    `ready_for_review`. Give the person `output.watch_url`, the reference it
    recreates, the script table, and what the graphics and render jobs cost
    (`usage.vcpu_seconds` at $0.03 per vCPU-minute).

## Real pages and clicks

Show the thing itself. A page capture is a real screenshot of the resource's
own page, played behind a camera inside a browser frame, with marks, lenses
and a cursor laid on its real pixels.

```bash
node tools/capture_page.mjs https://github.com/owner/tool page \
  --width 540 --height 2400 \
  --find '{"stars":"11.5k","promise":"checks its own output","install":"npx tool setup"}'
node tools/capture_page.mjs https://owner.github.io/tool site --scheme dark --height 1320 --click Copy
```

- It opens the page in headless Chrome at 540 px wide with 2x pixels, so the
  still is 1080 px wide (sharp at any zoom the camera uses), and saves
  `assets/page.png` plus `assets/page.json` with the boxes of every phrase you
  asked for, in the still's pixels: `[x, y, w, h]`. Those boxes are what
  `marks`, `lenses` and `cursor` take, so a highlight sits exactly on the
  words.
- `--click Copy` presses the first button with that text and also saves
  `page-clicked.png` (the "Copied" state), for a beat where the cursor clicks
  and the page answers: cut from one still to the other at the click.
- `--scheme dark` captures a site's dark theme; set `dark: true` on its
  `page` card so the frame, marks and lenses use the dark set.
- A page that loads its content late needs `--wait 8000`. A page that hides
  behind a sign-in can't be captured: use its public README instead.
- Take only the page's own text and images. Don't capture someone's profile,
  avatar or follower list.

The repo's demo clips become `demo` cards: download each GIF or video the
README shows, then

```bash
python3 tools/make_sheet.py demos/cut.gif assets/cut.jpg --fps 12 --frames 16
```

It prints the card keys (`sheet`, `cols`, `rows`, `frames`, `fw`, `fh`,
`fps`). The renderer can't play video inside a scene, so a clip travels as one
image of 16 frames that the card steps through.

## Shots

Load them after the kit and call `Yap.shots()` after `Yap.scene(...)`; it
waits for every image before the first frame is drawn:

```html
<link rel="stylesheet" href="kit/yap.css">
<link rel="stylesheet" href="kit/shots.css">
<script src="kit/yap.js"></script>
<script src="kit/shots.js"></script>
<script>
Yap.scene({
  seconds: 4.87, layout: "split",
  cards: [{type: "page", at: 0, img: "img/page.png", iw: 1080, ih: 4800,
    w: 1000, h: 664, y: -77, scale: 1, popFrom: 1, url: "github.com/owner/tool", life: 4.7,
    cam: [{at: 0, cx: 540, cy: 330, z: 0.926}, {at: 1.6, cx: 540, cy: 3198, z: 1.46, dur: 0.55}],
    lenses: [{at: 0.34, until: 1.55, rect: [70, 332, 232, 62], scale: 1.9, dx: 150, dy: 30}],
    marks: [{at: 2.26, rect: [637, 3180, 178, 36]}]}],
  captions: [[0.08, 0.54, "This *free* skill"]],
  pop: {fps: 30, frames: 146}
});
Yap.shots();
</script>
```

Sizes that fit the frame: on `split`, `w: 1000, h: 664, y: -77, scale: 1`; on
`card`, `w: 1000, h: 1130, y: -40, scale: 1/1.3` (the card layout scales by
1.3). Give `page` cards `popFrom: 1` so the window slides in rather than
growing. Rects and camera points are in the still's pixels (`iw` x `ih`).

| Type | Keys |
| --- | --- |
| `page` | `img`, `iw`, `ih` (the still and its size); `w`, `h` (the browser frame); `url` (shown in the address bar; leave out for no bar); `dark`; `cam` `[{at, cx, cy, z, dur?, ease?}]`: the image point at the view's centre and the zoom (screen px per image px), each key easing from the one before over `dur` (default 0.5 s, 0 = a cut); `push` (a slow zoom over `life` seconds, default 3%); `tilt` `{rot, dur, dy, from}` or `false` (how the window swings in); `marks` `[{at, rect or rects, kind?, dur?, until?, color?}]` with `kind` `hl` (marker highlight, the default), `strike` or `under`, several `rects` drawn one after another for a wrapped line; `lenses` `[{at, until?, rect, scale?, dx?, dy?, pad?, radius?}]`: a magnifier that lifts the region out, `scale` 1.15 to 2.3; `dim` `{at, to, until?}`: fade the rest of the page while a lens is up; `cursor` `[{at, x, y, click?, travel?}]` and `cursorUntil`: a pointer that glides (`travel` seconds) and clicks with a ring |
| `crop` | `img`, `iw`, `ih`, `rect`, `zoom`, `rot`, `radius`, `plain`: one region of a still as a sticker that sways a little |
| `demo` | `name` (the tool, its first word in the accent), the sheet keys from `make_sheet.py`, `cmd` (the real command, typed at `cps` characters a second), `dir` (1 or -1: which side it slides in from) |
| `odo` | `value`, `from`, `start`, `countFor`, `prefix`, `suffix`, `label`, `size`, `dark`, `star: false`, `burst: false`, `count`: a big number that counts up, then bursts into stars |

Moves that work: a camera that cuts or eases between two or three points per
beat (never a constant drift), a marker for every claim word, a lens for a
number or a name, the cursor clicking the real button the line talks about, a
demo clip per tool named, a counter that lands on the true number. One move
per spoken phrase; two at once only when they say the same thing.

## Sound

Sound effects carry the motion: a whoosh on every scene change, a click on
every cursor click, a marker squeak on every highlight, a pop on every lens,
a ticker under a counter, a ding when it lands, typing under a command.
Under it all, a quiet instrumental bed.

1. **Make the library once.** `python3 tools/sound_gen.py` makes twelve short
   effects and a 40 s lo-fi bed with ElevenLabs (`ELEVENLABS_API_KEY`); it
   uses the account's credits, so tell the person what it makes first. Any
   sound library works: name the files as in `sound_gen.py`. Listen to each:
   regenerate one that sounds wrong. Keep the library and reuse it.
2. **Place the effects.** Write `events.json`, one entry per move, in the
   same scene times as the cards: `[["01-hook", 0, "hit"], ["01-hook", -0.1,
   "whoosh"], ["02-stars", 0.86, "click"], ["02-stars", 1.05, "ticker"], ...]`.
   Whooshes lead their cut by 0.1 s so the peak lands on it. An optional
   fourth number adds or removes dB.
3. **Mix.** `python3 tools/sound_mix.py beats.json events.json --music
   sound/music.mp3` writes `sfx_stem.wav` and `music_bed.wav`. The effects sit
   about 20 dB under the voice and the bed lower still, so neither covers a
   word.

## Head room

On every split beat the presenter's head breaks out over the top edge of the
window, as if they lean out of the edit: the window is cropped at the
forehead, and the film draws the top of the head (cut out of its background)
in the strip just above the window, so it overlaps the window's frame. This
is on by default; a split beat without it is unfinished.

Geometry (pixels on the 1080x1920 frame): the window is x 60, y 1160, 960
wide; the head strip is x 60, y 900, 960 x 260 (`Yap.LAYOUT.pop`). Captions
sit at y 850 to 930 and split cards end by y 830, so nothing covers the head.

1. **Place the crown.** Matte a few source frames (any background-removal
   model your agent uses) and find the top row of the head, `crown` (source
   pixels); take the highest. With a source `W` x `H` and `S = 960 / W`, set
   the window crop to `y = round(1000 * (crown + 180 / S) / H)` on the grid:
   the crown then lands about 180 px above the window, inside the strip.
   Check that the mouth stays above y 1500 (the platform's buttons sit
   lower); if not, use a smaller 180.
2. **Make the strips.** For each split scene, one still per film frame
   (`round(seconds * 30)` stills): frame `n` (from 1) is timeline time
   `scene start + (n - 1) / 30`. Map it back through the pause cuts to the
   source time, take that source frame, cut out the presenter (alpha from the
   matte; make fully clear pixels black so they pack small), take the source
   rows from `crop_top - 260 / S` to `crop_top` (`crop_top = y * H / 1000`)
   at full width, and scale them to 960 x 260. Pack the stills into
   `<scene>/pop.mov` with the PNG codec, which keeps the alpha.
   [`files/tools/make_pop.py`](files/tools/make_pop.py) does all of this on
   your machine (Python, `rembg`, `ffmpeg`):
   `python3 tools/make_pop.py --video take.mp4 --cuts cuts.json --crop-y 302
   --scene 01-hook:0:4.8667 --scene 04-tour:9.7667:5.6667 --scenes scenes`.
3. **Wire the scene.** Add `pop: {fps: 30, frames: <count>}` to the scene
   config; `beats.py` already put `extract: [{video: "pop.mov", frames:
   "pop/%04d.png"}]` on every split scene of the film. The kit loads
   `pop/0001.png`... one per frame and draws it over the window's edge. To
   preview locally, extract them yourself:
   `ffmpeg -i scenes/01-hook/pop.mov -start_number 1 scenes/01-hook/pop/%04d.png`.

The strip only draws above the window and the presenter video only below its
top edge, so the two meet in one line: matte from the same source frames the
timeline shows (post-cut times) and the line doesn't show.

## The scene config

A scene page loads the kit and calls `Yap.scene(cfg)` once (then
`Yap.shots()` when it uses shots).

Times are seconds inside the scene. Text marks: `[boxed]` (accent box),
`*flair*` (serif italic in the accent), `^accent^` (accent color).

| Key | Meaning |
| --- | --- |
| `seconds` | The scene's length; equal to its `seconds` in the film. |
| `layout` | `split` (cards over the presenter window), `card` (cards full screen), `face` (presenter full frame; the page only draws the CTA pill). |
| `look`, `accent` | `"ink"` for the dark ground; a hex accent for this page. |
| `title` | `{text, at, until}`: the header at the top. |
| `cards` | Each `{type, at, until?, x?, y?, scale?, popFrom?, ...}`; one card shows at a time unless you place them with `x`, `y`. `popFrom` is the scale a card pops in from (default 0.88; 1 for no growth); `from` belongs to the card type (a counter's start value). |
| `notes` | Hand-placed stickers `{text, x, y, at, until?, rot?}`. |
| `captions` | `[start, end, text]`, 1 to 3 words. Omit on `face`. |
| `pop` | On `split`: `{fps: 30, frames}`, the head pop-out stills (see [Head room](#head-room)). |
| `cta` | On `face`: `{lead: "comment", keyword: "SKILLS"}`. |
| `cursor`, `cursorUntil` | A pointer `[{at, x, y, click?, travel?}]` that moves and clicks, in frame pixels. (A `page` card has its own, in the still's pixels.) |

Drawn card types and their keys, for anything the resource has no page or
footage for:

| Type | Keys |
| --- | --- |
| `header` | `text`, `sub` |
| `logo` | `name`, `by`, `mark` (a letter) or `markHtml`, `pills` |
| `repo` | `owner`, `name`, `visibility`, `desc`, `stars`, `starsFrom`, `countFor`, `license`, `lang` |
| `term` | `title`, `prompt`, `lines` `[{type: "cmd" \| "ok" \| "dim", text, at, cps?}]` |
| `chips` | `items`, `count {n, label}`, `on` (indices to light), `onAt`, `gap` |
| `list` | `items` |
| `stat` | `value`, `from`, `prefix`, `suffix`, `label`, `countFor` |
| `files` | `items` `[{ext, name}]`, `gap` |
| `meter` | `label`, `right` (`{pct}` is replaced), `rows` `[{name, at}]`, `steps` `[{at, value}]` |
| `compare` | `a {title, rows}`, `b {title, rows}` (rows are rich text) |

The kit follows the renderer's rules for you: every property is set from `t`
alone, fonts and images load before the first frame, and render calls run one
after another. Layers are chosen for repeatability: drawn cards keep a
`will-change` layer, which holds popping text steady, while the caption and
every scene with shots draw without one, because Chrome rasters a layer once at
the scale it first meets and then stretches the bitmap, so a scaling element
came out sharper or softer depending on the frame before it. If you add your
own elements, follow the same rules and the ones in the
vidjutsu-motion-graphics skill, and run `check_repeat.mjs`.

## The tools

All in `files/tools/`, run on your machine. Chrome is found at its macOS path;
set `CHROME` to the binary elsewhere.

| Tool | Does |
| --- | --- |
| `capture_page.mjs` | A real page as one 1080 px wide still, with the boxes of the phrases you name, and an optional click. |
| `make_sheet.py` | A demo GIF or video as a 4x4 sprite sheet for the `demo` card. |
| `beats.py` | Scene starts and lengths from the post-cut words; writes `beats.json` and `film.json`. |
| `preview.mjs` | Stills of any scene at any times, to look at before rendering. |
| `check_repeat.mjs` | Draws each scene forward then backward and fails a frame that came out visibly different. |
| `make_pop.py` | The head pop-out strips for every split scene. |
| `sound_gen.py` | The sound-effect library and music bed (ElevenLabs, paid). |
| `sound_mix.py` | The effects on the timeline and the trimmed bed, as two stems. |
| `cdp.mjs` | The small Chrome DevTools helper the Node tools share. |

## Checks

**Script.** The table has a reference line for every beat, and Took and
Changed are filled in. Every number on screen was checked at its source
today.

**Scenes.** `check_repeat.mjs` says `ok` for every scene, with no page errors.

**Graphics.** `graphics_status` succeeded and `output_seconds` equals the
cut's length (within one frame).

**Frames.** `frame` at 0.1 s into each beat, at its middle, and 0.05 s before
its end, plus one still a frame after the pill comes in. It passes when:
- On split beats the head breaks out over the window's top edge: hair and
  crown whole, no background halo around them, and no step where the strip
  meets the window. The mouth is above y 1500. Nothing else of the presenter
  shows outside the window's frame.
- Every mark sits on its words, every lens shows the region it names, and the
  cursor's tip is on the button when the ring goes off.
- Cards and notes end above the caption, and the caption above the crown.
- On card beats no presenter shows at all.
- Captions and headers are whole and inside the frame's safe zone (120 px at
  the sides, nothing important under y 1600 except the window).
- The pill on the CTA reads as one clean shape, no ground showing at its
  corners.

**Sound.** Measure the render (`ffmpeg -i out.mp4 -af ebur128=peak=true -f
null -`): about -14 LUFS, true peak at most -1 dB. Listen once: every effect
lands on its move, none covers a word, and the bed never pumps.

**Sync.** Watch the render once with sound: lips match the voice from first
word to last, and every card lands on the word that names it.

If a check fails, fix the scene with a `graphics_write` patch, render the
graphics again (only that scene is drawn), and `swap_media` the clips on
`v1` and `v3`. Report what you saw, never a score.

## After the first render

Changes come back as words or as comments (`comments`). A wording, card or
timing fix is a patch to one scene, plus its line in `events.json` if a move
changed. A different line from the presenter means a new take and a new cut:
redo steps 4 to 14.
