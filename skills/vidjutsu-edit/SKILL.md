---
name: vidjutsu-edit
description: Edit raw footage into finished videos with VidJutsu. Use when the person says /vidjutsu-edit, or asks to edit, cut, clip or finish video (talking-head takes, a podcast, a screen recording, a long recording to cut into Shorts, Reels or TikToks) in a style. Raw footage in, finished videos out, rendered in the cloud.
---

# /vidjutsu-edit

Raw footage in, finished videos out. You do the editing with VidJutsu's tools;
VidJutsu stores the footage, keeps every edit in history and renders the
export in the cloud. You never encode video yourself.

Usage: `/vidjutsu-edit <footage> [into clips | into one video] [in <style>]`

- `/vidjutsu-edit ./raw/take1.mp4 ./raw/take2.mp4`
- `/vidjutsu-edit https://.../podcast-ep12.mp4 into 5 clips for TikTok`
- `/vidjutsu-edit ./raw/take.mp4 in blueprint-yapper`

## 0. Connect

Use whichever is already set up, in this order:

1. **MCP**: the VidJutsu tools (`ingest`, `init`, `edit`, `render`, ...) are
   in your tool list. Server: `https://api.vidjutsu.ai/mcp` (OAuth).
2. **CLI**: `vidjutsu` is on the path (`vidjutsu --help`). Install it with
   `curl -fsSL https://vidjutsu.ai/install.sh | sh`.
3. **REST**: `https://api.vidjutsu.ai` with `Authorization: Bearer $VIDJUTSU_API_KEY`.

