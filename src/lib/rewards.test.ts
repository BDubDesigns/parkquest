import { describe, it, expect } from "vitest";
import { calculateBaseXP } from "@/lib/rewards";

describe("calculateBaseXP", () => {
  it("returns 50 for first park stamp when under daily cap", () => {
    const result = calculateBaseXP(true, 0);
    expect(result).toEqual({ amount: 50, reason: "First park stamp" });
  });

  it("returns 5 for repeat park stamp when under daily cap", () => {
    const result = calculateBaseXP(false, 0);
    expect(result).toEqual({ amount: 5, reason: "Repeat park stamp" });
  });

  it("returns null when daily cap reached (stampsToday >= 3)", () => {
    expect(calculateBaseXP(true, 3)).toBeNull();
    expect(calculateBaseXP(false, 4)).toBeNull();
  });

  it("returns null when cap exactly at 3", () => {
    expect(calculateBaseXP(true, 3)).toBeNull();
    expect(calculateBaseXP(false, 3)).toBeNull();
  });
});
