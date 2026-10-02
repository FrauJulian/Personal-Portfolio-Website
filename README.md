# FrauJulian's Portfolio Website

## Preview

Visit the live website at [fraujulian.xyz](https://fraujulian.xyz/).

## Technology

- Angular 22
- TypeScript
- SCSS
- Karma and Jasmine for tests

## Features

- English and German language options
- About, work, and project portfolio
- Contact links and downloadable OpenPGP public key
- Imprint and privacy information
- Interactive portrait highlights

## Project Architecture

- `src/app/home` — portfolio landing page
- `src/app/imprint` — imprint and privacy page
- `src/app/footer` — site footer
- `src/app/shared` — reusable UI components
- `src/app/services` — language and preference services
- `src/languages` — English and German content
- `scripts` — asset generation, versioning, and static file tools

## Setup

Requirements: Node.js 24.15 or newer and npm 11.12 or newer.

### Development

```bash
npm ci
npm run dev
```

The development server generates required static assets and runs the site at
`http://localhost:4200`.

### Production

```bash
npm run build
npm start
```

The build writes the static site to `dist/browser`. The static server serves the
built site at `http://localhost:3000`.

## Tests

```bash
npm run test
```

This generates assets and runs the Karma/Jasmine tests in ChromeHeadless.

## Docs

- [Nginx Proxy Manager deployment notes](npm.md)

## Guidelines

Run `npm run check` before submitting changes. See [AGENTS.md](AGENTS.md) for
project conventions.

## LICENSE

Licensed under the [GNU Affero General Public License v3.0](LICENSE).
