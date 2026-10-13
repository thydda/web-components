# @thydda/web-components

Reusable Web Components built with Lit and TypeScript, independent of Angular.
Vite generates the ES Module package and Vitest runs unit tests with jsdom.
Lit is a runtime dependency external to the bundle.

## Structure

```text
src/
  components/
    movie-search/
      movie-search.ts
      movie-search.test.ts
      movie.model.ts
      index.ts
      README.md
  index.ts              # Library public API
  register.ts           # Explicit registration of all components
  register.test.ts
```

The library currently contains one component. To add another, create
`src/components/<name>/` with `<name>.ts`, `<name>.test.ts`, `index.ts` and
`README.md`. Use the `thydda-` prefix for new tags; `<movie-search>` retains its
existing tag. Component-specific models stay alongside their component; add shared
modules only when they are actually reused. Export the API from `src/index.ts`
and add registration to `src/register.ts`.

## Development and validation

Requires Node.js 22.13 or later for the development tooling.

```sh
npm ci
npm run test:watch
npm run check
```

`npm run check` checks lint, formatting and TypeScript, requires a test file per component, runs all
tests and generates `dist/index.js` and `dist/types/`. A test file's existence does
not guarantee its quality: it must check observable behavior. jsdom does not verify
visual layout, contrast or every aspect of browser interaction.

## Consuming from Angular

First run `npm run build` here, then run this command from `mfe1/`:

```sh
npm install ../web-components
```

Register the required component before rendering it:

```ts
import { defineMovieSearch } from '@thydda/web-components';
defineMovieSearch();
```

You can also call `defineWebComponents()` to register the entire catalog.
Importing the library alone does not register elements. Registration functions
can be called repeatedly and check whether `customElements` is available.

Add `CUSTOM_ELEMENTS_SCHEMA` to `schemas` in the consuming Angular component.
Use property bindings for complex data: `<movie-search [movies]="movies" />`.
Listen to public events with `(movie-search:select)="onSelect($event)"` and validate
the `CustomEvent<MovieSearchSelectEventDetail>` type in the handler.

See [the movie-search contract](src/components/movie-search/README.md).
Angular's global styles do not cross Shadow DOM; the current component includes
Bootstrap inside its shadow root.

## Validation and local merges

```sh
npm run lint
npm run format:check
npm run test:unit
npm run check
```

`check` runs lint, format checking, unit tests without watch, tests of the merge script in temporary repositories, and a production build; the library also checks TypeScript and requires a test file per component. ESLint uses type-aware TypeScript rules; Angular repositories also lint inline/external templates and template accessibility. Formatting is checked separately with Prettier. Use `npm run format` to apply formatting deliberately.

Complete the applicable review checklist in [best-practices.md](best-practices.md) before merging. Automated checks do not certify architecture, usability or accessibility. Browser integration and keyboard/zoom/screen-reader checks are manual today; there is no automated e2e command.

From a clean `main` branch, after reviewing the feature:

```sh
npm run merge:main -- feature/my-change
```

This only accepts a local branch, prepares a merge with `--no-ff --no-commit`, validates the combined result, and commits locally only if checks pass. It does not push. If checks fail or conflicts occur, the merge stays uncommitted. Resolve and stage intended changes, then run:

```sh
npm run merge:main -- --continue
```

Or abort with `git merge --abort`. Failed commit hooks can also be corrected before continuing. Checks are repeated on every continuation; unstaged/untracked changes prevent completion. Other Git commands and GitHub can bypass this local flow; a pre-merge hook alone does not cover every merge mode.

GitHub Actions runs `npm ci` and `npm run test:unit` on pull requests targeting
`main`, testing the proposed merge result. Configure the `Unit tests` check as
required in GitHub branch protection to prevent merging when tests fail.

When a library contract changes, validate web-components and its mfe1 consumer. When federation or routes change, verify navigation through shell in a browser. Do not merge other repositories automatically as part of a check.

## Local skill

[web-components](.agents/skills/web-components/SKILL.md) contains conventions for
creating and testing this library's components. `AGENTS.md` instructs Codex to read
it for these tasks. It can be versioned with the project without global installation.

## References

- [Lit components](https://lit.dev/docs/components/overview/)
- [Vitest](https://vitest.dev/guide/)
- [Type-aware linting](https://typescript-eslint.io/getting-started/typed-linting/)
- [Git hooks](https://git-scm.com/docs/githooks)

## API 0.2.0

The public API uses Movie, the movies property and the { movie } selection payload.
Consumers must update their imports, bindings and handlers to these names.
mfe1 uses /movies and /movies/edit.

The component supports --app-accent, --app-ink, --app-muted and --app-border as host
CSS variables, with defaults for standalone use. Bootstrap remains encapsulated
inside Shadow DOM.
