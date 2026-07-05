CREATE TYPE "public"."amenity_suggestion_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."amenity_suggestion_type" AS ENUM('add', 'remove');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE TABLE "amenity_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"park_id" uuid NOT NULL,
	"amenity_id" uuid NOT NULL,
	"suggestion_type" "amenity_suggestion_type" NOT NULL,
	"status" "amenity_suggestion_status" DEFAULT 'pending' NOT NULL,
	"submitted_by_user_id" text NOT NULL,
	"reviewed_by_user_id" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "amenity_suggestions" ADD CONSTRAINT "amenity_suggestions_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amenity_suggestions" ADD CONSTRAINT "amenity_suggestions_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "amenity_suggestions_park_status_idx" ON "amenity_suggestions" USING btree ("park_id","status");--> statement-breakpoint
CREATE INDEX "amenity_suggestions_status_created_at_idx" ON "amenity_suggestions" USING btree ("status","created_at");
