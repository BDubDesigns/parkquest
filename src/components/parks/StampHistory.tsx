import {
  dividerSubtle,
  mutedText,
  surfacePrimary,
} from "@/components/ui/styles";
import StampForm from "./StampForm";
import ParkQuestStamp from "./ParkQuestStamp";

interface VisitRow {
  id: string;
  visitDate: string;
  rating: number | null;
  notes: string | null;
  visitSource: "live_stamp" | "backfill";
  stampColor?: string | null;
  stampRotation?: number | null;
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

function makeSerialNumber(slug: string): string {
  const code = slug.replace(/-/g, "").toUpperCase().slice(0, 6);
  const suffix = String(slug.length).padStart(3, "0");
  return `PQ-${code}-${suffix}`;
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

  const statusLabel = stampedToday
    ? "Stamped today"
    : liveCount > 0
      ? "Stamped"
      : "In your history";

  const statusTone =
    stampedToday || liveCount > 0
      ? "bg-stamp-red/10 text-stamp-red"
      : "bg-graphite/8 text-graphite/65";

  return (
    <section className={`mt-6 sm:mt-8 ${surfacePrimary}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4 fill-none stroke-forest-ink/60 stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <rect x="3" y="1" width="14" height="18" rx="2" />
            <path d="M7 5h6M7 9h6M7 13h4" />
          </svg>
          <p className="text-xs font-semibold text-graphite/55">
            Passport entry
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusTone}`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-forest-ink">{heading}</p>

      {liveCount > 0 && (
        <p className={`mt-1 text-sm ${mutedText}`}>
          Stamped {liveCount} time{liveCount !== 1 ? "s" : ""}
        </p>
      )}
      {backfillCount > 0 && (
        <p className={`mt-1 text-sm ${mutedText}`}>
          Previously visited {backfillCount} time
          {backfillCount !== 1 ? "s" : ""}
        </p>
      )}

      {stampedToday && (
        <p className={`mt-2 text-sm ${mutedText}`}>
          Come back tomorrow for a fresh stamp.
        </p>
      )}

      {displayVisits.length > 0 && (
        <ol className={`mt-4 space-y-4 border-t ${dividerSubtle} pt-4`}>
          {displayVisits.map((v) => (
            <li key={v.id} className="flex items-start gap-3 text-sm">
              {v.visitSource === "live_stamp" ? (
                <ParkQuestStamp
                  topText="ParkQuest"
                  bottomText="Family Park Passport"
                  centerText={parkName}
                  date={formatDate(v.visitDate)}
                  serialNumber={makeSerialNumber(parkSlug)}
                  color={v.stampColor ?? "#12372a"}
                  rotation={v.stampRotation ?? 0}
                  size={64}
                  className="shrink-0"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-collectible border border-dashed border-forest-ink/16 text-xs text-graphite/45">
                  Visit
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {v.visitSource === "backfill" ? (
                    <span className="font-medium text-graphite/60">
                      Previously visited
                    </span>
                  ) : (
                    <span className="font-medium text-forest-ink">
                      {formatDate(v.visitDate)}
                    </span>
                  )}
                  {v.rating && <Stars count={v.rating} />}
                </div>
                {v.notes && (
                  <p className="mt-0.5 text-graphite/72 italic">
                    &ldquo;{v.notes}&rdquo;
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {visitCount > 5 && (
        <p className={`mt-3 text-xs ${mutedText}`}>
          Showing 5 most recent records.
        </p>
      )}

      {!stampedToday && (
        <div className={`mt-4 border-t ${dividerSubtle} pt-4`}>
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
