import { pgEnum } from "drizzle-orm/pg-core";

export const regionTypeEnum = pgEnum("region_type", [
  "city",
  "county",
  "state",
  "other",
]);

export const amenityVerificationStatusEnum = pgEnum(
  "amenity_verification_status",
  ["unverified", "verified", "rejected"],
);

export const familyMemberRoleEnum = pgEnum("family_member_role", [
  "owner",
  "member",
]);

export const questStatusEnum = pgEnum("quest_status", [
  "assigned",
  "completed",
  "expired",
]);

export const visitSourceEnum = pgEnum("visit_source", [
  "live_stamp",
  "backfill",
]);

export const boardStatusEnum = pgEnum("board_status", ["active", "replaced"]);
