import Link from "next/link";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { parks, regions } from "@/db/public";
import { badgeDefinitions, earnedBadges, visits, xpEvents } from "@/db/private";
import { getCurrentFamilyContext } from "@/lib/family";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-500" aria-label={`${count} out of 5 stars`}>
      {"\u2605".repeat(count)}
      {"\u2606".repeat(5 - count)}
    </span>
  );
}

export default async function PassportPage() {
  const ctx = await getCurrentFamilyContext();

  if (!ctx) {
    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm text-amber-800">
          No family group found. Create one to start your park passport.
        </p>
        <Link
          href="/account"
          className="mt-3 inline-block text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900"
        >
          Go to Account
        </Link>
      </section>
    );
  }

  const region = await db.query.regions.findFirst({
    where: eq(regions.slug, "bellingham-wa"),
  });

  if (!region) {
    return (
      <p className="text-sm text-slate-500">
        No region data available. Run the seed to populate parks.
      </p>
    );
  }

  const regionParks = await db.query.parks.findMany({
    columns: { id: true, name: true, slug: true },
    where: and(eq(parks.regionId, region.id), eq(parks.isActive, true)),
    orderBy: asc(parks.name),
  });

  const totalParks = regionParks.length;

  const stampedRows = await db
    .select({ parkId: visits.parkId })
    .from(visits)
    .where(eq(visits.familyGroupId, ctx.familyGroupId))
    .groupBy(visits.parkId);

  const stampedParkIds = new Set(stampedRows.map((r) => r.parkId));

  const uniqueStamped = regionParks.filter((p) =>
    stampedParkIds.has(p.id),
  ).length;

  const stamped = regionParks.filter((p) => stampedParkIds.has(p.id));
  const unstamped = regionParks.filter((p) => !stampedParkIds.has(p.id));

  const percent =
    totalParks > 0 ? Math.round((uniqueStamped / totalParks) * 100) : 0;

  const recentStamps = await db.query.visits.findMany({
    columns: { id: true, visitDate: true, rating: true, notes: true },
    where: eq(visits.familyGroupId, ctx.familyGroupId),
    orderBy: [desc(visits.visitDate), desc(visits.createdAt)],
    limit: 10,
    with: { park: { columns: { name: true, slug: true } } },
  });

  const xpResult = await db
    .select({ total: sql<number>`COALESCE(SUM(${xpEvents.amount}), 0)::int` })
    .from(xpEvents)
    .where(eq(xpEvents.familyGroupId, ctx.familyGroupId));
  const totalAdventurePoints = xpResult[0].total;

  const allDefinitions = await db
    .select({
      name: badgeDefinitions.name,
      description: badgeDefinitions.description,
      slug: badgeDefinitions.slug,
    })
    .from(badgeDefinitions)
    .orderBy(asc(badgeDefinitions.name));

  const earnedSlugs = new Set(
    (
      await db
        .select({
          slug: badgeDefinitions.slug,
        })
        .from(earnedBadges)
        .innerJoin(
          badgeDefinitions,
          eq(earnedBadges.badgeDefinitionId, badgeDefinitions.id),
        )
        .where(eq(earnedBadges.familyGroupId, ctx.familyGroupId))
    ).map((r) => r.slug),
  );

  const earnedStickers = allDefinitions.filter((d) => earnedSlugs.has(d.slug));
  const unearnedStickers = allDefinitions.filter(
    (d) => !earnedSlugs.has(d.slug),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {ctx.familyGroupName ?? "Family"} Park Passport
      </h1>

      <section className="mt-6">
        <div className="h-3 w-full rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-slate-800 transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-slate-700">
          {uniqueStamped} / {totalParks} {region.name} parks stamped
        </p>
      </section>

      <section className="mt-4">
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">
            {totalAdventurePoints.toLocaleString()}
          </span>{" "}
          Adventure Points
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Stickers ({earnedStickers.length} / {allDefinitions.length})
        </h2>

        {earnedStickers.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Earned
            </p>
            <ul className="mt-1 space-y-1">
              {earnedStickers.map((s) => (
                <li key={s.slug} className="text-sm">
                  <span className="text-green-600">&check;</span>{" "}
                  <span className="font-medium text-slate-700">{s.name}</span>
                  {s.description && (
                    <span className="ml-2 text-slate-400">
                      &mdash; {s.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {unearnedStickers.length > 0 && (
          <div className={earnedStickers.length > 0 ? "mt-4" : "mt-2"}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Still to earn
            </p>
            <ul className="mt-1 space-y-1">
              {unearnedStickers.map((s) => (
                <li key={s.slug} className="text-sm">
                  <span className="text-slate-300">&cir;</span>{" "}
                  <span className="text-slate-500">{s.name}</span>
                  {s.description && (
                    <span className="ml-2 text-slate-400">
                      &mdash; {s.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {recentStamps.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Recently stamped
          </h2>
          <ol className="mt-3 space-y-3">
            {recentStamps.map((stamp) => (
              <li key={stamp.id} className="text-sm">
                <Link
                  href={`/parks/${stamp.park.slug}`}
                  className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
                >
                  {stamp.park.name}
                </Link>
                <span className="ml-2 text-slate-500">
                  &mdash; {formatDate(stamp.visitDate)}
                </span>
                {stamp.rating && (
                  <span className="ml-2">
                    <Stars count={stamp.rating} />
                  </span>
                )}
                {stamp.notes && (
                  <p className="mt-0.5 text-slate-500 italic">
                    &ldquo;{stamp.notes}&rdquo;
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {stamped.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Stamped parks ({stamped.length})
          </h2>
          <ul className="mt-3 space-y-1">
            {stamped.map((p) => (
              <li key={p.slug} className="text-sm">
                <span className="text-green-600">&check;</span>{" "}
                <Link
                  href={`/parks/${p.slug}`}
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {unstamped.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Still waiting for a stamp ({unstamped.length})
          </h2>
          <ul className="mt-3 space-y-1">
            {unstamped.map((p) => (
              <li key={p.slug} className="text-sm">
                <span className="text-slate-300">&cir;</span>{" "}
                <Link
                  href={`/parks/${p.slug}`}
                  className="text-slate-500 underline underline-offset-2 hover:text-slate-700"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
