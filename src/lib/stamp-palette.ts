export const STAMP_PALETTE = [
  { value: "#12372a", label: "Forest ink" },
  { value: "#b84b3c", label: "Stamp red" },
  { value: "#2e7191", label: "Lake blue" },
  { value: "#1f5a42", label: "Canopy green" },
  { value: "#1e2924", label: "Graphite" },
] as const;

export type StampColor = (typeof STAMP_PALETTE)[number]["value"];

export const ALLOWED_STAMP_COLORS: Set<string> = new Set(
  STAMP_PALETTE.map((c) => c.value),
);

export const DEFAULT_STAMP_COLOR: StampColor = "#12372a";

export function isValidStampColor(value: string): value is StampColor {
  return ALLOWED_STAMP_COLORS.has(value);
}
