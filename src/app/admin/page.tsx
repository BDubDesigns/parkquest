import { redirect } from "next/navigation";
import { eq, count } from "drizzle-orm";
import { db } from "@/db";
import { amenitySuggestions } from "@/db/public";
import { getCurrentAdminUserId } from "@/lib/admin";
import {
  actionPrimary,
  mutedText,
  sectionTitle,
  surfacePrimary,
} from "@/components/ui/styles";
import SectionHeader from "@/components/ui/SectionHeader";
import { RunMigrationsButton } from "./RunMigrationsButton";
import { getPendingMigrationCount } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminUserId = await getCurrentAdminUserId();
  if (!adminUserId) redirect("/");

  const pendingSuggestions = await db
    .select({ count: count() })
    .from(amenitySuggestions)
    .where(eq(amenitySuggestions.status, "pending"))
    .then((r) => r[0].count);

  const pendingMigrations = await getPendingMigrationCount();

  return (
    <div>
      <SectionHeader
        as="h1"
        title="Admin"
        description="Manage ParkQuest data and operations."
      />

      <section className={`mt-6 ${surfacePrimary}`}>
        <h2 className={sectionTitle}>Pending reviews</h2>
        <p className={`mt-2 text-sm ${mutedText}`}>
          {pendingSuggestions} amenity correction
          {pendingSuggestions !== 1 ? "s" : ""} awaiting review.
        </p>
        <a
          href="/admin/amenity-suggestions"
          className={`mt-3 inline-flex ${actionPrimary}`}
        >
          Review amenity suggestions
        </a>
      </section>

      <section className={`mt-6 ${surfacePrimary}`}>
        <h2 className={sectionTitle}>Database migrations</h2>
        <p className={`mt-2 text-sm ${mutedText}`}>
          {pendingMigrations > 0
            ? `${pendingMigrations} pending migration${pendingMigrations !== 1 ? "s" : ""}.`
            : "All migrations have been applied."}
        </p>
        <RunMigrationsButton pendingCount={pendingMigrations} />
      </section>
    </div>
  );
}
