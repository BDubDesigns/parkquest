import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { countPending, getPendingMigrationCount } from "./actions";
import type { db } from "@/db";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: { execute: mocks.execute } as Pick<typeof db, "execute">,
}));
vi.mock("@/lib/admin", () => ({
  getCurrentAdminUserId: vi.fn(),
}));

// Read the real journal once, and derive all "everything pending" expectations
// from it so the test never depends on a hardcoded migration count.
const journal = JSON.parse(
  readFileSync(join(process.cwd(), "drizzle/meta/_journal.json"), "utf-8"),
) as { entries: { tag: string; when: number }[] };

function rowsFor(latestCreatedAt: number | null): {
  rows: { created_at: string | null }[];
} {
  return {
    rows: [
      { created_at: latestCreatedAt === null ? null : String(latestCreatedAt) },
    ],
  };
}

describe("countPending (pure, DB-free)", () => {
  const entries = [{ when: 100 }, { when: 200 }, { when: 300 }];

  it("returns 0 when the effective latest applies every journal entry", () => {
    expect(countPending(entries, 300)).toBe(0);
  });

  it("counts only entries strictly newer than the effective latest", () => {
    expect(countPending(entries, 150)).toBe(2);
  });

  it("reports every entry as pending when the latest is 0 (fresh/empty table)", () => {
    expect(countPending(entries, 0)).toBe(3);
  });
});

describe("getPendingMigrationCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the number of pending journal entries above the latest applied", async () => {
    const latestWhen = Math.max(...journal.entries.map((e) => e.when));
    mocks.execute.mockResolvedValue(rowsFor(latestWhen));

    const result = await getPendingMigrationCount();

    expect(result).toBe(0);
  });

  it("counts pending migrations when the latest applied is behind the journal", async () => {
    const firstEntryWhen = journal.entries[0].when;
    mocks.execute.mockResolvedValue(rowsFor(firstEntryWhen));

    const result = await getPendingMigrationCount();

    expect(result).toBe(journal.entries.length - 1);
  });

  it("treats a NULL created_at row as everything pending (mirrors Number(null ?? 0))", async () => {
    mocks.execute.mockResolvedValue(rowsFor(null));

    const result = await getPendingMigrationCount();

    expect(result).toBe(journal.entries.length);
  });

  it("treats an empty migrations table as everything pending", async () => {
    mocks.execute.mockResolvedValue({ rows: [] });

    const result = await getPendingMigrationCount();

    expect(result).toBe(journal.entries.length);
  });

  it("returns null (not 0) when the migrations table cannot be read", async () => {
    mocks.execute.mockRejectedValue(new Error("connection refused"));

    const result = await getPendingMigrationCount();

    expect(result).toBeNull();
  });
});
