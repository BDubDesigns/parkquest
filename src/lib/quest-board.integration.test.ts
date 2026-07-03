/**
 * Integration tests for quest-board lifecycle.
 *
 * These tests verify server/database product rules using the real Postgres
 * database (same DATABASE_URL as the app). No browser is needed.
 *
 * Each describe block creates its own family group and cleans up after.
 * Tests within a describe run sequentially and share state — be careful
 * not to set duplicate manual_refresh_date values across old/new boards.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { eq, and, count } from "drizzle-orm";
import { db } from "@/db";
import { familyGroups, questBoards, questProgress } from "@/db/private";
import {
  refreshQuestBoard,
  ensureActiveBoard,
  getActiveBoard,
  todayUTC,
} from "@/lib/quest-board";

function yesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

function makeFamilyLabel(label: string): string {
  return `qbit-${Date.now()}-${label}`;
}

async function createFamily(name: string): Promise<string> {
  const [family] = await db
    .insert(familyGroups)
    .values({ name })
    .returning({ id: familyGroups.id });
  if (!family) throw new Error("Failed to create test family");
  return family.id;
}

async function cleanupFamily(familyGroupId: string): Promise<void> {
  await db
    .delete(questProgress)
    .where(eq(questProgress.familyGroupId, familyGroupId));
  await db
    .delete(questBoards)
    .where(eq(questBoards.familyGroupId, familyGroupId));
  await db.delete(familyGroups).where(eq(familyGroups.id, familyGroupId));
}

/**
 * Resets all manual_refresh_dates for a family to NULL, then sets
 * the active board's date to yesterday. This avoids the unique-index
 * collision that occurs when two boards share the same date.
 */
async function setBoardRefreshableToYesterday(familyGroupId: string) {
  await db
    .update(questBoards)
    .set({ manualRefreshDate: null })
    .where(eq(questBoards.familyGroupId, familyGroupId));

  const active = await getActiveBoard(db, familyGroupId);
  if (!active) return;

  await db
    .update(questBoards)
    .set({ manualRefreshDate: yesterdayUTC() })
    .where(eq(questBoards.id, active.id));
}

// --- Suite: Ensure & get active board ---

describe("ensureActiveBoard and getActiveBoard", () => {
  let fId: string;

  beforeAll(async () => {
    fId = await createFamily(makeFamilyLabel("ensure"));
  });
  afterAll(async () => {
    await cleanupFamily(fId);
  });

  it("creates a board when none exists", async () => {
    const board = await ensureActiveBoard(db, fId);
    expect(board.status).toBe("active");
    expect(board.familyGroupId).toBe(fId);
    expect(board.createdAppDate).toBe(todayUTC());
  });

  it("returns existing board on second call", async () => {
    const first = await ensureActiveBoard(db, fId);
    const second = await ensureActiveBoard(db, fId);
    expect(second.id).toBe(first.id);
  });

  it("getActiveBoard returns the active board", async () => {
    const board = await getActiveBoard(db, fId);
    expect(board).not.toBeNull();
    expect(board!.status).toBe("active");
  });
});

// --- Suite: One active board constraint ---

describe("one active board constraint", () => {
  let fId: string;

  beforeAll(async () => {
    fId = await createFamily(makeFamilyLabel("constraint"));
  });
  afterAll(async () => {
    await cleanupFamily(fId);
  });

  it("one active board after ensureActiveBoard", async () => {
    await ensureActiveBoard(db, fId);
    const [{ count: c }] = await db
      .select({ count: count() })
      .from(questBoards)
      .where(
        and(
          eq(questBoards.familyGroupId, fId),
          eq(questBoards.status, "active"),
        ),
      );
    expect(Number(c)).toBe(1);
  });

  it("one active board after refreshQuestBoard", async () => {
    await ensureActiveBoard(db, fId);
    await setBoardRefreshableToYesterday(fId);
    await refreshQuestBoard(db, fId);

    const [{ count: c }] = await db
      .select({ count: count() })
      .from(questBoards)
      .where(
        and(
          eq(questBoards.familyGroupId, fId),
          eq(questBoards.status, "active"),
        ),
      );
    expect(Number(c)).toBe(1);
  });
});

// --- Suite: Refresh lifecycle ---

