## Why

Capture currently only works via raw `POST /content` — there's no way to save a URL from inside the app itself. The feed screen (`mobile/app/index.tsx`) can list and read content, but a user has no in-app path to add something new. Capture is the entry point into the whole product; without it, the app can't be used standalone.

## What Changes

- Add an in-app capture flow: a way to input a URL (and optionally pick a content type) and submit it via the existing `useCaptureContent` hook (already scaffolded in `mobile-app-shell`, currently unused).
- Add a visible entry point to trigger capture from the feed screen (e.g. a floating action button or header button opening a capture input).
- On successful capture, the new item appears in the feed (already covered by `useCaptureContent`'s query invalidation) and the user gets clear confirmation (e.g. navigate to feed showing the new `pending` item, or a toast/inline confirmation).
- Handle capture failure (malformed URL — backend returns 422) with an inline, calm error message, not a crash or silent failure.
- No backend changes — `POST /content` and its validation already exist and are unchanged.

## Capabilities

### New Capabilities
- `capture-ui`: in-app URL capture flow — entry point, input, submission, success/error feedback.

### Modified Capabilities
(none — capture-endpoint's contract is unchanged; this is a pure consumer of it)

## Impact

- Affected code: `mobile/app/index.tsx` (add entry point), likely a new `mobile/app/capture.tsx` modal/screen or an inline input component under `mobile/src/components/capture/`.
- Reuses existing `useCaptureContent` hook and `captureContent` API function — no new API client code expected.
- No backend, schema, or dependency changes.
