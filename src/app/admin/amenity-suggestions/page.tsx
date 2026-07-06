import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { amenitySuggestions } from "@/db/public";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  mutedText,
  sectionTitle,
  surfacePrimary,
} from "@/components/ui/styles";
import { getCurrentAdminUserId } from "@/lib/admin";
import ReviewButtons from "./ReviewButtons";

export const dynamic = "force-dynamic";

export default async function AmenitySuggestionsAdminPage() {
  const adminUserId = await getCurrentAdminUserId();
  if (!adminUserId) redirect("/");

  const suggestions = await db.query.amenitySuggestions.findMany({
    where: eq(amenitySuggestions.status, "pending"),
    with: {
      park: { columns: { name: true, slug: true } },
      amenity: { columns: { name: true } },
      submittedBy: { columns: { email: true, name: true } },
    },
    orderBy: [asc(amenitySuggestions.createdAt)],
  });

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 md:py-10">
      <SectionHeader
        as="h1"
        title="Amenity verification queue"
        description="Approve or reject pending amenity correction suggestions."
      />
      <section className={`mt-7 ${surfacePrimary}`}>
        <h2 className={sectionTitle}>Pending suggestions</h2>
        {suggestions.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Queue is clear"
              description={<p>There are no pending suggestions to review.</p>}
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-forest-ink/12">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="py-5 first:pt-1 last:pb-1">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-forest-ink">
                    {suggestion.suggestionType === "add" ? "Add" : "Remove"}{" "}
                    {suggestion.amenity.name}
                  </p>
                  <p className={mutedText}>
                    Park: {suggestion.park.name}
                  </p>
                  <p className={mutedText}>
                    Submitted by: {suggestion.submittedBy.name} (
                    {suggestion.submittedBy.email})
                  </p>
                </div>
                <div className="mt-3">
                  <ReviewButtons suggestionId={suggestion.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
