# Tasks

## 1. Tokens

- [x] 1.1 Replace `src/theme/tokens.js` with the Material 3 tonal palettes and system Roboto, and the type scale and corner radius in `tailwind.config.js`. Verify `npx tsc --noEmit` passes.
- [x] 1.2 Set the native window background per theme (`values` / `values-night`). Verify `styles.xml` references `@color/appBackground`.

## 2. Primitives and screens

- [x] 2.1 Restyle every primitive in `src/components/ui/` and add `IconButton` and `Eyebrow`, keeping existing APIs; give `Screen` an `edges` option. Verify the type-check passes.
- [x] 2.2 Build the feed: shape-coded grouped rows, status badge, Continue card, bottom navigation, empty, error and no-match states. Verify the type-check passes.
- [x] 2.3 Build the reader: top bar, progress track, tonal header card, reading styles, end-of-article actions. Verify the type-check passes.
- [x] 2.4 Rewrite the DESIGN.md mission, visual identity, inspirations and feeling sections. Verify the other sections are unchanged.
- [x] 2.5 Bundle the Android JS with `npx expo export --platform android`. Verify it succeeds.

## 3. Device verification

- [ ] 3.1 Build with `./gradlew installDebug` and walk every screen in light and dark mode. Verify the bottom bar clears the gesture area, button shapes spring on press, and every scenario in this change's specs holds.
- [ ] 3.2 Capture Play Store screenshots from this build if this direction is chosen.

## Workflow follow-up

- Merge only the chosen direction; close the other two branches.
