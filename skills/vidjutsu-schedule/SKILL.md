---
name: vidjutsu-schedule
description: Schedule finished VidJutsu videos to TikTok, Instagram and YouTube, spread over days at good times, with captions written for each platform, then report how they did. Use when the person asks to post, schedule, publish or auto-post videos, plan a posting calendar, or check a post's views. Needs the VidJutsu MCP server or CLI and a paid plan.
license: Apache-2.0
metadata:
  version: "1.0.0"
  creator: VidJutsu
---

# Schedule

Finished videos in, a posting calendar out. Posts go to the person's own
TikTok, Instagram and YouTube accounts through VidJutsu (the publishing partner
is Zernio). A post that has gone out can't be pulled back from here, so this
skill always shows the plan and waits for the person's yes before it schedules
anything.

## Defaults

| Setting | Default | Meaning |
| --- | --- | --- |
| `accounts` | every connected account | Each video goes to every account in `social_accounts` with state `connected`. |
| `per_day` | 1 | Videos per account per day. |
| `start` | tomorrow | The first day of the calendar. |
| `times` | 12:00 and 18:00 | Local times to post at, in the person's time zone. Ask the zone once if you don't know it. |
| `order` | the order given, else newest render first | Which video goes out first. |
| TikTok | `privacy_level` public, comments on, `ai_generated` false | Change only when the person says. |
| YouTube | `visibility` public, title from the hook | Title up to 100 letters. |
| Instagram | `ai_generated` false | |

## Steps

1. **Find the videos.** Use the renders the person names, or the latest
   succeeded render of each project they name (`renders`, then
   `render_status` must say succeeded). A file that is already stored can go by
   its `hash`. Never post a video that hasn't finished rendering.
2. **Find the accounts.** `social_accounts`. Use the ones with state
   `connected`.
   - None connected: `connect_account {platform}` and give the person `url`
     (or `handoff_url` to scan with a phone). The links last about 30 minutes.
     Wait until the account shows as connected.
   - `needs_reconnect` or `disconnected_unpaid`:
     `connect_account {social_account_id}` brings it back in one click.
   - `paused_unpaid`: say the subscription is past due and nothing posts
     until it's paid.
   - On the trial, `social_accounts` and `connect_account` answer 402
     `upgrade_required`: posting needs a paid plan. Give the person
     `upgrade_url` and stop.
3. **Write the captions.** Read each video's words (`timeline_words` on its
   project, or `media_transcript`). Write one caption per platform from what is
   actually said, in the speaker's voice:
   - TikTok and Instagram: the hook in the first line, under 150 letters
     before any hashtags, 3 to 5 specific hashtags at most.
   - YouTube Shorts: a title of up to 100 letters that names the payoff, and a
     short description.
   - Don't promise what the video doesn't show. Don't invent facts, numbers or
     quotes.
4. **Lay out the calendar.** Spread the videos over days at the default
   times. Never stack two posts to the same account within 3 hours. Show the
   person the plan as a short table: date and time (in their zone), video,
   accounts, and the caption. Ask once: "Schedule these?"
5. **Schedule on yes.** For each post: `schedule_post {media, accounts,
   caption, at, idempotency_key}`.
   - `media` is `{job_id}` of the render, or `{hash}` of a stored file.
   - `accounts` holds each id, with `{id, options}` where the platform needs
     them (YouTube always needs `title` and `visibility`).
   - `at` is ISO 8601 with a zone, such as `2026-12-01T18:00:00-05:00`. Leave
     it out only when the person asked to post now.
   - `idempotency_key` is `<project>-<platform list>-<date>`. Send the same
     key when you retry so nothing posts twice.
   - A post comes back `scheduled`, or `pending_approval` on an account that
     needs the owner's approval in the web app. Say which.
6. **Confirm.** `posts {state: "scheduled"}` and give the person the calendar
   as it now stands, with each post's id.

## Changing the plan

- Move one: `reschedule_post {at}`. `at: null` posts it now (ask first).
- Drop one: `cancel_post`. A post that already went out stays up; the person
  deletes it on the platform.
- An account that disconnects cancels its scheduled posts. Reconnect it, then
  schedule them again.

## After posting

`get_post` shows each account's state and the live `url` once it's
published; on `failed` or `partial`, report the `error` per account as it
reads. `post_stats` gives views, likes, comments, shares, saves, impressions
and reach. They are read about 1 hour, 24 hours and 7 days after a post goes
out, so early numbers can be empty. When asked how posts did, list them with
their 24-hour and 7-day views side by side, best first, and say what the top
ones have in common (hook, length, time). Report the numbers you read, never a
score.
