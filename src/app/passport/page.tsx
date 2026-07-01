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
import {
  bodyText,
  card,
  cardSecondary,
  dividerSubtle,
  eyebrow,
  eyebrowAmber,
  heading,
  linkMuted,
  linkPrimary,
  mutedText,
} from "@/components/ui/styles";

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
      <p className={`text-sm ${mutedText}`}>
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
      <h1 className={`text-2xl sm:text-3xl ${heading}`}>
        {ctx.familyGroupName ?? "Family"} Park Passport
      </h1>

      <p className={`mt-2 max-w-prose text-sm ${bodyText}`}>
        Your Park Passport is private to your family. Other families cannot see
        your stamps, memories, Adventure Points, or stickers.
      </p>

      <section className={`mt-6 ${card}`}>
        <div className="h-3 w-full rounded-full bg-emerald-800">
          <div
            className="h-3 rounded-full bg-amber-300 transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-white">
          {uniqueStamped} / {totalParks} {region.name} parks stamped
        </p>

        <p className="mt-4">
          <span className="text-lg font-bold text-amber-300">
            {totalAdventurePoints.toLocaleString()}
          </span>{" "}
          <span className="text-sm text-stone-300/80">Adventure Points</span>
        </p>
      </section>

      {todayChallenges.length > 0 && (
        <section className={`mt-8 ${cardSecondary}`}>
          <h2 className={eyebrowAmber}>Today&apos;s Quests</h2>
          <ul className="mt-3">
            {todayChallenges.map((ch) => (
              <li
                key={ch.id}
                className={`flex flex-col gap-0.5 border-b ${dividerSubtle} py-2 text-sm last:border-b-0`}
              >
                <div className="flex items-center gap-2">
                  {ch.status === "completed" ? (
                    <>
                      <span aria-hidden="true" className="text-amber-300">
                        ✓
                      </span>
                      <span className="font-medium text-white">{ch.name}</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="text-stone-500/60">
                        ○
                      </span>
                      <span className={mutedText}>{ch.name}</span>
                    </>
                  )}
                  <span className="ml-auto text-xs font-medium text-amber-300/80">
                    {ch.xpReward} Adventure Points
                  </span>
                </div>
                {ch.description && (
                  <p className={`ml-5 text-xs ${mutedText}`}>
                    {ch.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={`mt-8 ${cardSecondary}`}>
        <h2 className={eyebrowAmber}>
          Stickers{" "}
          <span className="text-white">
            ({earnedStickers.length} / {allDefinitions.length})
          </span>
        </h2>

        {earnedStickers.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-300/80">
              Earned
            </p>
            <ul className="mt-1 space-y-1">
              {earnedStickers.map((s) => (
                <li key={s.slug} className="text-sm">
                  <span aria-hidden="true" className="text-amber-300">
                    ✓
                  </span>{" "}
                  <span className="font-medium text-white">{s.name}</span>
                  {s.description && (
                    <span className={`ml-2 ${mutedText}`}>
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
            <p
              className={`text-xs font-medium uppercase tracking-wide ${mutedText}`}
            >
              Still to earn
            </p>
            <ul className="mt-1 space-y-1">
              {unearnedStickers.map((s) => (
                <li key={s.slug} className="text-sm">
                  <span aria-hidden="true" className="text-stone-500/60">
                    ○
                  </span>{" "}
                  <span className={mutedText}>{s.name}</span>
                  {s.description && (
                    <span className={`ml-2 ${mutedText}`}>
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
        <section className={`mt-8 ${cardSecondary}`}>
          <h2 className={eyebrow}>Recently stamped</h2>
          <ol className="mt-3">
            {recentStamps.map((stamp) => (
              <li
                key={stamp.id}
                className={`border-b ${dividerSubtle} py-2 text-sm last:border-b-0`}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Link
                    href={`/parks/${stamp.park.slug}`}
                    className={`font-medium ${linkPrimary}`}
                  >
                    {stamp.park.name}
                  </Link>
                  <span className={mutedText}>
                    &mdash; {formatDate(stamp.visitDate)}
                  </span>
                  {stamp.rating && (
                    <span>
                      <Stars count={stamp.rating} />
                    </span>
                  )}
                </div>
                {stamp.notes && (
                  <p className="mt-1 text-stone-300/80 italic">
                    &ldquo;{stamp.notes}&rdquo;
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {stamped.length > 0 && (
        <section className={`mt-8 ${cardSecondary}`}>
          <h2 className={eyebrow}>Stamped parks ({stamped.length})</h2>
          <ul className="mt-3 space-y-1.5">
            {stamped.map((p) => (
              <li key={p.slug} className="text-sm">
                <span aria-hidden="true" className="text-amber-300">
                  ✓
                </span>{" "}
                <Link href={`/parks/${p.slug}`} className={linkPrimary}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {unstamped.length > 0 && (
        <section className={`mt-8 ${cardSecondary}`}>
          <h2 className={eyebrow}>
            Still waiting for a stamp ({unstamped.length})
          </h2>
          <ul className="mt-3 space-y-1.5">
            {unstamped.map((p) => (
              <li key={p.slug} className="text-sm">
                <span aria-hidden="true" className="text-stone-500/60">
                  ○
                </span>{" "}
                <Link href={`/parks/${p.slug}`} className={linkMuted}>
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
