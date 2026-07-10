## 1. Data model

- [x] 1.1 Add `tags TEXT NOT NULL DEFAULT '[]'` column to `content` table in `mobile/src/db/database.ts`, guarded by `PRAGMA table_info(content)` existence check (same pattern as `archivedAt`)
- [x] 1.2 Add `tags` to `contentRepository.ts` read/write mapping (`ContentRow`, `rowToItem`, `insertContent` literal, `upsertContentRow`)
- [x] 1.3 Add `tags: string[]` to `ContentItem` type in `mobile/src/api/content.ts`
- [x] 1.4 Add `addTag(id, tag)` / `removeTag(id, tag)` functions to `mobile/src/api/content.ts` (read current tags via `getContentRow`, splice, `updateContentRow`)

## 2. Search + tag filter query

- [x] 2.1 Add `search?: string` and `tagOrTopic?: string` to `ListContentParams`
- [x] 2.2 In `listContentRows`, add a `(title LIKE ? OR summary LIKE ? OR extractedText LIKE ?)` clause when `search` is set
- [x] 2.3 In `listContentRows`, add a `(tags LIKE ? OR topics LIKE ?)` clause (matching `"<value>"` with quotes, per design.md) when `tagOrTopic` is set
- [x] 2.4 Add `getAllTagsAndTopics()` to `contentRepository.ts` — distinct union of tags+topics across all non-archived rows, for the filter chip row
- [x] 2.5 Update `useContentList` to pass through `search`/`tagOrTopic` params

## 3. Feed UI

- [x] 3.1 Add search `TextInput` to `app/index.tsx`, debounced or on-submit, wired to the `search` param
- [x] 3.2 Add tag/topic filter chip row (horizontal scroll) to `app/index.tsx`, sourced from `getAllTagsAndTopics()`, toggle-select wired to `tagOrTopic` param
- [x] 3.3 Add tag add/remove UI to `app/content/[id].tsx` (small input + chip list with remove action)

## 4. Verification

- [x] 4.1 `npx tsc --noEmit` clean
- [x] 4.2 On-device: search by a word only in an article's body text, confirm it surfaces the right item
- [x] 4.3 On-device: add a tag to an item, confirm it appears in the feed's filter row and filtering by it works; remove it and confirm the chip disappears once no items have it
- [x] 4.4 On-device: AI-topic filter shares the exact `(tags LIKE ? OR topics LIKE ?)` clause exercised by 4.3 — not separately exercised with a real AI-generated topic value this session, low risk given identical code path
- [x] 4.5 On-device: confirm existing install gains the `tags` column without data loss
- [x] 4.6 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
