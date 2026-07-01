"use server";

import { revalidatePath } from "next/cache";
import { and, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { visits, xpEvents } from "@/db/private";
import { parks } from "@/db/public";
import { getCurrentFamilyContext } from "@/lib/family";

export interface StampState {
  error: string | null;
  success: boolean;
}

export async function stampPark(
  parkSlug: string,
  prevState: StampState,
  formData: FormData,
): Promise<StampState> {
  const ctx = await getCurrentFamilyContext();
  if (!ctx) {
    return { error: "You must be signed in to stamp a park.", success: false };
  }

  const park = await db.query.parks.findFirst({
    columns: { id: true, name: true },
    where: and(eq(parks.slug, parkSlug), eq(parks.isActive, true)),
  });
  if (!park) {
    return { error: "Park not found.", success: false };
  }

  const feltSafe = formData.get("feltSafe");
  if (feltSafe !== "yes" && feltSafe !== "no") {
    return {
      error: "Please answer the safety question.",
      success: false,
    };
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

  const today = new Date().toISOString().split("T")[0];

  await db.transaction(async (tx) => {
    const prior = await tx
      .select({ count: count() })
      .from(visits)
      .where(
        and(
          eq(visits.familyGroupId, ctx.familyGroupId),
          eq(visits.parkId, park.id),
        ),
      );

    const isFirstStamp = prior[0].count === 0;
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
    });

    await tx.insert(xpEvents).values({
      familyGroupId: ctx.familyGroupId,
      amount: isFirstStamp ? 50 : 5,
      reason: isFirstStamp ? "First park stamp" : "Repeat park stamp",
      sourceVisitId: visitId,
    });
  });

  revalidatePath(`/parks/${parkSlug}`);

  return { error: null, success: true };
}
