## 1. Onboarding screen

- [x] 1.1 Add `mobile/app/onboarding.tsx`: intro copy (what Ohara does) + first-capture guide (paste a link via Save screen, or share into Ohara from any app), `BrutalButton` "Get started" that sets `onboarding_complete=1` and routes to `/`

## 2. First-run redirect

- [x] 2.1 In `mobile/app/_layout.tsx`, on mount check `getSetting("onboarding_complete")`; if unset, redirect to `/onboarding` before the feed is shown
- [x] 2.2 Guard against redirect loop / share-intent capture: onboarding check must not fire when a share-intent redirect to `/capture` is already in flight

## 3. Empty state reinforcement

- [x] 3.1 `FeedEmptyState`: add one line mentioning the share-sheet path alongside the existing "Save a link" button

## 4. Verification

- [x] 4.1 `npx tsc --noEmit` clean
- [ ] 4.2 On-device or emulator: fresh install shows onboarding once, "Get started" routes to feed, relaunching the app does not show onboarding again
- [x] 4.3 Sync spec delta into `openspec/specs/onboarding/spec.md`, archive the change
