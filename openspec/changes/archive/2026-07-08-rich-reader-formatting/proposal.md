## Why

Readability extraction stripped every HTML tag before storing `extractedText`, so the reader screen showed a wall of unformatted plain text — no paragraphs, headings, links, or images from the original article. The reading experience for saved blog posts was materially degraded compared to the source.

## What Changes

- `ReadabilityExtractor` now sanitizes and preserves the article's HTML (headings, paragraphs, images, links, lists, blockquotes) instead of flattening it to plain text.
- `compute_reading_time` strips HTML before counting words, so reading-time estimates stay accurate for the new HTML-bearing `extractedText`.
- Mobile `ReaderBody` renders HTML content with `react-native-render-html` (images, headings, links styled to match the app's design tokens), falling back to plain `Text` for non-HTML content (e.g. YouTube descriptions, Firecrawl markdown fallback).

## Impact

- Affected specs: `reader-view`, `processing-pipeline`
- Affected code: `backend/src/content/infrastructure/extractors/readability_extractor.py`, `backend/src/content/domain/reading_time.py`, `mobile/src/components/reader/ReaderBody.tsx`
- Existing saved content keeps its old plain-text `extractedText` (no backfill/re-extraction) — only newly-saved content gets rich formatting.
