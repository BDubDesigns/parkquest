import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { visits } from "@/db/private";
import { getCurrentFamilyContext } from "@/lib/family";
import { getParkBySlug, getParkIdBySlug } from "@/lib/parks";
import { card, eyebrow, linkText, mutedText } from "@/components/ui/styles";
import StampForm from "./StampForm";
import StampHistory from "./StampHistory";

interface Props {
  parkSlug: string;
}

export default async function StampSection({ parkSlug }: Props) {
  const ctx = await getCurrentFamilyContext();

  if (!ctx) {
    return (
      <section className={`mt-6 sm:mt-8 ${card}`}>
        <h2 className={eyebrow}>Park Passport</h2>
        <p className={`mt-2 text-sm ${mutedText}`}>
          Sign in to stamp this park in your family passport.
        </p>
        <Link
          href="/sign-in"
          className={`mt-3 inline-flex min-h-11 items-center text-sm ${linkText}`}
        >
          Sign in
        </Link>
      </section>
    );
  }

  const parkId = await getParkIdBySlug(parkSlug);
  const park = await getParkBySlug(parkSlug);

  if (!parkId || !park) {
    return (
      <section className={`mt-6 sm:mt-8 ${card}`}>
        <h2 className={eyebrow}>Park Passport</h2>
        <p className={`mt-2 text-sm ${mutedText}`}>
          This park is not available for stamping.
        </p>
      </section>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const visitRows = await db.query.visits.findMany({
    columns: {
      id: true,
      visitDate: true,
      rating: true,
      notes: true,
      createdAt: true,
    },
    where: and(
      eq(visits.familyGroupId, ctx.familyGroupId),
      eq(visits.parkId, parkId),
    ),
    orderBy: [desc(visits.visitDate), desc(visits.createdAt)],
  });

  const hasStampedToday = visitRows.some((v) => v.visitDate === today);

  if (visitRows.length === 0) {
    return (
      <section className={`mt-6 sm:mt-8 ${card}`}>
        <h2 className={eyebrow}>Park Passport</h2>
        <p className={`mt-2 text-sm ${mutedText}`}>
          You haven&apos;t stamped this park yet.
        </p>
        <div className="mt-3">
          <StampForm key={parkSlug} parkSlug={parkSlug} parkName={park.name} />
        </div>
      </section>
    );
  }

  return (
    <StampHistory
      visits={visitRows}
      visitCount={visitRows.length}
      parkSlug={parkSlug}
      parkName={park.name}
      stampedToday={hasStampedToday}
    />
  );
}
