# PR #72 cleanup pass — migration-status correctness, admin mobile padding, PR body

Date: 2026-08-12
Repo: BDubDesigns/parkquest
Branch: `feat/70-park-detail-passport` (already checked out; HEAD 0047e96 matches PR head)
PR: https://github.com/BDubDesigns/parkquest/pull/72
Issue link: n/a — this is a final-cleanup pass on an existing open PR (no new issue).

## Decision summary (verified, not assumed)

The admin migration-status code compares two identifiers that can NEVER match,
and a broad `catch` turns a real failure into a false "All migrations applied".

- `src/app/admin/actions.ts` `getPendingMigrationCount()` reads journal entries'
  `tag` (`0000_needy_nitro`) and compares them against `__drizzle_migrations.hash`.
- Verified in installed `drizzle-orm@0.45.2` (`node_modules/drizzle-orm/migrator.cjs`
  line 56 + `node_modules/drizzle-orm/pg-core/dialect.cjs` lines 46-73):
  - `hash` = `sha256(<full .sql file content>)` as hex. Tags are human slugs;
    a tag never equals a hash.
  - Drizzle does NOT decide "what's applied" by hashes. It reads only the newest
    row (`order by created_at desc limit 1`) and applies every journal entry whose
    `when` (folderMillis) is newer than that row's `created_at`.
- Consequence: the current successful path reports ALL journal entries as pending,
  every time. And the `catch { return 0 }` (actions.ts:58-60) makes any failure
  report `0`, which `page.tsx:55-57` renders as "All migrations have been applied."
  and `RunMigrationsButton.tsx:32` uses to hide the run button entirely.

### Correct source of truth (mirrors Drizzle, no custom machinery)

Pending count = number of journal entries whose `when` > `MAX(created_at)` of
`drizzle.__drizzle_migrations`. This is exactly the comparison `migrate()` performs
natively, so the UI can never claim a different state than Drizzle itself.

## Design decision: tri-state status

Change `getPendingMigrationCount()` to return `number | null`:

- `number >= 0` — reliably derived; UI shows the real pending count.
- `null` — could NOT determine state (table missing, DB error, journal unreadable).
  UI must NOT claim "All migrations applied"; it shows an honest
  "Could not determine migration status" and KEEPS the run button available.

Never silently return `0` on failure. This satisfies the prompt's "do not silently
swallow an inability and report 0."

## Task 1 — migration-status correctness

Files:
- `src/app/admin/actions.ts` — rewrite `getPendingMigrationCount`:
  - Parse `drizzle/meta/_journal.json` (existing) → get `entries[]` with `tag`,
    `when`.
  - Mirror Drizzle's exact applied-tracking query (pg-core/dialect.cjs:58-59), do NOT
    use `MAX(created_at)`. `created_at` is a nullable `bigint`; MAX vs DESC-LIMIT-1
    can diverge on NULLs, and mirroring the proven mechanism guarantees the UI state
    never differs from what `migrate()` will do. Query:
    `SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1`
  - Get the single latest row's `created_at` (may be NULL). Effective latest =
    `Number(created_at ?? 0)`. Return
    `entries.filter(e => e.when > effectiveLatest).length`, treating an empty table
    (no rows) the same as Drizzle's `!lastDbMigration` → everything pending.
  - Remove the broad `catch { return 0 }`. Return `null` only when the state
    genuinely cannot be determined; let real errors propagate where appropriate.
  - Keep `runMigrations()` untouched (preserves admin apply + advisory lock).
- `src/app/admin/page.tsx` — handle the tri-state:
  - `pendingMigrations === null` → render honest "Could not determine migration
    status." + a run button pointed at the same action.
  - `> 0` / `=== 0` → existing phrasing.
- `src/app/admin/RunMigrationsButton.tsx` — accept `pendingCount: number | null`;
  the "hide button on exact 0" behavior stays only for a verified `0`. For `null`,
  render the run button with generic "Run migrations" label (no false count), or a
  "status unknown" surface — do NOT hide it.

