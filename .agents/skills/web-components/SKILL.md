---
name: web-components
description: Create, extend and unit test Lit Web Components in the @thydda/web-components library, including public contracts and Angular consumption.
---

Read AGENTS.md and best-practices.md, then the library README and the affected component README. Follow the colocated
folder convention and export public types through the component barrel and src/index.ts.
Add explicit registration to src/register.ts when introducing a component.

Use static reactive properties with this library's TypeScript configuration.
Rich data belongs in properties, not serialized HTML attributes. Keep styles in
Shadow DOM; never assume the Angular host's Bootstrap CSS reaches it. Treat
documented properties, events, CSS variables and parts as versioned public API.
Preserve movie-search's existing tag; use thydda- for new tags.

Write <name>.test.ts using Vitest and jsdom. Create the registered element through
document.createElement, append it, and await updateComplete after reactive changes.
Assert observable DOM and typed event payloads, including bubbles/composed where
events must escape Shadow DOM. Cover empty data, property changes, user input,
idempotent registration and disconnect/reconnect behavior where relevant.
Remove fixtures and external listeners after each test. Avoid sleeps and snapshots
that only mirror implementation. Test cleanup explicitly when adding subscriptions,
observers or global listeners.

Use semantic controls, accessible names and preserved keyboard focus. jsdom does
not validate layout, contrast or real keyboard/browser behavior; use browser checks
for changes that depend on those features and state what was actually verified.

For Angular consumers, register before rendering and scope CUSTOM_ELEMENTS_SCHEMA
to the consuming component. Bind arrays/objects through properties and listen to
documented CustomEvents. Do not import library internals from Angular.

Run npm run check: it verifies lint, formatting, types, component test-file presence, unit tests and the build. Review the relevant manual checklist and report evidence. Validate mfe1 when changing consumed contracts. No CI or automated browser suite is configured; local checks cannot enforce remote merges. The merge workflow does not authorize an agent to merge without a user request.
