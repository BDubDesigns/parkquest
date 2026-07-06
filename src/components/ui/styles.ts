/**
 * ParkQuest shared Tailwind class recipes.
 *
 * Trail Journal exports are the target foundation. Legacy exports remain
 * stable while unlisted routes migrate through focused issues.
 */

// ─── Role-based palette tokens ─────────────────────────────────
// Change these when the design palette shifts; all composed recipes
// and consumers update automatically.
export const colorPage = "bg-atlas-paper";
export const colorSurface = "bg-white";
export const colorSurfaceMuted = "bg-mist/70";
export const colorInk = "text-forest-ink";
export const colorInkMuted = "text-graphite/68";
export const colorAction = "bg-trail-gold";
export const colorReward = "text-reward-ink";
export const colorInformation = "text-lake-blue";
export const colorDanger = "text-danger";

// ─── Trail Journal foundation ──────────────────────────────────
export const pageShell = "min-h-screen bg-atlas-paper text-graphite";
export const pageContainer =
  "mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 md:py-10";
export const pageContainerWide =
  "mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 md:py-8";

export const surfacePrimary =
  "rounded-surface bg-white p-4 ring-1 ring-forest-ink/12 sm:p-6";
export const surfaceSecondary =
  "rounded-surface bg-mist/70 p-4 ring-1 ring-forest-ink/10 sm:p-5";

export const sectionTitle = "text-lg font-bold tracking-tight text-forest-ink";
export const collectibleTitle =
  "font-display text-xl font-semibold tracking-[-0.015em] text-forest-ink";
export const heading =
  "font-bold tracking-[-0.02em] text-forest-ink text-balance";
export const bodyText = "leading-7 text-graphite/80 text-pretty";
export const mutedText = "text-graphite/68";

export const linkPrimary =
  "font-medium text-forest-ink underline decoration-canopy/45 decoration-1 underline-offset-4 transition-colors hover:text-canopy hover:decoration-canopy focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lake-blue";
export const linkText = linkPrimary;
export const linkMuted =
  "text-graphite/72 underline decoration-graphite/30 underline-offset-4 transition-colors hover:text-forest-ink hover:decoration-canopy focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lake-blue";

export const actionPrimary =
  "inline-flex min-h-12 items-center justify-center rounded-control bg-trail-gold px-5 py-3 text-sm font-bold text-forest-ink transition-[background-color,transform] duration-150 ease-out hover:-translate-y-px hover:bg-trail-gold/80 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-lake-blue";
export const actionSecondary =
  "inline-flex min-h-12 items-center justify-center rounded-control border border-forest-ink bg-white px-5 py-3 text-sm font-bold text-forest-ink transition-[background-color,transform] duration-150 ease-out hover:-translate-y-px hover:bg-mist active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-lake-blue";
export const actionGhost =
  "inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold text-forest-ink transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lake-blue";

export const fieldInput =
  "min-h-12 rounded-control border border-forest-ink/45 bg-white px-3.5 py-2.5 text-base text-graphite placeholder:text-graphite/65 focus:border-forest-ink focus:outline-none focus-visible:ring-3 focus-visible:ring-trail-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-mist disabled:text-graphite/65";
export const fieldSelect = fieldInput;
export const fieldLabel = "text-sm font-semibold text-forest-ink";

export const divider = "border-forest-ink/18";
export const dividerSubtle = "border-forest-ink/12";

export const statusSuccess =
  "inline-flex items-center gap-1.5 rounded-full bg-canopy px-2.5 py-1 text-xs font-semibold text-white";
export const statusReward =
  "inline-flex items-center gap-1.5 rounded-full bg-trail-gold px-2.5 py-1 text-xs font-semibold text-forest-ink";
export const statusMuted =
  "inline-flex items-center gap-1.5 rounded-full bg-graphite/8 px-2.5 py-1 text-xs font-semibold text-graphite/75";
export const skeleton = "animate-pulse rounded-md bg-forest-ink/10";
