import Link from "next/link";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { parks, regions } from "@/db/public";
import {
  badgeDefinitions,
  earnedBadges,
  questDefinitions,
  questProgress,
  visits,
  xpEvents,
} from "@/db/private";
import { getCurrentFamilyContext } from "@/lib/family";
import { ensureDailyPassportChallenges } from "@/lib/challenges";

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
      <section className="rounded-2xl border border-amber-700/60 bg-amber-900/30 p-6 text-amber-200">
        <p className="text-sm">
          No family group found. Create one to start your park passport.
        </p>
        <Link
          href="/account"
          className="mt-3 inline-block text-sm font-medium text-amber-100 underline decoration-amber-500 underline-offset-2 hover:text-white"
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
      <p className="text-sm text-emerald-200/80">
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

  const today = new Date().toISOString().split("T")[0];

  await ensureDailyPassportChallenges(db, {
    familyGroupId: ctx.familyGroupId,
    today,
  });

  const todayChallenges = await db
    .select({
      id: questProgress.id,
      status: questProgress.status,
      name: questDefinitions.name,
      description: questDefinitions.description,
      slug: questDefinitions.slug,
      xpReward: questDefinitions.xpReward,
    })
    .from(questProgress)
    .innerJoin(
      questDefinitions,
      eq(questProgress.questDefinitionId, questDefinitions.id),
    )
    .where(
      and(
        eq(questProgress.familyGroupId, ctx.familyGroupId),
        eq(questProgress.assignedDate, today),
      ),
    )
    .orderBy(asc(questDefinitions.name));

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
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {ctx.familyGroupName ?? "Family"} Park Passport
      </h1>

      <p className="mt-2 max-w-prose text-sm text-emerald-200/80">
        Your Park Passport is private to your family. Other families cannot see
        your stamps, memories, Adventure Points, or stickers.
      </p>

      <section className="mt-6 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:p-6">
        <div className="h-3 w-full rounded-full bg-emerald-800">
          <div
            className="h-3 rounded-full bg-amber-300 transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-emerald-200">
          {uniqueStamped} / {totalParks} {region.name} parks stamped
        </p>

        <p className="mt-4">
          <span className="text-lg font-bold text-amber-300">
            {totalAdventurePoints.toLocaleString()}
          </span>{" "}
          <span className="text-sm text-emerald-200/80">Adventure Points</span>
        </p>
      </section>

      {todayChallenges.length > 0 && (
        <section className="mt-8 border-t border-emerald-800 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Today&apos;s Quests
          </h2>
          <ul className="mt-3 space-y-2">
            {todayChallenges.map((ch) => (
              <li key={ch.id} className="text-sm">
                {ch.status === "completed" ? (
                  <>
                    <span aria-hidden="true" className="text-emerald-300">
                      ✓
                    </span>{" "}
                    <span className="font-medium text-emerald-200">
                      {ch.name}
                    </span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="text-emerald-500/50">
                      ○
                    </span>{" "}
                    <span className="text-emerald-300/60">{ch.name}</span>
                  </>
                )}
                <span className="ml-2 text-xs text-emerald-400/80">
                  {ch.xpReward} Adventure Points
                </span>
                {ch.description && (
                  <p className="ml-4 mt-0.5 text-xs text-emerald-300/60">
                    {ch.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 border-t border-emerald-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Stickers ({earnedStickers.length} / {allDefinitions.length})
        </h2>

        {earnedStickers.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-200/70">
              Earned
            </p>
            <ul className="mt-1 space-y-1">
              {earnedStickers.map((s) => (
                <li key={s.slug} className="text-sm">
                  <span aria-hidden="true" className="text-emerald-300">
                    ✓
                  </span>{" "}
                  <span className="font-medium text-emerald-100">{s.name}</span>
                  {s.description && (
                    <span className="ml-2 text-emerald-200/70">
                      &mdash; {s.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {unearnedStickers.length > 0 && (
          <div className={earnedStickers.length > 0 ? "mt-4" : "mt-3"}>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-200/70">
              Still to earn
            </p>
            <ul className="mt-1 space-y-1">
              {unearnedStickers.map((s) => (
                <li key={s.slug} className="text-sm">
                  <span aria-hidden="true" className="text-emerald-500/50">
                    ○
                  </span>{" "}
                  <span className="text-emerald-300/60">{s.name}</span>
                  {s.description && (
                    <span className="ml-2 text-emerald-200/70">
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
        <section className="mt-8 border-t border-emerald-800 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Recently stamped
          </h2>
          <ol className="mt-3 space-y-3">
            {recentStamps.map((stamp) => (
              <li key={stamp.id} className="text-sm">
                <Link
                  href={`/parks/${stamp.park.slug}`}
                  className="font-medium text-emerald-50 underline decoration-emerald-500 underline-offset-2 hover:text-emerald-200"
                >
                  {stamp.park.name}
                </Link>
                <span className="ml-2 text-emerald-200/70">
                  &mdash; {formatDate(stamp.visitDate)}
                </span>
                {stamp.rating && (
                  <span className="ml-2">
                    <Stars count={stamp.rating} />
                  </span>
                )}
                {stamp.notes && (
                  <p className="mt-0.5 text-emerald-100/80 italic">
                    &ldquo;{stamp.notes}&rdquo;
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {stamped.length > 0 && (
        <section className="mt-8 border-t border-emerald-800 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Stamped parks ({stamped.length})
          </h2>
          <ul className="mt-3 space-y-1">
            {stamped.map((p) => (
              <li key={p.slug} className="text-sm">
                <span aria-hidden="true" className="text-emerald-300">
                  ✓
                </span>{" "}
                <Link
                  href={`/parks/${p.slug}`}
                  className="text-emerald-100 underline decoration-emerald-500 underline-offset-2 hover:text-white"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {unstamped.length > 0 && (
        <section className="mt-8 border-t border-emerald-800 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Still waiting for a stamp ({unstamped.length})
          </h2>
          <ul className="mt-3 space-y-1">
            {unstamped.map((p) => (
              <li key={p.slug} className="text-sm">
                <span aria-hidden="true" className="text-emerald-500/50">
                  ○
                </span>{" "}
                <Link
                  href={`/parks/${p.slug}`}
                  className="text-emerald-300/60 underline decoration-emerald-500 underline-offset-2 hover:text-white"
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
