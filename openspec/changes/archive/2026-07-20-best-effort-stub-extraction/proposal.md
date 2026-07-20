## Why

Sites like X/Twitter posts, public Notion pages, and Scribd documents are JS-rendered — a plain fetch only ever returns their `<head>` meta tags (which these sites do serve for link-preview purposes: `og:title`, `og:description`, `og:image`), never real article body text. Today the generic extractor either scrapes nothing useful from the body or (per current spec) some of these content types are meant to always fail — so the user gets either a blank/broken item or a completely lost capture, instead of a lightweight but genuinely useful preview.

## What Changes

- When body-text extraction yields no usable content (empty/whitespace-only after the existing tag scrape), the system SHALL still succeed with a **stub** result: `title`, `description`, `heroImage` from meta tags, `extractedText: null`, `readingTime: null` — instead of failing the entity.
- Add an `isStub` flag (or equivalent) on the Content entity so the UI can show "preview only — open the original link to read" instead of presenting an empty reader view.
- This is a general fallback improvement to the existing generic extractor (not a source-specific scraper for X/Notion/Scribd individually) — any URL whose page is meta-rich but body-empty benefits.

## Capabilities

### New Capabilities
(none — modifies the existing processing-pipeline capability)

### Modified Capabilities
- `processing-pipeline`: "no body text extracted" no longer always means `failed` — it can mean a successful stub, and `reader-view` needs to render that state distinctly.
- `reader-view`: reader screen must handle an item with `title`/`description` but no `extractedText`, showing a clear "open original" affordance instead of an empty body.

## Impact

- `mobile/src/extraction/extractArticle.ts` — return a stub result shape instead of nothing when body scrape is empty but meta tags exist
- `mobile/src/db/database.ts` / `contentRepository.ts` — new `isStub` column (additive migration, same pattern as `archivedAt`/`tags`/etc.)
- `mobile/app/content/[id].tsx` — render stub state (title/description/heroImage + "Open original link" button, no reader body)
- `openspec/specs/processing-pipeline/spec.md`, `openspec/specs/reader-view/spec.md` — requirement deltas
