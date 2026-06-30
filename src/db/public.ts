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
import { amenityVerificationStatusEnum, regionTypeEnum } from "./enums";

export const regions = pgTable("regions", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  type: regionTypeEnum().default("city").notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const parks = pgTable(
  "parks",
  {
    id: uuid().primaryKey().defaultRandom(),
    regionId: uuid()
      .notNull()
      .references(() => regions.id),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    description: text(),
    latitude: doublePrecision().notNull(),
    longitude: doublePrecision().notNull(),
    sourceUrl: varchar({ length: 512 }),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("parks_region_id_idx").on(table.regionId)],
);

export const amenities = pgTable("amenities", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const parkAmenities = pgTable(
  "park_amenities",
  {
    id: uuid().primaryKey().defaultRandom(),
    parkId: uuid()
      .notNull()
      .references(() => parks.id, { onDelete: "cascade" }),
    amenityId: uuid()
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
    // Public park pages (issue #5) should only treat `verified` rows as
    // public facts. `unverified` and `rejected` rows must not be displayed
    // as verified amenities.
    verificationStatus: amenityVerificationStatusEnum()
      .default("unverified")
      .notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("park_amenities_park_id_amenity_id_idx").on(
      table.parkId,
      table.amenityId,
    ),
  ],
);
