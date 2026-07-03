CREATE TYPE "public"."board_status" AS ENUM('active', 'replaced');--> statement-breakpoint
CREATE TABLE "quest_boards" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "family_group_id" uuid NOT NULL REFERENCES "family_groups"("id") ON DELETE CASCADE,
  "status" "board_status" NOT NULL DEFAULT 'active',
  "created_app_date" date NOT NULL,
  "manual_refresh_date" date,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);--> statement-breakpoint
CREATE INDEX "quest_boards_family_group_id_idx" ON "quest_boards" ("family_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "quest_boards_one_active_per_family_idx" ON "quest_boards" ("family_group_id") WHERE "status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "quest_boards_one_manual_refresh_per_family_date_idx" ON "quest_boards" ("family_group_id", "manual_refresh_date") WHERE "manual_refresh_date" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD COLUMN "quest_board_id" uuid REFERENCES "quest_boards"("id") ON DELETE CASCADE;--> statement-breakpoint
DO $$
DECLARE
  rec RECORD;
  board_id uuid;
BEGIN
  FOR rec IN
    SELECT DISTINCT qp.family_group_id, qp.assigned_date
    FROM quest_progress qp
    WHERE qp.quest_board_id IS NULL
    ORDER BY qp.family_group_id, qp.assigned_date
  LOOP
    board_id := gen_random_uuid();
    INSERT INTO quest_boards (id, family_group_id, status, created_app_date, manual_refresh_date)
    VALUES (board_id, rec.family_group_id, 'replaced', rec.assigned_date, NULL);
    UPDATE quest_progress
    SET quest_board_id = board_id
    WHERE family_group_id = rec.family_group_id
      AND assigned_date = rec.assigned_date
      AND quest_board_id IS NULL;
  END LOOP;
END $$;--> statement-breakpoint
WITH latest_board AS (
  SELECT DISTINCT ON (family_group_id) id
  FROM quest_boards
  ORDER BY family_group_id, created_app_date DESC
)
UPDATE quest_boards
SET status = 'active'
FROM latest_board
WHERE quest_boards.id = latest_board.id;--> statement-breakpoint
UPDATE quest_progress
SET status = 'expired'
WHERE quest_board_id IN (
  SELECT id FROM quest_boards WHERE status = 'replaced'
)
AND status = 'assigned';--> statement-breakpoint
ALTER TABLE "quest_progress" ALTER COLUMN "quest_board_id" SET NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS "quest_progress_family_group_id_quest_definition_id_assigned_date_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "quest_progress_family_group_id_assigned_date_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "quest_progress_family_group_id_quest_definition_id_board_idx" ON "quest_progress" ("family_group_id", "quest_definition_id", "quest_board_id");--> statement-breakpoint
CREATE INDEX "quest_progress_family_group_id_board_id_idx" ON "quest_progress" ("family_group_id", "quest_board_id");
