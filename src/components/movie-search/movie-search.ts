import { css, html, LitElement, unsafeCSS } from 'lit';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline';
import type { Movie } from './movie.model';

export interface MovieSearchResultsEventDetail {
  query: string;
  results: Movie[];
}

export interface MovieSearchSelectEventDetail {
  movie: Movie;
}

export class MovieSearch extends LitElement {
  static properties = {
    movies: { attribute: false },
    query: { type: String },
    placeholder: { type: String },
    label: { type: String },
  };

  static styles = [
    unsafeCSS(bootstrapCss),
    css`
      :host {
        --bs-primary: var(--app-accent, #2455a4);
        --bs-primary-rgb: 36, 85, 164;
        --bs-secondary: #6c757d;
        --bs-secondary-rgb: 108, 117, 125;
        --bs-success: #198754;
        --bs-danger: #dc3545;
        --bs-warning: #ffc107;
        --bs-info: #0dcaf0;
        --bs-light: #f8f9fa;
        --bs-dark: #212529;
        --bs-body-color: var(--app-ink, #18263b);
        --bs-body-bg: #fff;
        --bs-body-font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        --bs-body-font-size: 1rem;
        --bs-body-font-weight: 400;
        --bs-body-line-height: 1.5;
        --bs-border-color: #dee2e6;
        display: block;
        color: var(--bs-body-color);
        font-family: var(--bs-body-font-family);
      }

      .movie-search {
        padding: 0;
      }

      .search-panel {
        padding: 1.25rem;
        border: 1px solid var(--app-border, #d9e0e9);
        border-radius: 1rem;
        background: #fff;
        margin-block-end: 1.5rem;
      }

      .form-label {
        font-weight: 650;
      }
      .form-control {
        min-block-size: 2.75rem;
        border-color: #8794a5;
        border-radius: 0.6rem;
      }
      .form-control:focus {
        border-color: var(--bs-primary);
        box-shadow: 0 0 0 0.2rem rgb(36 85 164 / 15%);
      }
      .result-count {
        color: var(--app-muted, #526176);
        margin: 0.75rem 0 0;
        font-size: 0.875rem;
      }
      :focus-visible {
        outline: 3px solid var(--bs-primary);
        outline-offset: 3px;
      }
      .empty-state {
        padding: 2rem;
        border: 1px dashed #8794a5;
        border-radius: 1rem;
        background: #fff;
        text-align: center;
      }
      .card-title {
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .movie-meta {
        color: var(--app-muted, #526176);
        font-size: 0.875rem;
      }
      .card-body {
        padding: 1.25rem;
        gap: 0.5rem;
      }
      .select-movie {
        min-block-size: 2.75rem;
        --bs-btn-bg: var(--bs-primary);
        --bs-btn-border-color: var(--bs-primary);
        --bs-btn-hover-bg: #193f7c;
        --bs-btn-hover-border-color: #193f7c;
        --bs-btn-active-bg: #193f7c;
        --bs-btn-active-border-color: #193f7c;
        border-radius: 0.6rem;
        font-weight: 600;
        white-space: normal;
      }

      .movie-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
        gap: 1.5rem;
      }

      .movie-card {
        overflow: hidden;
        border: 1px solid var(--app-border, #d9e0e9);
        border-radius: 1rem;
        box-shadow: 0 4px 16px rgb(24 38 59 / 5%);
      }

      .movie-poster {
        inline-size: 100%;
        aspect-ratio: 2 / 3;
        object-fit: cover;
        background: var(--bs-light);
      }

      .movie-summary {
        color: var(--app-muted, #526176);
        font-size: 0.875rem;
      }
    `,
  ];

  declare movies: Movie[];
  declare query: string;
  declare placeholder: string;
  declare label: string;

  constructor() {
    super();
    this.movies = [];
    this.query = '';
    // Defaults; consumer properties/attributes override them after construction.
    this.placeholder = 'Search by title, director or story…';
    this.label = 'Search movies';
  }

  private get filteredMovies(): Movie[] {
    const query = this.query.trim().toLocaleLowerCase();
    if (!query) {
      return this.movies;
    }

    return this.movies.filter((movie) =>
      `${movie.title} ${movie.director} ${movie.summary}`.toLocaleLowerCase().includes(query),
    );
  }

  private readonly handleSearchInput = (event: Event): void => {
    if (!(event.currentTarget instanceof HTMLInputElement)) {
      return;
    }

    this.query = event.currentTarget.value;
    this.dispatchEvent(
      new CustomEvent<MovieSearchResultsEventDetail>('movie-search:results', {
        detail: { query: this.query, results: this.filteredMovies },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private readonly handleMovieSelect = (movie: Movie): void => {
    this.dispatchEvent(
      new CustomEvent<MovieSearchSelectEventDetail>('movie-search:select', {
        detail: { movie },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    const movies = this.filteredMovies;

    return html`
      <section class="movie-search" aria-label=${this.label}>
        <div class="search-panel">
          <label class="form-label" for="movie-query">${this.label}</label>
          <input
            id="movie-query"
            class="form-control"
            type="search"
            autocomplete="off"
            placeholder=${this.placeholder}
            .value=${this.query}
            @input=${this.handleSearchInput}
          />

          <p class="result-count" aria-live="polite">${movies.length} movies found</p>
        </div>

        ${
          movies.length
            ? html`
                <div class="movie-grid">
                  ${movies.map(
                    (movie) => html`
                      <article class="card movie-card h-100">
                        <img
                          class="movie-poster card-img-top"
                          src=${movie.poster}
                          alt="Poster for ${movie.title}"
                          loading="lazy"
                        />
                        <div class="card-body d-flex flex-column">
                          <h2 class="h5 card-title">${movie.title}</h2>
                          <p class="movie-meta card-text mb-2">${movie.year} · ${movie.director}</p>
                          <p class="movie-summary card-text">${movie.summary}</p>
                          <button
                            class="select-movie btn btn-primary mt-auto"
                            type="button"
                            @click=${() => this.handleMovieSelect(movie)}
                          >
                            Select ${movie.title}
                          </button>
                        </div>
                      </article>
                    `,
                  )}
                </div>
              `
            : html`<p class="empty-state" role="status">No movies match your search.</p>`
        }
      </section>
    `;
  }
}

export function defineMovieSearch(): void {
  if (typeof customElements === 'undefined' || customElements.get('movie-search')) {
    return;
  }

  customElements.define('movie-search', MovieSearch);
}
