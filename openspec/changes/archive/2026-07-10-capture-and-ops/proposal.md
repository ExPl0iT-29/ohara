## Why

Four small gaps left over from earlier feature passes: saving the same link twice silently creates a duplicate; getting a batch of links from a PC into the app still means saving one at a time in the app itself (the existing PC-import path only covers file import, not a quick paste); a permanently `failed` item has no way to try again short of re-saving the URL as a new entry; and there's no way to see how big the library is or what's oldest without scrolling the whole feed.

## What Changes

- Capture screen checks the entered URL against the library before saving; if it already exists, offers to open the existing item instead of creating a duplicate.
- Capture screen accepts a paste of multiple newline-separated URLs at once, capturing and processing each independently (same one-URL-per-line shape as the existing plain-list import in `local-backup`).
- Reader screen's failure notice gains a Retry button for `failed` items, re-running processing without creating a new entry.
- New Stats screen (reachable from Settings) shows total item count, a breakdown by status and by content type, and the oldest unread item.

## Capabilities

### New Capabilities
- `library-stats`: a stats view over the existing library.

### Modified Capabilities
- `capture-ui`: duplicate URL detection and bulk multi-URL paste capture.
- `reader-view`: manual retry control for failed content.
- `processing-pipeline`: expose a way to re-run processing for a single already-`failed` item on demand (distinct from the existing launch-time sweep of `pending`/`processing` rows).

## Impact

- `mobile/src/db/contentRepository.ts` — add `findContentByUrl(url)` for duplicate lookup; add stats query helpers (counts by status/type, oldest unread).
- `mobile/src/api/content.ts` — expose `findByUrl(url)`, `getLibraryStats()`, `retryContent(id)` (thin wrapper re-invoking `processContent`).
- `mobile/app/capture.tsx` — duplicate check + "Open existing" affordance; textarea-style multi-line input, split on newline, capture each non-empty line.
- `mobile/app/content/[id].tsx` — Retry button on the `failed` status notice.
- `mobile/app/stats.tsx` (new) — stats screen.
- `mobile/app/settings.tsx` / `mobile/app/_layout.tsx` — link to and register the new Stats screen.
- No backend, no new dependencies.
