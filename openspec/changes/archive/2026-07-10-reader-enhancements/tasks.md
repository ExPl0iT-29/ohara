## 1. Data model

- [x] 1.1 Add `scrollProgress REAL` and `highlights TEXT NOT NULL DEFAULT '[]'` columns to `content` table in `mobile/src/db/database.ts`, guarded by `PRAGMA table_info(content)` (extend existing column-check loop)
- [x] 1.2 Add `scrollProgress`/`highlights` to `contentRepository.ts` read/write mapping (`ContentRow`, `rowToItem`, `insertContent` literal, `upsertContentRow`, `updateContentRow`'s JSON-column check)
- [x] 1.3 Add `Highlight` type (`{ id, quote, note, createdAt }`), `scrollProgress: number | null`, `highlights: Highlight[]` to `ContentItem` in `mobile/src/api/content.ts`
- [x] 1.4 Add `saveScrollProgress(id, progress)` to `mobile/src/api/content.ts`
- [x] 1.5 Add `addHighlight(id, quote, note?)` / `removeHighlight(id, highlightId)` to `mobile/src/api/content.ts` (via `Crypto.randomUUID()` for highlight id)

## 2. Reader: scroll restore + persist

- [x] 2.1 In `app/content/[id].tsx`, add `onContentSizeChange` handler that computes and `scrollTo`s the saved fraction once per mount (guarded by a ref so it doesn't refire)
- [x] 2.2 Add `onScrollEndDrag`/`onMomentumScrollEnd` handler that computes current scroll fraction and calls `saveScrollProgress` (debounced/guarded against redundant writes)

## 3. Reader: highlights UI

- [x] 3.1 Add highlights list section below `ReaderBody` in `app/content/[id].tsx` (or new `ReaderHighlights.tsx` component) — quote + note per entry, remove action
- [x] 3.2 Add quote/note input + save control

## 4. Verification

- [x] 4.1 `npx tsc --noEmit` clean
- [x] 4.2 On-device: scroll partway into a long article, leave and reopen it, confirm it resumes near that position
- [x] 4.3 On-device: add a highlight with a note, confirm it appears in the list; add one without a note; remove one
- [x] 4.4 On-device: confirm existing install gains both new columns without data loss
- [x] 4.5 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
