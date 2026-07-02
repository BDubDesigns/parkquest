"use server";

import { revalidatePath } from "next/cache";
import { and, eq, count, sql } from "drizzle-orm";
import { db } from "@/db";
import { badgeDefinitions, earnedBadges, visits, xpEvents } from "@/db/private";
import { parks } from "@/db/public";
import { getCurrentFamilyContext } from "@/lib/family";
import { setFamilyParkNickname } from "@/lib/park-nicknames";
import {
  ensureDailyPassportChallenges,
  completeMatchingPassportChallenges,
} from "@/lib/challenges";
export interface StampState {
  error: string | null;
  info: string | null;
  success: boolean;
}

export async function stampPark(
  parkSlug: string,
  prevState: StampState,
  formData: FormData,
): Promise<StampState> {
  const ctx = await getCurrentFamilyContext();
  if (!ctx) {
    return {
      error: "You must be signed in to stamp a park.",
      success: false,
      info: null,
    };
  }

  const park = await db.query.parks.findFirst({
    columns: { id: true, name: true },
    where: and(eq(parks.slug, parkSlug), eq(parks.isActive, true)),
  });
  if (!park) {
    return { error: "Park not found.", success: false, info: null };
  }

  const feltSafe = formData.get("feltSafe");
  if (feltSafe !== "yes" && feltSafe !== "no") {
    return {
      error: "Please answer the safety question.",
      success: false,
      info: null,
    };
  }

  const ratingRaw = formData.get("rating");
  let rating: number | null = null;
  if (ratingRaw && typeof ratingRaw === "string" && ratingRaw !== "") {
    const parsed = parseInt(ratingRaw, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 5) {
      return {
        error: "Rating must be between 1 and 5.",
        success: false,
        info: null,
      };
    }
    rating = parsed;
  }

  const memoryRaw = formData.get("memory");
  let memory: string | null = null;
  if (memoryRaw && typeof memoryRaw === "string" && memoryRaw.trim() !== "") {
    memory = memoryRaw.trim().slice(0, 1000);
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const result = await db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtextextended(${`${ctx.familyGroupId}:${today}`}, 0))`,
      );

      const existingToday = await tx
        .select({ count: count() })
        .from(visits)
        .where(
          and(
            eq(visits.familyGroupId, ctx.familyGroupId),
            eq(visits.parkId, park.id),
            eq(visits.visitDate, today),
          ),
        );

      if (existingToday[0].count > 0) {
        return {
          error:
            "You already stamped this park today. Come back another day for a fresh stamp.",
          success: false,
          info: null,
        };
      }

      const todayStampCount = await tx
        .select({ count: count() })
        .from(visits)
        .where(
          and(
            eq(visits.familyGroupId, ctx.familyGroupId),
            eq(visits.visitDate, today),
            eq(visits.visitSource, "live_stamp"),
          ),
        );

      const stampsToday = todayStampCount[0].count;

      const priorForPark = await tx
        .select({ count: count() })
        .from(visits)
        .where(
          and(
            eq(visits.familyGroupId, ctx.familyGroupId),
            eq(visits.parkId, park.id),
            eq(visits.visitSource, "live_stamp"),
          ),
        );

      const priorTotal = await tx
        .select({ count: count() })
        .from(visits)
        .where(
          and(
            eq(visits.familyGroupId, ctx.familyGroupId),
            eq(visits.visitSource, "live_stamp"),
          ),
        );

      const isFirstStampOfPark = priorForPark[0].count === 0;
      const isFirstStampEver = priorTotal[0].count === 0;
      const visitId = crypto.randomUUID();

      await tx.insert(visits).values({
        id: visitId,
        familyGroupId: ctx.familyGroupId,
        parkId: park.id,
        visitDate: today,
        rating,
        feltSafe: feltSafe === "yes",
        notes: memory,
        createdByUserId: ctx.userId,
        visitSource: "live_stamp",
      });

      if (stampsToday < 3) {
        await tx.insert(xpEvents).values({
          familyGroupId: ctx.familyGroupId,
          amount: isFirstStampOfPark ? 50 : 5,
          reason: isFirstStampOfPark ? "First park stamp" : "Repeat park stamp",
          sourceVisitId: visitId,
        });
      }

      const badgeDefs = await tx
        .select({ id: badgeDefinitions.id, slug: badgeDefinitions.slug })
        .from(badgeDefinitions);
      const stickerId = new Map(badgeDefs.map((b) => [b.slug, b.id]));

      const firstStampId = stickerId.get("first-stamp");
      if (isFirstStampEver && firstStampId) {
        await tx
          .insert(earnedBadges)
          .values({
            familyGroupId: ctx.familyGroupId,
            badgeDefinitionId: firstStampId,
          })
          .onConflictDoNothing();
      }

      const returnExplorerId = stickerId.get("return-explorer");
      if (!isFirstStampOfPark && returnExplorerId) {
        await tx
          .insert(earnedBadges)
          .values({
            familyGroupId: ctx.familyGroupId,
            badgeDefinitionId: returnExplorerId,
          })
          .onConflictDoNothing();
      }

      const uniqueRows = await tx
        .select({ parkId: visits.parkId })
        .from(visits)
        .where(
          and(
            eq(visits.familyGroupId, ctx.familyGroupId),
            eq(visits.visitSource, "live_stamp"),
          ),
        )
        .groupBy(visits.parkId);
      const fiveParksId = stickerId.get("five-parks");
      if (uniqueRows.length >= 5 && fiveParksId) {
        await tx
          .insert(earnedBadges)
          .values({
            familyGroupId: ctx.familyGroupId,
            badgeDefinitionId: fiveParksId,
          })
          .onConflictDoNothing();
      }

      await ensureDailyPassportChallenges(tx, {
        familyGroupId: ctx.familyGroupId,
        today,
      });

      await completeMatchingPassportChallenges(tx, {
        familyGroupId: ctx.familyGroupId,
        parkId: park.id,
        isFirstStampOfPark,
        today,
        visitId,
      });

      let info: string | null = null;
      if (stampsToday >= 3) {
        info =
          "Today's base Adventure Points limit has been reached, but this stamp is saved and you can still earn points from quests!";
      }

      return { error: null, info, success: true };
    });

    if (result?.success) {
      revalidatePath(`/parks/${parkSlug}`);
      revalidatePath("/passport");
    }

    return result;
  } catch (err) {
    const pgErr = err as { code?: string; constraint?: string };
    if (pgErr?.code === "23505") {
      return {
        error:
          "You already stamped this park today. Come back another day for a fresh stamp.",
        success: false,
        info: null,
      };
    }
    throw err;
  }
}

export interface BackfillState {
  error: string | null;
  success: boolean;
}

export async function backfillPark(
  parkSlug: string,
  prevState: BackfillState,
  formData: FormData,
): Promise<BackfillState> {
  const ctx = await getCurrentFamilyContext();
  if (!ctx) {
    return { error: "You must be signed in.", success: false };
  }

  if (ctx.role !== "owner") {
    return {
      error: "Only family owners can mark parks as previously visited.",
      success: false,
    };
  }

  const park = await db.query.parks.findFirst({
    columns: { id: true, name: true },
    where: and(eq(parks.slug, parkSlug), eq(parks.isActive, true)),
  });
  if (!park) {
    return { error: "Park not found.", success: false };
  }

  const visitDateRaw = formData.get("visitDate");
  const today = new Date().toISOString().split("T")[0];
  const visitDate =
    visitDateRaw &&
    typeof visitDateRaw === "string" &&
    visitDateRaw.trim() !== ""
      ? visitDateRaw.trim()
      : today;

  if (visitDate > today) {
    return { error: "Visit date cannot be in the future.", success: false };
  }

  const ratingRaw = formData.get("rating");
  let rating: number | null = null;
  if (ratingRaw && typeof ratingRaw === "string" && ratingRaw !== "") {
    const parsed = parseInt(ratingRaw, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 5) {
      return { error: "Rating must be between 1 and 5.", success: false };
    }
    rating = parsed;
  }

  const memoryRaw = formData.get("memory");
  let memory: string | null = null;
  if (memoryRaw && typeof memoryRaw === "string" && memoryRaw.trim() !== "") {
    memory = memoryRaw.trim().slice(0, 1000);
  }

  try {
    const result = await db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtextextended(${`${ctx.familyGroupId}:${park.id}:backfill`}, 0))`,
      );

      const existingAny = await tx
        .select({ count: count() })
        .from(visits)
        .where(
          and(
            eq(visits.familyGroupId, ctx.familyGroupId),
            eq(visits.parkId, park.id),
          ),
        );

      if (existingAny[0].count > 0) {
        return {
          error: "Your family already has a visit record for this park.",
          success: false,
        };
      }

      await tx.insert(visits).values({
        familyGroupId: ctx.familyGroupId,
        parkId: park.id,
        visitDate,
        rating,
        notes: memory,
        feltSafe: null,
        createdByUserId: ctx.userId,
        visitSource: "backfill",
      });

      return { error: null, success: true };
    });

    if (result?.success) {
      revalidatePath(`/parks/${parkSlug}`);
      revalidatePath("/passport");
    }

    return result;
  } catch (err) {
    const pgErr = err as { code?: string; constraint?: string };
    if (pgErr?.code === "23505") {
      return {
        error: "Your family already has a record for this park on that date.",
        success: false,
      };
    }
    throw err;
  }
}

export interface NicknameState {
  error: string | null;
  success: boolean;
}

export async function setNickname(
  parkSlug: string,
  prevState: NicknameState,
  formData: FormData,
): Promise<NicknameState> {
  const ctx = await getCurrentFamilyContext();
  if (!ctx) {
    return {
      error: "You must be signed in to set a nickname.",
      success: false,
    };
  }

  const park = await db.query.parks.findFirst({
    columns: { id: true },
    where: and(eq(parks.slug, parkSlug), eq(parks.isActive, true)),
  });
  if (!park) {
    return { error: "Park not found.", success: false };
  }

  const nicknameRaw = formData.get("nickname");
  const nickname =
    nicknameRaw && typeof nicknameRaw === "string"
      ? nicknameRaw.trim().slice(0, 255)
      : null;

  await setFamilyParkNickname(ctx.familyGroupId, park.id, nickname);

  revalidatePath(`/parks/${parkSlug}`);
  revalidatePath("/parks");
  revalidatePath("/passport");
  revalidatePath("/map");

  return { error: null, success: true };
}
