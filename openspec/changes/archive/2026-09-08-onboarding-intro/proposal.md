## Why

Ohara currently drops a first-time user straight into an empty feed with no explanation of what the app does or how to get content into it. There is no onboarding at all today — the closest thing is `FeedEmptyState`, which only nudges toward the capture screen after the user has already found their way there. Launch requires a proper first-run intro plus a guide to completing the first capture.

## What Changes

- New one-time intro screen (`mobile/app/onboarding.tsx`) shown on first launch: what Ohara is (save links, on-device AI enrichment, read later), and how to add content (paste a link, or share into Ohara from any app via the OS share sheet).
- First-run detection: a persisted `onboarding_complete` flag in the existing `settings` key/value store (`src/db/settings.ts`); root layout redirects to `/onboarding` when unset, `/onboarding` redirects to `/` (feed) once dismissed.
- `FeedEmptyState` gets a one-line mention of the share-sheet path alongside the existing "Save a link" button, so the guidance is reinforced even after onboarding is dismissed.

## Capabilities

### Added Capabilities
- `onboarding`: first-run intro flow and persisted completion flag.

## Impact

- `mobile/app/onboarding.tsx` — new screen.
- `mobile/app/_layout.tsx` — first-run redirect check.
- `mobile/src/components/feed/FeedEmptyState.tsx` — added share-sheet hint line.
- `mobile/src/db/settings.ts` — no schema change, reuses existing generic key/value table.
- No changes to data model, extraction pipeline, or existing screens beyond the redirect check.
