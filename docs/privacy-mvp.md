# ParkQuest Privacy Model (MVP)

## Summary

ParkQuest is a family park passport app. The privacy model is built around family groups: every piece of private data is scoped to a `familyGroupId`, and only signed-in members of that family group can see it. Other families and signed-out visitors see only public park information.

## Data Classification

### Public Data

The following data is available to anyone visiting the site, signed in or not:

- Park names, descriptions, coordinates, and official/source URLs
- Region names
- Verified amenity names and slugs (only rows with `verification_status = 'verified'` are shown)
- Sticker/badge definitions (the list of stickers that exist, not who earned them)

Public pages: `/parks`, `/parks/[slug]`, `/map`.

### Private Data (Family Group)

The following data is scoped to a single family group and never visible to other families or signed-out visitors:

- Visit logs (park stamps) — when your family visited a park
- Visit notes / memories — free-text reflections about a visit
- Safety answers (`feltSafe` boolean) — whether you felt safe during a visit
- Ratings (1–5 stars) per visit
- Adventure Points (xp_events) — points earned from stamping parks
- Earned stickers (earned_badges) — which stickers your family has unlocked
- Park Passport progress — which parks your family has or hasn't stamped

Private pages: `/passport`, `/account`.

### Data Intentionally Not Collected

ParkQuest MVP does **not** collect or store:

- Photos of any kind
- Child-specific profile fields (age, birthdate, real name beyond display name)
- Location tracking or GPS logs
- Real-time presence or activity feeds
- Public reviews or comments on parks
- Social features (following, sharing, leaderboards)

## Child-Safety Stance

- There are no child-specific accounts, profiles, or fields. A family group shares one passport.
- Photos are not collected or stored, eliminating the primary vector for child-privacy exposure.
- Safety answers are stored as private family visit data and are not shown on public pages.
- No location tracking beyond the park coordinates (public data) is performed.
- All private data is isolated by `familyGroupId` at the database query level. There is no way for one family to view another family's stamps, memories, ratings, safety answers, points, or stickers.

## Future Photo Policy

If photos are added in a future release, they must follow these principles:

- Photos are private by default. A family's photos are only visible to that family group.
- No recognizable children in any public or shared photos. If public photo sharing is ever introduced, it must include clear warnings and opt-in consent.
- Photo uploads must never include EXIF geolocation data in the stored file.
- Any public photo feature must be opt-in per photo, not global.

## No Public Social or Review Features

ParkQuest MVP is a private family passport app. There are no public reviews, comments, ratings visible to other families, or social sharing features. This is an intentional design choice to keep the experience focused on family exploration rather than social comparison.

## Admin / Amenity Verification

- Amenities on the public park pages are shown only when `verification_status = 'verified'` in the `park_amenities` join table.
- Unverified or rejected amenity rows are never displayed to any user.

## Current Privacy Test Coverage

E2E tests verify all core cross-family isolation rules (all passing):

- `e2e/stamps.spec.ts` — second family cannot see first family's stamps or memories on park detail; signed-out user sees sign-in prompt, not private data.
- `e2e/passport.spec.ts` — second family sees 0/46 passport progress and cannot see first family's memory text.
- `e2e/xp.spec.ts` — second family sees 0 Adventure Points.
- `e2e/stickers.spec.ts` — second family sees 0/3 earned stickers, all sticker definitions shown as unearned.
- `e2e/auth.spec.ts` — signed-out users are redirected from protected routes; public routes remain accessible without auth.
