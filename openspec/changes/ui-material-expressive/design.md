# Design

## Context

`ui-theme-foundation` put every colour and font in `src/theme/tokens.js` and every screen on shared primitives. This direction changes tokens, primitives and the feed and reader layouts. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** feel native on Android; meaningful shape variety; spring motion on touch; both themes from proper M3 tonal roles.

**Non-Goals:** dynamic (wallpaper) colour, a full tab navigator with separate routes, bundled fonts.

## Decisions

### D1. Static tonal palette from a teal seed, not dynamic colour
Material You's wallpaper colours would need a native module and would make store screenshots unpredictable. A fixed palette keeps the brand teal.

### D2. System Roboto
Roboto ships with Android in all weights, so text matches the platform and the APK does not grow. Roboto Flex was considered but is only available as a single static weight in packaged form.

### D3. Shape-coded thumbnails using corner radii only
Circle, arch, leaf, squircle and ticket silhouettes are built from per-corner radii, which work on both `View` and `expo-image` without masking libraries.

### D4. Navigation bar inside the feed, not a tab navigator
Library and Archive are the same list with a different filter, so the bar switches the filter and Settings pushes its route. This avoids restructuring routes for two views of one screen.

### D5. Press motion
Buttons animate corner radius and scale with springs (Reanimated, UI thread); the FAB scales and springs, which keeps the existing FAB press requirement.

## Risks / Trade-offs

- **Less distinctive in store screenshots than A or C** → the shape-coded list and Continue card are the signature; feature them in screenshots.
- **Glyph icons (⚙ ↗ ⇣) depend on the system font** → acceptable for a first pass; a proper icon set can replace them without layout changes.
- **Not verified on a device here** → device check task.

## Migration Plan

Choose this branch or an alternative; merge only one. Rollback is reverting the merge; no data changes.
