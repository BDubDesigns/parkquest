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
