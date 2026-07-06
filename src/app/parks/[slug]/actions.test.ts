import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  getCurrentFamilyContext: vi.fn(),
  completeMatchingPassportChallenges: vi.fn(),
  ensureActiveBoard: vi.fn(),
  setFamilyParkNickname: vi.fn(),
  park: { id: "park-1", name: "Test Park" },
  amenity: { id: "amenity-1" },
  verifiedParkAmenity: null as { id: string } | null,
  existingPendingSuggestion: null as { id: string } | null,
  selectCounts: [] as number[],
  selectRows: [] as unknown[][],
  inserted: [] as Array<{ table: unknown; values: Record<string, unknown> }>,
  execute: vi.fn(),
}));

function tableName(table: unknown): string {
  return String(
    Reflect.get(table as object, Symbol.for("drizzle:Name")) ?? "unknown",
  );
}

function makeTx() {
  return {
    execute: mocks.execute,
    select(selection?: Record<string, unknown>) {
      return {
        from(table: unknown) {
          const builder = {
            where: vi.fn(() => builder),
            groupBy: vi.fn(() => {
              const rows = mocks.selectRows.shift() ?? [];
              return Promise.resolve(rows);
            }),
            innerJoin: vi.fn(() => builder),
            then(resolve: (value: unknown) => unknown) {
              const rows =
                selection && "count" in selection
                  ? [{ count: mocks.selectCounts.shift() ?? 0 }]
                  : (mocks.selectRows.shift() ?? []);
              return Promise.resolve(rows).then(resolve);
            },
          };
          void table;
          return builder;
        },
      };
    },
    insert(table: unknown) {
      return {
        values(values: Record<string, unknown>) {
          mocks.inserted.push({ table, values });
          return { onConflictDoNothing: vi.fn(() => Promise.resolve()) };
        },
      };
    },
  };
}

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/family", () => ({
  getCurrentFamilyContext: mocks.getCurrentFamilyContext,
}));
vi.mock("@/lib/challenges", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/challenges")>()),
  completeMatchingPassportChallenges: mocks.completeMatchingPassportChallenges,
}));
vi.mock("@/lib/quest-board", () => ({
  ensureActiveBoard: mocks.ensureActiveBoard,
}));
vi.mock("@/lib/park-nicknames", () => ({
  setFamilyParkNickname: mocks.setFamilyParkNickname,
}));
vi.mock("@/db", () => ({
  db: {
    query: {
      parks: { findFirst: vi.fn(() => Promise.resolve(mocks.park)) },
      amenities: { findFirst: vi.fn(() => Promise.resolve(mocks.amenity)) },
      parkAmenities: {
        findFirst: vi.fn(() => Promise.resolve(mocks.verifiedParkAmenity)),
      },
      amenitySuggestions: {
        findFirst: vi.fn(() =>
          Promise.resolve(mocks.existingPendingSuggestion),
        ),
      },
    },
    insert(table: unknown) {
      return {
        values(values: Record<string, unknown>) {
          mocks.inserted.push({ table, values });
          return Promise.resolve();
        },
      };
    },
    transaction: vi.fn(
      async (callback: (tx: ReturnType<typeof makeTx>) => Promise<unknown>) =>
        callback(makeTx()),
    ),
  },
}));

import { backfillPark, stampPark, submitAmenitySuggestion } from "./actions";

function liveForm() {
  const form = new FormData();
  form.set("feltSafe", "yes");
  return form;
}

