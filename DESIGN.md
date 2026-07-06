---
name: ParkQuest
description: Turn every park into an adventure.
colors:
  forest-ink: "#12372A"
  canopy: "#1F5A42"
  trail-gold: "#F3B33D"
  reward-ink: "#A86100"
  stamp-red: "#B84B3C"
  lake-blue: "#2E7191"
  atlas-paper: "#F7F6F0"
  mist: "#E8EEE9"
  graphite: "#1E2924"
  white: "#FFFFFF"
  danger: "#B42318"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.3
rounded:
  control: "10px"
  surface: "14px"
  collectible: "18px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.trail-gold}"
    textColor: "{colors.forest-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.atlas-paper}"
    textColor: "{colors.forest-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
    height: "48px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "48px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.surface}"
    padding: "20px"
  collectible:
    backgroundColor: "{colors.atlas-paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.collectible}"
    padding: "16px"
---

# Design System: ParkQuest

## 1. Overview

**Creative North Star: "The Trail Journal"**

ParkQuest should feel like a well-used field guide brought on a family outing: practical enough to trust at a glance, personal enough to keep, and full of evidence that someone has been somewhere. The public atlas is calm and daylight-readable. The private passport adds the satisfying material language of stamps, stickers, trail markers, and collected discoveries.

This is a target foundation, not a preservation order for the current dark emerald interface. Existing shared classes in `src/components/ui/styles.ts` are migration evidence, not immutable rules. Future work should move toward clearer hierarchy, lighter information surfaces, stronger state design, and collectibles that have genuine visual identity rather than appearing as text lists.

The system rejects generic glassmorphism, excessive gradients, glowing effects, decorative visual noise, raw black debug-style surfaces, and unrelated palettes. It must never feel like a competitive social network, a children's cartoon, or a dense municipal data portal.

**Key Characteristics:**

- Daylight-legible atlas surfaces grounded by deep forest navigation.
- Tactile, confident controls with unmistakable states and large touch targets.
- Calm information hierarchy for parks, maps, forms, and privacy-sensitive content.
- Collectibles with distinct silhouettes, color families, rarity, and earned-state ceremony.
- Warmth from trail gold, stamp ink, language, and artifacts—not an all-purpose beige wash.

**The Two-Tempo Rule.** Browsing is quiet and efficient; earning is vivid and memorable. Never apply collectible intensity to routine settings, forms, or park facts.

## 2. Colors

The palette pairs a field-guide neutral stage with forest structure and a compact set of artifact colors. Color must communicate role before mood.

### Primary

- **Forest Ink:** the structural anchor for navigation, strong text, map chrome, and high-confidence actions.
- **Canopy Green:** the active outdoor identity for selected states, progress, verified park information, and supporting controls.
- **Trail Gold:** the primary action and reward signal. Use it for the next meaningful action, earned progress, and focused highlights—not as general decoration.
- **Reward Ink:** the darker accessible amber used for rating stars and reward text on light surfaces.

### Secondary

- **Stamp Red:** physical stamp ink, memorable milestones, and occasional collectible emphasis. It is not the default error color.
- **Lake Blue:** informational and map-specific states, including water-related amenities and neutral location context.

### Neutral

- **Atlas Paper:** the primary page background and quiet reading surface. It is deliberately close to neutral, not cream, parchment, or faux-aged paper.
- **Mist:** grouped controls, subtle selected rows, skeletons, and secondary surface separation.
- **Graphite:** primary reading text on light surfaces.
- **White:** elevated controls and high-clarity content surfaces.
- **Danger:** destructive actions and errors only; always pair it with text or an icon.

**The Artifact Color Rule.** Stamp Red and Lake Blue belong to meaningful artifacts or semantic states. If either can be removed without changing meaning, remove it.

**The One-Gold Rule.** Trail Gold identifies the single most useful next action or earned result within a region. Multiple competing gold controls destroy priority.

**The Contrast Rule.** All body text, placeholders, controls, and state labels must meet WCAG 2.2 AA. Never rely on opacity guesses for readable text.

## 3. Typography

**Display Font:** Fraunces (with Georgia fallback)
**Body Font:** Geist (with Arial fallback)

**Character:** Geist keeps product tasks direct and familiar. Fraunces is an accent voice for the homepage, passport chapter titles, and collectible names; its soft, variable forms add field-journal character without turning ordinary UI into themed decoration.

### Hierarchy

- **Display** (650, 3rem, 1.05): homepage statements, passport collection titles, and exceptional reward moments only. Scale down to 2.5rem on narrow screens.
- **Headline** (700, 2rem, 1.15): page-level task headings and major atlas sections.
- **Title** (700, 1.25rem, 1.25): park names, grouped content titles, dialogs, and collectible names.
- **Body** (400, 1rem, 1.6): descriptions, instructions, and form help. Prose is capped at 70ch.
- **Label** (650, 0.875rem, 1.3): buttons, navigation, field labels, filter controls, and concise metadata.

**The Product Voice Rule.** Geist owns every control, form label, navigation item, and data value. Fraunces never appears in a button, table, input, or dense list.

**The Quiet Label Rule.** Uppercase tracking is reserved for literal stamp text, serial marks, and compact map legends. It is forbidden as a repeated section-heading scaffold.

## 4. Elevation

ParkQuest is flat by default. Depth comes from tonal separation, borders with clear purpose, and overlap. Shadows appear only when a surface must demonstrably sit above another surface or respond to interaction.

