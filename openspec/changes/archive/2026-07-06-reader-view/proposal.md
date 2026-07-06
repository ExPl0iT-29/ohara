## Why

Reader-api (`GET /content`, `GET /content/{id}`) and the mobile app shell exist, but the actual reading screen (`mobile/app/content/[id].tsx`) is a placeholder that dumps raw title/summary/extractedText as unstyled plain text. Per PRODUCT_VISION.md, reading is the core loop the whole product exists to serve ("Reading First" — the app succeeds only if it replaces keeping browser tabs open), and per DESIGN.md the Reader is "the most important screen. Everything else exists to get here." Right now there is no real reading experience to get to. This change builds it.

## What Changes

- Replace the placeholder reader screen with a real reading view: hero image, title, author, reading time, source, and (when present) an AI summary, followed by the full extracted text rendered with comfortable reading typography (generous line length, spacing, font sizing) per DESIGN.md's typography and "Content Is The Hero" principles.
- Handle all `ContentItem.status` states explicitly at the reading screen:
  - `pending` / `processing`: show a calm "still being prepared" state, not raw nulls or a generic loading spinner mismatched to reality.
  - `failed`: still render whatever fields are available (title, url, source) and clearly but calmly indicate the content couldn't be fully processed, with a way to open the original URL — reading must not depend on AI/extraction succeeding.
  - `ready` with `extractedText` present: render the full reading experience.
  - `ready` (or any status) with `summary`/`topics` absent: reading view must degrade gracefully — AI-derived fields are optional enhancements, never required for the core reading experience ("AI is invisible infrastructure," applied here analogously to how ai-enrichment applied it to summaries).
- Handle network/not-found states distinctly from content-processing states (e.g. a genuine 404 vs. content still `pending`).
- No backend changes — this is purely a `mobile/app/content/[id].tsx` (and any supporting reading-view components under `mobile/src/`) UI change consuming the existing `GET /content/{id}` response shape.

## Capabilities

### New Capabilities
- `reader-view`: The reading screen UI — rendering a full content item (metadata + hero image + body text) with reading-appropriate typography, and handling loading/not-found/pending/processing/failed/ready states.

### Modified Capabilities
(none — reader-api's response contract is unchanged; this is a pure consumer of it)

## Impact

- Affected code: `mobile/app/content/[id].tsx` (full rewrite), likely new presentational components under `mobile/src/components/reader/` (e.g. reader header/metadata block, body typography component, status/empty states), possibly a small style/typography helper in `mobile/src/` for NativeWind reading styles.
- No API, schema, or backend changes.
- No new dependencies expected beyond what's already scaffolded (Expo Router, NativeWind, React Query, existing `useContentItem` hook and `ContentItem` type in `mobile/src/api/content.ts`).
