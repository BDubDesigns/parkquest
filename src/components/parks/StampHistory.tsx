import {
  collectibleTitle,
  dividerSubtleDaylight,
  mutedTextDaylight,
  surfacePrimary,
} from "@/components/ui/styles";
import StampForm from "./StampForm";

interface VisitRow {
  id: string;
  visitDate: string;
  rating: number | null;
  notes: string | null;
  visitSource: "live_stamp" | "backfill";
}

interface Props {
  visits: VisitRow[];
  visitCount: number;
  parkSlug: string;
  parkName: string;
  stampedToday?: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stars({ count }: { count: number }) {
  const filled = "\u2605".repeat(count);
  const empty = "\u2606".repeat(5 - count);
  return (
    <span className="text-reward-ink" aria-label={`${count} out of 5 stars`}>
      {filled}
      {empty}
    </span>
  );
}

export default function StampHistory({
  visits,
  visitCount,
  parkSlug,
  parkName,
  stampedToday,
}: Props) {
  const displayVisits = visits.slice(0, 5);

  const liveCount = visits.filter((v) => v.visitSource === "live_stamp").length;
  const backfillCount = visits.filter(
    (v) => v.visitSource === "backfill",
  ).length;

  const heading = stampedToday
    ? "Today's stamp is already in your passport."
    : backfillCount > 0 && liveCount === 0
      ? "This park is in your family history."
      : "Stamped! This park is in your family passport.";

  return (
    <section className={`mt-6 sm:mt-8 ${surfacePrimary}`}>
      <h2 className={collectibleTitle}>Park Passport</h2>

      <p className="mt-2 text-sm font-semibold text-forest-ink">{heading}</p>

      {liveCount > 0 && (
        <p className={`mt-1 text-sm ${mutedTextDaylight}`}>
          Stamped {liveCount} time{liveCount !== 1 ? "s" : ""}
        </p>
      )}
      {backfillCount > 0 && (
        <p className={`mt-1 text-sm ${mutedTextDaylight}`}>
          Previously visited {backfillCount} time
          {backfillCount !== 1 ? "s" : ""}
        </p>
      )}

      {stampedToday && (
        <p className={`mt-2 text-sm ${mutedTextDaylight}`}>
          Come back tomorrow for a fresh stamp.
        </p>
      )}

      {displayVisits.length > 0 && (
        <ol className={`mt-4 space-y-3 border-t ${dividerSubtleDaylight} pt-4`}>
          {displayVisits.map((v) => (
            <li key={v.id} className="text-sm">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {v.visitSource === "backfill" ? (
                  <span className="text-graphite/65 italic">
                    Previously visited
                  </span>
                ) : (
                  <span className={mutedTextDaylight}>
                    {formatDate(v.visitDate)}
                  </span>
                )}
                {v.rating && <Stars count={v.rating} />}
              </div>
              {v.notes && (
                <p className="mt-1 text-graphite/72 italic">
                  &ldquo;{v.notes}&rdquo;
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      {visitCount > 5 && (
        <p className={`mt-3 text-xs ${mutedTextDaylight}`}>
          Showing 5 most recent records.
        </p>
      )}

      {!stampedToday && (
        <div className={`mt-4 border-t ${dividerSubtleDaylight} pt-4`}>
          <StampForm
            key={`${parkSlug}-${visitCount}`}
            parkSlug={parkSlug}
            parkName={parkName}
            alreadyStamped
          />
        </div>
      )}
    </section>
  );
}
