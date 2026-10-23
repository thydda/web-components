# Changelog

Release notes and public API changes for `@thydda/web-components`.

## API 0.2.2

### Movie selection

- Add the reactive `selectedMovieIds: number[]` property, which defaults to `[]`.
  Consumers supply selected movie IDs and assign a new array to update the view.
- Extend `MovieSearchSelectEventDetail` with `selected: boolean`. The
  `movie-search:select` event now emits `{ movie, selected }`, where `selected`
  is the requested next state: `true` to select, `false` to unselect.
  The event continues to bubble and cross Shadow DOM boundaries.
- Display `Select` or `Unselect` in each movie button and set `aria-pressed`
  according to the selection supplied by the consumer. Filtering preserves
  selection by movie ID.

### Consumer updates

Handle `event.detail.selected` and update `selectedMovieIds` in response. Clicking
only requests a selection change; the component does not update the array itself.
Existing handlers that construct `MovieSearchSelectEventDetail` values must include
its new required `selected` field.

The event's `movie` object also includes its current selection state at runtime.
Use the top-level `selected` field for the requested next state; the public
`movie` field remains typed as `Movie`.

### Tests

Unit tests cover default selection, reactive updates, selection across filtering,
selection and deselection event payloads, event propagation, reconnection and
preservation of the original movie data.

## API 0.2.0

The public API uses `Movie`, the `movies` property and the `{ movie }` selection
payload. Consumers must update their imports, bindings and handlers to these names.
The `mfe1` consumer uses `/movies` and `/movies/edit`.

The component supports `--app-accent`, `--app-ink`, `--app-muted` and `--app-border`
as host CSS variables, with defaults for standalone use. Bootstrap remains
encapsulated inside Shadow DOM.
