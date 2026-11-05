# Tasks

## 1. Tokens and fonts

- [x] 1.1 Replace `src/theme/tokens.js` with the Quiet Shelf palettes and font families, and the type scale in `tailwind.config.js`. Verify `npx tsc --noEmit` passes.
- [x] 1.2 Bundle Literata and Instrument Sans as XML font families in `res/font/`, register them in `MainApplication.kt`, and keep the OFL licences in `mobile/assets/fonts/licenses/`. Verify the family names match `fonts` in tokens.
- [x] 1.3 Set the native window background per theme (`values` / `values-night`). Verify `styles.xml` references `@color/appBackground`.

## 2. Primitives and screens

- [x] 2.1 Restyle every primitive in `src/components/ui/`, keeping their APIs. Verify the type-check passes with no call-site changes outside feed and reader layouts.
- [x] 2.2 Rebuild the feed row, status badge, empty and error states, and the feed screen (tabs, sections, no-match state). Verify the type-check passes.
- [x] 2.3 Rebuild the reader header, reading typography and reader layout with the progress line. Verify the type-check passes.
- [x] 2.4 Rewrite the DESIGN.md mission, visual identity, inspirations and feeling sections. Verify the other sections are unchanged.
- [x] 2.5 Bundle the Android JS with `npx expo export --platform android`. Verify it succeeds.

## 3. Device verification

- [ ] 3.1 Build with `./gradlew installDebug` and walk feed, reader, capture, settings, stats and onboarding in light and dark mode. Verify Literata and Instrument Sans render with real bold and italic, and every scenario in this change's specs holds.
- [ ] 3.2 Capture Play Store screenshots of the feed and reader from this build if this direction is chosen.

## Workflow follow-up

- Merge only the chosen direction; close the other two branches.
