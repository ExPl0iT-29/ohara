# Design

## Context

`ui-theme-foundation` put every colour and font in `src/theme/tokens.js` and screens on shared primitives. This direction keeps the neo-brutalist identity and changes tokens, primitives and the feed and reader layouts. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** keep the recognisable identity; reduce visual noise; make dark mode correct; give the reader a calmer body.

**Non-Goals:** changing the mission in DESIGN.md, new features.

## Decisions

### D1. `HardShadow` primitive with level-fixed offsets
One component draws the offset layer from the theme's `shadow` token; `Card`, `IconButton` and feed cards use it, `Button` animates its own so the face can slide onto it. Offsets: 4dp cards and FAB, 3dp buttons, 2dp icon buttons.

### D2. Theme-aware lines
`line` becomes a light/dark pair (#1C1917 / #E9E1CC) and the dark shadow is a warm dark brown, fixing invisible borders in dark mode on `main`.

### D3. Bricolage Grotesque + Literata, native XML families
Bricolage is expressive at heavy weights and readable small; Literata keeps long reads calm. Registered with `ReactFontManager.addCustomFont` so weights are real. The width token is named `2.5` (`border-2.5`) to avoid clashing with the `line` colour in class names.

### D4. Colour by content type
A small mapping (`typeColors.ts`) assigns each content type a family, used for type pills, tiles and the lead card band.

## Risks / Trade-offs

- **Still the loudest of the three directions in the reader chrome** → the body text is unboxed Literata, and actions sit below the article.
- **Not verified on a device here** → device check task.
- **APK grows by about 1.3 MB** for fonts.

## Migration Plan

Choose this branch or an alternative; merge only one. Rollback is reverting the merge; no data changes.