describe("refreshQuestBoard lifecycle", () => {
  let fId: string;

  beforeAll(async () => {
    fId = await createFamily(makeFamilyLabel("lifecycle"));
  });
  afterAll(async () => {
    await cleanupFamily(fId);
  });

  it("creates first board (no manualRefreshDate)", async () => {
    const result = await refreshQuestBoard(db, fId);
    expect(result.success).toBe(true);
    expect(result.hadIncomplete).toBe(false);

    const active = await getActiveBoard(db, fId);
    expect(active).not.toBeNull();
    expect(active!.createdAppDate).toBe(todayUTC());
    expect(active!.manualRefreshDate).toBeNull();
  });

  it("sets manualRefreshDate on refreshed board", async () => {
    await setBoardRefreshableToYesterday(fId);
    const result = await refreshQuestBoard(db, fId);
    expect(result.success).toBe(true);

    const active = await getActiveBoard(db, fId);
    expect(active!.manualRefreshDate).toBe(todayUTC());
  });

  it("replaces old board status", async () => {
    const boards = await db
      .select()
      .from(questBoards)
      .where(eq(questBoards.familyGroupId, fId));
    const replaced = boards.filter((b) => b.status === "replaced").length;
    expect(replaced).toBeGreaterThan(0);
  });

  it("blocks same-day refresh", async () => {
    const result = await refreshQuestBoard(db, fId);
    expect(result.success).toBe(false);
    expect(result.error).toContain("already refreshed");
  });

  it("allows refresh after moving date to yesterday", async () => {
    await setBoardRefreshableToYesterday(fId);
    const result = await refreshQuestBoard(db, fId);
    expect(result.success).toBe(true);
  });

  // --- Subsuite: quest life during refresh ---

  it("expires incomplete quests on old board", async () => {
    const active = await getActiveBoard(db, fId);
    expect(active).not.toBeNull();

    const [{ count: assignedBefore }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.questBoardId, active!.id),
          eq(questProgress.status, "assigned"),
        ),
      );

    await setBoardRefreshableToYesterday(fId);
    const result = await refreshQuestBoard(db, fId);
    expect(result.success).toBe(true);

    if (Number(assignedBefore) > 0) {
      const [{ count: expiredAfter }] = await db
        .select({ count: count() })
        .from(questProgress)
        .where(
          and(
            eq(questProgress.questBoardId, active!.id),
            eq(questProgress.status, "expired"),
          ),
        );
      expect(Number(expiredAfter)).toBe(Number(assignedBefore));
      expect(result.hadIncomplete).toBe(true);
    }
  });

  it("preserves completed quests on old board", async () => {
    const active = await getActiveBoard(db, fId);
    expect(active).not.toBeNull();

    const quests = await db
      .select({ id: questProgress.id })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.questBoardId, active!.id),
          eq(questProgress.status, "assigned"),
        ),
      )
      .limit(1);

    if (quests.length > 0) {
      await db
        .update(questProgress)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(questProgress.id, quests[0].id));
    }

    await setBoardRefreshableToYesterday(fId);
    await refreshQuestBoard(db, fId);

    if (quests.length > 0) {
      const q = await db.query.questProgress.findFirst({
        where: eq(questProgress.id, quests[0].id),
      });
      expect(q?.status).toBe("completed");
    }
  });

  it("reports hadIncomplete:false when all completed", async () => {
    const active = await getActiveBoard(db, fId);
    expect(active).not.toBeNull();

    await db
      .update(questProgress)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(questProgress.questBoardId, active!.id));

    await setBoardRefreshableToYesterday(fId);
    const result = await refreshQuestBoard(db, fId);
    expect(result.success).toBe(true);

    // If there were quests, hadIncomplete should be false
    const [{ count: questCount }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(eq(questProgress.questBoardId, active!.id));
    if (Number(questCount) > 0) {
      expect(result.hadIncomplete).toBe(false);
    }
  });
});

// --- Suite: Quest progress targets active board ---

describe("quest progress board targeting", () => {
  let fId: string;

  beforeAll(async () => {
    fId = await createFamily(makeFamilyLabel("targeting"));
  });
  afterAll(async () => {
    await cleanupFamily(fId);
  });

  it("quest progress is created for the active board on ensure", async () => {
    await ensureActiveBoard(db, fId);
    const active = await getActiveBoard(db, fId);
    expect(active).not.toBeNull();

    const [{ count: c }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.questBoardId, active!.id),
          eq(questProgress.status, "assigned"),
        ),
      );
    expect(Number(c)).toBeGreaterThan(0);
  });

  it("refresh creates new quests on the new board", async () => {
    const oldActive = await getActiveBoard(db, fId);
    expect(oldActive).not.toBeNull();

    await setBoardRefreshableToYesterday(fId);
    await refreshQuestBoard(db, fId);

    const newActive = await getActiveBoard(db, fId);
    expect(newActive).not.toBeNull();
    expect(newActive!.id).not.toBe(oldActive!.id);

    const [{ count: c }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.questBoardId, newActive!.id),
          eq(questProgress.status, "assigned"),
        ),
      );
    expect(Number(c)).toBeGreaterThan(0);
  });
});
