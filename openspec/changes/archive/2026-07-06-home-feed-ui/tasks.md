## 1. Shared status copy

- [x] 1.1 Add `mobile/src/constants/statusCopy.ts` — maps `ContentStatus` to calm human-readable labels (`pending`/`processing` → "Still preparing", `failed` → "Couldn't process", `ready` → null/no label)

## 2. Feed components

- [x] 2.1 Create `mobile/src/components/feed/` directory
- [x] 2.2 Build `FeedStatusBadge` component: renders the mapped label for non-`ready` statuses, renders nothing for `ready`
- [x] 2.3 Build `FeedEmptyState` component: calm copy + nudge toward the capture entry point (link/button to `/capture`)
- [x] 2.4 Build `FeedErrorState` component: calm error copy + retry control

## 3. Screen assembly

- [x] 3.1 In `mobile/app/index.tsx`, branch explicitly: `isLoading` → loading indicator, `error` → `FeedErrorState` with retry wired to `refetch`, `data.length === 0` → `FeedEmptyState`, else → populated `FlatList`
- [x] 3.2 Wire `FlatList`'s `refreshing`/`onRefresh` to React Query's `isFetching`/`refetch` for pull-to-refresh
- [x] 3.3 Replace raw status `Text` in list items with `FeedStatusBadge`

## 4. Verification

- [x] 4.1 Verify loading state renders before first fetch completes
- [x] 4.2 Verify empty state renders when the list is genuinely empty, with a working link to capture
- [x] 4.3 Verify error state renders distinctly from empty state and retry re-fetches
- [x] 4.4 Verify pull-to-refresh re-fetches and updates the list
- [x] 4.5 Verify status badges show mapped labels for pending/processing/failed and no badge for ready
- [x] 4.6 Confirm no backend or `mobile/src/api/content.ts` changes were required
