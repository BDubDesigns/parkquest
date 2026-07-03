"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { getCurrentFamilyContext } from "@/lib/family";
import { refreshQuestBoard } from "@/lib/quest-board";

export interface RefreshBoardState {
  error: string | null;
  success: boolean;
  hadIncomplete: boolean;
}

export async function refreshBoard(): Promise<RefreshBoardState> {
  const ctx = await getCurrentFamilyContext();
  if (!ctx) {
    return {
      error: "You must be signed in to refresh the Quest Board.",
      success: false,
      hadIncomplete: false,
    };
  }

  try {
    const result = await refreshQuestBoard(db, ctx.familyGroupId);

    if (result.success) {
      revalidatePath("/passport");
    }

    return {
      error: result.error ?? null,
      success: result.success,
      hadIncomplete: result.hadIncomplete ?? false,
    };
  } catch (err) {
    const pgErr = err as { code?: string; message?: string };
    if (pgErr?.code === "23505") {
      return {
        error:
          "Your family already refreshed the Quest Board today. Come back tomorrow for a new board.",
        success: false,
        hadIncomplete: false,
      };
    }
    throw err;
  }
}