None of them? Tell the person to connect VidJutsu (https://docs.vidjutsu.ai/mcp)
or sign up at https://vidjutsu.ai, then stop. The steps below name the MCP
tools; the CLI and REST have the same operations under the same names.

## 1. Read the ask

Decide three things from what the person said. Don't ask when it's clear;
use the defaults when it isn't. The first export is the proposal: people react
to a video better than to questions.

| Decide | Default |
| --- | --- |
| **Output**: one video (long form) or clips | One video. Clips when they say clips, Shorts, Reels, TikToks, or give a count. |
| **Frame** | The footage's own frame. 9:16 for clips meant for TikTok, Reels or Shorts. |
| **Look**: a style (VidJutsu's or their own) or plain | Plain. A style only when they name one or ask for a look. |

Then follow the recipe that fits, with its steps and defaults:

- talking-head takes: **vidjutsu-clean-cut**
  (https://vidjutsu.ai/.well-known/skills/vidjutsu-clean-cut/SKILL.md);
- title cards, lower thirds, animated segments: **vidjutsu-motion-graphics**
  (https://vidjutsu.ai/.well-known/skills/vidjutsu-motion-graphics/SKILL.md,
  with its starter files);
- making or changing the person's own style (colors, fonts, title card, lower
  third) and saving it with `save_style`: **vidjutsu-style**
  (https://vidjutsu.ai/.well-known/skills/vidjutsu-style/SKILL.md);
- posting or scheduling the finished videos to TikTok, Instagram or YouTube:
  **vidjutsu-schedule**
  (https://vidjutsu.ai/.well-known/skills/vidjutsu-schedule/SKILL.md).

If they're installed as skills, use them; otherwise read them at those links.
The recipe is the method; this skill only decides what goes in and what comes
out.

## 2. Bring the footage in

- An https link: `ingest {url, name}`.
- A local file: `create_upload {name, bytes, sha256}`, PUT each part, then
  `complete_upload`. With the CLI: `vidjutsu upload <file>`.
- Keep each answer's `hash`: it is the media id.
- `make_transcript` for every file with speech, and poll `render_status`
  until each job ends. Cuts, clips and captions are made from words.

Bring in only what the person gave you. Don't make or generate footage.

## 3. Edit

### One video (long form)

Follow the recipe: `init` one project, lay the takes out with one `edit`
(`add_media` + `insert_clip`, picture on a video track, sound on an audio
track, full-frame layout `{x: 0, y: 0, width: 1000, height: 1000}`), then the
recipe's cuts (pauses, false starts) with `timeline_words` and `cut_pauses`.

### Clips

1. Find the moments. Read the transcript (`media_transcript`, or
   `search_words` in a project) and pick self-contained moments of 20 to 60
   seconds: one idea each, a first line that hooks on its own, and an ending
   that lands. Use the count they asked for; otherwise 3 to 5.
2. One project per clip: `init {project: "<name>-clip-1", canvas: "9:16"}`
   (or their frame), then one `edit` that adds the media and `insert_clip`s
   only that moment (`source: {start, end}` from the words' own times, picture
   and sound with the same range). Reframe a 16:9 source with `set_layout`
   (`fit: "cover"`, `crop` on the speaker) so it fills the upright frame.
3. Run the recipe's cutting steps inside each clip.

Name projects so the person can find them: `<source>-cut`, `<source>-clip-1`.
Give each edit a one-line `summary`; it is what history shows.

## 4. Look

A style is a named look with its method, kept in the person's VidJutsu
account: VidJutsu's own (`global: true`) and the ones they saved. Read it by
name; don't guess what it looks like.

1. **Find it.** `styles` lists them (id, name, tagline, format, `ready`).
   Match the name the person said to an `id`. If none fits, say so in one
   line, list the closest, and use plain; don't invent a style id.
2. **Read it.** `get_style {style}` returns the look (palette and fonts by
   role), the `guide`, its `layouts`, its `kit` (the graphics files) and the
   starter `film`. **Follow the guide step by step**: it is the method for
   that style, and it overrides the generic steps here where they differ.
   When a style has its own skill (vidjutsu-blueprint-yapper), use that too.
3. **Use the kit.** `use_style {style, workspace}` copies the kit into a new
   graphics workspace (one per video, for example `<project>-graphics`) and
   answers the starter film. Change the words in the scenes with
   `graphics_write` `patch`. Set the film's `width` and `height` to the
   project's frame (`show` gives `canvas`: 1920x1080 for 16:9, 1080x1920 for
   9:16) when the style's film is drawn for the other one; a full-frame card
   in the wrong frame is letterboxed. Then `make_graphics {workspace, film}`, poll
   `graphics_status`, then place `output.media` with `add_media` and
   `insert_clip`. A style with `ready: false` has no kit yet: follow its guide
   with vidjutsu-motion-graphics.
4. **Lay out screen and camera**, only when the style has `layouts` and the
   project has both a screen and a camera track: `apply_layout {project,
   style}` (its first layout) or `{project, style, preset: "<layout name>"}`.
   A style without layouts (most saved brand looks) leaves the picture as it
   is.
5. **Your part.** VidJutsu stores and draws; it makes nothing with a model.
   Words, scripts, a cut-out of the speaker or a voice are yours to make with
   your own tools, then `ingest` them.

- **A new look**: when they ask for a look they don't have yet, make it with
  vidjutsu-style, which saves it with `save_style`.
- **Captions**: `render` with `captions {on: true}` when they ask, or for
  clips meant for social feeds.

## 5. Check, then export

1. Run the recipe's checks (`check`, and `frame` around the cuts). Fix what
   fails before anyone watches.
2. The person asked for the edit, so render without a second go-ahead: there
   is no price up front, and the render is billed after for the box time it used.
3. `render {project, idempotency_key, height: 1080}` (plus `captions`),
   then poll `render_status` until `succeeded`.
4. Give the person each `output.watch_url`, what you cut (length before and
   after), the style you used, and what it cost. The links last seven days and
   anyone with one can open it: say so.

A 402 `upgrade_required` names the plan limit and an `upgrade_url`: give
them both and stop.

## 6. Changes

Changes come back as words ("too tight", "lose the intro") or as comments in
the web app. Make each with `edit` (or `undo` a change from `history`), render
again and send the new link. For a back-and-forth on comments, follow the
review loop from `review_skill`. Post only when the person asks, and then
follow vidjutsu-schedule: it shows the calendar and waits for a yes.

## Rules

- Never render, re-encode or upload the result with local tools (FFmpeg and
  the like): `render` makes the file and the link.
- Every edit is undoable; nothing in history is lost. Prefer trying the cut
  to asking about it.
- Report measured values (lengths, cuts, price), not scores.
- When a call is refused, report its `reason` and `message`; don't call a
  feature broken without a call that shows it.
