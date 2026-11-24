---
name: vidjutsu-clean-cut
description: Cut raw talking-head takes into a tight video with VidJutsu. Use when the person has one or more recordings of someone talking (camera, or screen plus camera) and wants dead air, false starts and repeated lines removed, checked and exported. Needs the VidJutsu MCP server or CLI.
license: Apache-2.0
metadata:
  version: "1.2.0"
  creator: VidJutsu
---

# Clean Cut

Raw talking-head takes in, a tight cut out.

You edit with VidJutsu's tools (the MCP server at https://api.vidjutsu.ai/mcp or the `vidjutsu` CLI); /vidjutsu-edit says how to connect. Use the defaults and don't ask first. The first export is the proposal: the
person reacts to a video, not to a list of questions. Ask only where a step
below says to.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `pause_seconds` | 0.6 | A silence this long or longer is cut. |
| `keep_pause_seconds` | 0.2 | What is left of each cut silence, so speech still breathes. |
| `studio_sound` | ask | Cleaning the voice costs money: say the price from `quote` and ask once. |
| `captions` | false | Burned-in captions are off unless the person asks. |
| `height` | 1080 | Export quality. 2160 only if the person asks for 4K. |
| `post` | off | Posting is optional: only when the person asks to post the cut. |

Keep the takes' own frame: a 16:9 take makes a 16:9 project. Make a 9:16
project (`init` with `canvas: "9:16"`) only when the takes are upright or the
person asks for a Short, Reel or TikTok.

## Steps

1. **Bring the takes in.** `ingest` each https link, or `create_upload` then
   `complete_upload` for a file. Keep each answer: its `hash` is the media id.
2. **Transcribe.** `make_transcript` for every take, then poll `render_status`
   until each job has ended. A cut is made from words, so every take needs one.
3. **Lay the takes out.** `init` a project. With one `edit`, `add_media` each
   take and `insert_clip` them end to end in the order the person gave (or the
   order recorded), picture on a video track and sound on an audio track. A
   video `insert_clip` needs a `layout`; full frame is
   `{x: 0, y: 0, width: 1000, height: 1000}`.
4. **Cut the pauses.** `timeline_words` with `pause: 0.6` lists every pause of
   at least `pause_seconds`. Send them all in one `edit` as a single
   `cut_pauses` operation, each range shortened by half of
   `keep_pause_seconds` at both ends (start + 0.1, end - 0.1) so 0.2 s stays.
   Ranges must be sorted and must not overlap. Give the edit a `summary` such
   as "Cut 41 pauses".
5. **Cut the false starts.** Read `timeline_words` again (times have moved).
   Cut, as one more `cut_pauses` edit:
   - a sentence that is started, dropped and started again: keep the last full
     version;
   - a line said twice in a row: keep the later take;
   - words to the crew ("okay", "let me do that again", "cut").
   Use the words' own `start` and `end` as the range. Leave filler words
   ("um", "you know") alone unless the person asks: cutting them all makes
   the picture jump. When unsure whether a line is a retake, keep it.
6. **Studio Sound (ask).** `quote` shows its price. Tell the person the price
   in one line and ask once. On yes, `studio_sound` and poll `render_status`.
7. **Check the cut.** Run both checks below and fix what fails before
   exporting. This is the step that makes the first export worth watching.
8. **Export.** `quote`, then `render` at `height: 1080`, then poll
   `render_status`. The person asked for a cut, so the export does not need a
   second go-ahead unless `quote` says the wallet would refuse it. Give the
   person `output.watch_url`, the length before and after, the number of cuts,
   and what the export cost.
9. **Post (optional).** Only when the person asks to post the cut. See
   [Post the cut](#post-the-cut).

## Checks

**`check`** on the cut revision. It passes when:

- `gaps` is empty, and there is no `no_sound` stretch (a hole left by a cut);
- `black` is empty;
- no `silence` run is longer than about 1 second (a pause you meant to cut);
- the mix's `true_peak_dbtp` is at or under -1.

**`frame`** at three to six of the cuts, at `t - 1/30` and `t` for each cut
time `t` (the frames either side of the cut). Pick the longest cuts. It passes
when no still is black and the speaker stays in frame across each cut. A hard
jump of the head is normal for a cut like this; a different shot is not.

If a check fails, fix it with `edit` (or `undo` the change that caused it)
and check again. Report measured values, never a score.

## Post the cut

Skip this unless the person asked to post. Posting puts the video in public,
so post only the export the person approved, with the caption and time they
gave or agreed to.

1. `social_accounts` lists the connected accounts. If the account they want is
   missing, `connect_account` with its `platform` (`tiktok`, `instagram` or
   `youtube`), send the person the `url` to sign in (or `handoff_url`, a QR
   code for their phone; both last about 30 minutes), and wait for them before calling `social_accounts` again. An account with a
   `reconnect_url` needs the same: send them that link.
2. `schedule_post` with `media: {job_id}` (the export's render job), the
   `caption`, the account ids in `accounts`, and `at` (an ISO time with a
   zone) when they gave one; leave `at` out to post now. A YouTube account
   needs a title (up to 100 letters) and explicit visibility: send
   `{id, options: {title, visibility}}` with `private`, `unlisted`, or `public`.
   If the person has not told you which, ask before scheduling; never assume.
   Send an `idempotency_key` so a retry doesn't post twice.
3. `get_post` shows where it is. Tell the person the time it goes out, or,
   once it is `published`, each target's `url`. A post `pending_approval`
   waits for the owner to review and approve that version in the VidJutsu web app;
   `paused_unpaid` waits for a payment; a `failed` or `partial` post's targets
   carry the `error` to report. `post_stats` gives the numbers later, if they
   ask.

A 402 `upgrade_required` means posting isn't in their plan: give them the
`upgrade_url` and stop.

## Styles

The first export is plain: a clean cut needs no graphics. If the person asks
for a title or a look, `styles` lists the looks and `get_style` says how one
is used. Pass it to `render` as `style`, for example
`{id: "terminal", title: {text: "..."}}`. A title card covers the first
seconds of the picture while the sound runs on, so either let the voice start
under it or open a gap first with an `insert_gap` edit. Put a stamp on a word
by using that word's own `start` from `timeline_words` as its `at`.

When the person has a saved look of their own (made with vidjutsu-style, kept
in the graphics workspace `style-<name>`) and asks for it, make the title card
from it with vidjutsu-motion-graphics instead of a built-in style.

## After the first export

Changes come back as plain words ("too tight", "you cut the bit about
pricing") or as comments on the project (`comments`). Each fix is an `edit`
or an `undo` of one change from `history`, then a new export. To loosen the
whole cut, `undo` the pause edit and redo step 4 with a larger
`keep_pause_seconds`.
