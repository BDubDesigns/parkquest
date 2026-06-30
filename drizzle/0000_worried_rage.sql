CREATE TYPE "public"."amenity_verification_status" AS ENUM('unverified', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."family_member_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TYPE "public"."quest_status" AS ENUM('assigned', 'completed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."region_type" AS ENUM('city', 'county', 'state', 'other');--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "amenities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "park_amenities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parkId" uuid NOT NULL,
	"amenityId" uuid NOT NULL,
	"verificationStatus" "amenity_verification_status" DEFAULT 'unverified' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"regionId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"sourceUrl" varchar(512),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "region_type" DEFAULT 'city' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "regions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "badge_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"criteria" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "badge_definitions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "earned_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"familyGroupId" uuid NOT NULL,
	"badgeDefinitionId" uuid NOT NULL,
	"earnedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"familyGroupId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" "family_member_role" DEFAULT 'member' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"criteria" jsonb,
	"xpReward" integer DEFAULT 0 NOT NULL,
	"isDaily" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quest_definitions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quest_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"familyGroupId" uuid NOT NULL,
	"questDefinitionId" uuid NOT NULL,
	"assignedDate" date NOT NULL,
	"status" "quest_status" DEFAULT 'assigned' NOT NULL,
	"completedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"familyGroupId" uuid NOT NULL,
	"parkId" uuid NOT NULL,
	"visitDate" date NOT NULL,
	"arrivalTime" time,
	"leaveTime" time,
	"rating" integer,
	"feltSafe" boolean,
	"notes" text,
	"createdByUserId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visits_rating_check" CHECK ("visits"."rating" IS NULL OR ("visits"."rating" >= 1 AND "visits"."rating" <= 5))
);
--> statement-breakpoint
CREATE TABLE "xp_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"familyGroupId" uuid NOT NULL,
	"amount" integer NOT NULL,
	"reason" varchar(100),
	"sourceVisitId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "park_amenities" ADD CONSTRAINT "park_amenities_parkId_parks_id_fk" FOREIGN KEY ("parkId") REFERENCES "public"."parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "park_amenities" ADD CONSTRAINT "park_amenities_amenityId_amenities_id_fk" FOREIGN KEY ("amenityId") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_regionId_regions_id_fk" FOREIGN KEY ("regionId") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "earned_badges" ADD CONSTRAINT "earned_badges_familyGroupId_family_groups_id_fk" FOREIGN KEY ("familyGroupId") REFERENCES "public"."family_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "earned_badges" ADD CONSTRAINT "earned_badges_badgeDefinitionId_badge_definitions_id_fk" FOREIGN KEY ("badgeDefinitionId") REFERENCES "public"."badge_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_familyGroupId_family_groups_id_fk" FOREIGN KEY ("familyGroupId") REFERENCES "public"."family_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_familyGroupId_family_groups_id_fk" FOREIGN KEY ("familyGroupId") REFERENCES "public"."family_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_questDefinitionId_quest_definitions_id_fk" FOREIGN KEY ("questDefinitionId") REFERENCES "public"."quest_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_familyGroupId_family_groups_id_fk" FOREIGN KEY ("familyGroupId") REFERENCES "public"."family_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_parkId_parks_id_fk" FOREIGN KEY ("parkId") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_events" ADD CONSTRAINT "xp_events_familyGroupId_family_groups_id_fk" FOREIGN KEY ("familyGroupId") REFERENCES "public"."family_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_events" ADD CONSTRAINT "xp_events_sourceVisitId_visits_id_fk" FOREIGN KEY ("sourceVisitId") REFERENCES "public"."visits"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "park_amenities_park_id_amenity_id_idx" ON "park_amenities" USING btree ("parkId","amenityId");--> statement-breakpoint
CREATE INDEX "parks_region_id_idx" ON "parks" USING btree ("regionId");--> statement-breakpoint
CREATE UNIQUE INDEX "earned_badges_family_group_id_badge_definition_id_idx" ON "earned_badges" USING btree ("familyGroupId","badgeDefinitionId");--> statement-breakpoint
CREATE UNIQUE INDEX "family_members_family_group_id_user_id_idx" ON "family_members" USING btree ("familyGroupId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "quest_progress_family_group_id_quest_definition_id_assigned_date_idx" ON "quest_progress" USING btree ("familyGroupId","questDefinitionId","assignedDate");--> statement-breakpoint
CREATE INDEX "quest_progress_family_group_id_assigned_date_idx" ON "quest_progress" USING btree ("familyGroupId","assignedDate");--> statement-breakpoint
CREATE INDEX "visits_family_group_id_park_id_idx" ON "visits" USING btree ("familyGroupId","parkId");--> statement-breakpoint
CREATE INDEX "xp_events_family_group_id_idx" ON "xp_events" USING btree ("familyGroupId");