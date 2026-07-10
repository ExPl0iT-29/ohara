## 1. Data model

- [x] 1.1 Add `archivedAt TEXT` column to `content` table in `mobile/src/db/database.ts`, guarded by a `PRAGMA table_info(content)` existence check so it's safe on repeat launches
- [x] 1.2 Add `archivedAt` to `contentRepository.ts` read/write mapping (insert, update, row-to-entity)
- [x] 1.3 Add `archivedAt: string | null` to the `ContentItem` type and `ListContentParams` archive filter in `mobile/src/api/content.ts`
- [x] 1.4 Add `archiveContent(id)` / `unarchiveContent(id)` functions to `mobile/src/api/content.ts`

## 2. Feed query + hook

- [x] 2.1 Extend `listContentRows`/`listContent` WHERE clause to filter on `archivedAt IS NULL` / `IS NOT NULL` per the `archived` param, defaulting to active-only
- [x] 2.2 Update `useContentList` to accept and pass through the archive filter, keep existing polling behavior for pending/processing items

## 3. Feed UI

- [x] 3.1 Add `CONTENT_TYPE_LABELS` map and render a type marker pill on `FeedListItem.tsx` (reuse `FeedStatusBadge`'s visual pattern, dark-mode variants included)
- [x] 3.2 Add Active/Archived pill toggle above the list in `app/index.tsx`, wired to the archive filter
- [x] 3.3 Add archive/unarchive action to feed item (swipe or long-press or inline button — pick simplest to wire) and to the reader screen (`app/content/[id].tsx`)

## 4. Verification

- [x] 4.1 `npx tsc --noEmit` clean
- [x] 4.2 On-device: save a few items of different types, confirm type markers render correctly in both light and dark mode
- [x] 4.3 On-device: archive an item, confirm it disappears from Active view and appears in Archived view; unarchive and confirm it returns
- [x] 4.4 On-device: confirm an existing pre-change install (already has data) launches cleanly and gains the new column without data loss
- [x] 4.5 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
