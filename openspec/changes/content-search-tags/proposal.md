## Why

As the library grows past a screenful, scrolling to find something becomes the only way to locate a saved item — there's no search. There's also no way to organize by subject: `contentType` distinguishes format (blog vs PDF vs YouTube) but says nothing about topic, and the AI already generates `topics` per item during enrichment that currently go unused in the UI.

## What Changes

- Feed gains a search box that matches against `title`, `summary`, and `extractedText` via a `LIKE`-based SQLite query (see design.md for why FTS5 was not used).
- Content gains a freeform `tags` field (user-defined, separate from `contentType`) — add/remove tags from the reader screen.
- The feed gains a tag filter row combining user-defined tags and the AI-generated `topics` already stored per item — tapping one filters the feed to matching items.

## Capabilities

### New Capabilities
- `content-search`: full-text search over the library.
- `tagging`: user-defined tags and tag/topic-based feed filtering.

### Modified Capabilities
- `content-model`: add `tags` field (JSON array, mirrors existing `topics` column shape) to the `Content` entity and its SQLite persistence.
- `home-feed-ui`: feed gains a search input and a tag/topic filter row.

## Impact

- `mobile/src/db/database.ts` — add `tags` column (same additive `ALTER TABLE` guard pattern as `archivedAt`). No new table for search.
- `mobile/src/db/contentRepository.ts` — read/write `tags`; add a search query function.
- `mobile/src/api/content.ts` — expose `searchContent(query)`, `addTag`/`removeTag`, extend `ListContentParams` with a tag/topic filter.
- `mobile/app/index.tsx` — search input, tag/topic filter chips row alongside the existing Active/Archived toggle.
- `mobile/app/content/[id].tsx` — tag add/remove UI.
- No backend, no new dependencies.
