CREATE TYPE "public"."visit_source" AS ENUM('live_stamp', 'backfill');--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "visit_source" "visit_source" DEFAULT 'live_stamp' NOT NULL;