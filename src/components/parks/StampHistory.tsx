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

const GRID_COLS = 3;
const GRID_COLS_LG = 6;
const GRID_ROWS = 2;
const MAX_VISIBLE = GRID_COLS_LG * GRID_ROWS;

/**
 * Given the desired column count (from a specific breakpoint), returns the
 * maximum number of slots for a 2-row grid.
 */
function slotsForCols(cols: number): number {
  return cols * GRID_ROWS;
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

  // Show enough stamps to fill 2 rows at the widest breakpoint
  const visibleStamps = liveStamps.slice(0, MAX_VISIBLE);
  const totalSlots = slotsForCols(GRID_COLS);
  const emptySlots = Math.max(0, totalSlots - visibleStamps.length);

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

      {visibleStamps.length > 0 && (
        <div className={`mt-5 border-t ${dividerSubtle} pt-4`}>
          <div
            className="overflow-hidden rounded-xl border border-forest-ink/10"
            role="list"
            aria-label="Stamp collection"
          >
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
              style={{ gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
            >
              {visibleStamps.map((v) => (
                <div
                  key={v.id}
                  role="listitem"
                  className="flex flex-col items-center justify-end gap-2 border-r border-b border-forest-ink/10 p-3"
                  style={{ minHeight: "112px" }}
                >
                  <ParkQuestStamp
                    topText="ParkQuest"
                    bottomText="Family Park Passport"
                    centerText={parkName}
                    date={formatDate(v.visitDate)}
                    serialNumber={serialNumber}
                    color={v.stampColor ?? "#12372a"}
                    rotation={v.stampRotation ?? 0}
                    size={64}
                  />
                  <p className="text-xs text-graphite/50">
                    {formatDate(v.visitDate)}
                  </p>
                </div>
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  aria-hidden="true"
                  className="border-r border-b border-forest-ink/10 p-3"
                  style={{ minHeight: "112px" }}
                />
              ))}
            </div>
          </div>

          {visitCount > MAX_VISIBLE && (
            <p className={`mt-3 text-xs ${mutedText}`}>
              Showing {MAX_VISIBLE} most recent stamps of {visitCount} total
              records.
            </p>
          )}
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
