import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  getCurrentAdminUserId: vi.fn(),
  suggestion: {
    id: "suggestion-1",
    parkId: "park-1",
    amenityId: "amenity-1",
    suggestionType: "add" as "add" | "remove",
    park: { slug: "test-park" },
  },
  inserted: [] as unknown[],
  deleted: [] as unknown[],
  updated: [] as unknown[],
}));

function makeTx() {
  return {
    query: {
      amenitySuggestions: {
        findFirst: vi.fn(() => Promise.resolve(mocks.suggestion)),
      },
    },
    insert(table: unknown) {
      return {
        values(values: unknown) {
          mocks.inserted.push({ table, values });
          return {
            onConflictDoUpdate: vi.fn(() => Promise.resolve()),
          };
        },
      };
    },
    delete(table: unknown) {
      mocks.deleted.push(table);
      return { where: vi.fn(() => Promise.resolve()) };
    },
    update(table: unknown) {
      return {
        set(values: unknown) {
          mocks.updated.push({ table, values });
          return { where: vi.fn(() => Promise.resolve()) };
        },
      };
    },
  };
}

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/admin", () => ({
  getCurrentAdminUserId: mocks.getCurrentAdminUserId,
}));
vi.mock("@/db", () => ({
  db: {
    transaction: vi.fn(
      async (callback: (tx: ReturnType<typeof makeTx>) => Promise<unknown>) =>
        callback(makeTx()),
    ),
  },
}));

import { reviewAmenitySuggestion } from "./actions";

function form() {
  const data = new FormData();
  data.set("suggestionId", "suggestion-1");
  return data;
}

describe("amenity suggestion admin review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentAdminUserId.mockResolvedValue("admin-1");
    mocks.suggestion.suggestionType = "add";
    mocks.inserted = [];
    mocks.deleted = [];
    mocks.updated = [];
  });

  it("prevents non-admin users from approving or rejecting suggestions", async () => {
    mocks.getCurrentAdminUserId.mockResolvedValue(null);

    const result = await reviewAmenitySuggestion(
      "approve",
      { error: null, success: false },
      form(),
    );

    expect(result).toEqual({ error: "Admin access required.", success: false });
    expect(mocks.inserted).toEqual([]);
    expect(mocks.updated).toEqual([]);
  });

  it("admin approval of add suggestions writes verified park amenities", async () => {
    const result = await reviewAmenitySuggestion(
      "approve",
      { error: null, success: false },
      form(),
    );

    expect(result).toEqual({ error: null, success: true });
    expect(mocks.inserted).toHaveLength(1);
    expect(mocks.deleted).toHaveLength(0);
    expect(mocks.updated[0]).toBeTruthy();
  });

  it("admin approval of remove suggestions removes verified park amenities", async () => {
    mocks.suggestion.suggestionType = "remove";

    const result = await reviewAmenitySuggestion(
      "approve",
      { error: null, success: false },
      form(),
    );

    expect(result).toEqual({ error: null, success: true });
    expect(mocks.inserted).toHaveLength(0);
    expect(mocks.deleted).toHaveLength(1);
    expect(mocks.updated[0]).toBeTruthy();
  });

  it("admin rejection records rejected status without changing verified amenities", async () => {
    const result = await reviewAmenitySuggestion(
      "reject",
      { error: null, success: false },
      form(),
    );

    expect(result).toEqual({ error: null, success: true });
    expect(mocks.inserted).toHaveLength(0);
    expect(mocks.deleted).toHaveLength(0);
    expect(mocks.updated[0]).toBeTruthy();
  });
});
