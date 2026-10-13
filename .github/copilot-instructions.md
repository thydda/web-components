# Repository instructions

Read `AGENTS.md`, `best-practices.md`, the library README and the affected component
documentation. Follow `.agents/skills/web-components/SKILL.md` for component work.

## Preparing a package release

- Follow the GitHub Packages publishing procedure in `README.md`.
- Review the package version in `package.json` and keep `package-lock.json` in
  sync. Use a patch for fixes, a minor for compatible features and a major for
  breaking changes; before 1.0, document breaking changes explicitly and agree
  on the next version. Do not bump the version on every unrelated PR.
- Verify the intended version has not already been published. Authentication or
  network failures do not mean a version is available.
- Verify the package name, repository and publishing registry point to
  `@thydda/web-components`, `thydda/web-components` and GitHub Packages.
- Run `npm run check` and inspect `npm pack --dry-run` before publication. Confirm
  the package includes its JavaScript entry point and TypeScript declarations.
- Preserve public contracts or document breaking changes and affected consumers.
- Never place tokens in repository files or output. Publishing requires an
  explicit user request; preparing or reviewing a release does not authorize it.
