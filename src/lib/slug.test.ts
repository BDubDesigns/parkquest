import { describe, it, expect } from "vitest";
import { createSlug } from "@/lib/slug";

describe("createSlug", () => {
  it("converts a simple name to a slug", () => {
    expect(createSlug("Elizabeth Park")).toBe("elizabeth-park");
  });

  it("handles commas and state abbreviations", () => {
    expect(createSlug("Bellingham, WA")).toBe("bellingham-wa");
  });

  it("collapses multiple spaces into a single hyphen", () => {
    expect(createSlug("Whatcom  Falls   Park")).toBe("whatcom-falls-park");
  });

  it("removes non-word characters", () => {
    expect(createSlug("Park #2!")).toBe("park-2");
  });

  it("trims leading and trailing hyphens", () => {
    expect(createSlug("---test---")).toBe("test");
  });

  it("returns empty string for empty input", () => {
    expect(createSlug("")).toBe("");
  });
});
