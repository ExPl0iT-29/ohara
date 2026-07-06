## 1. Reader components scaffold

- [ ] 1.1 Create `mobile/src/components/reader/` directory for reader-specific presentational components
- [ ] 1.2 Build `ReaderHeader` component: hero image (graceful omission when null), title, author, source, reading time chip (omitted when null)
- [ ] 1.3 Build `ReaderSummary` component: renders `summary` only when present, returns `null` otherwise
- [ ] 1.4 Build `ReaderBody` component: renders `extractedText` with reading-optimized typography (comfortable max width, line height, font scale) via NativeWind classes

## 2. Status handling

- [ ] 2.1 Build `ReaderStatusNotice` component: calm copy variants for `pending`/`processing` ("still being prepared") and `failed` (processing failed, with an "open original" link using `url`)
- [ ] 2.2 In `mobile/app/content/[id].tsx`, branch on React Query `isLoading` first (loading state), then on fetch error / missing data (distinct not-found state), then on `data.status` (`pending`, `processing`, `failed`, `ready`)
- [ ] 2.3 Wire `failed` branch to render available title/url/source via `ReaderHeader` (or a reduced variant) plus `ReaderStatusNotice`
- [ ] 2.4 Wire `pending`/`processing` branch to render available title/url plus `ReaderStatusNotice`, without attempting to render `extractedText`
- [ ] 2.5 Wire `ready` branch to render `ReaderHeader` + `ReaderSummary` + `ReaderBody`

## 3. Screen assembly and polish

- [ ] 3.1 Rewrite `mobile/app/content/[id].tsx` to use the new components and status branches, removing the old raw-text dump
- [ ] 3.2 Verify layout collapses cleanly when `heroImage`, `summary`, `readingTime`, or `author` are individually null (no dead space, no broken-image icons)
- [ ] 3.3 Confirm "open original URL" control on `failed`/pending states opens the item's `url` correctly

## 4. Verification

- [ ] 4.1 Manually verify all four `ContentStatus` values render distinct, correct screens using seeded/test content items
- [ ] 4.2 Manually verify a nonexistent content id shows the not-found state (not a pending/failed notice)
- [ ] 4.3 Confirm no backend or `mobile/src/api/content.ts` changes were required
