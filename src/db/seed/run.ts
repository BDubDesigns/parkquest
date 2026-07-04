import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import * as schema from "../schema";
import {
  seedSharedData,
  seedPassportChallengeDefinitions,
  seedStickerDefinitions,
} from "./seed-shared";
import { parks, parkAmenities } from "../schema";
import { bellinghamParkRecords } from "./data/parks/bellingham";
import { bellinghamParkAmenityLinks } from "./data/park-amenities/bellingham";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({
  client: pool,
  schema,
}) as import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PRODUCTION_SEED !== "1"
  ) {
    console.error(
      "ABORTING: NODE_ENV is production and ALLOW_PRODUCTION_SEED is not set.\n" +
        "This script seeds public atlas data (regions, parks, amenities).\n" +
        "If you are certain you want to run it in production, set exactly:\n" +
        "  ALLOW_PRODUCTION_SEED=1\n" +
        "Make sure the production database has already had migrations applied.",
    );
    process.exit(1);
  }

  console.log("Starting seed...\n");

  // Step 1: Amenities + regions + sticker definitions (shared across all regions)
  await seedSharedData(db);

  // Step 1b: Sticker definitions
  await seedStickerDefinitions(db);

  // Step 1c: Passport Challenge definitions (daily quests)
  await seedPassportChallengeDefinitions(db);

  // Step 2: Look up Bellingham region ID
  const regionRow = await db
    .select({ id: schema.regions.id })
    .from(schema.regions)
    .where(eq(schema.regions.slug, "bellingham-wa"))
    .then((r) => r[0]);
  const regionId = regionRow!.id;

  // Step 3: Build and insert Bellingham park records
  console.log(`Seeding Bellingham parks (${bellinghamParkRecords.length})...`);
  const parkInsertValues = bellinghamParkRecords.map((p) => ({
    name: p.name,
    slug: p.slug,
    regionId,
    description: p.description,
    latitude: p.latitude,
    longitude: p.longitude,
    sourceUrl: p.sourceUrl,
    officialUrl: p.officialUrl,
  }));
  await db
    .insert(parks)
    .values(parkInsertValues)
    .onConflictDoUpdate({
      target: parks.slug,
      set: { officialUrl: sql`excluded.official_url` },
    });

  // Step 4: Resolve IDs by slug
  const allParks = await db
    .select({ id: schema.parks.id, slug: schema.parks.slug })
    .from(schema.parks);
  const parkMap = new Map<string, string>();
  for (const p of allParks) parkMap.set(p.slug, p.id);

  const allAmenities = await db
    .select({ id: schema.amenities.id, slug: schema.amenities.slug })
    .from(schema.amenities);
  const amenityMap = new Map<string, string>();
  for (const a of allAmenities) amenityMap.set(a.slug, a.id);

  // Step 5: Build and insert park-amenity links
  const links = bellinghamParkAmenityLinks.flatMap((link) => {
    const parkId = parkMap.get(link.parkSlug);
    if (!parkId) {
      console.warn(`  WARNING: Park "${link.parkSlug}" not found — skipping`);
      return [];
    }
    return (link.verifiedAmenitySlugs ?? [])
      .filter((slug) => amenityMap.has(slug))
      .map((slug) => ({
        parkId,
        amenityId: amenityMap.get(slug)!,
        verificationStatus: "verified" as const,
      }));
  });

  if (links.length > 0) {
    console.log(`Seeding park amenity links (${links.length})...`);
    await db.insert(parkAmenities).values(links).onConflictDoNothing();
  } else {
    console.log("No park amenity links to seed in this pass.");
  }

  console.log("\nSeed complete.");

  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
