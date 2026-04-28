# Repository Guidelines

## Project Structure & Module Organization

`src/` contains the Angular application, SSR entry points, and global styles.
Feature code lives under `src/app/` with standalone components such as `home/`,
`imprint/`, `footer/`, and shared services in `src/app/services/`. Language
packs and shared language types are in `src/languages/`. Source images belong in
`src/assets/unoptimized/`; generated web assets are written to
`src/assets/optimized/`. Utility and generation scripts live in `scripts/`. CI
workflows and issue templates are under `.github/`.

## Build, Test, and Development Commands

Use npm scripts only.

- `npm run dev` starts the local Angular dev server after generating assets.
- `npm run test` runs the Angular/Karma test suite.
- `npm run check` runs the repository validation pipeline.
- `npm run fix` applies automatic fixes for version placeholders, ESLint issues,
  text cleanup, and formatting.
- `npm run lint` runs base and type-aware ESLint checks.
- `npm run format:check` verifies Prettier formatting.

For validation, use `npm run check` and `npm run test`. Do not run
`npm run build` directly.

## Coding Style & Naming Conventions

Use TypeScript with strict typing. Prefer `type`, `interface`, and `enum`
deliberately; do not use `any` or `unknown` unless unavoidable and justified.
`var` is forbidden. Only mark values nullable when `null` is a real runtime
state. Always declare the correct access modifier (`private`, `protected`,
`public`) explicitly when it improves clarity.

Formatting is enforced with Prettier and ESLint. Follow existing conventions:
2-space indentation, single quotes, semicolons, readonly where appropriate, and
Angular standalone components with files named
`feature.component.ts|html|spec.ts`.

## Testing Guidelines

Tests use Jasmine with Karma and live beside implementation files as
`*.spec.ts`. Add or update tests when changing component behavior, services,
routing, or asset-generation logic. Prefer focused unit tests over broad
integration-style setup. Run `npm run test` locally before opening a PR.

## Commit & Pull Request Guidelines

Recent history favors short conventional-style subjects such as
`fix: performance`, `fix: text`, and `feat: added languages`. Keep commits
scoped and imperative. PRs should include a concise summary, linked issue when
relevant, validation notes (`npm run check`, `npm run test`), and screenshots
for UI changes, especially mobile or performance-related updates.

## Asset & Content Notes

Do not edit generated optimized assets by hand. Update the source files in
`src/assets/unoptimized/` and regenerate through the provided scripts. Keep
localized text changes synchronized between `src/languages/de.ts` and
`src/languages/en.ts`.
