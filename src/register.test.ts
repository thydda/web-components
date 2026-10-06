import { describe, expect, it } from 'vitest';
import { defineWebComponents, MovieSearch } from './index';

describe('library registration', () => {
  it('registers all components idempotently through the public API', () => {
    defineWebComponents();
    expect(() => defineWebComponents()).not.toThrow();
    expect(customElements.get('movie-search')).toBe(MovieSearch);
  });
});
