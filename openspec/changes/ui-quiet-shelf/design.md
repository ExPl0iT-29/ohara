# Design

## Context

`ui-theme-foundation` moved every colour and font into `src/theme/tokens.js` and every screen onto primitives (`Button`, `Card`, `Chip`, `Tag`, `TextField`, `Notice`, `TextButton`, `Divider`, `Fab`, `Screen`). This direction changes tokens, primitives and three layouts (feed row, feed screen, reader). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** a calm, typography-first identity; real font weights on Android; both themes designed, not inverted; no behaviour removed.

**Non-Goals:** new features beyond presentation (the Continue reading grouping and progress line only reorder and display existing data), iOS fonts.

## Decisions

### D1. Fonts bundled as XML font families, registered in `MainApplication`
Literata (400, 400 italic, 600, 700, 700 italic) and Instrument Sans (400–700) live in `res/font/` with `literata.xml` and `instrument_sans.xml`, registered via `ReactFontManager.getInstance().addCustomFont`. *Why:* with plain `assets/fonts` files Android only distinguishes regular and bold by file name and synthesises other weights; an XML family lets `fontWeight` pick the real face. *Alternative:* `expo-font` runtime loading; rejected because the app is now built with Gradle and gains nothing from a JS loader.

### D2. Literata for titles and reading, Instrument Sans for UI
Literata was designed for long-form screen reading (Google Play Books). A sans for UI keeps labels compact and separates "chrome" from "content" without boxes.

### D3. Hairlines, not borders or shadows
Surfaces are white on paper with a 1px line; selection is ink fill; emphasis is the teal accent. The `Card` `tabColor` prop is accepted and ignored to keep the API stable.

### D4. Continue reading is derived, not stored
Items with 2–97% scroll progress and not archived form the first section when nothing is filtered. No schema change.

### D5. Reader progress on the UI thread
A Reanimated scroll handler updates a shared value that drives the progress line's width, so scrolling does not re-render the HTML body.

## Risks / Trade-offs

- **Font rendering not verified on a device here** (no Android SDK in the authoring environment) → device check task; a wrong family name falls back to the system font rather than crashing.
- **APK grows by about 1.5 MB** for fonts → acceptable for a reading app.
- **Calm can read as plain in store screenshots** → screenshots should show the reader, where this direction is strongest.
- **Reordering tags and archive below the article** → archive remains available from the feed swipe actions.

## Migration Plan

Choose this branch or one of the alternatives; merge only one. Rollback is reverting the merge; no data changes.
