# Web Components best practices

## JavaScript/TypeScript and Lit

- Use strict TypeScript, explicit public types and inference for obvious local values. Avoid any, unchecked assertions and unhandled promises.
- Keep each src/components/<name>/ folder focused: <name>.ts, <name>.test.ts, index.ts and README.md. Colocate component models; extract shared code only when actually reused.
- Export contracts through the public barrels. Preserve movie-search; use thydda- for new tags and document/version breaking API changes.
- Declare reactive properties with the static properties convention used by this project. Pass arrays/objects as properties; choose simple attributes deliberately and document defaults, reflection and reactive updates.
- Keep registration explicit and idempotent, without import side effects. Guard unavailable customElements, but do not equate that guard with complete SSR support.
- Define typed CustomEvent detail and stable namespaced event names. Document bubbles/composed behavior for events crossing Shadow DOM.
- Clean up listeners, subscriptions and observers on disconnection. Reconnection must not duplicate resources.

## Styles and accessibility

- Keep styles in Shadow DOM. Angular/global Bootstrap CSS cannot reach it; the current component includes its own Bootstrap CSS.
- Expose documented CSS custom properties or parts for supported customization. Consumers should not depend on internal selectors.
- Use semantic HTML and native controls, accessible labels/errors, visible focus and keyboard operation. Meet applicable WCAG A/AA requirements.
- Avoid clipped content, support narrow widths and enlarged text, and respect reduced motion where relevant.

## Before merge: review checklist

Run npm run check (lint, format, typecheck, component-test presence, unit tests and build). Review these items where affected:

- Rendering with defaults, host-provided properties and later reactive updates.
- Typed event payloads, registration, empty data and relevant disconnect/reconnect behavior.
- Public API compatibility and Angular consumer bindings/events. Rebuild the library and validate mfe1 for cross-repository changes.
- Browser focus, responsive layout, keyboard use, zoom/reflow and relevant screen-reader behavior. jsdom cannot establish layout, contrast or full accessibility.

Tests must assert behavior, not merely mirror implementation or snapshots. Await updateComplete rather than sleeps, and remove fixtures/listeners after each test.

GitHub Actions runs unit tests on pull requests targeting main. Browser integration is currently checked manually; no automated e2e command is configured. Record evidence and limitations. ESLint checks code patterns, not the full architecture or accessibility checklist.
