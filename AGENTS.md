# Repository Guidelines

## Project Context

This is an Angular portfolio application using Angular 21, TypeScript, SCSS,
Karma/Jasmine tests, and static hosting for production output. Production
application code lives in `src/app`; the client entry point lives in
`src/main.ts`.

Feature views live in folders such as `src/app/home`, `src/app/footer`, and
`src/app/imprint`. Reusable generic UI building blocks belong in
`src/app/shared`; reusable services belong in `src/app/services`. Assets and
language content live in `src/assets` and `src/languages`. Do not manually
maintain generated or copied output in `public/assets/optimized` or `dist`.

## Agent Workflow

- Read relevant project files before making changes and follow existing
  patterns.
- Always validate every change with `npm run check`.
- Do not run a build unless the user explicitly asks for it.
- If `npm run check` fails, read the cause first. `npm run fix` may be used, but
  it cannot fix every issue.
- Always follow the active ESLint, Prettier, and `tsconfig` rules.
- Change only files that are relevant to the task.
- Do not revert unrelated or unclear local changes.
- Commit, push, or open PRs only when explicitly asked.

## Important Commands

- `npm run dev`: generates assets and starts the Angular development server.
- `npm run build`: generates assets, builds the production app, and copies
  static root files. Run this only when explicitly requested.
- `npm start`: serves the built static app through `scripts/static-server.mjs`.
- `npm test`: generates assets and starts Angular tests with Karma/Jasmine.
- `npm run check`: runs linting, format checks, version checks, and source text
  checks. Always use this as the final validation.
- `npm run fix`: places version data, runs ESLint fixes, fixes source text, and
  formats the project.

Use Node `>=24.14.0` and npm `>=11.12.0`.

## Code Style

- TypeScript strict mode is enabled. `strictTemplates` is enabled.
- Prettier is authoritative: 2 spaces, single quotes, semicolons, trailing
  commas, and default print width 100.
- Markdown wraps at 80 characters.
- Angular selectors use the `app` prefix.
- Components follow the pattern `feature.component.ts`,
  `feature.component.html`, and `feature.component.spec.ts`.
- Services follow the pattern `name.service.ts`.
- Place shared types in `*.types.ts` files when that matches the local pattern.
- Explicitly type public methods, service APIs, and complex return values.
- Use `unknown` instead of `any` when a value must be checked first.
- Use `any` only when technically necessary, and document the reason.
- Use `const` instead of `let` when reassignment is not needed.
- Use `readonly` for data that should not be changed.
- Do not use non-null assertions to hide real nullability issues.
- Do not suppress type errors with `as unknown as`.
- Use union types for fixed value sets instead of magic strings.
- Keep API DTOs separate from internal UI or domain models.

## Angular Architecture

- Components must have exactly one clear responsibility.
- Keep components primarily responsible for UI, user interaction, and view state.
- Put business logic, HTTP access, mapping, and shared state into focused
  services.
- Structure code by features or domains, not only by file types.
- Put domain-specific logic and domain-specific components in the relevant
  feature folder.
- Put generic reusable elements in `shared/`.
- Split container components from presentational components when a view becomes
  complex.
- Create abstractions only when at least two real use cases exist.
- Avoid cyclic dependencies between components, services, and modules.
- Do not use services as unordered global storage.

## Angular Components

- Use `ChangeDetectionStrategy.OnPush` unless there is a concrete reason not to.
- Use required inputs when a component cannot work meaningfully without the
  data.
- Name inputs and outputs clearly after their purpose.
- Do not mutate input data directly.
- Keep component classes small and readable.
- Extract repeated UI blocks into their own components.
- Use lifecycle hooks only when they are truly necessary.
- Keep constructors free of logic; prefer dependency injection with `inject()`
  when it fits the existing code.
- Do not manipulate the DOM directly when Angular APIs are sufficient.
- Do not use component inheritance when composition is simpler.

## State, RxJS, and Data Flows

- Use Signals for local synchronous component state.
- Use computed Signals for derived synchronous values.
- Use RxJS for asynchronous data streams and complex event chains.
- Encapsulate shared state in services.
- Keep state as close as possible to where it is needed.
- Make state changes explicit and easy to follow.
- Name Observables with a `$` suffix.
- Use the `async` pipe when a stream is displayed directly in the template.
- Choose `switchMap`, `concatMap`, `mergeMap`, and `exhaustMap` deliberately
  based on their semantics.
