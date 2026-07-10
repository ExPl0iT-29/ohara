## Why

The home feed currently renders every saved item identically, regardless of whether it's a blog post, PDF, research paper, or YouTube video — a user with a mixed library can't tell types apart at a glance. There's also no way to get read items out of view: once read, content stays in the main feed forever alongside unread items, with no archive/read-later separation.

## What Changes

- Feed list items show a per-content-type visual marker (icon + label) derived from the existing `contentType` field — no new input required, just differentiated rendering.
- Content gains an `archivedAt` timestamp (nullable). Users can archive/unarchive an item from the feed or reader.
- The home feed defaults to showing only non-archived (active) items, with an Active/Archived toggle to view archived content.
- `local-backup` export/import continues to round-trip `archivedAt` like any other field (no special-casing needed given the existing full-entity JSON shape).

## Capabilities

### New Capabilities
- `archive`: archiving/unarchiving content, and filtering the feed by archive state.

### Modified Capabilities
- `content-model`: add nullable `archivedAt` field to the `Content` entity and its SQLite persistence.
- `home-feed-ui`: feed items display a content-type marker; feed supports an Active/Archived filter and only shows Active by default.

## Impact

- `mobile/src/db/database.ts` — add `archivedAt` column (migration via `ALTER TABLE` guarded by existence check, since there's no migration framework).
- `mobile/src/db/contentRepository.ts` — read/write `archivedAt`.
- `mobile/src/api/content.ts` — expose `archiveContent`/`unarchiveContent`, extend `ListContentParams` with an archive filter.
- `mobile/src/components/feed/FeedListItem.tsx` (+ new small type-icon helper) — type marker rendering.
- `mobile/app/index.tsx` — Active/Archived tab UI, filter wiring.
- `mobile/app/content/[id].tsx` / reader components — archive/unarchive action.
- No backend, no new dependencies — on-device SQLite only, consistent with `mobile-only-local-db`.
