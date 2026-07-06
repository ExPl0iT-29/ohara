## Context

`mobile/app/index.tsx` calls `useContentList()` and renders a `FlatList` directly with no handling for `isLoading`, empty data, or `error` beyond a single conditional `Text`. Status is shown as the raw `ContentStatus` string. `reader-view` already established the pattern of small presentational components under `mobile/src/components/<feature>/` and calm, distinct copy per state — this change applies the same pattern to the feed.

## Goals / Non-Goals

**Goals:**
- Distinct, calm treatment for: initial loading, empty (no content ever saved), error (fetch failed), and populated list.
- Pull-to-refresh via native `RefreshControl` wired to React Query's `refetch`.
- Human-readable status labels consistent with reader-view's "still being prepared" language, not raw enum strings.

**Non-Goals:**
- Sorting/filtering UI controls (reader-api already supports `status`/`contentType` filters server-side, but exposing filter controls in the UI is a separate, later change if wanted).
- Infinite scroll / pagination UI (reader-api supports `limit`/`offset`; wiring pagination into the feed is deferred — current default `limit=20` is enough for early usage).
- Swipe actions (archive/delete) — no delete/update endpoints exist yet.

## Decisions

- **New components under `mobile/src/components/feed/`**: `FeedEmptyState` (shown when `data` is an empty array), `FeedErrorState` (shown when `error` is set), `FeedStatusBadge` (small label + color per `ContentStatus`), mirroring `reader/`'s component split from `reader-view`.
- **Status label mapping**: reuse the same calm phrasing already established in `ReaderStatusNotice` — `pending`/`processing` → "Still preparing", `failed` → "Couldn't process", `ready` → no badge needed (default/normal state), keeping one source of truth for this copy rather than duplicating slightly different strings per screen. Since `ReaderStatusNotice` currently hardcodes its own copy inline, this change introduces a shared small constant (e.g. `mobile/src/constants/statusCopy.ts`) that both the feed badge and (optionally, in a later touch-up) the reader screen can reference — but changing `reader-view`'s existing file is out of scope here beyond adding the shared constant it could adopt.
- **Pull-to-refresh**: `FlatList`'s built-in `refreshing`/`onRefresh` props, backed by React Query's `refetch` and `isFetching` (not `isLoading`, which only reflects the very first fetch) — standard, no new dependency.
- **Empty vs. error vs. loading precedence**: check `isLoading` first (spinner/skeleton), then `error` (error state with retry), then `data.length === 0` (empty state with capture nudge), then the populated list — same explicit-branch pattern `reader-view` used for `ContentStatus`, avoiding implicit null-check bugs.

## Risks / Trade-offs

- [Introducing a shared status-copy constant touches a "shared" concern without a full design system in place] → Scoped narrowly: one small constants file, not a broader theme/token system; low risk, easy to expand later.
- [No pagination UI while reader-api already supports it] → Acceptable for current content volumes (early single-user usage); revisit if list length becomes a real problem.
