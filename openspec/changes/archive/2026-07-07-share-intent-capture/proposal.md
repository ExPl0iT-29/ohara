## Why

Capturing a link today requires: copy the URL in whatever app you found it in (WhatsApp, browser, etc.), switch to Ohara, open the capture screen, paste, save. That's the exact "more time adding than reading" friction the app exists to eliminate. Android's native Share sheet exists precisely for this — most read-later apps (Pocket, Instapaper) appear directly in the share sheet of any app.

## What Changes

- Register Ohara as an Android share target for shared URLs/text (via `expo-share-intent`'s Expo config plugin, which adds the necessary `AndroidManifest.xml` intent-filter).
- When the app is opened via a share (from WhatsApp, Chrome, etc.), route straight to the capture screen with the URL pre-filled, ready to just tap Save.
- No change to manual capture — pasting a URL directly into the app still works exactly as before.

## Capabilities

### New Capabilities
- `share-intent-capture`: accepting a shared URL from other Android apps via the system share sheet, pre-filling it into the existing capture flow.

### Modified Capabilities
- `capture-ui`: the capture screen now accepts an optional initial URL (from a share intent) in addition to manual entry — same save/validation behavior either way.

## Impact

- Affected code: `mobile/app.json` (new plugin + Android intent-filter config), `mobile/app/_layout.tsx` (handle incoming share intent, redirect to capture), `mobile/app/capture.tsx` (accept pre-filled URL).
- New dependency: `expo-share-intent`.
- Requires a native rebuild (`expo prebuild` + new APK) since it changes `AndroidManifest.xml` — won't work via Metro/Fast Refresh alone on the already-installed APK.
