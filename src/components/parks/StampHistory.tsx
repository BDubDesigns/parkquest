import {
  dividerSubtle,
  mutedText,
  surfacePrimary,
} from "@/components/ui/styles";
import StampForm from "./StampForm";
import StampGrid from "./StampGrid";

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

export default function StampHistory({
  visits,
  visitCount,
  parkSlug,
  parkName,
  stampedToday,
}: Props) {
  const liveStamps = visits.filter((v) => v.visitSource === "live_stamp");
  const backfills = visits.filter((v) => v.visitSource === "backfill");

  const liveCount = liveStamps.length;
  const backfillCount = backfills.length;

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

  const serialNumber = makeSerialNumber(parkSlug);

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

      {liveStamps.length > 0 && (
        <div className={`mt-5 border-t ${dividerSubtle} pt-4`}>
          <StampGrid
            stamps={liveStamps.map((v) => ({
              ...v,
              formattedDate: formatDate(v.visitDate),
            }))}
            parkName={parkName}
            serialNumber={serialNumber}
          />
        </div>
      )}

      {backfills.length > 0 && (
        <div className={`mt-4 space-y-1 border-t ${dividerSubtle} pt-4`}>
          <p className="text-sm font-semibold text-graphite/55">
            Past visits
          </p>
          {backfills.map((v) => (
            <p key={v.id} className="text-sm text-graphite/60">
              {formatDate(v.visitDate)}
              {v.notes && (
                <span className="italic"> &mdash; &ldquo;{v.notes}&rdquo;</span>
              )}
            </p>
          ))}
        </div>
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
