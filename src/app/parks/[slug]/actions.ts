"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { visits } from "@/db/private";
import { getCurrentFamilyContext } from "@/lib/family";
import { getParkIdBySlug } from "@/lib/parks";

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

  const parkId = await getParkIdBySlug(parkSlug);
  if (!parkId) {
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

  await db.insert(visits).values({
    familyGroupId: ctx.familyGroupId,
    parkId,
    visitDate: today,
    rating,
    feltSafe: feltSafe === "yes",
    notes: memory,
    createdByUserId: ctx.userId,
  });

  revalidatePath(`/parks/${parkSlug}`);

  return { error: null, success: true };
}
