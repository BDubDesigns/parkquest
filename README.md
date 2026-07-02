# ParkQuest

Turn every park into an adventure.

ParkQuest is a family park passport app — and a portfolio project showing full-stack Next.js engineering with server-owned game logic, family-group privacy isolation, and a polished mobile-first design system.

Completely open-source. Built for my daughter, who taught me that every day is an adventure.

## Product overview

ParkQuest helps Bellingham families discover parks, log visits in a private **Family Park Passport**, and turn days outside into a growing collection of **Adventure Points**, **Stickers**, and **Daily Quests**.

Anyone can browse the public park atlas and map without an account. Families who sign up unlock a private passport: stamp each park you visit, leave memories and ratings, and watch your collection grow. Every stamp, point, sticker, and quest reward is computed server-side — the client never controls rewards or progress.

### Core loop

1. **Discover** — browse Bellingham parks by list or interactive map.
2. **Visit** — head to a real park with your family.
3. **Stamp it** — log your visit in the private Family Park Passport.
4. **Earn** — collect Adventure Points from stamps and completed Daily Quests.
5. **Unlock** — earn Stickers as your family reaches server-evaluated milestones.
6. **Return** — stamp the same park again for repeat-visit memories and points.

## Current features

- **Public Bellingham park atlas** — 46 seeded parks with descriptions, coordinates, and official source links.
- **Verified amenities** — park features sourced from official data with verification status tracking.
- **Public park list and detail pages** — browse and learn about every park without logging in.
- **Interactive map** — Leaflet-powered OpenStreetMap with stamped vs. unstamped markers for signed-in families.
- **Better Auth family accounts** — email/password sign-up and sign-in with automatic family group creation.
- **Private Family Park Passport** — each family's visits, stamps, memories, ratings, points, stickers, and quests are isolated by `familyGroupId`.
- **Park stamps** — log visits with date, rating (1–5), safety answer, and private notes. Repeat visits welcome.
- **Adventure Points** — awarded server-side for stamps and Daily Quest completions; stored as append-only events.
- **Stickers** — earned from server-evaluated criteria; each family sees only their own sticker collection.
- **Daily Quests** — assigned per family per day; completed automatically when stamps meet the quest criteria.
- **Privacy and child-safety guardrails** — no photos, no child-specific profiles, no location tracking, no public social features.
- **Installable PWA basics** — manifest, icons, and mobile bottom navigation for a standalone app feel on phones.
- **Visual design system** — mobile-first, dark green palette, consistent component library across all pages.

## Architecture summary

ParkQuest follows a two-track domain model: a **public park atlas** and **private family progress**. These tracks share no sensitive data paths.

### Public track (no login required)

- `regions`, `parks`, `amenities`, and `park_amenities` tables store the park atlas.
- Only `verification_status = 'verified'` amenity rows are shown on public pages.
- Routes: `/parks`, `/parks/[slug]`, `/map`.

### Private track (family-group scoped)

- `family_groups`, `family_members`, `visits`, `xp_events`, `badge_definitions`, `earned_badges`, `quest_definitions`, and `quest_progress` tables store family data.
- Every private row is scoped to a `familyGroupId`. Queries are written to filter by the authenticated family, so one family should not be able to access another family's private data.
- Routes: `/passport`, `/account`.

### Server-owned game logic

The client is **never trusted** to award points, stickers, or quest completions:

- **Adventure Points** (`xp_events`) are inserted by server-side transactions after a stamp or quest completion. Points are append-only with no update or delete paths.
- **Stickers** (`earned_badges`) are evaluated against server-side rules using data-driven JSON criteria in `badge_definitions`.
- **Daily Quests** (`quest_progress`) are assigned per family per UTC day and completed server-side when a stamp meets the quest's criteria (e.g., visiting a park with a specific amenity).
- The database schema uses `xp_events` and `badge_definitions` / `earned_badges` as internal table names; the product refers to these as **Adventure Points** and **Stickers**.

### Expansion model

MVP starts in Bellingham, but the `regions` table supports city, county, and state types, and the schema never hardcodes a city name. Adding a new region is a data operation, not a schema change.

## Privacy and child safety

ParkQuest is designed for families. The privacy model centers on **family-group isolation**:

- Every private data row is scoped to a `familyGroupId`. No family can see another family's stamps, memories, ratings, safety answers, points, or stickers.
- There are **no child-specific accounts, profiles, or fields**. A family group shares one passport.
- **No photos are collected or stored** in the MVP. This eliminates the primary vector for child-privacy exposure.
- Safety answers (felt safe / not safe) are stored with each visit and are never shared publicly.
- No location tracking is performed beyond the public park coordinates.
- No public reviews, comments, social sharing, or leaderboards exist — ParkQuest is a private family experience.

