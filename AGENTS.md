# Repository Instructions

These instructions apply to this repository unless a more specific `AGENTS.md`
exists in a subdirectory.

## Required Verification

- Always verify changes with:
  - `npm run check`
  - `npm run test`
- If verification fails, `npm run fix` may help, but do not assume it resolves
  every issue.
- Respect the existing `tsconfig`, ESLint, and Prettier configurations.

## Assets

- Do not edit generated optimized assets by hand.
- Update source assets in `src/assets/unoptimized/`.
- Regenerate optimized assets through the provided scripts, usually via
  `npm run generate:assets` or commands that already include asset generation.

## Localization

- Keep localized text synchronized between:
  - `src/languages/de.ts`
  - `src/languages/en.ts`
- When changing user-facing text, update both language files unless the change
  is intentionally language-specific.

## Architecture

- Create components with exactly one clear responsibility.
- Keep components focused on UI, user interaction, and view state.
- Move business logic into focused services.
- Structure code by feature or domain where appropriate.
- Put reusable generic elements in `shared/`.
- Put domain-specific logic and components in the relevant feature folder.
- Separate container and presentational components when a view becomes complex.
- Avoid cyclic dependencies between modules, services, and components.
- Add abstractions only when at least two real use cases exist.
- Keep services focused on one business or technical responsibility.

## TypeScript

- Keep strict TypeScript enabled.
- Use explicit types for public methods, service APIs, and complex return
  values.
- Prefer `unknown` over `any` when a value still needs validation.
- Use `any` only when technically necessary and document the reason.
- Use union types for fixed value ranges.
- Use `readonly` for data that should not be mutated.
- Prefer `const` over `let` when reassignment is not needed.
- Check `null` and `undefined` explicitly before accessing nested values.
- Separate API DTOs from internal UI or domain models.
- Map external API data deliberately into internal models.
- Use clear names for interfaces, types, classes, variables, inputs, and
  outputs.
- Avoid type casts when clean type narrowing is possible.
- Do not suppress type errors with `as unknown as`.
- Do not use non-null assertions to hide real nullability problems.

## Angular Components

- Use `OnPush` change detection unless there is a clear reason not to.
- Use inputs for externally provided data.
- Use outputs for events emitted to parent components.
- Use required inputs when a component cannot work without the data.
- Keep component classes small and readable.
- Extract repeated UI blocks into dedicated components.
- Use lifecycle hooks only when they are necessary.
- Keep constructors limited to dependency injection.
- Initialize data clearly and predictably.
- Do not make god components.
- Do not mix API access, mapping, business logic, and UI logic in one component.
- Prefer composition over component inheritance.

## Angular State

- Use Signals for local synchronous component state.
- Use RxJS for asynchronous data streams and complex event chains.
- Use services for shared state across multiple components.
- Keep state as close as possible to where it is needed.
- Avoid global state when local state is enough.
- Make state changes explicit and understandable.
- Avoid hidden state mutation across multiple services.
- Do not store derived values redundantly when they can be computed.

## RxJS

- Name Observables with a `$` suffix.
- Use the `async` pipe when a stream is displayed directly in a template.
- Use `switchMap` for requests where older requests should be canceled.
- Use `concatMap` when ordering must be guaranteed.
- Use `mergeMap` when parallel processing is intended.
- Use `exhaustMap` when new events should be ignored while work is running.
- Use `combineLatest` for dependent live values.
- Use `forkJoin` for multiple one-time requests that complete together.
- Clean up manual subscriptions with `takeUntilDestroyed` or an equivalent.
- Handle errors with `catchError` at the appropriate level.
- Return controlled fallback state when useful.
- Do not hide errors that matter for debugging or UX.
- Do not use `subscribe()` inside `subscribe()`.
- Do not use RxJS for trivial synchronous state.
- Avoid duplicate identical requests from independent subscriptions.

## HTTP and API

- Encapsulate all HTTP calls in services.
- Define response types for API responses.
- Use central API configuration through environments or injection tokens.
- Use interceptors for repeated technical concerns such as auth, headers, and
  error handling.
- Implement loading, error, and empty states where requests affect UI.
- Treat API data defensively when quality is uncertain.
- Validate or normalize external data before broad UI usage.
- Avoid duplicate API calls through shared streams or caching where appropriate.
- Do not hardcode API URLs, tokens, roles, or secrets in components.

## Templates

- Keep templates declarative and easy to read.
- Use templates for presentation and simple bindings only.
- Move complex conditions into component code or computed signals.
- Use `@if` for conditional rendering.
- Use `@for` with `track` for lists.
- Track with a stable unique ID when available.
- Keep binding expressions short.
- Do not put business rules or complex ternaries into templates.
- Do not call expensive methods directly from templates.
- Split large templates into smaller components.

## Forms

- Use Reactive Forms for complex forms.
- Define validators explicitly.
- Show validation errors clearly in the UI.
- Keep form models and API DTOs separate when they differ.
- Map form data deliberately before submitting.
- Disable submit while requests are running when duplicate submits are a risk.
- Surface server-side validation errors in the form.

## Styling

- Prefer component-scoped styling.
- Use global styles only for truly global rules.
- Use a consistent design system or consistent utility classes.
- Reuse classes or components for repeated UI patterns.
- Account for responsive design in every new view.
- Prefer semantic HTML before complex CSS.
- Keep spacing, colors, and font sizes consistent.
- Use inline styles only for dynamic exceptions.
- Do not use `::ng-deep` as a default solution.
- Do not create global CSS rules that unintentionally affect other components.
- Avoid fixed pixel layouts without responsive behavior.

## Security

- Treat all external data as potentially unsafe.
- Never trust user input without validation.
- Do not store secrets in frontend code.
- Implement roles and permissions server-side.
- Use frontend role checks only for UX, not as a security boundary.
- Render API-provided HTML only after controlled sanitization.
- Use `bypassSecurityTrustHtml` only after explicit security review.
- Validate redirect URLs against an allowlist.
- Protect auth flows against XSS and CSRF risks.
- Store tokens only with a deliberate security concept.

## Performance

- Use lazy loading for larger features.
- Use `OnPush` to reduce unnecessary change detection.
- Use `track` in lists.
- Use virtual scrolling for large lists.
- Avoid expensive computations in templates.
- Move expensive computations into computed signals, memoization, or services.
- Avoid large dependencies for small helper functions.
- Check bundle size impact before adding libraries.
- Optimize images and assets.
- Measure performance issues before adding complex optimizations.

## Testing

- Test services that contain business logic.
- Test complex component logic.
- Test critical user flows with E2E tests where appropriate.
- Mock external dependencies in unit tests.
- Avoid real HTTP calls in unit tests.
- Write tests with clear behavioral assertions.
- Cover edge cases and error paths.
- Keep tests independent from internal implementation details.
- Use test names that describe behavior.
- Do not write tests only for coverage.
- Do not use snapshots as a substitute for concrete assertions.

## Code Quality

- Use ESLint and Prettier.
- Keep naming consistent.
- Remove unused code and unused imports.
- Do not leave commented-out code blocks.
- Keep changes focused.
- Write commits with concrete messages.
- Use comments only for context that is not obvious from the code.
- Keep files small enough to understand quickly.
- Follow existing project conventions.
- Do not leave TODOs without context, a ticket, or a documented decision.
- Do not add dependencies without checking value, risk, and bundle cost.
