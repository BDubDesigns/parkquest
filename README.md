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
