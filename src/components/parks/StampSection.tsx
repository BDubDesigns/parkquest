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
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Park Passport
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to stamp this park in your family passport.
        </p>
        <Link
          href="/sign-in"
          className="mt-3 inline-block text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
        >
          Sign in
        </Link>
      </section>
    );
  }

  const parkId = await getParkIdBySlug(parkSlug);

  if (!parkId) {
    return (
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Park Passport
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          This park is not available for stamping.
        </p>
      </section>
    );
  }

  const visitRows = await db.query.visits.findMany({
    columns: { id: true, visitDate: true, rating: true, notes: true },
    where: and(
      eq(visits.familyGroupId, ctx.familyGroupId),
      eq(visits.parkId, parkId),
    ),
    orderBy: desc(visits.visitDate),
  });

  if (visitRows.length === 0) {
    return (
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Park Passport
        </h2>
        <p className="mt-2 text-sm text-slate-500">
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
