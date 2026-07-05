import "dotenv/config";
import { Pool } from "pg";
import { parseAdminEmails, summarizeAdminSync } from "../lib/admin-sync";

async function main() {
  const parsed = parseAdminEmails(process.env.PARKQUEST_ADMIN_EMAILS);
  if (parsed.error) {
    console.error(parsed.error);
    process.exitCode = 1;
    return;
  }

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
    console.error("DATABASE_URL must be set to sync ParkQuest admins.");
    process.exitCode = 1;
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const existing = await pool.query<{ email: string; is_admin: boolean }>(
      `select email, is_admin from "user" where lower(email) = any($1::text[])`,
      [parsed.emails],
    );

    const summary = summarizeAdminSync(
      parsed.emails,
      existing.rows.map((row) => ({
        email: row.email,
        isAdmin: row.is_admin,
      })),
    );

    if (summary.promoted.length > 0) {
      await pool.query(
        `update "user" set is_admin = true, updated_at = now() where lower(email) = any($1::text[])`,
        [summary.promoted],
      );
    }

    console.log("ParkQuest admin sync complete.");
    console.log(
      `Configured admin emails: ${parsed.emails.length} (${parsed.emails.join(", ")})`,
    );
    console.log(
      `Promoted existing users: ${summary.promoted.length}${formatEmailList(summary.promoted)}`,
    );
    console.log(
      `Already admins: ${summary.alreadyAdmin.length}${formatEmailList(summary.alreadyAdmin)}`,
    );
    console.log(
      `Configured emails not found: ${summary.notFound.length}${formatEmailList(summary.notFound)}`,
    );
  } finally {
    await pool.end();
  }
}

function formatEmailList(emails: string[]): string {
  return emails.length > 0 ? ` (${emails.join(", ")})` : "";
}

main().catch((err: unknown) => {
  console.error("ParkQuest admin sync failed.");
  if (err instanceof Error) {
    console.error(err.message);
  }
  process.exitCode = 1;
});
