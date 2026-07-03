import { and, count, eq, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "@/db/schema";
import { questBoards, questDefinitions, questProgress } from "@/db/private";

export interface ActiveBoard {
  id: string;
  familyGroupId: string;
  status: "active" | "replaced";
  createdAppDate: string;
  manualRefreshDate: string | null;
}

export function todayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getActiveBoard(
  db: NodePgDatabase<typeof schema>,
  familyGroupId: string,
): Promise<ActiveBoard | null> {
  const row = await db
    .select()
    .from(questBoards)
    .where(
      and(
        eq(questBoards.familyGroupId, familyGroupId),
        eq(questBoards.status, "active"),
      ),
    )
    .then((rows) => rows[0] ?? null);

  if (!row) return null;

  return {
    id: row.id,
    familyGroupId: row.familyGroupId,
    status: row.status as "active" | "replaced",
    createdAppDate: row.createdAppDate,
    manualRefreshDate: row.manualRefreshDate,
  };
}

export async function ensureActiveBoard(
  db: NodePgDatabase<typeof schema>,
  familyGroupId: string,
): Promise<ActiveBoard> {
  const existing = await getActiveBoard(db, familyGroupId);
  if (existing) return existing;

  const today = todayUTC();

  const result = await db.transaction(async (tx) => {
    const [board] = await tx
      .insert(questBoards)
      .values({
        familyGroupId,
        status: "active",
        createdAppDate: today,
        manualRefreshDate: null,
      })
      .onConflictDoNothing()
      .returning();

    if (board) {
      const dailyDefs = await tx
        .select()
        .from(questDefinitions)
        .where(eq(questDefinitions.isDaily, true));

      if (dailyDefs.length > 0) {
        await tx
          .insert(questProgress)
          .values(
            dailyDefs.map((def) => ({
              familyGroupId,
              questDefinitionId: def.id,
              questBoardId: board.id,
              assignedDate: today,
            })),
          )
          .onConflictDoNothing();
      }

      return {
        id: board.id,
        familyGroupId: board.familyGroupId,
        status: board.status as "active" | "replaced",
        createdAppDate: board.createdAppDate,
        manualRefreshDate: board.manualRefreshDate,
      };
    }

    const retry = await getActiveBoard(tx, familyGroupId);
    if (!retry) throw new Error("Failed to create or find active quest board");
    return retry;
  });

  return result;
}

export interface RefreshResult {
  error?: string;
  success: boolean;
  hadIncomplete?: boolean;
}

export async function refreshQuestBoard(
  db: NodePgDatabase<typeof schema>,
  familyGroupId: string,
): Promise<RefreshResult> {
  const today = todayUTC();

  const result = await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${`quest-board-refresh:${familyGroupId}`}, 0))`,
    );

    const activeBoard = await getActiveBoard(tx, familyGroupId);

    if (!activeBoard) {
      await ensureActiveBoard(tx, familyGroupId);
      return { success: true, hadIncomplete: false };
    }

    if (activeBoard.manualRefreshDate === today) {
      return {
        error:
          "Your family already refreshed the Quest Board today. Come back tomorrow for a new board.",
        success: false,
        hadIncomplete: false,
      };
    }

    const incompleteCount = await tx
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.questBoardId, activeBoard.id),
          eq(questProgress.status, "assigned"),
        ),
      )
      .then((r) => Number(r[0].count));

    await tx
      .update(questBoards)
      .set({ status: "replaced", updatedAt: new Date() })
      .where(
        and(
          eq(questBoards.id, activeBoard.id),
          eq(questBoards.familyGroupId, familyGroupId),
        ),
      );

    await tx
      .update(questProgress)
      .set({ status: "expired" })
      .where(
        and(
          eq(questProgress.questBoardId, activeBoard.id),
          eq(questProgress.status, "assigned"),
        ),
      );

    const dailyDefs = await tx
      .select()
      .from(questDefinitions)
      .where(eq(questDefinitions.isDaily, true));

    const [newBoard] = await tx
      .insert(questBoards)
      .values({
        familyGroupId,
        status: "active",
        createdAppDate: today,
        manualRefreshDate: today,
      })
      .returning();

    if (dailyDefs.length > 0 && newBoard) {
      await tx
        .insert(questProgress)
        .values(
          dailyDefs.map((def) => ({
            familyGroupId,
            questDefinitionId: def.id,
            questBoardId: newBoard.id,
            assignedDate: today,
          })),
        )
        .onConflictDoNothing();
    }

    return { success: true, hadIncomplete: incompleteCount > 0 };
  });

  return result;
}
