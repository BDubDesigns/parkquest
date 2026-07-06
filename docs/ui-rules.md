# ParkQuest UI rules

These rules translate [DESIGN.md](../DESIGN.md) into implementation constraints. The design direction is **The Trail Journal**: calm and legible for park discovery, tactile and expressive for earned collectibles.

## Source of truth

- `DESIGN.md` defines the target visual language and normative tokens.
- `src/components/ui/styles.ts` contains the current shared Tailwind patterns. Treat it as the migration seam: update shared exports deliberately before copying new class strings across pages.
- `src/app/globals.css` is for true global behavior, named animation primitives, third-party overrides, and CSS that Tailwind cannot express cleanly. It is not a dumping ground for component styling.
- Existing emerald/amber classes are implementation history, not automatic design approval.

## Page structure

- Use Atlas Paper for reading-heavy public pages and White or Mist for focused sections. Forest Ink may anchor navigation, maps, or a contained passport moment; do not make every screen a dark panel.
- Default content width is 42rem for forms and prose, 72rem for park discovery, and full available width for maps.
- Use 16px horizontal padding on narrow screens, 24–32px on wider screens, and at least 48px vertical separation between major sections.
- Keep prose at 70ch or less.
- Prefer lists, ruled sections, shelves, and map relationships over repeated card grids.

## Typography

- Geist is the product font for controls, navigation, forms, body copy, metadata, and data.
- Fraunces is reserved for the homepage, passport chapter titles, collectible names, and exceptional reward moments.
- Never use Fraunces inside buttons, inputs, tables, dense lists, or admin UI.
- Page heading: 2rem/1.15, 700 weight. Section title: 1.25rem/1.25, 700 weight. Body: 1rem/1.6.
- Keep display letter spacing at `-0.025em` or looser. Never go tighter than `-0.04em`.
- Do not use uppercase tracked text as a default section label. Reserve it for literal stamp/serial language and compact legends.

## Color

- Forest Ink structures the interface; Canopy Green indicates outdoor identity, verification, progress, and selection.
- Trail Gold identifies the primary action or earned result. Use one dominant gold action per region.
- Stamp Red belongs to stamps and exceptional milestones, not general decoration and not ordinary error messages.
- Lake Blue belongs to map and informational meaning.
- Errors use Danger and must include explanatory text or an icon.
- Every text and control combination must meet WCAG 2.2 AA. Do not rely on low-opacity text classes without verifying the computed contrast.
- Never communicate selected, completed, locked, safe, or unsafe states through color alone.

## Controls

- All primary controls must be at least 44×44px; use 48px height for primary buttons and text inputs.
- Buttons use 10px corners. Pills are for compact filters, tags, and binary segmented choices—not every action.
- Every interactive component needs default, hover, focus-visible, active, disabled, loading, and error behavior where applicable.
- Focus indicators use a visible 3px outer ring separated from the component. Never remove outlines without a complete replacement.
- Loading labels should preserve control width and state what is happening (`Saving…`, `Signing in…`).
- Error copy states what failed and what the user can do next.

## Surfaces and elevation

- Default surface radius is 14px. Collectible cases may use 18px. Do not use 24–40px card radii.
- Resting surfaces are flat. Use tone or one 1px boundary to establish grouping.
- Do not pair a decorative border with a wide soft shadow.
- Use `0 4px 8px rgba(18, 55, 42, 0.14)` only for interactive lift and `0 12px 28px rgba(18, 55, 42, 0.22)` for actual overlays.
- Define z-index by role: navigation, dropdown, sticky content, overlay backdrop, modal, toast, tooltip. Do not use arbitrary values such as `999` or `9999`.

## Park discovery

- Park list items lead with the park name and the decision-making facts a family needs: distance/context, verified amenities, and concise description.
- Coordinates and source metadata are supporting information, never the visual focal point.
- Amenity badges distinguish verified information semantically and remain readable without hover.
- Map popovers must escape clipping containers, be keyboard reachable, and expose the same essential park information available visually.
- Public discovery remains useful without authentication; do not obscure core park information behind sign-in prompts.

## Collectibles

- Treat stamps, stickers, and quests as separate artifact families with shared alignment but distinct silhouettes and behavior.
- Earned, locked, and in-progress states must differ through shape/detail, label, and status—not opacity or saturation alone.
- A locked collectible explains how it is earned without falsely resembling an earned object.
- A quest presents action, progress, reward, and status in that order.
- A stamp preserves readable park, date, and serial information at mobile sizes.
- Use authored vector or raster artwork for tangible collectible subjects. Do not substitute hand-drawn code-generated SVG scenes, turbulence filters, fake paper grain, or repeating texture gradients.
- Collection screens should support scanning and completion without becoming identical icon-card grids.

## Motion

- Routine transitions last 150–250ms and use ease-out curves.
- Stamp impact or unlock feedback may last up to 500ms when it communicates a completed action.
- Never animate layout properties when transform or opacity can express the state.
- Content is visible before enhancement; animation must not gate rendering.
- Every animation requires a `prefers-reduced-motion` behavior that removes travel and preserves the state change.

## Responsive and accessible behavior

- Design mobile-first and verify at 320px, 375px, 768px, and a wide desktop viewport.
- Respect bottom safe-area insets and preserve navigation labels on mobile.
- Do not place dropdowns inside clipping or scrolling containers without a portal, fixed positioning, or the popover API.
- Use semantic headings in order, explicit labels, useful landmark names, and status announcements for asynchronous results.
- Touch, keyboard, screen reader, zoom to 200%, reduced motion, and color-independent comprehension are release checks—not optional polish.

## Prohibited shortcuts

- No glassmorphism as a default material.
- No gradient text, decorative grid backgrounds, repeating stripe textures, or glow-led hierarchy.
- No faux parchment, paper grain, rough SVG displacement, or topographic filler as shorthand for “outdoors.”
- No repeated eyebrow labels, arbitrary numbered sections, nested cards, or identical card grids.
- No raw black form controls, debug panels, or unrelated accent colors.
- No public social comparison, leaderboards, or UI language that pressures families to compete.

## Migration order

1. Replace the primitive exports in `src/components/ui/styles.ts` with the target color, radius, state, and focus vocabulary.
2. Establish page shell and navigation primitives so public and private surfaces share structure.
3. Migrate buttons, inputs, chips, cards, and status messaging before redesigning individual pages.
4. Build explicit collectible primitives for stamps, stickers, quests, locked states, and collection progress.
5. Migrate park discovery and passport surfaces one issue at a time, verifying contrast, keyboard behavior, responsive layout, and reduced motion.

This order is guidance for future scoped issues. It does not authorize broad refactors outside the active GitHub issue.
