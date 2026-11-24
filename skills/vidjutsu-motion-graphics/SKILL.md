---
name: vidjutsu-motion-graphics
description: Make title cards, lower thirds and animated segments with VidJutsu, written as HTML scenes and drawn in the cloud, then place them on a project's timeline. Use when the person asks for motion graphics, a title card, a lower third or an animated segment. Ships starter files (a title card and a lower third). Needs the VidJutsu MCP server or CLI.
license: Apache-2.0
metadata:
  version: "1.0.0"
  creator: VidJutsu
---

# Motion Graphics

Title cards, lower thirds and animated segments, written as HTML and drawn in
the cloud.

Use the defaults and don't ask first. The first render is the proposal: the
person reacts to moving pictures, not to a list of questions. Ask only where a
step below says to.

A graphic is a web page that draws any moment on request. You write it; the
renderer opens it on locked-down machines, calls `window.render(t)` for every
frame and joins the frames into a video. You never run the page yourself, and
nothing runs it except a render job.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `fps` | 30 | Output frame rate. |
| `subframes` | 2 | Frames drawn and blended per output frame: motion blur on fast moves. Use 1 for a scene that only fades. |
| `grain` | 0.1 | A grain effect on the film, `{type: "grain", amount: 0.1}`. Keeps flat dark backgrounds from banding. |
| `title_seconds` | 5 | Length of a title card scene. |
| `lower_third_seconds` | 6 | Length of a lower third scene. |
| `margin_px` | 160 | Keep text this far from every edge of a 1920x1080 frame. |

The film's size follows the project: 1920x1080 for a 16:9 project, 1080x1920
for a 9:16 one (`show` says which). On 9:16, also keep text out of the zones
the apps cover: the top 328 pixels, the bottom 672 and 120 at each side.

## The rules a scene must follow

1. **Draw `t` from `t` alone.** Frames are drawn in pieces, on many machines,
   in any order. Every animated property is set from `t` on every call; keep
   no state between frames. Clocks (Date, performance.now,
   requestAnimationFrame) are frozen to `t` and Math.random is seeded, so they
   are safe. CSS animations and transitions don't follow `t`: never use them.
   If a frame drawn twice comes out different, the job stops with "the scene
   is not repeatable".
2. **No network.** Ship every library, image and font in the scene's folder
   and load it by relative path. A CDN link fails.
3. **Named effects only.** Finishing effects are `grain`, `vignette` and
   `blur` on the film. Anything else is drawn by the page.
4. **One scene per card.** Each title card, lower third or segment is its own
   folder and its own entry in film.json. A changed scene is drawn again; the
   others come from the cache, so a fix to one card costs one card.
5. **Light pages.** Drawing is on the CPU. Avoid large CSS `filter: blur()`
   and `backdrop-filter`; use solid or semi-transparent panels instead.
6. **Settle at the end values.** When an element is fully in, set the
   property to its plain resting value (a clip-path to "none", not an inset of
   0%), or its edge can be drawn a shade differently depending on the frame
   before, and the job stops as not repeatable.

Libraries: put the file in the folder, then hand the animation to the frozen
helper, which sets `render(t)` for you: `vidjutsu.gsap(timeline)` (GSAP and
HyperFrames compositions), `vidjutsu.three({renderer, scene, camera, update})`
(Three.js; set positions from `t`, never add to them each frame),
`vidjutsu.lottie(animation)` (Lottie, loaded with autoplay off). Without a
library, define `window.render = (t) => { ... }` as the starter files do.

Fonts: Inter, Inter Display, JetBrains Mono, Satoshi, DejaVu, Liberation and
Noto Color Emoji are installed. Any other font goes in the folder with
`@font-face`, and `render(t)` awaits `document.fonts.ready` before drawing.

## Steps

1. **Decide the cards.** `show` the project to read its canvas and length,
   and the words where each card goes (a title before the first take, a lower
   third when a speaker first appears). Name the workspace after the project
   plus `-graphics`. If the person gave no words, use the project's name for
   the title and leave lower thirds out.
2. **Start from the starter files.** They ship with this skill in `files/`:
   film.json, title/index.html and lower-third/index.html (also at
   https://vidjutsu.ai/.well-known/skills/vidjutsu-motion-graphics/files/film.json
   and the same path for the two pages).
   `graphics_list` the workspace first: if it already has files, change those
   instead of starting over. Otherwise `graphics_write` them all as `write`
   entries in one call. For more cards of a kind, write a copy of the folder
   under a new name (title-2/index.html) and add a scene for it.
3. **Change the words and the look.** Each page starts with a CONTENT block
   and SECONDS: change those with `graphics_write` `patch` entries (find must
   occur exactly once), keeping SECONDS equal to the scene's seconds in the
   film. Send the bundle you read as `expected_bundle`; on a 409, read again
   with `graphics_list` and redo the change on top. Brand fonts, logos or
   footage go in as `files` by hash: PUT each missing one to its link.
4. **Render.** For a film over a minute long, `quote` the project with
   graphics_seconds (the film's length) first and tell the person the price;
   shorter films need no go-ahead. `make_graphics` with the workspace, the film (from film.json,
   with the size from step 1 and the defaults above), a `name` such as
   "<project>-graphics", an `idempotency_key` and the project. A 1080p film
   costs about $0.48 a minute per subframe plus a few cents to start. Poll `graphics_status`
   until it ends. On "not repeatable" or a page error, fix the scene it names
   and render again: the error gives the time `t`.
5. **Place it.** `output.media` is a video. Add it with an `add_media` edit
   (give it an id) and place each card with `insert_clip`: the source range is
   the scene's start and end inside the film (scenes play in film.json order).
   A title card goes on `v1` with `ripple: true` at the time it opens, so the
   takes and their sound move later together. The graphics video is opaque
   and silent: a card covers everything under it while it plays. A lower third
   over a take is drawn with that stretch of the take inside its scene (the
   lower-third page explains FOOTAGE_FPS and extract) and placed on a track
   above the take for the same stretch. Video `insert_clip` needs a `layout`;
   full frame is `{x: 0, y: 0, width: 1000, height: 1000}`.
6. **Check.** Run the checks below and fix what fails.
7. **Hand it over.** Give the person `output.watch_url` from
   `graphics_status` (the graphics on their own) and say what the job cost
   (`usage.vcpu_seconds` at $0.03 per vCPU-minute). If they asked for the
   finished video, `quote`, then `render` the project and poll
   `render_status`, and give them that `output.watch_url` too.

## Checks

**`graphics_status`** passes when the job succeeded, `output.media` is set and
`output_seconds` equals the sum of the scenes' seconds.

**`frame`** on the project after placing, for each card: at its start + 0.1 s,
its middle, and its end - 0.05 s. It passes when the middle still shows every
word whole and readable inside the margins (and the 9:16 safe zones), and the
first and last stills show nothing half-drawn, clipped or stuck on screen.

If a check fails, fix the scene with `graphics_write`, render again (only the
changed scene is drawn), and swap the clip's media with an edit. Report what
you saw, never a score.

## After the first render

Changes come back as plain words ("make the title bigger", "the name is
wrong") or as comments on the project (`comments`). Each fix is a small
`graphics_write` patch to one scene, a new `make_graphics` (the other scenes
come from the cache) and a `swap_media` edit on the placed clips. To go back
to an earlier look, `graphics_write` with `restore` and the bundle from the
workspace's history.
