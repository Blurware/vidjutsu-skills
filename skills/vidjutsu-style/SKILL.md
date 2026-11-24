---
name: vidjutsu-style
description: Turn a brand into a saved VidJutsu look (colors, fonts, a title card and a lower third), render a short sample, and save it to the account so every later edit reuses it. Use when the person asks for a style, a look, brand colors or fonts on their videos, or to save or change one. Needs the VidJutsu MCP server or CLI.
license: Apache-2.0
metadata:
  version: "1.0.0"
  creator: VidJutsu
---

# Style

A style is the look a person's videos share: colors, fonts, and how the title
card and lower third are drawn. This skill makes one, shows a sample, and
saves it to the person's VidJutsu account. vidjutsu-motion-graphics and
vidjutsu-clean-cut then start from it instead of the plain defaults.

Use the defaults and don't ask first. The sample is the proposal: the person
reacts to moving pictures, not to a list of questions.

## Where a saved style lives

A saved style is a graphics workspace named `style-<name>` (lowercase, words
joined with `-`, for example `style-max-show`). It holds:

| File | What it is |
| --- | --- |
| `style.json` | The look as data: `{name, colors: {bg, bg_glow, text, muted, accent, panel, panel_edge}, font: {family, file?}, radius, grain, notes}`. |
| `title/index.html` | The title card, in the look. |
| `lower-third/index.html` | The lower third, in the look. |
| `film.json` | The sample film: the title card then the lower third. |
| font and logo files | In each scene folder that uses them, added by hash. |

Workspaces keep every version, so a changed style can go back to an earlier
one with `graphics_write` `restore`. There is no list of workspaces: tell the
person the style's name, and when the agent has a memory, save the name there.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `name` | the person's brand or show name | The style is saved as `style-<name>`. |
| `font` | Inter | Inter, Inter Display, JetBrains Mono and Satoshi are installed. |
| `grain` | 0.1 | The film's grain effect. |
| `radius` | 12px | Corner of the lower third's box. |
| colors | the starter's grayscale | Replaced by the brand's colors when there are any. |

## Steps

1. **Read the brand.** Take what the person gave: hex colors, a font, a logo,
   a site or a few videos they like. For a video in the account, `frame` a
   few stills and read the colors off them. With nothing given, keep the
   starter's grayscale look and say so. Pick:
   - `bg` and `bg_glow`: the darkest brand color and a step lighter.
   - `text`: near-white on a dark `bg`, near-black on a light one.
   - `muted`: `text` at about 65% toward `bg`.
   - `accent`: the brand's strongest color. Text in it must stay readable
     on `bg`; if it doesn't, use it only for the kicker.
   - `panel`: `bg` at 94% opacity; `panel_edge`: `text` at 8% opacity.
2. **Start from the starter files.** They ship with vidjutsu-motion-graphics in
   `files/`: film.json, title/index.html and lower-third/index.html (also at
   https://vidjutsu.ai/.well-known/skills/vidjutsu-motion-graphics/files/film.json
   and the same path for the two pages). `graphics_list` the workspace
   `style-<name>` first: if it already has files, this is a change to a saved
   style, so patch those instead of starting over.
3. **Write the look.** Each page opens with a LOOK block of CSS variables
   (`--font`, `--bg`, `--bg-glow`, `--text`, `--muted`, `--accent`,
   `--panel`, `--panel-edge`, `--radius`). Set the same values in both pages,
   write `style.json` with them, and put the brand's name in each CONTENT
   block so the sample looks like theirs. A brand font goes in each scene
   folder as a `files` entry by hash, loaded with `@font-face` by relative
   path; `--font` names it first, with Inter after it. Send everything in one
   `graphics_write` (or `patch` entries on a saved style, with
   `expected_bundle`; on a 409, read again and redo the change).
4. **Render the sample.** `make_graphics` with the workspace, the film from
   film.json (its `effects` grain set to the style's), `name`
   "style-<name>-sample" and an `idempotency_key`. It is about 11 seconds and
   costs a few cents. Poll `graphics_status` until it ends. On "not
   repeatable" or a page error, fix the scene it names and render again.
5. **Check.** The sample passes when `graphics_status` succeeded and stills
   (from `output.watch_url`, or placed on a scratch project and read with
   `frame`) at the middle of each card show every word whole and readable,
   with the text clearly lighter or darker than what is behind it.
6. **Hand it over.** Give the person `output.watch_url`, the style's name
   (`style-<name>`) and what the job cost (`usage.vcpu_seconds` at $0.03 per
   vCPU-minute). Say it is saved and that later edits use it when they name
   it.

## Using a saved style

- **vidjutsu-motion-graphics**: when the person names a style, start from
  `style-<name>` instead of the starter files: `graphics_read` its title and
  lower-third pages and write them into the project's graphics workspace (font
  and logo files go across as `files` by the hashes `graphics_list` gives),
  then change only the words.
- **vidjutsu-clean-cut** and **vidjutsu-edit**: a cut "in my style" gets a
  title card from the saved style through vidjutsu-motion-graphics.

## Changing a style

"Make the accent orange" or "use our new font" is a `patch` to the LOOK block
in both pages and to `style.json`, then a new sample. Videos already rendered
keep the look they were made with; a project re-renders in the new look only
when its graphics are made again.
