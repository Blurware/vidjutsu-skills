---
name: vidjutsu-motion-graphics-yapper
description: Make a Motion Graphics Yapper short with VidJutsu, a 9:16 reel where a presenter talks in a window under animated UI cards that show the tool, repo or library being shared. Use when the person asks for a Yapper, a "this tool does X" short, or a short about a resource. Recreates one proven reel near verbatim, ships the look and eight starter scenes. Needs the VidJutsu MCP server or CLI.
license: Apache-2.0
metadata:
  version: "1.0.0"
  creator: VidJutsu
---

# Motion Graphics Yapper

A 9:16 short, 35 to 50 seconds, about one resource someone can use today: a
tool, a GitHub repo, a library of skills or prompts. The presenter talks in a
rounded window at the bottom of the frame. Above them, UI cards drawn in code
show what they are talking about (the repo card, the command that installs it,
the list of what's inside, the result). Every few seconds the cards take the
whole screen, then the presenter comes back. The last beat is the presenter
full frame with the call to action in a pill.

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
| `files/kit/yap.css`, `files/kit/yap.js` | The kit: layout, captions, eight card types, motion. Every scene loads it. |
| `files/kit/fonts/` | Bricolage Grotesque, Inter, Instrument Serif italic, JetBrains Mono (all SIL OFL 1.1). |
| `files/scenes/01-hook` ... `08-cta` | Eight starter scenes, one per beat, from the sample. |
| `files/film.json` | The sample's film: 1080x1920, the eight scenes and their seconds. |
| `preset.json` | The gallery entry (name, use, category, tags, sample). |

The starter files are also at
`https://vidjutsu.ai/.well-known/skills/vidjutsu-motion-graphics-yapper/files/<path>`.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `canvas` | 9:16 | `init` the project with `canvas: "9:16"` (1080x1920). |
| `length` | 35 to 50 s | After pauses are cut. About 130 to 150 spoken words. |
| `beats` | 7 to 9 | One scene per beat, 2.5 to 6.5 s each. |
| `pause_cut` | 0.3 s | Pauses this long or longer are cut, keeping 0.08 s at each side. |
| `look` | paper | Light grid ground. `ink` is the dark variant. |
| `accent` | `#2F6BFF` | One accent color per page. |
| `fps` | 30 | Film frame rate. `subframes` 1 (the moves are short pops). |

## The presenter

Two ways, both fine; ask once if the person hasn't said which:

1. **On camera.** The person records the script in one take, phone upright,
   face in the top half of the frame. Sound and picture are the same file.
2. **Avatar.** A talking-head video made from a still and a voice track with
   the tools the person's own agent uses (any lip-sync or avatar model). The
   voice is its own audio file and carries the sound; the avatar video is picture only.
   VidJutsu doesn't generate media: it edits and renders what you bring.

Either way the presenter's face must sit in the top half of the source, so
the window crop below shows it.

## Steps

1. **Pick the reference.** One reel, 3x or more its account's median views,
   in this format (presenter plus UI cards about one resource). Start from
   [references.md](references.md), or from the person's own bank of
   outliers. Write down its link, views and multiple of the median.
2. **Write the script near verbatim.** Keep the reference's beats in order,
   its sentence lengths and its turns of phrase ("Here's how you can...",
   "It's called...", "And the best part?"). Change only what must change: the
   resource, its numbers, what it does. Save it as a table, one row per beat:
   `Beat | Reference line | Our line`, then two lines under it: **Took** (what
   you kept) and **Changed** (what you swapped and why). Every number on
   screen must be true today: check stars, counts and prices at the source.
3. **Pick the call to action.** Rotate per page, per week:

   | Ask | Times a week | Last line |
   | --- | --- | --- |
   | Comment a keyword, get the link by DM | 3 | "comment KEYWORD down below and I'll DM you the link" |
   | DM me a keyword | 1 | "DM me KEYWORD and I'll send it over" |
   | Check the pinned comment | 1 | "the link is in the pinned comment" |
   | Follow for more | 2 | "follow for more tools like this" |

   On YouTube Shorts there are no DMs: swap keyword and DM asks for the
   pinned comment.
4. **Bring the presenter in.** `create_upload` + `complete_upload` (or
   `ingest` for a link) for the take, or for the voice and the avatar video.
   `init` the project with `canvas: "9:16"`; it starts in Editing.
5. **Lay it out and cut the pauses.** One `edit`: `add_media` each file,
   `add_track` `v2` and `v3` (video), then:
   - **Avatar:** the voice on `a1` from 0, the avatar video on `v2` from 0
     for the voice's length (a video clip on a video track plays no sound;
     the voice carries it). **On camera:** the take on `v2` from 0 (its sound
     plays from the clip).
   - Every video clip needs a `layout`; start with full frame
     `{x: 0, y: 0, width: 1000, height: 1000, fit: "cover"}`. Layout numbers
     are whole numbers on the 1000x1000 grid, and times are strings
     (`"12.5"`) or whole seconds.

   Then `make_transcript` on the voice (or the take), poll `render_status`,
   and `timeline_words` with `pause: 0.3`. Send every pause as one
   `cut_pauses` edit (`{op: "cut_pauses", ranges: [{start: "5.6", end:
   "5.96"}, ...]}`), each range shortened by 0.08 s at both ends. It cuts
   all tracks at once, so voice and lips stay together. Read
   `timeline_words` again: these post-cut times are the ones the scenes use.
