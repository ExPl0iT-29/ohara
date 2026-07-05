## 1. Domain Layer

- [x] 1.1 Define `EnrichmentResult` dataclass (`summary: str`, `topics: list[str]`)
- [x] 1.2 Define `AIProvider` protocol (`enrich(text: str) -> EnrichmentResult`) in domain layer

## 2. Infrastructure: Providers

- [x] 2.1 Add `openai` and Gemini SDK dependencies to backend project
- [x] 2.2 Implement `OpenAIProvider` (prompt for summary + topics, parse response into `EnrichmentResult`)
- [x] 2.3 Implement `GeminiProvider` (prompt for summary + topics, parse response into `EnrichmentResult`)
- [x] 2.4 Implement `get_active_provider()` reading `AI_PROVIDER` env var (default `openai`), returning the matching provider instance; raise/log clearly if the matching API key is missing

## 3. Worker Extension

- [x] 3.1 Add `get_ready_unenriched_batch(limit)` to `ContentRepository` interface + SQLAlchemy implementation (status `ready`, `summary` is null, `extractedText` is not null)
- [x] 3.2 Add `enrich_ready_content()` step to `backend/src/content/worker.py`: for each unenriched ready row, call active provider, on success `update_enrichment()` with summary/topics
- [x] 3.3 On provider error: catch, log, leave row unchanged (no status change, no partial update)
- [x] 3.4 Wire `enrich_ready_content()` into the worker's main loop after `process_batch()`

## 4. Verification

- [x] 4.1 Write test: ready content with extractedText gets summary/topics populated after enrichment (mocked provider)
- [x] 4.2 Write test: provider error during enrichment leaves status `ready` and summary/topics null, other fields unchanged
- [x] 4.3 Write test: `get_active_provider()` returns `OpenAIProvider` when `AI_PROVIDER=openai`, `GeminiProvider` when `AI_PROVIDER=gemini`
- [x] 4.4 Write test: enrichment step does not modify title/extractedText/author/heroImage/duration/readingTime
