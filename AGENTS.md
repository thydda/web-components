# web-components instructions

This repository owns reusable Lit custom elements and their public models, properties, attributes, events and theme tokens. Keep Angular-specific integration out of component implementation. Preserve the movie-search tag; use thydda- for new tags. Registration is explicit and idempotent.

## Working rules

Read README.md and best-practices.md before planning, implementing or reviewing changes. Read affected feature/component documentation and the relevant local skill.

Preserve public contracts unless the task changes them explicitly. Document breaking changes and verify affected consumers. Use the installed framework versions; distinguish implemented behavior from recommendations and future work.

Before declaring changes ready to merge, run `npm run check` and review the applicable checklist in best-practices.md. Report commands, results, manual checks and anything that could not run. Do not skip failed checks or weaken rules merely to obtain a passing result.

Prioritize behavioral regressions, contract compatibility, async failures and accessibility during review. Explain findings with a location, triggering scenario and impact. Formatting belongs to Prettier; automated code rules belong to ESLint.

Use the local merge workflow in README.md. There is no CI. Local validation does not enforce merges through other Git commands or GitHub. This instruction requires validation; it does not authorize an agent to commit, merge or push without a user request.

Use [.agents/skills/web-components/SKILL.md](.agents/skills/web-components/SKILL.md) for relevant implementation and review tasks.
