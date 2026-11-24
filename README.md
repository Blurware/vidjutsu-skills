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
| [`vidjutsu-style`](skills/vidjutsu-style/SKILL.md) | Your brand as a saved look (colors, fonts, a title card and a lower third), shown as a sample and reused in every edit. |
| [`vidjutsu-schedule`](skills/vidjutsu-schedule/SKILL.md) | Finished videos onto TikTok, Instagram and YouTube: captions per platform, a posting calendar you approve, then how each post did. |

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