Test (small, targeted, DB-free):
- Add `src/app/admin/pending-count.test.ts` extracting the pure
  `countPending(entries: {when:number}[], latestCreatedAt:number): number` logic
  (or test via the action's exported helper) so the `when > latest` comparison is
  covered without a DB. Cover: all applied, some pending, none applied, `latest=0`
  (fresh/empty table → everything pending), and a NULL latest row (→ everything
  pending, mirroring Drizzle's `Number(null ?? 0)` effective-latest semantics).
- Add an explicit UI test for `RunMigrationsButton` at `pendingCount === null`
  (unknown state): it still renders and leaves the migration action available (is
  NOT hidden like a verified `0`), and the label does not fabricate a count. This
  is the regression guard for the "never claim/never hide on unknown" requirement.

Terra plan-review verdict (card t_c8a3c958): APPROVED with this single correction —
Task 1 mirrors Drizzle's ORDER BY created_at DESC LIMIT 1 (not MAX), plus the
explicit null/unknown UI test. Tasks 2 and 3 approved as written.

Scope guard: no change to `runMigrations`, Dockerfile, seed, `db:migrate`, admin
apply path, or migration tooling.

## Task 2 — admin mobile padding (layout only)

Verified convention: the sibling admin page
`src/app/admin/amenity-suggestions/page.tsx:32` uses
`<main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-10">`.

`admin/page.tsx` currently renders a bare `<div>` with no padding classes at line 31.

Change: replace the outer `<div>` in `admin/page.tsx` with
`<main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-10">`, keeping all
existing sections (Pending reviews, Database migrations), footer, bottom nav, and
card styles (`surfacePrimary`). Do not redesign. Round-trip with autbot/headless
verify at mobile width (375px).

## Task 3 — PR description rewrite

Use `gh pr edit 72 --repo BDubDesigns/parkquest --body-file <file>`.

Verified stale facts to fix:
- Remove `Closes #70` — issue #70 is CLOSED (separately completed); this PR must
  not claim to close it. (Verified via `gh issue view 70`.)
- Drop the outdated "16-file diff" claim.
- Add the Better Auth preview-host fix: production `parkquest.club`; HTTPS
  `*.parkquest.club` preview/subdomain support; unrelated hosts remain rejected.
  Confirm wording at `src/auth` / wherever Better Auth origins are set before
  writing (don't invent specifics).
- Mention previews compatible with the isolated preview deployment setup, without
  secrets/connection strings.
- Keep: park-detail passport treatment, stamp grid, persisted stamp color/rotation,
  admin dashboard, automatic migrations (via Coolify execute-command + admin apply),
  deployment documentation.
- Do not claim "no behavior changes" where untrue.
- Concise, factual, not a changelog novel.

## Validation (proportional to touched files)

- `npm run typecheck`
- `npm run test` (vitest; includes the new pending-count test)
- `npm run lint`
- `npm run format:check` (or run `npm run format` if CI expects clean)
- No local DB available on this box (no `.env`); CI runs the full suite against a
  real Postgres service (`DATABASE_URL` in `.github/workflows/ci.yml`). The DB-free
  unit test for pending-count is the local gate; CI is the integration gate.
- Manual visual check of `/admin` at mobile width via preview URL once live.

## Branch / final state

- Commit directly to `feat/70-park-detail-passport`, push.
- Do not create branch/PR/issue, do not merge, do not close.

## Out of scope (explicit)

- No broader review/refactor of PR #72.
- No preview-DB / seed / Coolify / Better-Auth-hostname changes beyond preserving
  already-working behavior.
- No change to migration tooling or `db:migrate`/startup path.
- Chatgpt's original prompt frames the bug as "tag vs hash 'not necessarily the
  same'." Verified reality is stronger: they are categorically never equal, and
  Drizzle's real applied-tracking is time-based. Plan follows Drizzle truth.