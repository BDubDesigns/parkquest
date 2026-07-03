export function calculateBaseXP(
  isFirstStampOfPark: boolean,
  stampsToday: number,
): { amount: number; reason: string } | null {
  if (stampsToday >= 3) return null;
  return {
    amount: isFirstStampOfPark ? 50 : 5,
    reason: isFirstStampOfPark ? "First park stamp" : "Repeat park stamp",
  };
}
