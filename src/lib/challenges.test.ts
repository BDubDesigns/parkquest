import { describe, it, expect } from "vitest";
import { matchesQuestCriteria } from "@/lib/challenges";

describe("matchesQuestCriteria", () => {
  it("returns true for any_park type regardless of params", () => {
    expect(matchesQuestCriteria("any_park", undefined, false, new Set())).toBe(
      true,
    );
    expect(
      matchesQuestCriteria("any_park", "something", false, new Set()),
    ).toBe(true);
  });

  it("returns true for new_park when isFirstStampOfPark is true", () => {
    expect(matchesQuestCriteria("new_park", undefined, true, new Set())).toBe(
      true,
    );
  });

  it("returns false for new_park when isFirstStampOfPark is false", () => {
    expect(matchesQuestCriteria("new_park", undefined, false, new Set())).toBe(
      false,
    );
  });

  it("returns true for amenity when slug found in parkAmenitySlugs", () => {
    const slugs = new Set(["playground", "trail"]);
    expect(matchesQuestCriteria("amenity", "trail", false, slugs)).toBe(true);
  });

  it("returns false for amenity when slug not found", () => {
    const slugs = new Set(["playground"]);
    expect(matchesQuestCriteria("amenity", "trail", false, slugs)).toBe(false);
  });

  it("returns false for amenity when slug is undefined", () => {
    const slugs = new Set(["trail"]);
    expect(matchesQuestCriteria("amenity", undefined, false, slugs)).toBe(
      false,
    );
  });

  it("returns false for unknown criteria type", () => {
    expect(
      matchesQuestCriteria("unknown_type", undefined, true, new Set()),
    ).toBe(false);
  });

  it("returns true for any_park even when amenity slugs are present", () => {
    expect(
      matchesQuestCriteria("any_park", "not-used", false, new Set(["shelter"])),
    ).toBe(true);
  });

  it("requires exact amenity slug matches", () => {
    expect(
      matchesQuestCriteria("amenity", "play", true, new Set(["playground"])),
    ).toBe(false);
    expect(
      matchesQuestCriteria(
        "amenity",
        "playground",
        true,
        new Set(["playground"]),
      ),
    ).toBe(true);
  });
});
