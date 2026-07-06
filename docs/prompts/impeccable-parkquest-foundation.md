# ParkQuest design-foundation prompt

Analyze and document ParkQuest's existing visual system. This is a design-foundation and guardrail exercise, not a redesign or implementation pass.

## Product direction

ParkQuest is a family-friendly parks passport: outdoorsy, warm, trustworthy, playful without feeling childish, and mobile-first.

- Use deep emerald and forest green as the base.
- Use warm amber for primary calls to action, rewards, stickers, and adventure moments.
- Use stone and white text.
- Favor rounded cards and panels.
- Keep public park information calm and legible.
- Allow more playfulness in private passport, quest, sticker, and reward moments.
- Avoid raw black debug panels and raw black selects.
- Avoid introducing unrelated palettes.
- Avoid generic AI glassmorphism, excessive gradients, glowing effects, and decorative visual noise.

## Sources to inspect

Start with `src/components/ui/styles.ts` as the existing token and shared-class source of truth. Then inspect representative UI without changing it:

- park list and detail routes under `src/app/parks/`
- `src/components/parks/ParkCard.tsx`
- map UI under `src/app/map/` and `src/components/map/`
- passport UI in `src/app/passport/`
- stamp UI in `src/components/parks/StampForm.tsx`, `StampSection.tsx`, `StampHistory.tsx`, and `ParkQuestStamp.tsx`
- quest, sticker, reward, and passport surfaces in `src/app/passport/` and `src/components/parks/PassportSurface.tsx`
- authentication forms only as examples of existing form treatment

## Deliverables

1. Create a concise `DESIGN.md` describing the system that exists today: product character, palette roles, typography hierarchy, spacing, cards, controls, forms, interaction states, responsive behavior, accessibility expectations, and public-versus-private visual tone.
2. Create `docs/ui-rules.md` with actionable rules coding agents can follow when implementing future issues. Reference existing exports from `src/components/ui/styles.ts` rather than inventing replacements.
3. Add a clearly separated list of potential future component-extraction issues. For each, cite repeated evidence, expected benefit, and a narrow suggested scope. Recommendations are not authorization to implement them.
4. Identify inconsistencies and detector findings as observations or follow-up candidates. Do not fix them in this pass.

## Constraints

- Do not redesign the application.
- Do not edit application components or styles in this pass.
- Do not perform large refactors or extract components.
- Do not change application behavior, routes, database schema, or data.
- Do not touch auth behavior, stamps, rewards, quests, admin approval, or amenity suggestion behavior.
- Do not add Skagit or Sedro-Woolley data.
- Do not create a new palette or broad design system that conflicts with the existing ParkQuest direction.
- Keep generated documentation small, specific, evidence-based, and reviewable.
- Stop after producing the documentation and future-issue recommendations. Present the diff for human review.
