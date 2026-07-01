/**
 * ParkQuest visual design tokens.
 *
 * Shared Tailwind class strings extracted from repeated patterns across pages.
 * These use the dark emerald brand palette anchored by the homepage.
 *
 * Palette:
 *   emerald-950  — page backgrounds
 *   emerald-900  — card surfaces
 *   emerald-800  — dividers, ring borders
 *   emerald-700  — card borders
 *   emerald-300  — static section eyebrow labels
 *   emerald-200  — body text on cards
 *   emerald-100  — secondary text
 *   amber-300    — CTAs, rewards, quests, active nav
 *   white        — primary headings, earned/completed items, important links
 *   stone-400..200 — muted/pending text, descriptions
 */

// ─── Page shells ────────────────────────────────────────────────
/** Full-page dark emerald background. Apply to outermost layout wrapper. */
export const pageShell = "min-h-screen bg-emerald-950";

/** Standard page container: max-w-2xl, centered, with top/bottom padding. */
export const pageContainer = "mx-auto max-w-2xl px-4 py-6 md:py-8";

/** Wide page container for the map page. */
export const pageContainerWide = "mx-auto max-w-5xl px-3 py-4 sm:px-4 md:py-8";

// ─── Cards ──────────────────────────────────────────────────────
/** Primary card: dark emerald surface with border, shadow, and responsive padding. */
export const card =
  "rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:p-6";

/** Secondary card: softer surface with ring border, no heavy shadow. */
export const cardSecondary =
  "rounded-2xl bg-emerald-900/60 p-4 ring-1 ring-emerald-800 sm:p-5";

// ─── Typography ─────────────────────────────────────────────────
/** Section eyebrow label — static info (emerald). */
export const eyebrow =
  "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300";

/** Section eyebrow label — rewards, quests, stickers (amber). */
export const eyebrowAmber =
  "text-sm font-semibold uppercase tracking-[0.2em] text-amber-300";

/** Page heading (h1). Apply alongside text-2xl/sm:text-3xl. */
export const heading = "font-bold tracking-tight text-white";

/** Body / description text on dark surfaces. */
export const bodyText = "text-emerald-100/75";

/** Muted secondary text — dates, descriptions, pending states. */
export const mutedText = "text-stone-400/70";

// ─── Links ──────────────────────────────────────────────────────
/** Important link: white with amber underline decoration. */
export const linkPrimary =
  "text-white underline decoration-amber-500/40 underline-offset-2 hover:decoration-amber-300";

/** Standard text link: emerald with underline. */
export const linkText =
  "text-emerald-200/70 underline decoration-emerald-500 underline-offset-4 hover:text-white";

/** Muted link: stone tones for lower-priority items. */
export const linkMuted =
  "text-stone-300/70 underline decoration-stone-500/40 underline-offset-2 hover:text-white";

// ─── Buttons ────────────────────────────────────────────────────
/** Primary CTA button: amber rounded-full. */
export const ctaPrimary =
  "rounded-full bg-amber-300 px-6 py-2 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-200";

/** Secondary CTA button: bordered emerald style. */
export const ctaSecondary =
  "rounded-full border border-emerald-400/60 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-900";

/** Ghost / cancel button: subtle emerald outline. */
export const ctaGhost =
  "rounded-full border border-emerald-600/40 px-4 py-2 text-sm font-medium text-emerald-200/80 transition-colors hover:bg-emerald-900/60";

// ─── Forms ──────────────────────────────────────────────────────
/** Dark-themed form input with amber focus ring. */
export const formInput =
  "rounded-md border border-emerald-600/60 bg-emerald-900/40 px-3 py-2 text-sm text-white placeholder:text-emerald-300/50 focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50";

/** Form label text. */
export const formLabel = "text-sm font-medium text-emerald-200";

// ─── Dividers ───────────────────────────────────────────────────
export const divider = "border-emerald-800";

export const dividerSubtle = "border-emerald-800/50";
