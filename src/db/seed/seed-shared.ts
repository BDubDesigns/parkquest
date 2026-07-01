import { amenities, badgeDefinitions, questDefinitions, regions } from "../schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../schema";

/**
 * Daily Passport Challenges roll over by UTC date for MVP.
 * MVP assigns all seeded daily challenges each day.
 * Future work can rotate or select a smaller subset.
 */
export async function seedPassportChallengeDefinitions(
  db: NodePgDatabase<typeof schema>,
) {
  console.log("Seeding Passport Challenge definitions...");

  await db
    .insert(questDefinitions)
    .values([
      {
        name: "Park Passport Stamp",
        slug: "park-passport-stamp",
        description: "Stamp any park today.",
        criteria: { type: "any_park" },
        xpReward: 10,
        isDaily: true,
      },
      {
        name: "Park Scout",
        slug: "park-scout",
        description: "Visit a park you have not stamped before.",
        criteria: { type: "new_park" },
        xpReward: 25,
        isDaily: true,
      },
      {
        name: "Tiny Mountaineer",
        slug: "tiny-mountaineer",
        description: "Visit a park with a trail.",
        criteria: { type: "amenity", slug: "trail" },
        xpReward: 20,
        isDaily: true,
      },
      {
        name: "Playground Mission",
        slug: "playground-mission",
        description: "Visit a park with a playground.",
        criteria: { type: "amenity", slug: "playground" },
        xpReward: 20,
        isDaily: true,
      },
    ])
    .onConflictDoNothing();
}

export async function seedStickerDefinitions(
  db: NodePgDatabase<typeof schema>,
) {
  console.log("Seeding sticker definitions...");

  await db
    .insert(badgeDefinitions)
    .values([
      {
        name: "First Stamp",
        slug: "first-stamp",
        description: "Stamped your first park.",
        criteria: { type: "first_stamp" },
      },
      {
        name: "Five Parks",
        slug: "five-parks",
        description: "Stamped 5 different parks.",
        criteria: { type: "unique_park_count", count: 5 },
      },
      {
        name: "Return Explorer",
        slug: "return-explorer",
        description: "Returned to a park you already stamped.",
        criteria: { type: "repeat_park" },
      },
    ])
    .onConflictDoNothing();
}

export async function seedSharedData(db: NodePgDatabase<typeof schema>) {
  console.log("Seeding amenities...");

  await db
    .insert(amenities)
    .values([
      { name: "Waterfront", slug: "waterfront" },
      { name: "Water Feature", slug: "water-feature" },
      { name: "Playground", slug: "playground" },
      { name: "Slides", slug: "slides" },
      { name: "Swings", slug: "swings" },
      { name: "Spray Park", slug: "spray-park" },
      { name: "Restroom", slug: "restroom" },
      { name: "Picnic Table", slug: "picnic-table" },
      { name: "Trail", slug: "trail" },
      { name: "Sports Field", slug: "sports-field" },
      { name: "Basketball Court", slug: "basketball-court" },
      { name: "Tennis Court", slug: "tennis-court" },
      { name: "Pickleball Court", slug: "pickleball-court" },
      { name: "Dog Park", slug: "dog-park" },
      { name: "Beach", slug: "beach" },
      { name: "Viewpoint", slug: "viewpoint" },
      { name: "Garden", slug: "garden" },
    ])
    .onConflictDoNothing();

  console.log("Seeding regions...");

  await db
    .insert(regions)
    .values([{ name: "Bellingham, WA", slug: "bellingham-wa", type: "city" }])
    .onConflictDoNothing();
}
