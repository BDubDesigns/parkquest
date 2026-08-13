# Deployment

## Quick reference

```bash
npm run build       # production build
docker compose up   # local production test
```

## How migrations run

Migrations are applied **automatically at container startup** via `start.sh`.
On every deploy, before the Next.js server starts, `npm run db:migrate` runs
against the Postgres database. Already-applied migrations are skipped safely.

The startup script uses Drizzle's built-in migration tracking
(`__drizzle_migrations` table) to know which migrations have already run.

## Database migrations

Migrations live in `drizzle/` as numbered SQL files tracked by
`drizzle/meta/_journal.json`.

### Apply manually if needed

```bash
# SSH into the production server and run:
docker exec -it <container> sh -c "cd /app/tools && npm run db:migrate"
```

### Admin panel fallback

If you can't access the server, sign in as an admin user and visit `/admin`.
The admin dashboard shows pending migration counts and lets you apply them
from the browser.

### Writing new migrations

1. Edit the Drizzle schema in `src/db/`.
2. Run `npm run db:generate` to produce new migration SQL files.
3. Commit the generated SQL and updated journal files.
4. Deploy — migrations run automatically on container start.

## Environment

Required environment variables for production:

- `DATABASE_URL` — Postgres connection string
- `BETTER_AUTH_SECRET` — auth encryption key
- `BETTER_AUTH_URL` — public URL of the app

Copy `.env.example` and fill in production values. Never commit `.env`.