describe("park stamp server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentFamilyContext.mockResolvedValue({
      familyGroupId: "family-1",
      userId: "user-1",
      role: "owner",
    });
    mocks.selectCounts = [];
    mocks.selectRows = [];
    mocks.inserted = [];
    mocks.verifiedParkAmenity = null;
    mocks.existingPendingSuggestion = null;
  });

  it("requires a safety answer for live stamps before writing private rows", async () => {
    const result = await stampPark(
      "test-park",
      { error: null, info: null, success: false },
      new FormData(),
    );

    expect(result).toEqual({
      error: "Please answer the safety question.",
      info: null,
      success: false,
    });
    expect(mocks.inserted).toEqual([]);
  });

  it("rejects duplicate same-day live stamps", async () => {
    mocks.selectCounts = [1];

    const result = await stampPark(
      "test-park",
      { error: null, info: null, success: false },
      liveForm(),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("already stamped this park today");
    expect(mocks.inserted).toEqual([]);
  });

  it.each([0, 1, 2])(
    "awards base AP for eligible live stamp number %s of the day",
    async (stampsToday) => {
      mocks.selectCounts = [0, stampsToday, 0, stampsToday];
      mocks.selectRows = [[], []];

      const result = await stampPark(
        "test-park",
        { error: null, info: null, success: false },
        liveForm(),
      );

      expect(result.success).toBe(true);
      const xpRows = mocks.inserted.filter(
        (row) => tableName(row.table) === "xp_events",
      );
      expect(xpRows).toHaveLength(1);
      expect(xpRows[0].values.amount).toBeGreaterThan(0);
      expect(mocks.completeMatchingPassportChallenges).toHaveBeenCalledTimes(1);
    },
  );

  it("saves the 4th valid live stamp but does not award base AP", async () => {
    mocks.selectCounts = [0, 3, 0, 3];
    mocks.selectRows = [[], []];

    const result = await stampPark(
      "test-park",
      { error: null, info: null, success: false },
      liveForm(),
    );

    expect(result).toMatchObject({ success: true });
    expect(result.info).toContain("base Adventure Points limit");
    expect(
      mocks.inserted.some((row) => tableName(row.table) === "visits"),
    ).toBe(true);
    expect(
      mocks.inserted.some((row) => tableName(row.table) === "xp_events"),
    ).toBe(false);
  });

  it("backfill creates only a visit and no AP, stickers, quest progress, or safety answer", async () => {
    const form = new FormData();
    form.set("visitDate", "2024-06-01");
    mocks.selectCounts = [0];

    const result = await backfillPark(
      "test-park",
      { error: null, success: false },
      form,
    );

    expect(result.success).toBe(true);
    expect(mocks.inserted).toHaveLength(1);
    expect(tableName(mocks.inserted[0].table)).toBe("visits");
    expect(mocks.inserted[0].values).toMatchObject({
      visitSource: "backfill",
      feltSafe: null,
    });
    expect(mocks.ensureActiveBoard).not.toHaveBeenCalled();
    expect(mocks.completeMatchingPassportChallenges).not.toHaveBeenCalled();
  });

  it("allows a later live stamp after a historical backfill under current duplicate rules", async () => {
    mocks.selectCounts = [0];
    const backfillForm = new FormData();
    backfillForm.set("visitDate", "2024-06-01");
    await backfillPark(
      "test-park",
      { error: null, success: false },
      backfillForm,
    );

    mocks.selectCounts = [0, 0, 0, 0];
    mocks.selectRows = [[], []];
    const result = await stampPark(
      "test-park",
      { error: null, info: null, success: false },
      liveForm(),
    );

    expect(result.success).toBe(true);
    const visits = mocks.inserted.filter(
      (row) => tableName(row.table) === "visits",
    );
    expect(visits.map((row) => row.values.visitSource)).toEqual([
      "backfill",
      "live_stamp",
    ]);
  });

  it("lets signed-in users submit add amenity suggestions without touching verified amenities", async () => {
    const form = new FormData();
    form.set("suggestionType", "add");
    form.set("amenityId", "amenity-1");

    const result = await submitAmenitySuggestion(
      "test-park",
      { error: null, success: false },
      form,
    );

    expect(result).toEqual({ error: null, success: true });
    const suggestionRows = mocks.inserted.filter(
      (row) => tableName(row.table) === "amenity_suggestions",
    );
    expect(suggestionRows).toHaveLength(1);
    expect(suggestionRows[0].values).toMatchObject({
      parkId: "park-1",
      amenityId: "amenity-1",
      suggestionType: "add",
      submittedByUserId: "user-1",
    });
    expect(
      mocks.inserted.some((row) => tableName(row.table) === "park_amenities"),
    ).toBe(false);
  });

  it("lets signed-in users submit remove amenity suggestions without touching verified amenities", async () => {
    mocks.verifiedParkAmenity = { id: "park-amenity-1" };
    const form = new FormData();
    form.set("suggestionType", "remove");
    form.set("amenityId", "amenity-1");

    const result = await submitAmenitySuggestion(
      "test-park",
      { error: null, success: false },
      form,
    );

    expect(result).toEqual({ error: null, success: true });
    expect(
      mocks.inserted.filter(
        (row) => tableName(row.table) === "amenity_suggestions",
      )[0].values.suggestionType,
    ).toBe("remove");
    expect(
      mocks.inserted.some((row) => tableName(row.table) === "park_amenities"),
    ).toBe(false);
  });

  it("rejects an identical pending suggestion from the same user", async () => {
    mocks.existingPendingSuggestion = { id: "suggestion-1" };
    const form = new FormData();
    form.set("suggestionType", "add");
    form.set("amenityId", "amenity-1");

    const result = await submitAmenitySuggestion(
      "test-park",
      { error: null, success: false },
      form,
    );

    expect(result).toEqual({
      error: "You already have this correction pending review.",
      success: false,
    });
    expect(
      mocks.inserted.some(
        (row) => tableName(row.table) === "amenity_suggestions",
      ),
    ).toBe(false);
  });

  it("rejects add amenity suggestions when the amenity is already verified", async () => {
    mocks.verifiedParkAmenity = { id: "park-amenity-1" };
    const form = new FormData();
    form.set("suggestionType", "add");
    form.set("amenityId", "amenity-1");

    const result = await submitAmenitySuggestion(
      "test-park",
      { error: null, success: false },
      form,
    );

    expect(result).toEqual({
      error: "That amenity is already verified for this park.",
      success: false,
    });
    expect(
      mocks.inserted.some(
        (row) => tableName(row.table) === "amenity_suggestions",
      ),
    ).toBe(false);
    expect(
      mocks.inserted.some((row) => tableName(row.table) === "park_amenities"),
    ).toBe(false);
  });

  it("rejects remove amenity suggestions when the amenity is not verified", async () => {
    const form = new FormData();
    form.set("suggestionType", "remove");
    form.set("amenityId", "amenity-1");

    const result = await submitAmenitySuggestion(
      "test-park",
      { error: null, success: false },
      form,
    );

    expect(result).toEqual({
      error: "That amenity is not currently verified for this park.",
      success: false,
    });
    expect(
      mocks.inserted.some(
        (row) => tableName(row.table) === "amenity_suggestions",
      ),
    ).toBe(false);
    expect(
      mocks.inserted.some((row) => tableName(row.table) === "park_amenities"),
    ).toBe(false);
  });
});
