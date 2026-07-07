## 1. Branding

- [x] 1.1 Set `mobile/app.json` `name` to "Ohara", `slug` to "ohara"
- [x] 1.2 Design and render a flat bookmark-ribbon icon (teal on paper) via Pillow
- [x] 1.3 Replace `icon.png`, `android-icon-foreground.png`, `android-icon-background.png`, `android-icon-monochrome.png`, `splash-icon.png`, `favicon.png`
- [x] 1.4 Update adaptive-icon `backgroundColor` to paper tone

## 2. Design tokens

- [x] 2.1 Add `paper`/`ink`/`brand`/`line`/`danger`/`amber` color tokens to `tailwind.config.js`
- [x] 2.2 Add `display`/`title`/`body`/`caption` font-size scale
- [x] 2.3 Add `card`/`pill` border-radius tokens
- [x] 2.4 Fix `darkMode: "class"` config (was defaulting to `"media"`, breaking NativeWind's runtime color-scheme code)

## 3. Apply across screens

- [x] 3.1 Feed screen (`app/index.tsx`) — title, loading/empty/error states, FAB, list
- [x] 3.2 `FeedListItem`, `FeedStatusBadge`, `FeedEmptyState`, `FeedErrorState`
- [x] 3.3 Reader screen (`app/content/[id].tsx`) and `ReaderHeader`, `ReaderSummary`, `ReaderBody`, `ReaderStatusNotice`
- [x] 3.4 Capture screen (`app/capture.tsx`)
- [x] 3.5 Fix double nav header (`app/_layout.tsx` — hide default expo-router header on non-modal screens)

## 4. Verification

- [x] 4.1 Typecheck mobile (clean, no errors)
- [x] 4.2 Verify on physical device via Metro/dev-client — paper/teal design renders correctly
- [x] 4.3 Verify app name shows as "Ohara" in native `strings.xml` after prebuild
- [x] 4.4 Build release APK, confirm new bundle/icon assets present in the artifact
