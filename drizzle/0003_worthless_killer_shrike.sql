CREATE TABLE "family_park_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_group_id" uuid NOT NULL,
	"park_id" uuid NOT NULL,
	"nickname" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "family_park_preferences" ADD CONSTRAINT "family_park_preferences_family_group_id_family_groups_id_fk" FOREIGN KEY ("family_group_id") REFERENCES "public"."family_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_park_preferences" ADD CONSTRAINT "family_park_preferences_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "family_park_preferences_family_group_id_park_id_idx" ON "family_park_preferences" USING btree ("family_group_id","park_id");