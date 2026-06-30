import { amenities, regions } from "../schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../schema";

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
