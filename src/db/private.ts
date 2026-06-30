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
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const familyMembers = pgTable(
  "family_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyGroupId: uuid("family_group_id")
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    // No FK yet — Better Auth user tables arrive in issue #7.
    // varchar (not uuid) because we don't assume Better Auth's user ID type
    // before integration. Length 255 covers common ID formats.
    userId: varchar("user_id", { length: 255 }).notNull(),
    role: familyMemberRoleEnum("role").default("member").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
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
    id: uuid("id").primaryKey().defaultRandom(),
    familyGroupId: uuid("family_group_id")
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id),
    visitDate: date("visit_date").notNull(),
    arrivalTime: time("arrival_time"),
    leaveTime: time("leave_time"),
    rating: integer("rating"),
    // Nullable at the DB level to allow drafts/imports. Issue #8 must
    // require the safety answer in the visit logging flow.
    feltSafe: boolean("felt_safe"),
    notes: text("notes"),
    // Records which signed-in user created the visit. No FK yet —
    // Better Auth user tables arrive in issue #7. Visits still belong
    // to the family group; this field is for audit purposes only.
    // varchar (not uuid) because we don't assume Better Auth's user ID type.
    createdByUserId: varchar("created_by_user_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
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
    id: uuid("id").primaryKey().defaultRandom(),
    familyGroupId: uuid("family_group_id")
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: varchar("reason", { length: 100 }),
    sourceVisitId: uuid("source_visit_id").references(() => visits.id, {
      onDelete: "set null",
    }),
    // Append-only: no updatedAt column. Do not UPDATE or DELETE
    // XP events in application code (enforced from issue #10+).
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("xp_events_family_group_id_idx").on(table.familyGroupId)],
);

export const badgeDefinitions = pgTable("badge_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  // Data-driven badge criteria for the awarding engine (issue #11).
  criteria: jsonb("criteria"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const earnedBadges = pgTable(
  "earned_badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyGroupId: uuid("family_group_id")
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    badgeDefinitionId: uuid("badge_definition_id")
      .notNull()
      .references(() => badgeDefinitions.id),
    earnedAt: timestamp("earned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("earned_badges_family_group_id_badge_definition_id_idx").on(
      table.familyGroupId,
      table.badgeDefinitionId,
    ),
  ],
);

export const questDefinitions = pgTable("quest_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  // Data-driven quest criteria for assignment/completion (issue #12).
  criteria: jsonb("criteria"),
  xpReward: integer("xp_reward").default(0).notNull(),
  isDaily: boolean("is_daily").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const questProgress = pgTable(
  "quest_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyGroupId: uuid("family_group_id")
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    questDefinitionId: uuid("quest_definition_id")
      .notNull()
      .references(() => questDefinitions.id),
    assignedDate: date("assigned_date").notNull(),
    status: questStatusEnum("status").default("assigned").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
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
