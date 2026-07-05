## Context

`capture-endpoint` produces `Content` rows in `pending` status with only capture fields populated. Nothing consumes them yet. This is a single-user, local-first app (per product scope) — no need for distributed queues, no multi-tenant fairness concerns, no horizontal scaling. Per ADR-008, extraction must be async and never block capture. Per ADR-011, external tool integration (extraction libraries, same as AI providers) should sit behind an interface so the worker/business logic never imports a specific library directly.

## Goals / Non-Goals

**Goals:**
- Define a `ContentExtractor` protocol: given a URL, return raw extracted fields (title, description, heroImage, author, extractedText, duration).
- Implement it for what STACK.md already commits to: a web-page extractor (Mozilla Readability, with Firecrawl as the fetch layer for pages that need JS rendering) and a `yt-dlp`-based extractor for YouTube.
- Add a registry mapping `ContentType -> ContentExtractor` so the worker never branches on content type itself.
- Add a worker process that: polls for `pending` rows, transitions to `processing`, extracts, computes `readingTime` from word count, writes back via `update_enrichment()`, transitions to `ready` or `failed`.
- Keep worker and API as separate processes (per ADR-008's async model) — the worker is a `python -m content.worker` script, not a FastAPI background task, so a slow/stuck extraction can never affect API responsiveness.

**Non-Goals:**
- No AI summarization, topic extraction, or embeddings — strictly `ai-enrichment`'s job, next change.
- No extractors for `pdf`, `paper`, `github`, `book`, `tweet`, `reddit` — not in STACK.md's extraction tool list yet; these content types fail fast with a clear "unsupported" reason rather than pretending to work.
- No retry/backoff policy, no dead-letter handling, no distributed locking — single worker, single user, acceptable to keep this simple until it's ever actually a problem.
- No webhook/push trigger from capture to worker — polling is simpler and sufficient at this scale; revisit only if latency ever matters.

## Decisions

**Polling worker, not a message queue.**
Given the single-user scope and nothing in STACK.md about Redis/RabbitMQ/Celery, a worker that polls `SELECT ... WHERE status = 'pending' LIMIT N` on an interval (e.g. every 5s) is simplest and sufficient. Alternative considered: LISTEN/NOTIFY via Postgres — rejected as unnecessary complexity for a single-user app; polling latency of a few seconds is invisible at this scale.

**`ContentExtractor` protocol lives in domain, implementations in infrastructure.**
Mirrors the `ContentRepository` pattern from `content-model` and the `AIProvider` pattern from ADR-011. `backend/src/content/domain/extractor.py` defines `ContentExtractor.extract(url: str) -> ExtractionResult`. `backend/src/content/infrastructure/extractors/readability_extractor.py` and `yt_dlp_extractor.py` implement it. A plain `ExtractionResult` dataclass (domain) carries the raw fields back — no `ContentModel`/ORM leakage into extractors.

**Extractor registry as a plain dict, not a plugin system.**
`{ContentType.BLOG: readability_extractor, ContentType.WEBSITE: readability_extractor, ContentType.DOCUMENTATION: readability_extractor, ContentType.OTHER: readability_extractor, ContentType.YOUTUBE: yt_dlp_extractor}`. Content types absent from the map raise `UnsupportedContentTypeError`, caught by the worker and turned into a `failed` status with a reason. Alternative considered: entry-point-based plugin discovery — over-engineered for 2 extractors and a single deployment.

**`readingTime` computed here, not by AI.**
Word count / 200 wpm is a deterministic function of `extractedText`, has nothing to do with AI, and belongs with the extraction step that produces the text in the first place. Keeps `ai-enrichment` scoped purely to things that actually need a model (summary, topics).

**Failure reason stored in `metadata`, no schema change.**
`metadata` is already JSONB per `content-model`. On failure: `{"processingError": "<class>: <message>"}`. No migration needed.

**Worker updates status through the existing `update_enrichment()` repository method.**
`status` is already in `_ENRICHMENT_FIELDS` from `content-model`'s repository implementation, so `pending -> processing -> ready|failed` transitions require no repository changes.

## Risks / Trade-offs

- [Risk] Firecrawl requires an API key / external network call — a dependency the local extraction path doesn't strictly need for simple static pages. → Mitigation: try Readability-only extraction first (fetch HTML directly + parse); only fall back to Firecrawl if the page is JS-rendered or Readability extraction yields near-empty text. Keeps the common case dependency-free.
- [Risk] Single polling worker means a stuck extraction (e.g. hung network call) blocks all other pending items behind it. → Mitigation: acceptable for now at single-user scale; add a per-extraction timeout as a cheap guard rather than building real concurrency.
- [Risk] Six of eleven content types have no extractor and will always fail. → Mitigation: intentional and documented; product scope only committed to web + YouTube extraction tools so far (STACK.md). Extending the registry later is additive, not a redesign.

## Migration Plan

No database migration. Deployment adds one new long-running process (the worker) alongside the API. Rollback is stopping the worker process; rows simply stay in whatever status they were last written to.

## Open Questions

None — scope matches what STACK.md already commits to (Firecrawl, yt-dlp, Readability); everything else is deliberately deferred.
