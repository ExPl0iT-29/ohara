# Tasks

## 1. Theme layer

- [x] 1.1 Add `src/theme/tokens.js` (+ `.d.ts`) and `useTheme()`, and make `tailwind.config.js` read colours and font families from it. Verify `npx tsc --noEmit` passes.
- [x] 1.2 Replace every hard-coded hex colour outside `src/theme/` with tokens. Verify a grep for `#[0-9A-Fa-f]{6}` in `app/` and `src/` (excluding `src/theme/`) returns nothing.

## 2. Primitives

- [x] 2.1 Rename `BrutalButton`/`BrutalCard` to `Button`/`Card`; add `Chip`, `Tag`, `TextField`, `Screen`, `Fab`; move all screens onto them. Verify no screen imports `SafeAreaView` or `TextInput` directly and the type-check passes.
- [x] 2.2 Add a font-role class to every text style. Verify every class list containing `text-display|title|body|caption` also contains `font-heading|ui|reading`.
- [x] 2.3 Fix the onboarding copy so it no longer mentions summarising. Verify by reading `app/onboarding.tsx`.

## 3. Primitives own their text

- [x] 3.1 Make `Button` render its own label and add `Notice`, `TextButton` and `Divider`; move capture, reader, status notice, onboarding, settings and feed states onto them. Verify no `Button` call site passes children and the type-check passes.
- [x] 3.2 Fix highlight cards showing light text on a light card in dark mode. Verify the highlight text class has no `dark:text-paper`.

## 4. Integration

- [x] 4.1 Bundle the Android JS with `npx expo export --platform android`. Verify the export succeeds.
- [ ] 4.2 On a device, compare every screen against the previous build in light and dark mode. Verify nothing changed except the stack header colour.
