## Context

`mobile/app/capture.tsx` only supports a user manually typing/pasting a URL. `mobile/app.json` has no intent-filters, so Android never offers Ohara in the share sheet for other apps' shared content.

## Goals / Non-Goals

**Goals:**
- Ohara appears in Android's Share sheet when sharing a URL or plain text containing a URL from any app.
- Selecting Ohara from the share sheet opens the app directly on the capture screen with the URL already filled in — user just picks a content type (optional) and taps Save.
- Manual capture flow (typing/pasting into the existing text field) keeps working unchanged.

**Non-Goals:**
- iOS share extension (not building for iOS currently; `expo-share-intent` supports it but we scope this change to Android only).
- Sharing images/files (only URL/text sharing, matching the existing capture contract which only accepts a URL).

## Decisions

- **Library: `expo-share-intent`** — the standard community solution for this in Expo projects; ships an Expo config plugin that adds the Android intent-filter automatically via `app.json`, plus a `useShareIntent()` hook that exposes the shared content in JS. Avoids hand-writing native Android manifest/activity code.
- **Routing**: `app/_layout.tsx` checks `useShareIntent()` on mount; if a share intent with text/URL is present, it navigates to `/capture` with the URL as a route param, then resets the share-intent state (library provides `resetShareIntent()`) so re-opening the app normally doesn't re-trigger it.
- **Capture screen**: `app/capture.tsx` reads an optional `url` param via `useLocalSearchParams` and uses it as the `TextInput`'s initial value via `useState`'s initializer — falls back to empty string for the existing manual-entry path. No behavior change to validation/save.
- **Android-only scope**: `app.json`'s `expo-share-intent` plugin config targets Android only (no iOS-specific `activationRules`/URL-scheme config added), matching where this app is actually tested/built.

## Risks / Trade-offs

- [Native rebuild required] → Unavoidable; intent-filters are compiled into `AndroidManifest.xml`, can't be delivered via Metro/OTA JS update alone. Existing installed APK needs a fresh build+install to pick this up.
- [Only handles URL/plain-text shares, not images or files] → Matches the existing capture contract (URL-only); out of scope to extend that contract here.
