# Tasks

## 1. Tokens and fonts

- [x] 1.1 Replace `src/theme/tokens.js` with the refined palettes (theme-aware lines and shadows, deep dark tints) and Bricolage/Literata families, and the type scale and `2.5` line width in `tailwind.config.js`. Verify `npx tsc --noEmit` passes.
- [x] 1.2 Bundle Bricolage Grotesque and Literata as XML font families, register them in `MainApplication.kt`, keep OFL licences in `mobile/assets/fonts/licenses/`. Verify the family names match tokens.
- [x] 1.3 Set the native window background per theme. Verify `styles.xml` references `@color/appBackground`.

## 2. Primitives and screens

- [x] 2.1 Restyle every primitive with one shadow depth per level and add `HardShadow`, `IconButton` and `Eyebrow`. Verify the type-check passes.
- [x] 2.2 Build the feed: featured lead card, compact rows, type colours, status pill, empty, error and no-match states. Verify the type-check passes.
- [x] 2.3 Build the reader: top bar, bordered hero, source pill, Literata body, end-of-article actions. Verify the type-check passes.
- [x] 2.4 Refine the DESIGN.md visual identity and inspirations sections and mark the current direction. Verify the mission and other sections are unchanged.
- [x] 2.5 Bundle the Android JS with `npx expo export --platform android`. Verify it succeeds.

## 3. Device verification

- [ ] 3.1 Build with `./gradlew installDebug` and walk every screen in light and dark mode. Verify borders and shadows are visible in dark mode, fonts render with real weights, and every scenario in this change's specs holds.
- [ ] 3.2 Capture Play Store screenshots from this build if this direction is chosen.

## Workflow follow-up

- Merge only the chosen direction; close the other two branches.
