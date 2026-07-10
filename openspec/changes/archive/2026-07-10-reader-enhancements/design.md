## Context

Reader is a single `ScrollView` in `app/content/[id].tsx` rendering `ReaderHeader`, `ReaderSummary`, `ReaderBody` (via `react-native-render-html`). No existing per-item single-value or list-value fields beyond `tags`/`topics` (JSON arrays) and `archivedAt` (nullable scalar) — this change follows both existing patterns from `feed-organization` and `content-search-tags`.

## Goals / Non-Goals

**Goals:**
- Reopening an article resumes near where the user left off.
- Save a quote + optional note per item without leaving the reader.

**Non-Goals:**
- No inline text-selection highlighting in the rendered HTML — confirmed out of scope with the user; would require either a custom text-selection-aware HTML renderer or a full rewrite of `ReaderBody` off `react-native-render-html`, disproportionate to the value here.
- No highlight editing after creation — remove and re-add instead, consistent with tags having no rename/edit.
- No cross-device sync beyond what `local-backup`'s full-entity export/import already does generically (both new fields ride along for free, same as `archivedAt`/`tags` did).

## Decisions

- **Scroll position: `scrollProgress: number | null`, a 0–1 fraction of total content height, not a raw pixel offset.** Pixel offsets break if the article's rendered height changes (font scale, screen rotation, device change via backup/restore to a different phone). A fraction is device-independent and matches how `local-backup` already treats the library as portable.
- **Persist on scroll end (debounced ~500ms via `onMomentumScrollEnd`/`onScrollEndDrag`), not on every scroll frame.** Ladder: writing to SQLite on every `onScroll` frame is wasteful and unnecessary — the user only needs "close enough," and native scroll events already fire at a manageable rate only at drag/momentum end.
- **Restore via `onContentSizeChange`, applied once per screen mount.** `RenderHtml` resolves its height asynchronously (images, fonts), so `scrollTo` must wait for a real content height rather than firing on initial mount. A `hasRestoredRef` guard prevents re-triggering restore on subsequent size changes (e.g. an image finishing load after the user has already started reading).
- **Highlights: `highlights: Highlight[]` JSON column, same serialization pattern as `tags`/`topics`.** `Highlight = { id: string, quote: string, note: string | null, createdAt: string }`. A JSON array column avoids a new SQL table + join for what is, per item, a short list — consistent with the ladder call already made for `tags`.
- **Highlight `id` via `expo-crypto`'s `Crypto.randomUUID()`**, already a dependency (used for Content `id` generation) — no new dependency for list-item identity.

## Risks / Trade-offs

- [Scroll restore could feel imprecise across very different screen sizes/font scales, since it's a fraction of *current* rendered height, not the height at save time] → acceptable; "roughly where I was" is the goal, not pixel-perfect resume.
- [Existing installs need two more additive columns] → same guarded `ALTER TABLE` pattern already proven twice (`archivedAt`, `tags`).

## Open Questions

None.
