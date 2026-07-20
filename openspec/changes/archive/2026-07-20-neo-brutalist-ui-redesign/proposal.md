## Why

Ohara's current visual language (soft warm neutrals, muted accents, "quiet reading room" per `openspec/specs/DESIGN.md`) reads as generic and low-energy. After reviewing Tuckii (a competing save-and-read app) the user wants Ohara to adopt its bold, tactile, neo-brutalist visual identity instead: thick black borders, hard offset shadows, saturated accent colors, folder-tab collection cards, chunky pill buttons. `openspec/specs/DESIGN.md` has been updated in this change to reflect the new mission ("bold, tactile, confident" replacing "calm reading room").

## What Changes

- New shared design tokens: bold accent color palette (yellow/pink/violet/mint), black border color, hard-offset shadow primitive, condensed display type weight.
- New reusable UI primitives: `BrutalCard` (bordered card with hard offset shadow) and `BrutalButton` (bordered pill/square button with press-down shadow-collapse feedback), replacing ad hoc card/button styling.
- Re-skin of all screens to use the new primitives: capture screen, feed/library, collection cards, reader view chrome (header/archive/tags — not the reading body text itself), settings.
- Collection cards restyled as folder-tab shapes (colored tab peeking above a bordered card), matching Tuckii's collection grid.
- **BREAKING (visual only, no data/API changes)**: existing muted color tokens (`brand`, `amber`, `danger` soft variants) are replaced/restyled; any screen not explicitly migrated in this change will look inconsistent until follow-up work covers it.

## Capabilities

### Modified Capabilities
- `ui-redesign`: design tokens change from muted/warm-neutral to bold neo-brutalist (new color palette, border/shadow tokens); app branding assets (icon/splash) unaffected by this change.

## Impact

- `mobile/tailwind.config.js` — new color tokens, border/shadow additions.
- `mobile/src/components/ui/` — new `BrutalCard.tsx`, `BrutalButton.tsx` primitives.
- `mobile/app/index.tsx` (or equivalent feed screen), `mobile/app/capture.tsx`, `mobile/app/content/[id].tsx`, `mobile/app/settings.tsx`, and feed/collection card components under `mobile/src/components/` — restyled to use new primitives.
- `openspec/specs/DESIGN.md` — mission/visual-identity sections rewritten (already applied in this change).
- No changes to data model, extraction pipeline, or navigation structure.
