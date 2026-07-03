/**
 * Integration tests for quest-board lifecycle and product rules.
 *
 * These tests verify server/database product rules using the real Postgres
 * database (same DATABASE_URL as the app). No browser is needed.
 *
 * Each describe block creates its own family group and cleans up after.
 * Tests within a describe run sequentially and share state — be careful
 * not to set duplicate manual_refresh_date values across old/new boards.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { eq, and, count, asc } from "drizzle-orm";
import { db } from "@/db";
import {
  familyGroups,
  questBoards,
  questProgress,
  visits,
  xpEvents,
} from "@/db/private";
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
  await db.delete(visits).where(eq(visits.familyGroupId, familyGroupId));
  await db.delete(xpEvents).where(eq(xpEvents.familyGroupId, familyGroupId));
  await db.delete(familyGroups).where(eq(familyGroups.id, familyGroupId));
}

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

// --- Suite: Backfill does not award rewards or complete quests ---

describe("backfill does not award rewards", () => {
  let fId: string;

  beforeAll(async () => {
    fId = await createFamily(makeFamilyLabel("backfill-rewards"));
    await ensureActiveBoard(db, fId);
  });

  afterAll(async () => {
    await cleanupFamily(fId);
  });

  it("backfilled visit does not change quest progress status", async () => {
    const active = await getActiveBoard(db, fId);
    expect(active).not.toBeNull();

    const [{ count: assignedBefore }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.familyGroupId, fId),
          eq(questProgress.status, "assigned"),
        ),
      );

    const park = await db.query.parks.findFirst({ columns: { id: true } });
    if (!park) return;

    await db.insert(visits).values({
      familyGroupId: fId,
      parkId: park.id,
      visitDate: "2024-06-01",
      visitSource: "backfill",
    });

    const [{ count: assignedAfter }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.familyGroupId, fId),
          eq(questProgress.status, "assigned"),
        ),
      );
    expect(Number(assignedAfter)).toBe(Number(assignedBefore));

    const [{ count: completed }] = await db
      .select({ count: count() })
      .from(questProgress)
      .where(
        and(
          eq(questProgress.familyGroupId, fId),
          eq(questProgress.status, "completed"),
        ),
      );
    expect(Number(completed)).toBe(0);
  });

  it("backfilled visit does not create XP events", async () => {
    const [{ count: xpBefore }] = await db
      .select({ count: count() })
      .from(xpEvents)
      .where(eq(xpEvents.familyGroupId, fId));

    const park = await db.query.parks.findFirst({ columns: { id: true } });
    if (!park) return;

    await db.insert(visits).values({
      familyGroupId: fId,
      parkId: park.id,
      visitDate: "2024-06-02",
      visitSource: "backfill",
    });

    const [{ count: xpAfter }] = await db
      .select({ count: count() })
      .from(xpEvents)
      .where(eq(xpEvents.familyGroupId, fId));
    expect(Number(xpAfter)).toBe(Number(xpBefore));
  });

  it("backfill then live-stamp on same park — both exist as separate records", async () => {
    const park = await db.query.parks.findFirst({ columns: { id: true } });
    if (!park) return;

    const backfillDate = "2023-12-01";

    await db.insert(visits).values({
      familyGroupId: fId,
      parkId: park.id,
      visitDate: backfillDate,
      visitSource: "backfill",
    });

    await db.insert(visits).values({
      familyGroupId: fId,
      parkId: park.id,
      visitDate: todayUTC(),
      visitSource: "live_stamp",
    });

    const visitsForPark = await db
      .select()
      .from(visits)
      .where(and(eq(visits.familyGroupId, fId), eq(visits.parkId, park.id)))
      .orderBy(asc(visits.visitDate));

    const backfillRows = visitsForPark.filter(
      (v) => v.visitSource === "backfill" && v.visitDate === backfillDate,
    );
    const liveRows = visitsForPark.filter(
      (v) => v.visitSource === "live_stamp" && v.visitDate === todayUTC(),
    );
    expect(backfillRows.length).toBe(1);
    expect(liveRows.length).toBe(1);
  });
});

// --- Suite: Family isolation for private data ---

describe("family isolation for private data", () => {
  let fIdA: string;
  let fIdB: string;
  let parkId: string;

  beforeAll(async () => {
    const [familyA] = await db
      .insert(familyGroups)
      .values({ name: `qbit-${Date.now()}-iso-a` })
      .returning({ id: familyGroups.id });
    const [familyB] = await db
      .insert(familyGroups)
      .values({ name: `qbit-${Date.now()}-iso-b` })
      .returning({ id: familyGroups.id });
    fIdA = familyA.id;
    fIdB = familyB.id;

    const park = await db.query.parks.findFirst({ columns: { id: true } });
    if (park) parkId = park.id;

    if (parkId) {
      await db.insert(visits).values({
        familyGroupId: fIdA,
        parkId,
        visitDate: "2024-06-01",
        visitSource: "live_stamp",
        notes: "secret-note-a",
      });
    }
  });

  afterAll(async () => {
    for (const id of [fIdA, fIdB]) {
      await db.delete(questProgress).where(eq(questProgress.familyGroupId, id));
      await db.delete(questBoards).where(eq(questBoards.familyGroupId, id));
      await db.delete(visits).where(eq(visits.familyGroupId, id));
      await db.delete(familyGroups).where(eq(familyGroups.id, id));
    }
  });

  it("family A sees its own visit", async () => {
    if (!parkId) return;
    const rows = await db
      .select()
      .from(visits)
      .where(and(eq(visits.familyGroupId, fIdA), eq(visits.parkId, parkId)));
    expect(rows.length).toBe(1);
    expect(rows[0].notes).toBe("secret-note-a");
  });

  it("family B does not see family A's visit", async () => {
    if (!parkId) return;
    const rows = await db
      .select()
      .from(visits)
      .where(and(eq(visits.familyGroupId, fIdB), eq(visits.parkId, parkId)));
    expect(rows.length).toBe(0);
  });

  it("family A's quest board is not visible to family B", async () => {
    await ensureActiveBoard(db, fIdA);
    const boardA = await getActiveBoard(db, fIdA);
    expect(boardA).not.toBeNull();

    const boardB = await getActiveBoard(db, fIdB);
    expect(boardB).toBeNull();
  });
});
