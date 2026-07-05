## Why

`capture-endpoint` creates `Content` rows in `pending` status but nothing ever moves them forward. Per ADR-008, capture must stay synchronous and cheap while the real work — fetching and extracting the actual content — happens asynchronously. Without this change, everything saved into Ohara stays permanently empty: no title, no readable text, no reader view possible.

## What Changes

- Add a `ContentExtractor` interface (domain layer) — the same provider-abstraction pattern already used for AI providers (ADR-011) — so extraction logic never leaks into business rules.
- Add concrete extractors per the tools already named in STACK.md: a web-page extractor (Mozilla Readability, optionally backed by Firecrawl for JS-heavy pages) for `blog`/`website`/`documentation`/`other`, and a `yt-dlp`-based extractor for `youtube`.
- Add an extractor registry that maps `ContentType` to the appropriate extractor; content types with no extractor yet (`pdf`, `paper`, `github`, `book`, `tweet`, `reddit`) are explicitly unsupported in this change and fail gracefully rather than silently hanging in `pending`.
- Add a background worker process that polls for `pending` content, marks it `processing`, runs the matching extractor, and writes the result back via `ContentRepository.update_enrichment()`.
- Populate only *extraction* fields from this pipeline: `title`, `description`, `heroImage`, `author`, `extractedText`, `duration` (video), and an algorithmically computed `readingTime` (word count, no AI). `summary` and `topics` stay null — those belong to the separate `ai-enrichment` change.
- On extractor failure, set status to `failed` and record the error reason in `metadata` (no schema change needed — `metadata` is already JSONB).

## Capabilities

### New Capabilities
- `processing-pipeline`: the async extraction pipeline — what triggers it, what it's allowed to populate, how failures are represented, and which content types are (not yet) supported.

### Modified Capabilities
(none — reuses `content-model`'s entity/repository and `capture-endpoint`'s created rows as-is)

## Impact

- New backend module: `backend/src/content/domain/extractor.py` (the `ContentExtractor` protocol).
- New backend module: `backend/src/content/infrastructure/extractors/` (Readability/Firecrawl-based web extractor, yt-dlp extractor, registry).
- New backend module: `backend/src/content/worker.py` (polling loop, runnable as a standalone process).
- New dependencies: extraction libraries for Readability-style parsing and `yt-dlp`.
- No API changes — this operates entirely on rows already created by `capture-endpoint`.
- Establishes the field-ownership boundary (`processing-pipeline` owns extraction fields, `ai-enrichment` owns summary/topics) that the next change builds on.
