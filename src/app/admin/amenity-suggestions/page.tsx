import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { amenitySuggestions } from "@/db/public";
import { card, eyebrow, mutedText } from "@/components/ui/styles";
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
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Amenity verification queue
      </h1>
      <p className={`mt-2 ${mutedText}`}>
        Approve or reject pending amenity correction suggestions.
      </p>
      <section className={`mt-6 ${card}`}>
        <h2 className={eyebrow}>Pending suggestions</h2>
        {suggestions.length === 0 ? (
          <p className={`mt-3 text-sm ${mutedText}`}>No pending suggestions.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4"
              >
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-white">
                    {suggestion.suggestionType === "add" ? "Add" : "Remove"}{" "}
                    {suggestion.amenity.name}
                  </p>
                  <p className={mutedText}>Park: {suggestion.park.name}</p>
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
    </div>
  );
}
