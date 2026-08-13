# AGENTS.md

Guidance for OpenCode sessions working in this repo. Park Quest is a greenfield, issue-driven project — the GitHub issues are the roadmap and the authoritative source for intended architecture until code lands.

## Workflow

- Work one GitHub issue at a time.
- Before starting a new issue: confirm the previous issue's PR was merged, switch to `main`, and pull to update before creating the new feature branch.
- Create one feature branch per issue: `feat/<issue#>-<slug>` off `main` (e.g. `feat/3-drizzle-schema`).
- Open one PR per issue back to `main`, defaulting to draft PRs. Use `Closes #<issue#>` in the PR body when the PR fully satisfies every acceptance criterion in the issue — this is the default for a complete PR, even a draft. GitHub only closes the issue when the PR is merged (not when `Closes` is written), so `Closes` is safe on draft PRs since merging is gated by the user. Use `Refs #<issue#>` only while work is still in progress and the acceptance criteria are not yet met.
- After being explicitly asked to finish an issue, you may commit, push, and open a draft PR. Never merge PRs. Stop after opening the draft PR and provide the PR link.
- Stay strictly within an issue's scope. Each issue explicitly forbids building features that belong to a later issue — do not pre-implement UI, auth, map, quest engine, etc.
- It is okay to skim later issues for context, but code changes must stay inside the current issue's scope.
- Verify against the issue's "Acceptance criteria" section before declaring done, and run the relevant checks (lint, typecheck, tests) before summarizing work.
- Do not commit, push, or open a PR unless explicitly asked.

## Planned stack (per issues, not yet implemented)

These choices come from the GitHub issues, not from committed config. Once executable config (package.json, lockfile, etc.) exists, prefer the actual repo files over older issue text.

Verify against the actual issue before choosing a library; do not substitute.

- Next.js App Router + TypeScript + Tailwind CSS (issue #1)
- ESLint + Prettier (issue #1)
- Vitest for unit tests, Playwright for e2e (issue #1)
- Drizzle ORM + Postgres — not Prisma (issue #3)
- Better Auth — not NextAuth (issue #7)
- Leaflet + OpenStreetMap tiles for the map (issue #6)
- Docker + Coolify deployment (issue #2)

## Commands

Package manager is **npm** — do not use pnpm, yarn, or bun.

Scripts expected once issue #1 scaffolds the app (from its acceptance criteria):

- `npm run dev` — start the app
- `npm run lint` — lint
- `npm run test` — Vitest unit tests
- `npm run test:e2e` — Playwright e2e (separate from unit tests; `npm run test` does not run e2e)

## Architecture constraints (from issues)

- Two-track domain model: a **public park atlas** (regions, parks, amenities) plus **private family progress** (families, visits, XP, badges, quests). Keep public browsing available without login (issues #3, #7).
- Public routes: `/parks`, park detail pages, `/map`. Protected routes: account/family pages (issue #7).
- Park amenities are a **join table** with verification status — never hardcode amenity columns on the `parks` table (issue #3 acceptance criterion).
- Schema must support expansion beyond Bellingham — do not hardcode the city (issue #3).
- XP events are **append-only** (issue #3).

## Env

- `.env` is gitignored; `.env.example` should be committed when introduced (see `.gitignore`). Issue #2 introduces the example env file.

## Status manifest (`.qcfailed/status.json`)

- `.qcfailed/status.json` is ParkQuest's curated public status manifest for the qcfailed.com "Current Build Floor / QC Operations Console". It is intentionally public — never put secrets, credentials, private family data, internal employer information, production database details, or speculative claims in it.
- Schema version one fields: `schemaVersion` (must be 1), `projectSlug` (must be "parkquest"), `workState` (active | maintenance | paused), `currentFocus` (concise public-safe sentence, ≤ 240 chars), `latestCompleted` (truthful latest merged public product milestone with date and optional absolute-https GitHub PR url), `nextStep`, `lastMeaningfulUpdate` (real non-future YYYY-MM-DD), `highlights` (zero to three portfolio-worthy entries), optional `currentChange` (closed object with exactly `summary`, `stage`, `pullRequestNumber`; no other fields). Unknown top-level fields are invalid.
- **Meaningful-status upkeep** — update the manifest in the same PR only when that PR meaningfully changes current focus, latest completed milestone, next step, work state, or portfolio highlights. Do not update it for typos, dependency bumps, CI-only changes, test-only corrections, or packaging-only fixes. Keep status text public-safe, factual, concise, and reviewable beside the work that caused it.
- **Active-review upkeep** — after opening a meaningful product PR, add or update `currentChange` on that PR's branch with the real PR number, and advance `stage` truthfully through implementation → review → preview → merge-ready. Never copy a preview URL into the manifest.
- **Rollover after merge** — when starting the next meaningful product PR, move the previously merged product change into `latestCompleted`, update `currentFocus`/`nextStep`/`lastMeaningfulUpdate`/`highlights` truthfully, and replace `currentChange` only after the new PR exists. Never present a closed-unmerged change as completed.
- **PR number, not preview URL** — the manifest stores the PR number only. qcfailed.com derives preview URLs from the PR number against its allowlisted template; ParkQuest never stores a preview URL.
- **Verified preview pattern** — ParkQuest's Coolify PR-preview hostname shape is `https://pr-{pullRequestNumber}.parkquest.club` (verified via `pr-72.parkquest.club` resolving to the Coolify gateway, HTTP 503 when the preview app is not spun up). The allowlisted template lives in the qcfailed.com project catalog, not in `status.json`.
- **Infrastructure-only work** (deploy, CI, dependency, typo, packaging) must not add or replace `currentChange`, and must not silently displace `latestCompleted` or `highlights` unless Brandon explicitly decides it is portfolio-worthy.
- **qcfailed.com responsibilities** — remote validation, GitHub PR-state interpretation, preview probing, fallback snapshots, staleness handling, and public rendering stay with qcfailed.com. ParkQuest's durable repository-local validation is `src/lib/qcfailed-status.test.ts`; keep that test generic (schema-one contract only, no frozen rollout history) so future rollover PRs never have to rewrite historical assertions.
