# Portfolio

Ishan Ghosh's personal developer portfolio — React + Vite + Tailwind CSS.

## Stack

- React + Vite
- Tailwind CSS v4
- [React Bits](https://reactbits.dev) — Molten Metal background, Shiny Text, Spotlight Card

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## OSS contributions tracker

`public/data/oss-contributions.json` is refreshed daily by
[`.github/workflows/oss-contributions.yml`](.github/workflows/oss-contributions.yml),
which runs [`scripts/fetch-oss-contributions.mjs`](scripts/fetch-oss-contributions.mjs)
against the GitHub GraphQL API. The frontend reads the committed JSON file at
runtime — no live GitHub API calls from the browser.
