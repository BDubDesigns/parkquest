import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  preferences: new Map<string, string>(),
  parks: [
    {
      id: "park-1",
      slug: "official-park",
      name: "Official Park",
      region: { name: "Region" },
      description: null,
      latitude: 1,
      longitude: 2,
      sourceUrl: null,
      officialUrl: null,
      parkAmenities: [],
    },
  ],
}));

vi.mock("drizzle-orm", async (importOriginal) => ({
  ...(await importOriginal<typeof import("drizzle-orm")>()),
  eq: vi.fn((column, value) => ({ column, value })),
  and: vi.fn((...conditions) => conditions),
  inArray: vi.fn((column, values) => ({ column, values })),
}));

function valuesFromWhere(where: unknown): string[] {
  return Array.isArray(where)
    ? (where
        .map((condition) => (condition as { value?: string }).value)
        .filter(Boolean) as string[])
    : [];
}

vi.mock("@/db", () => ({
  db: {
    query: {
      familyParkPreferences: {
        findFirst: vi.fn((options: { where?: unknown }) => {
          const [familyGroupId, parkId] = valuesFromWhere(options.where);
          const nickname = mocks.preferences.get(`${familyGroupId}:${parkId}`);
          return Promise.resolve(nickname ? { nickname } : null);
        }),
        findMany: vi.fn((options: { where?: unknown }) => {
          const [familyGroupId] = valuesFromWhere(options.where);
          return Promise.resolve(
            Array.from(mocks.preferences.entries())
              .filter(([key]) => key.startsWith(`${familyGroupId}:`))
              .map(([key, nickname]) => ({
                parkId: key.split(":")[1],
                nickname,
              })),
          );
        }),
      },
      parks: {
        findFirst: vi.fn(() => Promise.resolve(mocks.parks[0])),
      },
    },
    delete: vi.fn(() => ({
      where: vi.fn((where: unknown) => {
        const [familyGroupId, parkId] = valuesFromWhere(where);
        mocks.preferences.delete(`${familyGroupId}:${parkId}`);
        return Promise.resolve();
      }),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(
        (values: {
          familyGroupId: string;
          parkId: string;
          nickname: string;
        }) => ({
          onConflictDoUpdate: vi.fn(() => {
            mocks.preferences.set(
              `${values.familyGroupId}:${values.parkId}`,
              values.nickname,
            );
            return Promise.resolve();
          }),
        }),
      ),
    })),
  },
}));

import {
  getFamilyParkNickname,
  getFamilyParkNicknames,
  setFamilyParkNickname,
} from "@/lib/park-nicknames";
import { getParkBySlug } from "@/lib/parks";

describe("family park nicknames", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.preferences = new Map();
  });

  it("keeps family A's nickname hidden from family B", async () => {
    await setFamilyParkNickname("family-a", "park-1", "Adventure Base");

    await expect(getFamilyParkNickname("family-a", "park-1")).resolves.toBe(
      "Adventure Base",
    );
    await expect(
      getFamilyParkNickname("family-b", "park-1"),
    ).resolves.toBeNull();
  });

  it("clearing a nickname removes only that family's nickname", async () => {
    await setFamilyParkNickname("family-a", "park-1", "A Name");
    await setFamilyParkNickname("family-b", "park-1", "B Name");

    await setFamilyParkNickname("family-a", "park-1", "   ");

    await expect(
      getFamilyParkNickname("family-a", "park-1"),
    ).resolves.toBeNull();
    await expect(getFamilyParkNickname("family-b", "park-1")).resolves.toBe(
      "B Name",
    );
  });

  it("family nickname maps are scoped by family", async () => {
    await setFamilyParkNickname("family-a", "park-1", "A Name");
    await setFamilyParkNickname("family-b", "park-1", "B Name");

    await expect(
      getFamilyParkNicknames("family-a", ["park-1"]),
    ).resolves.toEqual({ "park-1": "A Name" });
  });

  it("signed-out/public park reads use the official park name", async () => {
    await setFamilyParkNickname("family-a", "park-1", "Secret Family Name");

    const publicPark = await getParkBySlug("official-park");

    expect(publicPark?.name).toBe("Official Park");
    expect(publicPark?.name).not.toBe("Secret Family Name");
  });
});
