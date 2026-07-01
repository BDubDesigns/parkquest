import {
  card,
  dividerSubtle,
  eyebrow,
  mutedText,
} from "@/components/ui/styles";
import StampForm from "./StampForm";

interface VisitRow {
  id: string;
  visitDate: string;
  rating: number | null;
  notes: string | null;
}

interface Props {
  visits: VisitRow[];
  visitCount: number;
  parkSlug: string;
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
    <span className="text-amber-500" aria-label={`${count} out of 5 stars`}>
      {filled}
      {empty}
    </span>
  );
}

export default function StampHistory({ visits, visitCount, parkSlug }: Props) {
  const displayVisits = visits.slice(0, 5);

  return (
    <section className={`mt-6 sm:mt-8 ${card}`}>
      <h2 className={eyebrow}>Park Passport</h2>

      <p className="mt-2 text-sm font-medium text-white">
        Stamped! This park is in your family passport.
      </p>

      <p className={`mt-1 text-sm ${mutedText}`}>
        Stamped {visitCount} time{visitCount !== 1 ? "s" : ""}
      </p>

      {displayVisits.length > 0 && (
        <ol className={`mt-4 space-y-3 border-t ${dividerSubtle} pt-4`}>
          {displayVisits.map((v) => (
            <li key={v.id} className="text-sm">
              <div className="flex items-center gap-2">
                <span className={mutedText}>{formatDate(v.visitDate)}</span>
                {v.rating && <Stars count={v.rating} />}
              </div>
              {v.notes && (
                <p className="mt-1 text-stone-300/80 italic">
                  &ldquo;{v.notes}&rdquo;
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      {visitCount > 5 && (
        <p className={`mt-3 text-xs ${mutedText}`}>
          Showing 5 most recent of {visitCount} stamps.
        </p>
      )}

      <div className={`mt-4 border-t ${dividerSubtle} pt-4`}>
        <StampForm parkSlug={parkSlug} alreadyStamped />
      </div>
    </section>
  );
}
