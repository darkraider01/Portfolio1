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

## Data synchronization

Data is kept fresh automatically by scheduled GitHub Actions without client-side API calls:

- **Project commit dates**: [`src/data/projects.js`](src/data/projects.js) is refreshed daily by
  [`scripts/fetch-project-updates.mjs`](scripts/fetch-project-updates.mjs), which pulls the latest commit
  and push timestamps for all linked repositories.
- **OSS contributions**: `public/data/oss-contributions.json` is refreshed daily by
  [`scripts/fetch-oss-contributions.mjs`](scripts/fetch-oss-contributions.mjs) against the GitHub GraphQL API.

Both run automatically at 06:00 UTC via [`.github/workflows/oss-contributions.yml`](.github/workflows/oss-contributions.yml).
You can also run them locally at any time:

```bash
npm run update:projects  # updates src/data/projects.js
npm run update:oss       # updates public/data/oss-contributions.json
npm run update:data      # updates both
```

