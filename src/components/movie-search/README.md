# movie-search

Movie search component with Bootstrap styles encapsulated in Shadow DOM.

The Web Awesome app-indicator icon uses an embedded SVG imported from bootstrap-icons.
Consumers do not need to serve `/assets/icons/` or configure a Web Awesome base path
for this icon.

## Public API

- Tag: `<movie-search>`; explicit registration: `defineMovieSearch()`.
- Property `movies: Movie[]`, initially empty. Assign a new array to update it.
- Property `selectedMovieIds: number[]`, initially empty. Assign a new array of
  selected IDs to update button labels and `aria-pressed`. The consumer owns this
  state; clicks request a change without modifying this array.
- Property/attribute `query: string`, initially empty.
- Property/attribute `placeholder: string`, defaulting to
  `Search by title, director or story…`. It can be changed at any time to update
  the input hint without changing the query or its label.
- Property/attribute `label: string`, defaulting to `Search movies`. Sets the visible
  input label and the section's accessible name. Use non-empty text.
  Constructor values are defaults; consumer properties and attributes override
  them and update the view.
- `Movie`: `readonly id: number`, `title`, `director`, `year`, `summary`, `poster`.
  The ID is required and preserved in search and selection events.
- Event `movie-search-results`: `CustomEvent<MovieSearchResultsEventDetail>` with
  `{ query, results }`, emitted when the user types in the search box.
- Event `movie-search-select`: `CustomEvent<MovieSearchSelectEventDetail>` with
  `{ movie, selected }`. The top-level `selected` is the requested next state:
  `true` to select and `false` to unselect. Update `selectedMovieIds` in response.

Both events use `bubbles: true` and `composed: true`. Filtering searches titles,
directors and summaries, ignoring case and trimming the query's surrounding spaces.
Setting `query` programmatically updates the view without emitting a search event.

```ts
import { defineMovieSearch, type Movie } from '@thydda/web-components';
defineMovieSearch();
const element = document.createElement('movie-search');
const movies: Movie[] = [
  {
    id: 1,
    title: 'Arrival',
    director: 'Denis Villeneuve',
    year: 2016,
    summary: 'A linguist communicates with visitors.',
    poster: '/posters/arrival.jpg',
  },
];
Object.assign(element, { movies });
document.body.append(element);
```

In Angular, bind a signal to change the text dynamically:

```html
<movie-search
  [movies]="movies()"
  [placeholder]="searchPlaceholder()"
  [label]="searchLabel()"
></movie-search>
```

## Tests

Run `npm test -- src/components/movie-search/movie-search.test.ts` from the library
root. Tests cover registration, empty data, reactive changes, filtering, restoring
results, events and reconnection. They do not replace visual checks in a browser.
