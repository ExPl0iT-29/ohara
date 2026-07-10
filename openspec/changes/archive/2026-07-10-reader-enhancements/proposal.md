## Why

Long articles currently always open at the top — closing one mid-read and reopening it means scrolling back down manually every time. There's also no way to save a passage worth remembering; the only record of having read something is the AI summary, which loses the reader's own take.

## What Changes

- Reader remembers scroll position per Content item and restores it when reopened.
- Reader gains a highlights/notes list: the user types or pastes a quote plus an optional note, saved per item, shown as a list below the article body. Add/remove per entry. This is a quote list, not inline text-selection highlighting inside the rendered HTML (out of scope — confirmed with user; `react-native-render-html` doesn't give a practical path to true in-place highlighting without a much larger rework).

## Capabilities

### New Capabilities
- `reading-progress`: per-item scroll position tracking and restore.
- `highlights`: per-item quote + note list.

### Modified Capabilities
- `content-model`: add `scrollProgress` (nullable float, 0–1) and `highlights` (JSON array) fields to the `Content` entity and its SQLite persistence.
- `reader-view`: reader restores scroll position on open and renders the highlights/notes list with add/remove controls.

## Impact

- `mobile/src/db/database.ts` — add `scrollProgress REAL` and `highlights TEXT NOT NULL DEFAULT '[]'` columns, same additive `ALTER TABLE` guard pattern as `archivedAt`/`tags`.
- `mobile/src/db/contentRepository.ts` — read/write both fields; `highlights` JSON-serialized like `tags`/`topics`.
- `mobile/src/api/content.ts` — expose `saveScrollProgress(id, progress)`, `addHighlight(id, quote, note?)`, `removeHighlight(id, highlightId)`.
- `mobile/app/content/[id].tsx` — restore scroll on mount, persist scroll position (throttled) on scroll, render highlights list + add form.
- No backend, no new dependencies.
