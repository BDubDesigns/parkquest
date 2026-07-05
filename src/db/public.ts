import {
  boolean,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  amenitySuggestionStatusEnum,
  amenitySuggestionTypeEnum,
  amenityVerificationStatusEnum,
  regionTypeEnum,
} from "./enums";

export const regions = pgTable("regions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  type: regionTypeEnum("type").default("city").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const parks = pgTable(
  "parks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    regionId: uuid("region_id")
      .notNull()
      .references(() => regions.id),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    sourceUrl: varchar("source_url", { length: 512 }),
    officialUrl: varchar("official_url", { length: 512 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("parks_region_id_idx").on(table.regionId)],
);

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const parkAmenities = pgTable(
  "park_amenities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id, { onDelete: "cascade" }),
    amenityId: uuid("amenity_id")
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
    // Public park pages (issue #5) should only treat `verified` rows as
    // public facts. `unverified` and `rejected` rows must not be displayed
    // as verified amenities.
    verificationStatus: amenityVerificationStatusEnum("verification_status")
      .default("unverified")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("park_amenities_park_id_amenity_id_idx").on(
      table.parkId,
      table.amenityId,
    ),
  ],
);

export const amenitySuggestions = pgTable(
  "amenity_suggestions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id, { onDelete: "cascade" }),
    amenityId: uuid("amenity_id")
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
    suggestionType: amenitySuggestionTypeEnum("suggestion_type").notNull(),
    status: amenitySuggestionStatusEnum("status").default("pending").notNull(),
    submittedByUserId: text("submitted_by_user_id").notNull(),
    reviewedByUserId: text("reviewed_by_user_id"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("amenity_suggestions_park_status_idx").on(table.parkId, table.status),
    index("amenity_suggestions_status_created_at_idx").on(
      table.status,
      table.createdAt,
    ),
  ],
);
