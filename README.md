# parkquest

Turn every park into an adventure with maps, visits, quests, XP, badges, and family-safe park tracking. Completely open-source. Built for my daughter, who taught me that every day is an adventure <3

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev) for unit tests
- [Playwright](https://playwright.dev) for e2e tests
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io)

## Prerequisites

- Node.js 20+
- npm

## Local setup

```bash
npm install
npm run dev
```

The app runs at <http://localhost:3000>.

## Scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the dev server                         |
| `npm run build`        | Production build                             |
| `npm run start`        | Start the production server                  |
| `npm run lint`         | Run ESLint                                   |
| `npm run test`         | Run Vitest unit tests                        |
| `npm run test:e2e`     | Run Playwright e2e tests (starts dev server) |
| `npm run typecheck`    | Type-check with `tsc --noEmit`               |
| `npm run format`       | Format the codebase with Prettier            |
| `npm run format:check` | Check formatting without writing             |

## Health check

A deployment health endpoint is available at <http://localhost:3000/api/health>, which returns `200` with `{ "status": "ok" }`.

## Docker (local)

A multi-stage `Dockerfile` and `docker-compose.yml` are included. The compose setup runs the Next.js app alongside a Postgres database, with a named volume for Postgres data and a healthcheck-gated startup order.

```bash
cp .env.example .env
# edit .env to set POSTGRES_PASSWORD (and optionally POSTGRES_USER/POSTGRES_DB/POSTGRES_PORT)
docker compose up --build
```

The app runs at <http://localhost:3000> and the health endpoint at <http://localhost:3000/api/health>. Postgres is exposed on `localhost:${POSTGRES_PORT:-5432}` for local connections.

To stop and remove the containers (keeping the Postgres volume):

```bash
docker compose down
```

To stop and **also remove the Postgres volume** (wipe data):

```bash
docker compose down -v
```

## Coolify deployment

This is a standard Node app with a `Dockerfile`, so it deploys on [Coolify](https://coolify.io) as a generic Docker service:

- **Build command:** handled by the `Dockerfile` (multi-stage, `node:20-slim`, Next.js `output: "standalone"`).
- **Port:** `3000` (the container listens on `0.0.0.0:3000`).
- **Health check path:** `/api/health` (returns `200 { "status": "ok" }`).
- **Required env:** `DATABASE_URL` (Coolify can inject this; the compose local setup wires it from `POSTGRES_*`).
- **Persistent storage:** attach a Coolify volume to the Postgres service at `/var/lib/postgresql/data`.

If you run Postgres as a separate Coolify resource, set `DATABASE_URL` on the app resource to that service's connection string. If you let Coolify provision Postgres alongside, the same compose env pattern applies.
