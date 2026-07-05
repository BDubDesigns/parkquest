"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { amenitySuggestions, parkAmenities } from "@/db/public";
import { getCurrentAdminUserId } from "@/lib/admin";

export interface ReviewSuggestionState {
  error: string | null;
  success: boolean;
}

export async function reviewAmenitySuggestion(
  decision: "approve" | "reject",
  prevState: ReviewSuggestionState,
  formData: FormData,
): Promise<ReviewSuggestionState> {
  void prevState;
  const adminUserId = await getCurrentAdminUserId();
  if (!adminUserId) return { error: "Admin access required.", success: false };

  const suggestionId = formData.get("suggestionId");
  if (!suggestionId || typeof suggestionId !== "string") {
    return { error: "Suggestion not found.", success: false };
  }

  const result = await db.transaction(async (tx) => {
    const suggestion = await tx.query.amenitySuggestions.findFirst({
      where: and(
        eq(amenitySuggestions.id, suggestionId),
        eq(amenitySuggestions.status, "pending"),
      ),
      with: { park: { columns: { slug: true } } },
    });
    if (!suggestion)
      return { error: "Pending suggestion not found.", parkSlug: null };

    if (decision === "approve") {
      if (suggestion.suggestionType === "add") {
        await tx
          .insert(parkAmenities)
          .values({
            parkId: suggestion.parkId,
            amenityId: suggestion.amenityId,
            verificationStatus: "verified",
          })
          .onConflictDoUpdate({
            target: [parkAmenities.parkId, parkAmenities.amenityId],
            set: { verificationStatus: "verified", updatedAt: new Date() },
          });
      } else {
        await tx
          .delete(parkAmenities)
          .where(
            and(
              eq(parkAmenities.parkId, suggestion.parkId),
              eq(parkAmenities.amenityId, suggestion.amenityId),
            ),
          );
      }
    }

    await tx
      .update(amenitySuggestions)
      .set({
        status: decision === "approve" ? "approved" : "rejected",
        reviewedByUserId: adminUserId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(amenitySuggestions.id, suggestion.id));

    return { error: null, parkSlug: suggestion.park.slug };
  });

  if (result.parkSlug) revalidatePath(`/parks/${result.parkSlug}`);
  revalidatePath("/admin/amenity-suggestions");

  return { error: result.error, success: !result.error };
}
