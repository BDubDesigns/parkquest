"use server";

import { revalidatePath } from "next/cache";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getCurrentAdminUserId } from "@/lib/admin";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function runMigrations(): Promise<{
  success: boolean;
  message: string;
}> {
  const adminUserId = await getCurrentAdminUserId();
  if (!adminUserId) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await db.execute(
      sql`SELECT pg_advisory_lock(hashtextextended('parkquest_migrations', 0))`,
    );

    await migrate(db, { migrationsFolder: "./drizzle" });

    revalidatePath("/admin");
    return { success: true, message: "Migrations applied successfully." };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown migration error.";
    return { success: false, message };
  } finally {
    try {
      await db.execute(
        sql`SELECT pg_advisory_unlock(hashtextextended('parkquest_migrations', 0))`,
      );
    } catch {
      // lock released on session end
    }
  }
}

type JournalEntry = { tag: string; when: number };

/**
 * Pure, DB-free accounting of how many journal entries Drizzle would still
 * apply. Mirrors the migrator's applied-tracking check exactly
 * (`!lastDbMigration || Number(created_at) < folderMillis` in
 * pg-core/dialect.cjs): a journal entry is pending when its `when`
 * (folderMillis) is strictly newer than the effective latest applied time.
 */
export function countPending(
  entries: Pick<JournalEntry, "when">[],
  effectiveLatest: number,
): number {
  return entries.filter((entry) => entry.when > effectiveLatest).length;
}

export async function getPendingMigrationCount(): Promise<number | null> {
  let journalEntries: JournalEntry[];
  try {
    const journal = JSON.parse(
      readFileSync(join(process.cwd(), "drizzle/meta/_journal.json"), "utf-8"),
    );
    journalEntries = journal.entries as JournalEntry[];
  } catch {
    // Journal unreadable/corrupt — state genuinely cannot be determined.
    return null;
  }

  let effectiveLatest: number;
  try {
    // Single latest applied migration, exactly as Drizzle's migrator reads it
    // (`select id, hash, created_at from drizzle.__drizzle_migrations order by
    // created_at desc limit 1`). An empty table is the same as Drizzle's
    // `!lastDbMigration`, so `created_at ?? 0` leaves everything pending.
    const result = await db.execute<{ created_at: string | null }>(
      sql`SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1`,
    );
    effectiveLatest = Number(result.rows[0]?.created_at ?? 0);
  } catch {
    // DB unreachable / migrations table missing — never report a false 0.
    return null;
  }

  return countPending(journalEntries, effectiveLatest);
}
