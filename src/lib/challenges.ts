import { and, eq, inArray } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "@/db/schema";
import { questDefinitions, questProgress, xpEvents } from "@/db/private";
import { amenities, parkAmenities } from "@/db/public";
import { getActiveBoard } from "@/lib/quest-board";

export function matchesQuestCriteria(
  criteriaType: string,
  criteriaSlug: string | undefined,
  isFirstStampOfPark: boolean,
  parkAmenitySlugs: Set<string>,
): boolean {
  switch (criteriaType) {
    case "any_park":
      return true;
    case "new_park":
      return isFirstStampOfPark;
    case "amenity":
      return criteriaSlug ? parkAmenitySlugs.has(criteriaSlug) : false;
    default:
      return false;
  }
}

export interface ChallengeParams {
  familyGroupId: string;
  parkId: string;
  isFirstStampOfPark: boolean;
  today: string;
  visitId: string;
}

export async function completeMatchingPassportChallenges(
  tx: NodePgDatabase<typeof schema>,
  params: ChallengeParams,
): Promise<void> {
  const { familyGroupId, parkId, isFirstStampOfPark, visitId } = params;

  const activeBoard = await getActiveBoard(tx, familyGroupId);
  if (!activeBoard) return;

  const assigned = await tx
    .select({
      id: questProgress.id,
      questDefinitionId: questProgress.questDefinitionId,
      criteria: questDefinitions.criteria,
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
        eq(questProgress.familyGroupId, familyGroupId),
        eq(questProgress.status, "assigned"),
      ),
    );

  if (assigned.length === 0) return;

  const isAmenityChallenge = assigned.some(
    (ch) =>
      ch.criteria &&
      typeof ch.criteria === "object" &&
      "type" in ch.criteria &&
      (ch.criteria as { type: string }).type === "amenity",
  );

  let parkAmenitySlugs = new Set<string>();
  if (isAmenityChallenge) {
    const amenitySlugsNeeded = assigned
      .filter(
        (ch) =>
          ch.criteria &&
          typeof ch.criteria === "object" &&
          (ch.criteria as { type: string; slug?: string }).type === "amenity",
      )
      .map((ch) => (ch.criteria as { type: string; slug?: string }).slug ?? "")
      .filter(Boolean);

    if (amenitySlugsNeeded.length > 0) {
      const rows = await tx
        .select({ slug: amenities.slug })
        .from(parkAmenities)
        .innerJoin(amenities, eq(parkAmenities.amenityId, amenities.id))
        .where(
          and(
            eq(parkAmenities.parkId, parkId),
            eq(parkAmenities.verificationStatus, "verified"),
            inArray(amenities.slug, amenitySlugsNeeded),
          ),
        );
      parkAmenitySlugs = new Set(rows.map((r) => r.slug));
    }
  }

  for (const ch of assigned) {
    const criteria = ch.criteria as { type: string; slug?: string } | null;
    if (!criteria) continue;

    const completed = matchesQuestCriteria(
      criteria.type,
      criteria.slug,
      isFirstStampOfPark,
      parkAmenitySlugs,
    );

    if (!completed) continue;

    const updated = await tx
      .update(questProgress)
      .set({ status: "completed", completedAt: new Date() })
      .where(
        and(eq(questProgress.id, ch.id), eq(questProgress.status, "assigned")),
      )
      .returning({ id: questProgress.id });

    if (updated.length > 0 && ch.xpReward > 0) {
      await tx.insert(xpEvents).values({
        familyGroupId,
        amount: ch.xpReward,
        reason: `Quest: ${ch.slug}`,
        sourceVisitId: visitId,
      });
    }
  }
}
