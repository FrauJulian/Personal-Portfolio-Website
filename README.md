# Hey, I'm Julian 👋

This is the source code of my personal portfolio at
[fraujulian.xyz](https://fraujulian.xyz/). It's where I show who I am, what I
work on, and how you can reach me.

I'm a full-stack developer from Austria. I care about reliable systems, clean
code, and privacy. Most of my day happens on the move, usually on a train, and
when I'm not coding, I'm probably scuba diving somewhere in an Austrian lake. 🤿

## What you'll find on the site

- A short introduction about me and the skills I work with
- My current jobs and projects
- Ways to get in touch: email, phone, Signal, Gitea, and LinkedIn
- English and German versions (add `?lang=de` for German)
- A small portrait gallery: click the photo to see a bit more of my life
- Imprint and privacy information

## Built with

I kept the stack small and modern on purpose:

- Angular 22 with standalone components, signals, and zoneless change detection
- TypeScript and SCSS
- Vitest for tests
- A tiny Node.js static server with security headers and compression

The site is fully static. There is no tracking, no cookies, and no third-party
requests. Even the font is self-hosted. 🔒

## Running it locally

You need Node.js 24.15 or newer and npm 11.12 or newer.

```bash
npm ci
npm run dev
```

This generates the optimized assets and starts the dev server at
`http://localhost:4200`.

To build and serve the production version:

```bash
npm run build
npm start
```

The build lands in `dist/browser`, and the static server runs at
`http://localhost:3000`.

## Tests and checks

```bash
npm run test
npm run check
```

`npm run test` runs the Vitest suite in jsdom. `npm run check` runs linting,
formatting, version, and source text checks. Please run it before you open a
pull request.

## Project structure

- `src/app/home`: the portfolio landing page
- `src/app/imprint`: imprint and privacy page
- `src/app/footer`: site footer
- `src/app/shared`: reusable UI building blocks
- `src/app/services`: language, preference, and SEO services
- `src/languages`: English and German content
- `scripts`: asset generation, versioning, and the static server

More notes:

- [Nginx Proxy Manager deployment notes](npm.md)
- [Project conventions](AGENTS.md)

## License

The code is licensed under the
[GNU Affero General Public License v3.0](LICENSE). The content of the website,
such as texts and photos, is mine and not covered by that license.

Thanks for stopping by! ✨
