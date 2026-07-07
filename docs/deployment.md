# Deployment

## Quick reference

```bash
npm run build    # production build
npm run db:migrate  # apply pending database migrations
```

## Database migrations

Migrations live in `drizzle/` as numbered SQL files. Drizzle tracks which
migrations have been applied in a `__drizzle_migrations` table.

### Apply migrations

```bash
# On the production server, after deploying new code:
npm run db:migrate
```

This is safe to run multiple times — already-applied migrations are skipped.

### Admin panel fallback

If you can't SSH into the server, sign in as an admin user and visit `/admin`.
The admin dashboard shows pending migration counts and lets you apply them
from the browser.

### Writing new migrations

1. Edit the Drizzle schema in `src/db/`.
2. Run `npm run db:generate` to produce new migration SQL files.
3. Commit both the generated SQL and the updated journal files.
4. Deploy, then run `npm run db:migrate`.

## Environment

Required environment variables for production:

- `DATABASE_URL` — Postgres connection string
- Auth environment variables (see `src/lib/auth.ts`)

Copy `.env.example` and fill in production values. Never commit `.env`.
