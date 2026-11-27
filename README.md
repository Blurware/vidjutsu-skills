# VidJutsu skills

Agent skills for editing video with [VidJutsu](https://vidjutsu.ai). Each skill
is a folder with a `SKILL.md` (and any files it ships with) that teaches an
agent such as Claude Code, Codex, OpenClaw or Grok one way of making video
with VidJutsu's tools.

| Skill | What it does |
| --- | --- |
| [`vidjutsu-edit`](skills/vidjutsu-edit/SKILL.md) | Raw footage in, finished videos out: reads the ask, brings the footage in, picks a recipe, checks and renders. Say `/vidjutsu-edit`. |
| [`vidjutsu-clean-cut`](skills/vidjutsu-clean-cut/SKILL.md) | Raw talking-head takes in, a tight cut out: dead air, false starts and repeated lines removed, then checked and exported. |
| [`vidjutsu-motion-graphics`](skills/vidjutsu-motion-graphics/SKILL.md) | Title cards, lower thirds and animated segments written as HTML scenes and drawn in the cloud, with starter files. |
| [`vidjutsu-blueprint-yapper`](skills/vidjutsu-blueprint-yapper/SKILL.md) | A 9:16 Yapper short in the Blueprint style: a presenter in a rounded window whose head breaks out over its top edge, under animated cards about one tool, repo or library, recreated from a proven reel. Ships the look and eleven real-page starter scenes. Say `/vidjutsu-edit <take> blueprint-yapper`. |
| [`vidjutsu-style`](skills/vidjutsu-style/SKILL.md) | Your brand as a style saved to your VidJutsu account (colors, fonts, a title card and a lower third, and the steps to use them), shown as a sample and reused in every edit with `get_style` and `use_style`. |
| [`vidjutsu-schedule`](skills/vidjutsu-schedule/SKILL.md) | Finished videos onto TikTok, Instagram and YouTube: captions per platform, a posting calendar you approve, then how each post did. |
| [`vidjutsu-compliance-score`](skills/vidjutsu-compliance-score/SKILL.md) | A video checked against YouTube, TikTok, Instagram, Meta ads and FTC policy before posting: a 0 to 100 score, a verdict and the rules it cites. |
| [`vidjutsu-ftc-disclosure`](skills/vidjutsu-ftc-disclosure/SKILL.md) | Whether a video needs an ad, sponsorship, affiliate or AI disclosure for US viewers, and the disclosure written and placed. |

## Install

```sh
npx skills add https://vidjutsu.ai
```

That installs every skill below, with no GitHub sign-in: vidjutsu.ai
publishes a pinned copy of this repository at
`https://vidjutsu.ai/.well-known/skills/index.json`.

No terminal? Tell your agent: `Read https://vidjutsu.ai/skill.md and save it as
a skill named vidjutsu-edit.`

The skills need VidJutsu connected: the MCP server at
`https://api.vidjutsu.ai/mcp`, or the `vidjutsu` CLI. See
[docs.vidjutsu.ai/skill](https://docs.vidjutsu.ai/skill).

## Contributing

A skill is `skills/<name>/SKILL.md` with `name` and `description` in its
front matter, plus any files it ships with. Keep tool names to the ones the
VidJutsu MCP server lists. vidjutsu.ai picks up a change when its pinned
commit is moved forward.

## License

[Apache-2.0](LICENSE).
