# Repository Guidelines

## Project Structure & Module Organization

This repository is an Angular 21 SSR application. Main app code lives in `src/`,
with standalone components under `src/app/` such as `home/`, `footer/`, and
`imprint/`. Shared constants are kept in `src/global.fields.ts`. Component tests
sit next to their source files as `*.spec.ts`. Automation and project
maintenance scripts live in `scripts/`. Generated build output goes to `dist/`
and should not be edited manually.

## Build, Test, and Development Commands

- `npm run dev`: generate static assets, then start the Angular dev server.
- `npm run build`: generate assets, create a production build, then copy static
  root files.
- `npm run test`: run unit tests with Karma/Jasmine.
- `npm run lint`: run the base ESLint config and the type-aware TypeScript
  config.
- `npm run format:check`: verify Prettier formatting without changing files.
- `npm run check`: full CI-style verification (`build`, `lint`, formatting,
  version, and text checks).
- `npm run fix`: apply the local autofix workflow, including version placeholder
  reset, lint fixes, text cleanup, and Prettier.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, spaces, 2-space indentation, final newline, and
trimmed trailing whitespace. Use Prettier for formatting and ESLint for code
quality. Keep Angular file naming consistent: `feature.component.ts`,
`feature.component.html`, and `feature.component.spec.ts`. Prefer PascalCase for
classes and interfaces, camelCase for members, and keep scripts in CommonJS
format as `*.cjs`.

## Testing Guidelines

The project uses Jasmine with Karma via `ng test`. Place tests beside the
implementation file and keep names aligned with the component or module under
test. Run `npm run test` for unit tests and `npm run check` before opening a PR.
No explicit coverage gate is configured, so contributors should add focused
tests for changed behavior.

## Commit & Pull Request Guidelines

Recent history mixes short imperative messages (`Update src/global.fields.ts`)
with lightweight conventional commits
(`feat: pre-render routes and restore scroll`). Prefer concise, imperative
commit subjects and include a scope or prefix when it adds clarity. PRs should
summarize the user-visible change, mention any config or script updates, link
related issues, and include screenshots for UI changes.

## Configuration Tips

Use the placeholder version workflow intentionally: `version:check` expects
`YYDDDhhmm+GIT_HASH`, while build pipelines may resolve it through the scripts
in `scripts/version.cjs`. Keep `package.json` and `package-lock.json` in sync,
and avoid committing manual edits to generated files in `dist/`.
