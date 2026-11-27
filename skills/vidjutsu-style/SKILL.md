---
name: vidjutsu-style
description: Turn a brand into a saved VidJutsu look (colors, fonts, a title card and a lower third), render a short sample, and save it to the account so every later edit reuses it. Use when the person asks for a style, a look, brand colors or fonts on their videos, or to save or change one. Needs the VidJutsu MCP server or CLI.
license: Apache-2.0
metadata:
  version: "2.0.0"
  creator: VidJutsu
---

# Style

A style is the look a person's videos share: colors, fonts, and how the title
card and lower third are drawn. This skill makes one, shows a sample, and
saves it to the person's VidJutsu account with `save_style`. It then shows
up in `styles` next to VidJutsu's own, and every later edit reads it by name
with `get_style` and copies it with `use_style`.

Use the defaults and don't ask first. The sample is the proposal: the person
reacts to moving pictures, not to a list of questions.

## What a saved style holds

`save_style` keeps a style in the account, under an id made from its name
(`Max Show` is `max-show`). It holds:

| Part | What it is |
| --- | --- |
| kit | The files of a graphics workspace (`style-<name>`), by hash: `title/index.html`, `lower-third/index.html`, font and logo files in each scene folder that uses them. |
| `look` | `{palette: {bg, bg_glow, text, muted, accent, panel, panel_edge}, fonts: {display}, notes}`: colors as `#RRGGBB` (put opacity in the pages, not here). |
| `guide` | The method in plain steps, for the next agent: which scene is for what, what to change (the CONTENT block, SECONDS) and what to keep. |
| `film` | The sample film: the title card then the lower third. |
| `sample` | `{hash}` of the sample video. |
| `layouts` | Optional screen and camera layouts, if the look has one. |

Saving again under the same name makes a new version. The workspace keeps
every version of the files too, so `graphics_write` `restore` goes back.
Names of VidJutsu's own styles are taken. An API key needs the `styles`
scope; an agent's editing connection has it.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `name` | the person's brand or show name | The style's name; its workspace is `style-<name>`. |
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
   and the same path for the two pages). Check `styles` first: if the person
   already saved this style, this is a change, so `use_style {style,
   workspace: "style-<name>"}` (or `graphics_list` that workspace) and patch
   those files instead of starting over.
3. **Write the look.** Each page opens with a LOOK block of CSS variables
   (`--font`, `--bg`, `--bg-glow`, `--text`, `--muted`, `--accent`,
   `--panel`, `--panel-edge`, `--radius`). Set the same values in both
   pages, and put the brand's name in each CONTENT block so the sample looks
   like theirs. A brand font goes in each scene
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
6. **Save it.** `save_style {name, workspace: "style-<name>", guide, look,
   film, sample: {hash: <the sample's output.hash>}, format, tagline}`. Write
   the guide for an agent that has never seen the style: one line per step.
7. **Hand it over.** Give the person `output.watch_url`, the style's name and
   id, and what the job cost (`usage.vcpu_seconds` at $0.03 per vCPU-minute).
   Say it is saved to their account and that later edits use it when they
   name it.

## Using a saved style

Any agent on the account finds it in `styles`. `get_style {style}` returns
the look and the guide; `use_style {style, workspace}` copies the kit into a
new workspace and answers the film. vidjutsu-motion-graphics then changes
only the words and renders it; vidjutsu-clean-cut and vidjutsu-edit place it.

## Changing a style

"Make the accent orange" or "use our new font" is a `patch` to the LOOK block
in both pages of `style-<name>`, a new sample, and `save_style` again under the
same name with the new `look` (a new version). Videos already rendered
keep the look they were made with; a project re-renders in the new look only
when its graphics are made again.
