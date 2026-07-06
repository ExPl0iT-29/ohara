## Why

`mobile/app/index.tsx` is still the `mobile-app-shell` placeholder: a bare `FlatList` with no empty state, no pull-to-refresh, no distinct loading treatment, and status shown as raw enum text (`"pending"`, `"processing"`). It's the first screen every session opens — per DESIGN.md, first impressions matter and empty/loading states should be calm, not blank or broken-looking. Reader-view and capture-ui already got real polish; the feed itself hasn't.

## What Changes

- Add a genuine empty state for a fresh install (no content saved yet) with a nudge toward the existing capture entry point, rather than a blank list.
- Add a distinct loading state (skeleton or calm placeholder) instead of nothing rendering during the initial fetch.
- Add pull-to-refresh on the list (`RefreshControl` via React Query's `refetch`).
- Replace raw status text (`pending`/`processing`/`ready`/`failed`) with calm, human-readable status labels/badges consistent with reader-view's status language ("still being prepared" etc.).
- Add a distinct error state for a failed fetch (network/backend down), separate from the empty state.
- No backend or API changes — purely a `mobile/app/index.tsx` UI change consuming the existing `useContentList` hook and `GET /content` response shape.

## Capabilities

### New Capabilities
- `home-feed-ui`: the feed screen's list rendering, empty/loading/error states, pull-to-refresh, and status presentation.

### Modified Capabilities
(none — reader-api's `GET /content` contract is unchanged; this is a pure consumer of it)

## Impact

- Affected code: `mobile/app/index.tsx` (rewrite), likely small presentational components under `mobile/src/components/feed/` (e.g. a status badge, an empty-state block) mirroring the `reader/` component pattern from `reader-view`.
- No new dependencies expected — `RefreshControl` is part of React Native core, `useContentList`/React Query already handle `isLoading`/`error`/`refetch`.
