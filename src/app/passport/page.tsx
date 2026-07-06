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
import { getFamilyParkNicknames } from "@/lib/park-nicknames";
import { ensureActiveBoard } from "@/lib/quest-board";
import {
  collectibleTitle,
  dividerSubtleDaylight,
  linkMutedDaylight,
  linkPrimaryDaylight,
  mutedTextDaylight,
  sectionTitle,
  surfacePrimary,
  surfaceSecondary,
} from "@/components/ui/styles";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { RefreshBoardButton } from "./RefreshBoardButton";

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
    <span className="text-reward-ink" aria-label={`${count} out of 5 stars`}>
      {"\u2605".repeat(count)}
      {"\u2606".repeat(5 - count)}
    </span>
  );
}

function ParkNameWithNickname({
  name,
  nickname,
  slug,
  linkClass,
}: {
  name: string;
  nickname: string | null;
  slug: string;
  linkClass: string;
}) {
  return (
    <Link href={`/parks/${slug}`} className={linkClass}>
      {nickname ?? name}
    </Link>
  );
}

export default async function PassportPage() {
  const ctx = await getCurrentFamilyContext();

  if (!ctx) {
    return (
      <section className="rounded-surface bg-white p-6 text-graphite ring-1 ring-forest-ink/12">
        <p className="text-sm">
          No family group found. Create one to start your park passport.
        </p>
        <Link
          href="/account"
          className={`mt-3 inline-block text-sm ${linkPrimaryDaylight}`}
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
      <p className={`text-sm ${mutedTextDaylight}`}>
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

  const visitRows = await db
    .select({ parkId: visits.parkId, visitSource: visits.visitSource })
    .from(visits)
    .where(eq(visits.familyGroupId, ctx.familyGroupId));

  const visitedParkIds = new Set(visitRows.map((r) => r.parkId));
  const liveStampedParkIds = new Set(
    visitRows
      .filter((r) => r.visitSource === "live_stamp")
      .map((r) => r.parkId),
  );

  const uniqueVisited = regionParks.filter((p) =>
    visitedParkIds.has(p.id),
  ).length;

  const allParkIds = regionParks.map((p) => p.id);
  const nicknames = await getFamilyParkNicknames(ctx.familyGroupId, allParkIds);

  const visited = regionParks.filter((p) => visitedParkIds.has(p.id));
  const unstamped = regionParks.filter((p) => !visitedParkIds.has(p.id));

  const percent =
    totalParks > 0 ? Math.round((uniqueVisited / totalParks) * 100) : 0;

  const recentStamps = await db.query.visits.findMany({
    columns: { id: true, visitDate: true, rating: true, notes: true },
    where: and(
      eq(visits.familyGroupId, ctx.familyGroupId),
      eq(visits.visitSource, "live_stamp"),
    ),
    orderBy: [desc(visits.visitDate), desc(visits.createdAt)],
    limit: 10,
    with: { park: { columns: { id: true, name: true, slug: true } } },
  });

  const xpResult = await db
    .select({ total: sql<number>`COALESCE(SUM(${xpEvents.amount}), 0)::int` })
    .from(xpEvents)
    .where(eq(xpEvents.familyGroupId, ctx.familyGroupId));
  const totalAdventurePoints = xpResult[0].total;

  const activeBoard = await ensureActiveBoard(db, ctx.familyGroupId);
  const today = new Date().toISOString().split("T")[0];
  const alreadyRefreshedToday = activeBoard.manualRefreshDate === today;

  const boardQuests = await db
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
        eq(questProgress.questBoardId, activeBoard.id),
        eq(questProgress.familyGroupId, ctx.familyGroupId),
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
      <SectionHeader
        as="h1"
        journal
        title={`${ctx.familyGroupName ?? "Family"} Park Passport`}
        description="Your Park Passport is private to your family. Other families cannot see your stamps, memories, Adventure Points, or stickers."
      />

      <section className={`mt-6 ${surfacePrimary}`}>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-mist"
          role="progressbar"
          aria-label={`${region.name} parks visited`}
          aria-valuemin={0}
          aria-valuemax={totalParks}
          aria-valuenow={uniqueVisited}
        >
          <div
            className="h-3 rounded-full bg-canopy transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-semibold text-forest-ink">
          {uniqueVisited} / {totalParks} {region.name} parks visited
        </p>

        <p className="mt-5 flex flex-wrap items-baseline gap-2 border-t border-forest-ink/10 pt-4">
          <span className="font-display text-2xl font-semibold text-forest-ink">
            {totalAdventurePoints.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-graphite/70">
            Adventure Points
          </span>
        </p>
      </section>

      {boardQuests.length > 0 && (
        <section className={`mt-8 ${surfaceSecondary}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={collectibleTitle}>Quest Board</h2>
            <RefreshBoardButton
              hasIncomplete={boardQuests.some((q) => q.status === "assigned")}
              alreadyRefreshedToday={alreadyRefreshedToday}
            />
          </div>
          <ul className="mt-3">
            {boardQuests.map((ch) => (
              <li
                key={ch.id}
                className={`flex flex-col gap-0.5 border-b ${dividerSubtleDaylight} py-2 text-sm last:border-b-0`}
              >
                <div className="flex items-center gap-2">
                  {ch.status === "completed" ? (
                    <StatusBadge tone="success" mark="✓">
                      Completed
                    </StatusBadge>
                  ) : ch.status === "expired" ? (
                    <>
                      <span aria-hidden="true" className="text-graphite/45">
                        ✗
                      </span>
                      <span className="text-graphite/58 line-through">
                        {ch.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="text-canopy">
                        ○
                      </span>
                      <span className={mutedTextDaylight}>{ch.name}</span>
                    </>
                  )}
                  {ch.status === "completed" && (
                    <span className="font-medium text-forest-ink">
                      {ch.name}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-semibold text-forest-ink">
                    {ch.xpReward} Adventure Points
                  </span>
                </div>
                {ch.description && (
                  <p className={`ml-5 text-xs ${mutedTextDaylight}`}>
                    {ch.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={`mt-8 ${surfaceSecondary}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={collectibleTitle}>Stickers</h2>
          <StatusBadge tone="reward">
            {earnedStickers.length} of {allDefinitions.length} earned
          </StatusBadge>
        </div>

        {earnedStickers.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-bold text-forest-ink">In your journal</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {earnedStickers.map((s) => (
                <li
                  key={s.slug}
                  className="rounded-collectible bg-white p-3 text-sm ring-1 ring-canopy/16"
                >
                  <span className="font-display font-semibold text-forest-ink">
                    {s.name}
                  </span>
                  {s.description && (
                    <p
                      className={`mt-1 text-xs leading-5 ${mutedTextDaylight}`}
                    >
                      {s.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {unearnedStickers.length > 0 && (
          <div className={earnedStickers.length > 0 ? "mt-4" : "mt-3"}>
            <p className={`text-sm font-bold ${mutedTextDaylight}`}>
              Still to discover
            </p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {unearnedStickers.map((s) => (
                <li
                  key={s.slug}
                  className="rounded-collectible border border-dashed border-forest-ink/22 p-3 text-sm"
                >
                  <span className={`font-semibold ${mutedTextDaylight}`}>
                    {s.name}
                  </span>
                  {s.description && (
                    <p
                      className={`mt-1 text-xs leading-5 ${mutedTextDaylight}`}
                    >
                      {s.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {recentStamps.length > 0 && (
        <section className={`mt-8 ${surfaceSecondary}`}>
          <h2 className={sectionTitle}>Recently stamped</h2>
          <ol className="mt-3">
            {recentStamps.map((stamp) => {
              const n = nicknames[stamp.park.id] ?? null;
              return (
                <li
                  key={stamp.id}
                  className={`border-b ${dividerSubtleDaylight} py-2 text-sm last:border-b-0`}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <div>
                      <ParkNameWithNickname
                        name={stamp.park.name}
                        nickname={n}
                        slug={stamp.park.slug}
                        linkClass={`font-medium ${linkPrimaryDaylight}`}
                      />
                      {n && (
                        <p className={`text-xs ${mutedTextDaylight}`}>
                          Official: {stamp.park.name}
                        </p>
                      )}
                    </div>
                    <span className={mutedTextDaylight}>
                      &mdash; {formatDate(stamp.visitDate)}
                    </span>
                    {stamp.rating && (
                      <span>
                        <Stars count={stamp.rating} />
                      </span>
                    )}
                  </div>
                  {stamp.notes && (
                    <p className="mt-1 text-graphite/72 italic">
                      &ldquo;{stamp.notes}&rdquo;
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {visited.length > 0 && (
        <section className={`mt-8 ${surfaceSecondary}`}>
          <h2 className={sectionTitle}>Visited parks ({visited.length})</h2>
          <ul className="mt-3 space-y-1.5">
            {visited.map((p) => {
              const n = nicknames[p.id] ?? null;
              const hasLiveStamp = liveStampedParkIds.has(p.id);
              return (
                <li key={p.slug} className="text-sm">
                  <StatusBadge tone="success" mark="✓">
                    Visited
                  </StatusBadge>{" "}
                  <ParkNameWithNickname
                    name={p.name}
                    nickname={n}
                    slug={p.slug}
                    linkClass={linkPrimaryDaylight}
                  />
                  <span className={`ml-2 text-xs ${mutedTextDaylight}`}>
                    {hasLiveStamp ? "Stamped" : "Previously visited"}
                  </span>
                  {n && (
                    <p className={`ml-5 text-xs ${mutedTextDaylight}`}>
                      Official: {p.name}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {unstamped.length > 0 && (
        <section className={`mt-8 ${surfaceSecondary}`}>
          <h2 className={sectionTitle}>Not yet visited ({unstamped.length})</h2>
          <ul className="mt-3 space-y-1.5">
            {unstamped.map((p) => {
              const n = nicknames[p.id] ?? null;
              return (
                <li key={p.slug} className="text-sm">
                  <span aria-hidden="true" className="text-graphite/50">
                    ○
                  </span>{" "}
                  <ParkNameWithNickname
                    name={p.name}
                    nickname={n}
                    slug={p.slug}
                    linkClass={linkMutedDaylight}
                  />
                  {n && (
                    <p className={`ml-5 text-xs ${mutedTextDaylight}`}>
                      Official: {p.name}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
