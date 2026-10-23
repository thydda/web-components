# @thydda/web-components

**Latest version: 0.2.2** · [Release notes](CHANGELOG.md#api-022)

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

GitHub Actions installs dependencies with `npm ci` and runs `npm run check` on
pull requests targeting `main`, checking the proposed merge result. This validates
lint, formatting, types, merge-script tests, unit tests and the production build.
Configure the `Check` check as required in GitHub branch protection to prevent
merging when validation fails.

When a library contract changes, validate web-components and its mfe1 consumer. When federation or routes change, verify navigation through shell in a browser. Do not merge other repositories automatically as part of a check.

## Publishing to GitHub Packages

Run the following commands from this repository. The package is published as
`@thydda/web-components` to `https://npm.pkg.github.com`; `publishConfig` selects
that registry and `repository` links the package to `thydda/web-components`.

### Authentication

In GitHub account settings, open Developer settings → Personal access tokens →
Tokens (classic). Create a token with `write:packages` and `read:packages`.
The account must have permission to publish the package. The `repo` scope is not
needed just to publish this npm package.

```sh
npm login --scope=@thydda --registry=https://npm.pkg.github.com --auth-type=legacy
```

Enter your GitHub username and use the token as the password. Keep credentials
out of repository files and commits.

### Version and publication

Review `package.json` and check the versions already published:

```sh
npm view @thydda/web-components versions --json --registry=https://npm.pkg.github.com
```

Do not reuse a published version. A failed lookup can indicate missing access or
a network problem; confirm those before treating it as a first publication.
For a new release, update the version and lockfile together, for example:

```sh
npm version patch --no-git-tag-version
```

Choose `patch` for fixes, `minor` for compatible features and `major` for breaking
changes. Before 1.0, agree on the next version and document breaking API changes.
For the first publication, the current version can be used if it is available.
Review and commit the release changes before publishing from `main`.

```sh
npm run check
npm pack --dry-run
npm publish
```

Inspect the dry-run file list for `dist/index.js` and `dist/types/index.d.ts`.
`npm publish` also runs `prepublishOnly`, which executes `npm run check` again
against the code being published. The PR workflow already runs the same checks
in GitHub; it does not publish packages automatically.

Confirm publication using the version you released:

```sh
npm view @thydda/web-components@X.Y.Z version --registry=https://npm.pkg.github.com
```

### Installing in a consumer

Create a project `.npmrc` containing only the scope mapping:

```ini
@thydda:registry=https://npm.pkg.github.com
```

Authenticate with a token with `read:packages` and package access, then install
the published version (replace `X.Y.Z` with your release):

```sh
npm install @thydda/web-components@X.Y.Z --save-exact
```

GitHub Actions consumers also need authentication and package read access.

See [GitHub's npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Local skill

[web-components](.agents/skills/web-components/SKILL.md) contains conventions for
creating and testing this library's components. `AGENTS.md` instructs Codex to read
it for these tasks. It can be versioned with the project without global installation.

## References

- [Lit components](https://lit.dev/docs/components/overview/)
- [Vitest](https://vitest.dev/guide/)
- [Type-aware linting](https://typescript-eslint.io/getting-started/typed-linting/)
- [Git hooks](https://git-scm.com/docs/githooks)

## Release history

See [CHANGELOG.md](CHANGELOG.md) for release notes and API changes, including
[API 0.2.2](CHANGELOG.md#api-022).
