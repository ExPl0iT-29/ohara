## 1. Domain Layer

- [x] 1.1 Define `ExtractionResult` dataclass (title, description, heroImage, author, extractedText, duration — all optional)
- [x] 1.2 Define `ContentExtractor` protocol (`extract(url: str) -> ExtractionResult`) in domain layer
- [x] 1.3 Define `UnsupportedContentTypeError` exception

## 2. Infrastructure: Extractors

- [x] 2.1 Add `readability`/HTML-parsing and `yt-dlp` dependencies to backend project
- [x] 2.2 Implement `ReadabilityExtractor` (fetch HTML, parse with Readability-style extraction; fall back to Firecrawl if page yields near-empty text)
- [x] 2.3 Implement `YtDlpExtractor` (title, description, heroImage/thumbnail, author/channel, duration via yt-dlp)
- [x] 2.4 Implement extractor registry mapping `ContentType -> ContentExtractor`, raising `UnsupportedContentTypeError` for unmapped types

## 3. Reading Time Calculation

- [x] 3.1 Implement word-count-based `compute_reading_time(text: str) -> int` helper (word count / 200 wpm)

## 4. Worker

- [x] 4.1 Create `backend/src/content/worker.py` with a polling loop (query `pending` rows, configurable interval)
- [x] 4.2 For each pending row: transition to `processing`, look up extractor via registry, run extraction
- [x] 4.3 On success: compute readingTime (if extractedText present), call `update_enrichment()` with extracted fields + status `ready`
- [x] 4.4 On `UnsupportedContentTypeError` or any extractor exception: call `update_enrichment()` with status `failed` and error reason in `metadata.processingError`
- [x] 4.5 Ensure one row's failure does not stop the worker from processing subsequent rows
- [x] 4.6 Add a runnable entrypoint (`python -m content.worker`) separate from the FastAPI app process

## 5. Verification

- [x] 5.1 Write test: pending web-page content is extracted and reaches `ready` with title/description/extractedText populated
- [x] 5.2 Write test: pending YouTube content is extracted and reaches `ready` with duration populated
- [x] 5.3 Write test: readingTime is computed from extractedText word count
- [x] 5.4 Write test: content with an unsupported contentType (e.g. `pdf`) becomes `failed` with a reason recorded
- [x] 5.5 Write test: an extractor raising an exception marks that row `failed` and does not stop processing of other pending rows
- [x] 5.6 Write test: `ready` content has null `summary` and `topics` after processing
