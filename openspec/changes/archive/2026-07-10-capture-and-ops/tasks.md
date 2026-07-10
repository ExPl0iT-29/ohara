## 1. Data + API

- [x] 1.1 Add `findContentByUrl(url)` to `contentRepository.ts` (single `SELECT * FROM content WHERE url = ?`)
- [x] 1.2 Add stats helpers to `contentRepository.ts`: total count, count by status, count by contentType, oldest non-archived non-ready item (all `SELECT`/`GROUP BY` queries, no caching)
- [x] 1.3 Add `findByUrl(url)`, `getLibraryStats()`, `retryContent(id)` to `mobile/src/api/content.ts` (`retryContent` calls `processContent(id)` directly)

## 2. Capture: duplicate detection + bulk paste

- [x] 2.1 In `app/capture.tsx`, check `findByUrl` on URL change (debounced) or on submit; if found, show "Already saved" state with a button to navigate to `/content/{id}`
- [x] 2.2 Change the URL `TextInput` to `multiline`; on submit, split on `\n`, filter blank lines
- [x] 2.3 If more than one non-empty line, call `captureContent` per line (content-type picker ignored/hidden for multi-line input, matching plain-list import's no-type-per-item behavior); if exactly one line, keep existing single-capture behavior with content-type picker

## 3. Reader: retry

- [x] 3.1 Add Retry button to the `failed`-status branch in `app/content/[id].tsx`, calling `retryContent(data.id)` then invalidating the content query

## 4. Stats screen

- [x] 4.1 Create `mobile/app/stats.tsx` — total count, status breakdown, content-type breakdown, oldest-unread item (title/url + savedAt)
- [x] 4.2 Register `Stack.Screen name="stats"` in `app/_layout.tsx`
- [x] 4.3 Add a link to Stats from `app/settings.tsx`

## 5. Verification

- [x] 5.1 `npx tsc --noEmit` clean
- [x] 5.2 On-device: try to capture a URL already in the library, confirm duplicate notice and that "open existing" navigates correctly
- [x] 5.3 On-device: paste 2-3 URLs at once, confirm each is captured as a separate item
- [x] 5.4 On-device: force an item to `failed` (e.g. a `pdf`/unsupported type), tap Retry, confirm it processes again
- [x] 5.5 On-device: open Stats, confirm counts match the actual library contents
- [x] 5.6 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