See [docs/privacy-mvp.md](docs/privacy-mvp.md) for the full privacy model, data classification table, and future photo policy.

Privacy isolation is verified by e2e tests covering stamps, passport progress, points, stickers, and auth across separate families.

## Tech stack

| Area              | Technology                                                       |
| ----------------- | ---------------------------------------------------------------- |
| Framework         | [Next.js](https://nextjs.org) (App Router)                       |
| Language          | TypeScript                                                       |
| Styling           | [Tailwind CSS](https://tailwindcss.com) v4                       |
| Database          | PostgreSQL                                                       |
| ORM               | [Drizzle ORM](https://orm.drizzle.team)                          |
| Auth              | [Better Auth](https://www.better-auth.com)                       |
| Map               | [Leaflet](https://leafletjs.com) + React Leaflet + OpenStreetMap |
| Unit tests        | [Vitest](https://vitest.dev)                                     |
| E2E tests         | [Playwright](https://playwright.dev)                             |
| Code quality      | [ESLint](https://eslint.org) + [Prettier](https://prettier.io)   |
| Deployment target | [Docker](https://www.docker.com) + [Coolify](https://coolify.io) |

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL (via Docker or local install)

## Local setup

```bash
cp .env.example .env
# edit .env:
#   - set POSTGRES_PASSWORD (and optionally POSTGRES_USER/POSTGRES_DB)
#   - set BETTER_AUTH_SECRET (generate with: openssl rand -base64 48)
#   - set BETTER_AUTH_URL to http://localhost:3000
npm install
npm run db:migrate   # create the tables
npm run db:seed      # seed Bellingham park data
npm run dev
```

The app runs at <http://localhost:3000>.

## Environment variables

See `.env.example` for the full list. The key vars are:

| Variable             | Description                                        |
| -------------------- | -------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string                       |
| `BETTER_AUTH_SECRET` | Secret key for cookie signing (min 32 chars)       |
| `BETTER_AUTH_URL`    | Base URL of the app (e.g. `http://localhost:3000`) |

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
| `npm run db:generate`  | Generate a Drizzle migration                 |
| `npm run db:migrate`   | Apply pending Drizzle migrations             |
| `npm run db:studio`    | Open Drizzle Studio (GUI database browser)   |
| `npm run db:seed`      | Seed Bellingham region, parks, and amenities |

## Authentication

Better Auth provides email/password sign-up and sign-in. On sign-up, a family group is automatically created and the user is added as the owner.

- **Sign up:** <http://localhost:3000/sign-up>
- **Sign in:** <http://localhost:3000/sign-in>
- **Account:** <http://localhost:3000/account> (protected — redirects to sign-in when signed out)

Public routes (`/`, `/parks`, `/parks/[slug]`, `/map`) are accessible without login.

## Health check

A deployment health endpoint is available at <http://localhost:3000/api/health>, which returns `200` with `{ "status": "ok" }`.

## Seed data

Bellingham city park data can be seeded into the local Postgres database:

```bash
cp .env.example .env
# edit .env to set POSTGRES_PASSWORD and ensure DATABASE_URL points at your local Postgres
npm run db:migrate
npm run db:seed
```

The seed is idempotent — running it multiple times won't create duplicates.

The seed covers **46 Bellingham parks** from the official City of Bellingham Parks Guide, **17 reusable amenity definitions**, and **66 verified park-amenity links**. Neighborhood parks with uncertain amenity data are seeded with basic info (name, coordinates, source URL) but without amenity links pending future verification.

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
- **Required env:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- **Persistent storage:** attach a Coolify volume to the Postgres service at `/var/lib/postgresql/data`.

If you run Postgres as a separate Coolify resource, set `DATABASE_URL` on the app resource to that service's connection string. If you let Coolify provision Postgres alongside, the same compose env pattern applies.

## Roadmap

Planned ideas — not yet implemented:

- **Final logo, icons, and sticker art** — placeholder icons are in use today.
- **Interactive stamp animation** — a stamping animation when logging a park visit.
- **Family-specific park nicknames** — let your family give parks personal names.
- **Photo handling with child-safety rules** — photos private to the family group by default; no public sharing; EXIF stripping required; opt-in only if public sharing is ever added.
- **Amenity submissions and admin verification queue** — let the community suggest amenity corrections; admin reviews and verifies.
- **Official event and photo sync** — sync park events or photos from official sources.
- **Offline support** — allow browsing cached park data and logging visits without a connection. Not implemented now.

## License

MIT — see [LICENSE](LICENSE).
