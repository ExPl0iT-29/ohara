## Context

`mobile/src/hooks/useCaptureContent.ts` already wraps `captureContent(url, contentType)` in a React Query mutation that invalidates the content list on success — built during `mobile-app-shell` but never wired to any UI. The feed screen (`mobile/app/index.tsx`) has no entry point to reach it. Expo Router is file-based; a new route is the natural way to add a capture screen.

## Goals / Non-Goals

**Goals:**
- One clear entry point from the feed screen into capture.
- A minimal input (URL text field, optional content-type picker) that submits via the existing mutation hook.
- Clear, calm success and error feedback — no crashes on bad input, no silent failures.

**Non-Goals:**
- Share-sheet / OS-level "share to Ohara" integration (separate, larger change — needs native share extension work).
- Content-type auto-detection from the URL (backend already defaults to `other` when omitted; no new logic needed here).
- Editing/deleting captured content (out of scope — capture is write-once from the UI's perspective).

## Decisions

- **New route `mobile/app/capture.tsx`**: a modal-style screen (Expo Router supports `presentation: "modal"` via `Stack.Screen` options in `_layout.tsx`) rather than an inline expanding field on the feed screen. Rationale: keeps the feed screen simple (matches `reader-view`'s precedent of one focused screen per concern), and a modal is the conventional pattern for a quick "add" action.
- **Entry point**: a floating action button (FAB) in the bottom-right of `mobile/app/index.tsx`, styled with NativeWind, routing to `/capture` via `expo-router`'s `Link`/`router.push`. Rationale: FAB is the standard mobile pattern for a primary "create" action and doesn't require restructuring the existing feed header.
- **Content-type input**: a simple optional picker (a row of selectable chips for the fixed `ContentType` enum, defaulting to none/`other`) rather than a full dropdown component — avoids pulling in a picker library for an 11-value enum.
- **Submission feedback**: on success, `router.back()` to return to the feed (which will show the new `pending` item, already covered by query invalidation) with a brief inline confirmation state before dismissing. On error (422 from malformed URL, or network failure), show inline error text under the input — do not dismiss the modal, so the user can correct and retry.
- **No new dependencies**: `useCaptureContent`, `Linking`-free (this is data entry, not navigation-out), Expo Router modal presentation, and NativeWind are all already present.

## Risks / Trade-offs

- [FAB overlapping list content on small screens] → Standard bottom-right FAB positioning with safe-area padding; acceptable for a placeholder-quality feed screen (feed's own polish is `home-feed-ui`'s scope, not this change's).
- [No client-side URL format validation before submit] → Rely on backend's existing 422 validation and surface its error inline; duplicating URL-format validation client-side is unnecessary complexity for a single-user local-first app.
