import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { visits } from "@/db/private";
import { getCurrentFamilyContext } from "@/lib/family";
import { getParkIdBySlug } from "@/lib/parks";
import StampForm from "./StampForm";
import StampHistory from "./StampHistory";

interface Props {
  parkSlug: string;
}

export default async function StampSection({ parkSlug }: Props) {
  const ctx = await getCurrentFamilyContext();

  if (!ctx) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:mt-8 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Park Passport
        </h2>
        <p className="mt-2 text-sm text-emerald-200/80">
          Sign in to stamp this park in your family passport.
        </p>
        <Link
          href="/sign-in"
          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-emerald-200 underline decoration-emerald-500 underline-offset-2 hover:text-white"
        >
          Sign in
        </Link>
      </section>
    );
  }

  const parkId = await getParkIdBySlug(parkSlug);

  if (!parkId) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:mt-8 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Park Passport
        </h2>
        <p className="mt-2 text-sm text-emerald-200/80">
          This park is not available for stamping.
        </p>
      </section>
    );
  }

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

  if (visitRows.length === 0) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:mt-8 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Park Passport
        </h2>
        <p className="mt-2 text-sm text-emerald-200/80">
          You haven&apos;t stamped this park yet.
        </p>
        <div className="mt-3">
          <StampForm parkSlug={parkSlug} />
        </div>
      </section>
    );
  }

  return (
    <StampHistory
      visits={visitRows}
      visitCount={visitRows.length}
      parkSlug={parkSlug}
    />
  );
}
