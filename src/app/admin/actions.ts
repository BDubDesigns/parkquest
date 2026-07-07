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

export async function getPendingMigrationCount(): Promise<number> {
  try {
    const journal = JSON.parse(
      readFileSync(join(process.cwd(), "drizzle/meta/_journal.json"), "utf-8"),
    );
    const journalTags: string[] = journal.entries.map(
      (e: { tag: string }) => e.tag,
    );

    const result = await db
      .execute<{ hash: string }>(sql`SELECT hash FROM __drizzle_migrations`);

    const applied = new Set(result.rows.map((r) => r.hash));
    return journalTags.filter((tag) => !applied.has(tag)).length;
  } catch {
    return 0;
  }
}
