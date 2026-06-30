import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { parks } from "./public";
import { familyMemberRoleEnum, questStatusEnum } from "./enums";

export const familyGroups = pgTable("family_groups", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const familyMembers = pgTable(
  "family_members",
  {
    id: uuid().primaryKey().defaultRandom(),
    familyGroupId: uuid()
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    // No FK yet — Better Auth user tables arrive in issue #7.
    userId: uuid().notNull(),
    role: familyMemberRoleEnum().default("member").notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("family_members_family_group_id_user_id_idx").on(
      table.familyGroupId,
      table.userId,
    ),
  ],
);

export const visits = pgTable(
  "visits",
  {
    id: uuid().primaryKey().defaultRandom(),
    familyGroupId: uuid()
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    parkId: uuid()
      .notNull()
      .references(() => parks.id),
    visitDate: date().notNull(),
    arrivalTime: time(),
    leaveTime: time(),
    rating: integer(),
    // Nullable at the DB level to allow drafts/imports. Issue #8 must
    // require the safety answer in the visit logging flow.
    feltSafe: boolean(),
    notes: text(),
    // Records which signed-in user created the visit. No FK yet —
    // Better Auth user tables arrive in issue #7. Visits still belong
    // to the family group; this field is for audit purposes only.
    createdByUserId: uuid(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("visits_family_group_id_park_id_idx").on(
      table.familyGroupId,
      table.parkId,
    ),
    check(
      "visits_rating_check",
      sql`${table.rating} IS NULL OR (${table.rating} >= 1 AND ${table.rating} <= 5)`,
    ),
  ],
);

export const xpEvents = pgTable(
  "xp_events",
  {
    id: uuid().primaryKey().defaultRandom(),
    familyGroupId: uuid()
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    amount: integer().notNull(),
    reason: varchar({ length: 100 }),
    sourceVisitId: uuid().references(() => visits.id, {
      onDelete: "set null",
    }),
    // Append-only: no updatedAt column. Do not UPDATE or DELETE
    // XP events in application code (enforced from issue #10+).
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("xp_events_family_group_id_idx").on(table.familyGroupId)],
);

export const badgeDefinitions = pgTable("badge_definitions", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  // Data-driven badge criteria for the awarding engine (issue #11).
  criteria: jsonb(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const earnedBadges = pgTable(
  "earned_badges",
  {
    id: uuid().primaryKey().defaultRandom(),
    familyGroupId: uuid()
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    badgeDefinitionId: uuid()
      .notNull()
      .references(() => badgeDefinitions.id),
    earnedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("earned_badges_family_group_id_badge_definition_id_idx").on(
      table.familyGroupId,
      table.badgeDefinitionId,
    ),
  ],
);

export const questDefinitions = pgTable("quest_definitions", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  // Data-driven quest criteria for assignment/completion (issue #12).
  criteria: jsonb(),
  xpReward: integer().default(0).notNull(),
  isDaily: boolean().default(true).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const questProgress = pgTable(
  "quest_progress",
  {
    id: uuid().primaryKey().defaultRandom(),
    familyGroupId: uuid()
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    questDefinitionId: uuid()
      .notNull()
      .references(() => questDefinitions.id),
    assignedDate: date().notNull(),
    status: questStatusEnum().default("assigned").notNull(),
    completedAt: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex(
      "quest_progress_family_group_id_quest_definition_id_assigned_date_idx",
    ).on(table.familyGroupId, table.questDefinitionId, table.assignedDate),
    index("quest_progress_family_group_id_assigned_date_idx").on(
      table.familyGroupId,
      table.assignedDate,
    ),
  ],
);
