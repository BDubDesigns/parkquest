import { describe, it, expect } from "vitest";
import { tagline } from "@/lib/tagline";

describe("tagline", () => {
  it("matches the expected copy", () => {
    expect(tagline).toBe("Turn every park into an adventure.");
  });
});
