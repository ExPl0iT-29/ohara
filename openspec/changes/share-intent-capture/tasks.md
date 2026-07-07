## 1. Install and configure

- [ ] 1.1 `npx expo install expo-share-intent`
- [ ] 1.2 Add `expo-share-intent` to `app.json` plugins, scoped to Android

## 2. Routing

- [ ] 2.1 In `app/_layout.tsx`, use `useShareIntent()` to detect an incoming shared URL and redirect to `/capture?url=<shared url>`
- [ ] 2.2 Reset the share intent state after consuming it so re-launching the app normally doesn't retrigger navigation

## 3. Capture screen

- [ ] 3.1 Read optional `url` param in `app/capture.tsx` via `useLocalSearchParams`, use as initial `TextInput` value
- [ ] 3.2 Confirm manual entry (no param) still works unchanged

## 4. Native rebuild

- [ ] 4.1 `expo prebuild --platform android --clean` to regenerate `AndroidManifest.xml` with the new intent-filter
- [ ] 4.2 Build release APK, install on device

## 5. Verification

- [ ] 5.1 Typecheck mobile
- [ ] 5.2 From WhatsApp (or any app), share a link → confirm Ohara appears in the share sheet
- [ ] 5.3 Confirm tapping Ohara in the share sheet opens the capture screen with the URL pre-filled
- [ ] 5.4 Confirm Save still works and manual paste-based capture is unaffected