### Shadow Vocabulary

- **Interactive Lift** (`0 4px 8px rgba(18, 55, 42, 0.14)`): hover or pressed-response support for tappable park and collectible surfaces; never permanently paired with a decorative border.
- **Overlay** (`0 12px 28px rgba(18, 55, 42, 0.22)`): menus, dialogs, and map overlays that must separate from live content.
- **Stamp Contact** (`0 2px 3px rgba(30, 41, 36, 0.24)`): a brief physical contact state during stamping, not general card styling.

**The Flat-Until-Lifted Rule.** Resting content surfaces use tone or a 1px boundary. Shadows communicate interaction or overlay hierarchy, never generic premium styling.

## 5. Components

### Buttons

Buttons feel like trail equipment: sturdy, concise, and easy to operate with one hand.

- **Shape:** gently squared control corners (10px), never universal pills.
- **Primary:** Trail Gold with Forest Ink text, 48px minimum height, used once per action region.
- **Hover / Focus:** darken or lift by one clear step; focus uses a 3px high-contrast outer ring with separation from the control.
- **Secondary:** light surface, Forest Ink border and text; never a translucent ghost that disappears outdoors.
- **Disabled / Loading:** preserve the label width, communicate state in text, and remain legible without color alone.

### Chips

- **Style:** compact filter or amenity controls with 36px minimum height when interactive. Static amenity tags may be smaller but remain readable.
- **State:** selected chips use Canopy Green fill plus a check or removal affordance; unselected chips use a quiet Mist surface. Do not encode selection by border color alone.

### Cards / Containers

- **Corner Style:** restrained surface corners (14px). Collectible display cases may use 18px; routine cards may not.
- **Background:** White for focused content, Atlas Paper for the page, Mist for grouped secondary regions.
- **Shadow Strategy:** flat at rest; Interactive Lift only for truly tappable surfaces.
- **Border:** use a single low-contrast boundary where grouping would otherwise be unclear. Never combine a border with a wide decorative shadow.
- **Internal Padding:** 16px on mobile, 20–24px where space permits.

### Inputs / Fields

- **Style:** White fill, visible Forest Ink-tinted boundary, 10px radius, and 48px minimum height.
- **Focus:** explicit 3px focus ring plus border shift; never glow.
- **Error / Disabled:** error text explains the remedy and uses Danger with an icon. Disabled fields retain readable labels and values.

### Navigation

- **Style:** desktop navigation is compact and structural; mobile navigation is a stable five-destination bar with a 64px minimum target.
- **States:** active destinations use shape, weight, and color together. Inactive items remain comfortably readable.
- **Mobile treatment:** respect safe-area insets, preserve labels, and never use tooltips as the only navigation names.

### Collectibles

Collectibles are a first-class system, not a decorated list.

- **Stamps:** each park stamp uses a coherent postal/field-station geometry, readable place and date, controlled ink variation, and a genuine earned imprint. Texture must not compromise legibility or be simulated with noisy CSS filters.
- **Stickers:** each sticker family has a recognizable silhouette and a small, limited palette. Locked stickers show the silhouette and requirement without pretending to be earned.
- **Quests:** quest rows state the action, progress, reward, and completion status in that order. Completion earns a brief stateful transition, never a page-load spectacle.
- **Collection views:** support scanning by earned status and meaning. Avoid identical card grids; vary structure by artifact type while maintaining alignment.
- **Motion:** stamp and unlock feedback lasts 150–500ms, respects reduced motion, and enhances content that is already visible.

**The Earned Object Rule.** An earned collectible must look materially different from a locked preview through silhouette, detail, label, and state—not saturation alone.

**The No-Fake-Craft Rule.** No paper-grain gradients, sketch filters, roughened SVG edges, or faux-handmade noise. Character comes from typography, composition, illustration quality, and the actual record of an outing.

## 6. Do's and Don'ts

### Do:

- **Do** optimize every primary flow for outdoor mobile use with 44px minimum targets and strong daylight contrast.
- **Do** preserve calm, clear hierarchy for public park facts and privacy-sensitive family content.
- **Do** reserve Trail Gold for the next meaningful action or a genuinely earned result.
- **Do** give stamps, stickers, and quests distinct visual grammars and meaningful locked, progress, and earned states.
- **Do** use semantic structure, visible focus, reduced-motion alternatives, and color-independent state cues to meet WCAG 2.2 AA.
- **Do** migrate shared patterns through `src/components/ui/styles.ts` or future extracted primitives rather than scattering replacement class strings.

### Don't:

- **Don't** use generic glassmorphism, excessive gradients, glowing effects, or decorative visual noise.
- **Don't** use raw black debug-style surfaces or introduce unrelated palettes.
- **Don't** make ParkQuest feel like a competitive social network, a children's cartoon, or a dense municipal data portal.
- **Don't** use cream, parchment, faux-aged paper, paper grain, topographic filler, or rough SVG filters as shortcuts to an outdoors identity.
- **Don't** repeat tiny uppercase tracked eyebrows or numbered markers as general section scaffolding.
- **Don't** combine a 1px border with a wide soft shadow on the same resting card.
- **Don't** use cards when a list, section, map annotation, or collection shelf expresses the relationship more clearly.
- **Don't** hide content behind animation or ship motion without a reduced-motion behavior.
