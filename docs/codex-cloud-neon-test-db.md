# Codex Cloud Neon Test Database

Use this setup when running the full Vitest suite in Codex Cloud against the shared non-production Neon test database.

## Required Codex Cloud variables

Configure these as Codex Cloud environment variables/secrets. Do not commit their values.

- `DATABASE_URL` — secret; must point at the Neon non-production test database.
- `NODE_ENV=test`
- `BETTER_AUTH_SECRET` — secret or environment variable suitable for tests.
- `BETTER_AUTH_URL=http://localhost:3000`

## Safety behavior

Migration and seed commands print only a sanitized database summary before touching the database:

- database host
- database name
- whether `sslmode=require` is present

The scripts never print `DATABASE_URL`, usernames, passwords, or other secrets. They refuse to run migrations or seed when the host or database name looks production-like, Coolify production-like, `parkquest.club`-like, or otherwise not clearly local/test/dev/staging/non-production/Neon.

## Commands

From the repo root, run:

```bash
npm run db:migrate
npm run db:seed
npm run typecheck
npm run lint
npm run test
npm run test:coverage
```

`npm run test` still uses the application database configuration. When Codex Cloud provides `DATABASE_URL`, tests use that Neon database. When `DATABASE_URL` is not set, local development falls back to the local Postgres URL `postgresql://parkquest:changeme@localhost:5432/parkquest`.

## Notes

- Do not use production `DATABASE_URL`.
- Do not clone production data into the Neon test database.
- Do not commit `.env` files or database credentials.
- DB-backed integration tests, including the quest-board integration tests, should run as part of `npm run test`; do not skip them in Codex Cloud.
