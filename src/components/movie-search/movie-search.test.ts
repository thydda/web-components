import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Movie } from './movie.model';
import { defineMovieSearch, MovieSearch } from './movie-search';

const movies: Movie[] = [
  {
    id: 1,
    title: 'Arrival',
    director: 'Denis Villeneuve',
    year: 2016,
    summary: 'A linguist works to communicate with visitors from another world.',
    poster: '/posters/arrival.jpg',
  },
  {
    id: 2,
    title: 'Moonlight',
    director: 'Barry Jenkins',
    year: 2016,
    summary: 'A young man searches for identity and connection in Miami.',
    poster: '/posters/moonlight.jpg',
  },
];

describe('movie-search custom element', () => {
  let element: MovieSearch;

  beforeEach(async () => {
    defineMovieSearch();
    element = document.createElement('movie-search') as MovieSearch;
    element.movies = movies;
    document.body.append(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('registers idempotently', () => {
    expect(() => defineMovieSearch()).not.toThrow();
    expect(customElements.get('movie-search')).toBe(MovieSearch);
  });

  it('provides a default placeholder', () => {
    expect(element.shadowRoot?.querySelector('input')?.placeholder).toBe(
      'Search by title, director or story…',
    );
  });

  it('provides a default label associated with the input', () => {
    const label = element.shadowRoot?.querySelector('label');
    expect(label?.textContent).toBe('Search movies');
    expect(label?.htmlFor).toBe(element.shadowRoot?.querySelector('input')?.id);
  });

  it('updates the label through its property and attribute', async () => {
    element.label = 'Find a movie';
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('label')?.textContent).toBe('Find a movie');
    expect(element.shadowRoot?.querySelector('section')?.getAttribute('aria-label')).toBe(
      'Find a movie',
    );
    element.setAttribute('label', 'Browse the collection');
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('label')?.textContent).toBe('Browse the collection');
    expect(element.shadowRoot?.querySelector('section')?.getAttribute('aria-label')).toBe(
      'Browse the collection',
    );
  });

  it('updates the placeholder through its property and attribute without changing the query', async () => {
    element.query = 'arrival';
    element.placeholder = 'Find your next movie';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input');
    expect(input?.placeholder).toBe('Find your next movie');
    expect(input?.value).toBe('arrival');

    element.setAttribute('placeholder', 'Search the collection');
    await element.updateComplete;
    expect(input?.placeholder).toBe('Search the collection');
    expect(input?.value).toBe('arrival');
    expect(element.shadowRoot?.querySelector('label')?.textContent).toBe('Search movies');
  });

  it('renders initial movies and labels the search control', () => {
    expect(element.shadowRoot?.querySelectorAll('article')).toHaveLength(2);
    const input = element.shadowRoot?.querySelector('input');
    expect(element.shadowRoot?.querySelector('label')?.htmlFor).toBe(input?.id);
  });

  it('renders empty data and responds to subsequent property updates', async () => {
    element.movies = [];
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[role="status"]')?.textContent).toContain(
      'No movies',
    );
    element.movies = [movies[1]];
    await element.updateComplete;
    expect(element.shadowRoot?.querySelectorAll('article')).toHaveLength(1);
    expect(element.shadowRoot?.querySelector('h2')?.textContent).toBe('Moonlight');
  });

  it.each(['  ARRIVAL  ', 'Villeneuve', 'linguist'])(
    'filters by normalized title, director or summary: %s',
    async (query) => {
      element.query = query;
      await element.updateComplete;
      expect(element.shadowRoot?.querySelectorAll('article')).toHaveLength(1);
      expect(element.shadowRoot?.querySelector('h2')?.textContent).toBe('Arrival');
    },
  );

  it('shows no matches and restores all movies when the query is cleared', async () => {
    element.query = 'no such movie';
    await element.updateComplete;
    expect(element.shadowRoot?.querySelectorAll('article')).toHaveLength(0);
    expect(element.shadowRoot?.querySelector('[role="status"]')).not.toBeNull();
    element.query = '';
    await element.updateComplete;
    expect(element.shadowRoot?.querySelectorAll('article')).toHaveLength(2);
  });

  it('continues to handle selection after disconnecting and reconnecting', async () => {
    element.remove();
    document.body.append(element);
    await element.updateComplete;
    const listener = vi.fn();
    document.body.addEventListener('movie-search:select', listener);
    try {
      element.shadowRoot?.querySelector('button')?.click();
      expect(listener).toHaveBeenCalledOnce();
      expect(listener.mock.calls[0][0]).toMatchObject({
        detail: { movie: movies[0] },
        bubbles: true,
        composed: true,
      });
    } finally {
      document.body.removeEventListener('movie-search:select', listener);
    }
  });

  it('filters movies and emits a bubbling results event', async () => {
    const listener = vi.fn();
    document.body.addEventListener('movie-search:results', listener);

    const input = element.shadowRoot?.querySelector<HTMLInputElement>('input[type="search"]');
    expect(input).not.toBeNull();
    if (!input) {
      throw new Error('Search input was not rendered');
    }

    input.value = 'arrival';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain('Arrival');
    expect(element.shadowRoot?.textContent).not.toContain('Moonlight');
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0]).toMatchObject({
      detail: { query: 'arrival', results: [movies[0]] },
      bubbles: true,
      composed: true,
    });

    document.body.removeEventListener('movie-search:results', listener);
  });

  it('emits the selected movie', () => {
    const listener = vi.fn();
    element.addEventListener('movie-search:select', listener);
    const button = element.shadowRoot?.querySelector('button');

    expect(button).not.toBeNull();
    button?.click();

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0]).toMatchObject({ detail: { movie: movies[0] } });
  });
});
