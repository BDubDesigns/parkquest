import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { visits } from "@/db/private";
import { getCurrentFamilyContext } from "@/lib/family";
import { getParkBySlug, getParkIdBySlug } from "@/lib/parks";
import {
  collectibleTitle,
  linkText,
  mutedText,
  surfacePrimary,
} from "@/components/ui/styles";
import BackfillForm from "./BackfillForm";
import StampForm from "./StampForm";
import StampHistory from "./StampHistory";

interface Props {
  parkSlug: string;
}

export default async function StampSection({ parkSlug }: Props) {
  const ctx = await getCurrentFamilyContext();

  if (!ctx) {
    return (
      <section className={`mt-6 sm:mt-8 ${surfacePrimary}`}>
        <h2 className={collectibleTitle}>Park Passport</h2>
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
      <section className={`mt-6 sm:mt-8 ${surfacePrimary}`}>
        <h2 className={collectibleTitle}>Park Passport</h2>
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
      visitSource: true,
      stampColor: true,
      stampRotation: true,
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
      <section className={`mt-6 sm:mt-8 ${surfacePrimary}`}>
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
        <p className={`mt-3 text-sm font-semibold text-forest-ink`}>
          Ready for your family passport
        </p>
        <div className="mt-4">
          <StampForm key={parkSlug} parkSlug={parkSlug} parkName={park.name} />
        </div>
        {ctx.role === "owner" && <BackfillForm parkSlug={parkSlug} />}
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
