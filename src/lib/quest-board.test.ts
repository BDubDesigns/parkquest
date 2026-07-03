import { describe, it, expect } from "vitest";
import { todayUTC } from "@/lib/quest-board";

describe("todayUTC", () => {
  it("returns a valid YYYY-MM-DD date string", () => {
    const result = todayUTC();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns today's date", () => {
    const result = todayUTC();
    const expected = new Date().toISOString().split("T")[0];
    expect(result).toBe(expected);
  });
});