6. **Cut it into beats.** Split the post-cut words into 7 to 9 beats on
   sentence ends. Each beat gets a layout, and they alternate so the screen
   changes every 3 to 6 seconds:

   | Beat | Layout | What's on screen |
   | --- | --- | --- |
   | Hook | split | Title with the promise, a card that shows the result. |
   | Name | card | The resource: logo card or repo card, plus what's inside. |
   | Setup | split | The install, as a terminal card typing the real command. |
   | Mechanism | card | How it works, as a meter or list. |
   | Payoff | split | Two real asks and what happens. |
   | Best part | card | The surprising fact, as a header and a meter or stat. |
   | Proof | split | The repo card with its real star count, "Free". |
   | CTA | face | Presenter full frame, the ask in a pill. |

   The first beat starts at 0 and the last ends at the cut's length. A
   scene's `seconds` is its beat's length. Beats that are one short sentence
   (2.5 s) are fine: they keep the pace up.
7. **Build the scenes.** For each beat, copy the starter scene closest to it
   and change its `Yap.scene({...})` config (see [The scene
   config](#the-scene-config)). Captions come from the post-cut words, minus
   the beat's start: 1 to 3 words each, broken on punctuation, with the one
   word that matters marked `*word*`. Never show a real app, terminal, repo
   page or dashboard as a screenshot or recording: every card is drawn by the
   kit from text.
8. **Send the files.** Name the workspace `<project>-graphics`. Each scene is
   served on its own, so every scene folder holds its own copy of the kit:
   `<scene>/index.html`, `<scene>/kit/yap.css`, `<scene>/kit/yap.js`,
   `<scene>/kit/fonts/*.woff2`. `graphics_write` lists every path with its
   sha256; identical files upload once, so PUT only the ones it says are
   missing.
9. **Render the graphics.** `make_graphics` with the workspace, the film
   (`files/film.json` with your scenes and seconds), `name`
   `<project>-graphics`, an `idempotency_key` and the project. Poll
   `graphics_status`. On "not repeatable" or a page error, fix the scene it
   names (the error gives `t`) and render again: unchanged scenes come from
   the cache. `output_seconds` must equal the cut's length.
10. **Place it.** One `edit`:
    - `add_media` the graphics, `insert_clip` it on `v1` from 0 for the whole
      cut, full frame. It is opaque: it is the ground, the cards, the
      captions and the window's frame.
    - The presenter on `v2` is drawn over it. `set_layout` on `v2` per beat
      range:
      - **split:** the window, `{x: 56, y: 604, width: 889, height: 328,
        shape: "rounded", radius: 24, fit: "cover", crop: {x: 0, y: 180,
        width: 1000, height: 387}, cut: true}`. The crop is a box of the
        source with the window's shape (387 tall for a 9:16 source); move its
        `y` so the face fills the window with a little headroom.
      - **card:** `{x: 0, y: 0, width: 1000, height: 1000, hidden: true}`.
      - **face:** full frame `{x: 0, y: 0, width: 1000, height: 1000,
        fit: "cover"}`. From the window it glides to full frame (a third of a
        second), which reads as a push-in.
    - The CTA pill on `v3`: a second clip of the graphics, source from the
      CTA scene's start for as long as is left, placed at the moment the
      presenter says the ask (the keyword), with layout `{x: 111, y: 630,
      width: 778, height: 125, crop: {x: 111, y: 630, width: 778,
      height: 125}, shape: "rounded", radius: 120}`. The pill pops in at the
      start of its clip.
11. **Check.** Run the checks below and fix what fails.
12. **Render and hand it over.** `render` the project and poll
    `render_status`, then `set_review_state` `ready_for_review`. Give the person
    `output.watch_url`, the reference it recreates, the script table, and
    what the graphics and render jobs cost (`usage.vcpu_seconds` at $0.03 per
    vCPU-minute).

## The scene config

A scene page loads the kit and calls `Yap.scene(cfg)` once:

```html
<link rel="stylesheet" href="kit/yap.css">
<script src="kit/yap.js"></script>
<script>
Yap.scene({
  seconds: 6.1, layout: "split",
  title: {text: "Claude makes [Word docs] like Anthropic", at: 0, until: 5.2},
  cards: [{type: "repo", at: 0.1, owner: "anthropics", name: "skills",
           desc: "Public repository for *Agent Skills*", stars: 200935,
           starsFrom: 150000, countFor: 3.2, lang: "Python"}],
  notes: [{text: "Free", x: 760, y: 420, at: 1.2, rot: -6}],
  captions: [[0.06, 0.5, "and it's *free*"], [0.56, 1.1, "on GitHub"]]
});
</script>
```

Times are seconds inside the scene. Text marks: `[boxed]` (accent box),
`*flair*` (serif italic in the accent), `^accent^` (accent color).

| Key | Meaning |
| --- | --- |
| `seconds` | The scene's length; equal to its `seconds` in the film. |
| `layout` | `split` (cards over the presenter window), `card` (cards full screen), `face` (presenter full frame; the page only draws the CTA pill). |
| `look`, `accent` | `"ink"` for the dark ground; a hex accent for this page. |
| `title` | `{text, at, until}`: the header at the top. |
| `cards` | Each `{type, at, until?, x?, y?, scale?, ...}`; one card shows at a time unless you place them with `x`, `y`. |
| `notes` | Hand-placed stickers `{text, x, y, at, until?, rot?}`. |
| `captions` | `[start, end, text]`, 1 to 3 words. Omit on `face`. |
| `cta` | On `face`: `{lead: "comment", keyword: "SKILLS"}`. |
| `cursor`, `cursorUntil` | A pointer `[{at, x, y, click?, travel?}]` that moves and clicks. |

Card types and their keys:

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
| `compare` | `a {title, items}`, `b {title, items}` |

The kit follows the renderer's rules for you (every property set from `t`
alone, a layer on everything that moves, fonts loaded before the first
frame). If you add your own elements, follow the rules in the
vidjutsu-motion-graphics skill.

## Checks

**Script.** The table has a reference line for every beat, and Took and
Changed are filled in. Every number on screen was checked at its source
today.

**Graphics.** `graphics_status` succeeded and `output_seconds` equals the
cut's length (within one frame).

**Frames.** `frame` at 0.1 s into each beat, at its middle, and 0.05 s before
its end, plus one still a frame after the pill comes in. It passes when:
- On split beats the face is whole in the window, eyes in its top third, and
  nothing of the presenter shows outside the window's frame.
- On card beats no presenter shows at all.
- Captions and headers are whole and inside the frame's safe zone (120 px at
  the sides, nothing important under y 1600 except the window).
- The pill on the CTA reads as one clean shape, no ground showing at its
  corners.

**Sync.** Watch the render once with sound: lips match the voice from first
word to last, and every card lands on the word that names it.

If a check fails, fix the scene with a `graphics_write` patch, render the
graphics again (only that scene is drawn), and `swap_media` the clips on
`v1` and `v3`. Report what you saw, never a score.

## After the first render

Changes come back as words or as comments (`comments`). A wording or card fix
is a patch to one scene. A different line from the presenter means a new take
(or a new voice and avatar) and a new cut: redo steps 4 to 10.