- Use `combineLatest` for dependent live values and `forkJoin` for multiple
  one-time requests.
- End manual subscriptions with `takeUntilDestroyed` or an equivalent mechanism.
- Do not write `subscribe()` inside `subscribe()`.
- Handle errors with `catchError` in the right place and do not blindly swallow
  them with `EMPTY`.
- Do not use RxJS for trivial synchronous state.

## HTTP and API

- Encapsulate all HTTP calls in services.
- Define response types for API responses.
- Keep API configuration centralized through environments or injection tokens.
- Use interceptors for recurring technical tasks such as auth, headers, or error
  handling.
- Include loading, error, and empty states for slow or failed requests.
- Treat external data defensively, and validate or normalize it before broad UI
  use.
- Map external API data deliberately into internal models.
- Avoid duplicate API calls through shared stream or cache handling.
- Do not hardcode API URLs, tokens, roles, or secrets in components.

## Templates

- Keep templates declarative and easy to read.
- Use templates only for presentation and simple bindings.
- Move complex conditions into component code or computed Signals.
- Use `@if` for conditional rendering.
- Always use `@for` with `track`.
- Use stable unique IDs for `track`; use the index only when no stable ID
  exists.
- Do not put business rules, complex ternaries, or expensive method calls in
  templates.
- Use pipes only for pure formatting.
- Break large templates into smaller components.
- Keep binding expressions short.

## Forms

- Use Reactive Forms for complex forms.
- Define validators explicitly.
- Show validation errors clearly in the UI.
- Validate critical rules again on the backend.
- Keep form models and API DTOs separate when they differ.
- Map form data deliberately before sending it.
- Disable submit during active requests when repeated submission is problematic.
- Show server errors visibly in the form.

## Styling

- Prefer component-scoped styling.
- Use global styles in `src/styles.scss` only for truly global rules.
- Use consistent design tokens, utility classes, or reusable components for
  recurring UI patterns.
- Consider responsive design for every new view.
- Use semantic HTML before adding complex CSS.
- Keep spacing, colors, and font sizes consistent.
- Use inline styles only for dynamic edge cases.
- Do not use `::ng-deep` as a default solution.
- Do not write global CSS rules that unintentionally affect unrelated
  components.
- Do not build fixed-pixel layouts without responsive behavior.

## Security

- Treat all external data as potentially unsafe.
- Never trust user input without validation.
- Do not store secrets in the frontend or repository.
- Use `.env.example` as the documented template; keep real environment-specific
  values out of version control.
- Enforce roles and permissions server-side; use frontend checks only for UX.
- Render HTML from APIs only after controlled sanitization.
- Use `bypassSecurityTrustHtml` only after an explicit security review.
- Check redirect URLs against an allowlist.
- Protect auth flows against XSS and CSRF risks.
- Store tokens only with a deliberate security concept.

## Performance

- Lazy-load larger features.
- Use `OnPush` to reduce unnecessary change detection.
- Always render lists with stable `track` values.
- Consider virtual scrolling for large lists.
- Do not run expensive calculations in templates.
- Move expensive calculations into computed Signals, memoization, or services.
- Do not add a large dependency for a small helper function.
- Check value, risk, and bundle cost before adding a dependency.
- Optimize images and assets.
- Measure performance problems before implementing complex optimizations.

## Tests

- Keep tests next to the code under test with `*.spec.ts`.
- Test services that contain domain logic.
- Test complex component logic.
- Cover critical user flows with E2E tests when an E2E setup exists or is
  requested.
- Mock external dependencies in unit tests.
- Do not use real HTTP calls in unit tests.
- Write tests with a clear domain-level assertion.
- Test edge cases and failure cases.
- Do not couple tests unnecessarily to implementation details.
- Test names should describe behavior rather than implementation.

## Code Quality and Project Practice

- Remove unused code and unused imports.
- Do not leave commented-out code blocks in the repository.
- Leave TODOs only with context, a ticket, or a documented decision.
- Use comments sparingly and only for context that is not obvious from the code.
- Keep files small enough to understand quickly.
- Follow existing project conventions.
- Prefer small, focused pull requests.
- Write commit messages with a concrete statement, for example `fix:` or
  `improve:` followed by a short summary.
- Do not write commits named only `fix`, `stuff`, `update`, or `changes`.
- Document workarounds when they are unavoidable.
