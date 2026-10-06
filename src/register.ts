import { defineMovieSearch } from './components/movie-search';

/** Explicit browser registration; importing the library has no registration side effects. */
export function defineWebComponents(): void {
  defineMovieSearch();
}
