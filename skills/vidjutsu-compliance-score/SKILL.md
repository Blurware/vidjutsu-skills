---
name: vidjutsu-compliance-score
description: Check a video against YouTube, TikTok, Instagram, Meta ads and FTC policy before posting, and score it 0 to 100 with a verdict and cited rules. Use before you post or schedule, or when someone asks whether a video is safe to post.
---

# Score a video against platform policy

VidJutsu gives you the policy rules, stills and the transcript. You do the judging: VidJutsu runs no model.

## 1. Pick the rules

Ask which platforms the video goes to (or read the post's targets). Then call `policies {platform}` once, for example `{platform: "youtube,tiktok"}`. Add `surface: "ad"` for paid ads, `"organic"` for normal posts; add `ftc` when a US audience sees a sponsorship, an affiliate link, a review or a product claim. A platform's whole set is 10 to 20 thousand tokens, so read it all and keep it for the session: over REST, send the ETag back as If-None-Match and a 304 means nothing changed.

## 2. Look and listen, cheaply first

1. `show {project}` for the length and what is on the timeline.
2. The words: `timeline_words {project}` (what is said in the cut). If a clip has no transcript yet, `make_transcript` its media first.
3. The pictures: `frame {project, times}` with up to 24 times per call, one every 2 to 3 seconds for a short (every 10 to 20 for long-form), plus both sides of every cut. Poll `render_status` for the stills.
4. Zoom in only where it matters: more frames around anything that looks risky (a body, a product, a claim on screen, a logo, a child, a weapon).
5. Read on-screen text in the stills, and the caption and hashtags you plan to post.

## 3. Judge against every rule

Go through the rules once, against the whole video. Flag a violation only when you can point at evidence: a timestamp with the words said or the thing shown. Lean towards flagging (a missed violation costs more than a borderline flag), especially for:
- profanity or insults in an ad,
- health, weight-loss, cosmetic or medical claims, including hedged ones ("feel better in 7 days"), and before/after comparisons,
- money promises ("guaranteed returns", "get rich", "insider"),
- minors appearing near anything risky,
- undisclosed sponsorships, affiliate links or AI-made realistic people and events,
- reused or mass-produced content with nothing added.

Every violation cites a rule id from `policies`, exactly as given. Never invent a rule; if nothing fits, it isn't a violation.

Give each violation a severity:
- **critical**: the platform removes it outright or bans for it (child safety, violent threats, dangerous challenges, hate).
- **high**: removal or ad rejection is likely (misleading health or money claims, nudity, undisclosed paid promotion).
- **medium**: age restriction, limited ads or reach, or a needed label is missing.
- **low**: a style or quality issue a reviewer may object to.

## 4. Score

Risk score = sum of weights, capped at 100: low 1, medium 5, high 15, critical 40.

Verdict:
- **likely-violation**: any critical, or score 80 or more
- **high-risk**: score 40 to 79
- **caution**: score 10 to 39
- **safe**: under 10

## 5. Report

Answer in this shape, one block per platform:

```json
{
  "platform": "tiktok",
  "risk_score": 20,
  "verdict": "caution",
  "violations": [
    { "rule_id": "tiktok:ads-misleading-false:misleading-claims", "severity": "high",
      "explanation": "Says the cream removes wrinkles in 3 days.",
      "evidence": { "time": 4.5, "said": "gone in three days", "shown": "before/after split screen" },
      "fix": "Cut 3.0-6.5 or say results vary." }
  ],
  "policy_version": "2026-11-24"
}
```

Then tell the person in plain words what to change, with times, and offer to make the cuts (`edit`) and check again. Say that this is informational, not legal advice, and that the platforms decide.
