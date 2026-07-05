## Context

`processing-pipeline` leaves `summary`/`topics` null by design — those need an LLM. Per ADR-011, AI calls must go through a provider interface, never a vendor SDK called directly from business logic. Per PRODUCT_VISION.md, AI is invisible infrastructure: it should improve the reading experience without ever being a hard dependency for the app to function. This means enrichment failure must degrade gracefully, not break anything already working.

## Goals / Non-Goals

**Goals:**
- Define `AIProvider` protocol: `enrich(text: str) -> EnrichmentResult` (summary + topics).
- Implement `OpenAIProvider` and `GeminiProvider`, the two vendors STACK.md already commits to.
- Add a provider selector: one active provider, chosen via env var (`AI_PROVIDER=openai|gemini`), resolved once at worker startup.
- Extend the existing worker loop: after a row reaches `ready` via extraction, attempt enrichment; on success, `update_enrichment()` with `summary`/`topics`; on failure, leave the row exactly as extraction left it.
- Keep prompt construction and response parsing inside each provider implementation — the worker only calls `provider.enrich(text)` and gets back a plain result, never sees vendor-specific request/response shapes.

**Non-Goals:**
- No `OllamaProvider` — STACK.md marks Ollama "future"; the interface will support adding it later without changing the worker.
- No retry/backoff for failed AI calls — best-effort, single attempt; a failed enrichment just means the row stays without summary/topics until reprocessed (manual re-trigger is out of scope here).
- No cost tracking, token budgeting, or rate limiting — single-user app, out of scope until it's an actual problem.
- No user-facing provider switching UI — provider choice is operator/deployment config (env var), not a runtime user setting.
- No structured topic taxonomy — topics are freeform short strings the model returns, matching the existing JSONB `topics` field from `content-model`.

## Decisions

**`AIProvider` protocol lives in domain, implementations in infrastructure.**
Same pattern as `ContentRepository` and `ContentExtractor`. `backend/src/content/domain/ai_provider.py` defines `AIProvider.enrich(text: str) -> EnrichmentResult`; `EnrichmentResult` is a plain dataclass (`summary: str`, `topics: list[str]`). `backend/src/content/infrastructure/ai_providers/openai_provider.py` and `gemini_provider.py` implement it, each owning its own prompt template and response parsing.

**Provider selection via env var, resolved once.**
`get_active_provider()` reads `AI_PROVIDER` (default `openai`) and returns the matching instance. Alternative considered: dependency-inject the provider per call — unnecessary indirection for a single-active-provider, single-process worker; a module-level resolution at worker startup is simpler and sufficient.

**Enrichment is a second pass after extraction, not merged into it.**
The worker's existing extraction step (from `processing-pipeline`) stays untouched. A new `enrich_ready_content()` step runs after `process_batch()`, querying rows that are `ready` with null `summary`. This keeps `processing-pipeline`'s tested behavior stable and makes the enrichment step independently disable-able (e.g. no API key configured → skip it entirely, log once, extraction still works).

**Enrichment failure never changes `status`.**
If `provider.enrich()` raises (network error, bad API key, rate limit, empty text), the worker catches it, logs it, and leaves the row `ready` with `summary`/`topics` still null. It does NOT set `failed` — that status is reserved for extraction failures (per `processing-pipeline`'s spec), and reverting a working reader-ready row because an optional enhancement failed would contradict "AI is invisible infrastructure, reading works without it."

**Repository needs no changes.**
`update_enrichment()` already permits `summary`/`topics` as enrichment fields (from `content-model`).

## Risks / Trade-offs

- [Risk] No API key configured means enrichment silently never runs. → Mitigation: log a single clear warning at worker startup ("AI_PROVIDER key missing, enrichment disabled") rather than failing per-row repeatedly.
- [Risk] LLM-returned topics could be inconsistent in phrasing/casing across items. → Mitigation: acceptable for now; a topic-normalization/dedup pass is a future concern (`search` capability), not this change's job.
- [Risk] Vendor SDKs (`openai`, `google-generativeai`) add real dependency weight. → Mitigation: both are already committed in STACK.md; no way around it if AI enrichment is wanted at all.
- [Risk] Provider prompt differences could produce different summary quality/format between OpenAI and Gemini. → Mitigation: acceptable; provider choice is explicit deployment config, not something the app has to reconcile across.

## Migration Plan

No database migration — reuses existing `summary`/`topics` columns from `content-model`. Deployment requires setting `AI_PROVIDER` and the matching API key env var before starting the worker. Rollback: unset `AI_PROVIDER`/omit the key, enrichment step becomes a no-op, extraction continues unaffected.

## Open Questions

None — scope matches STACK.md's committed AI vendors; Ollama and cost controls are explicitly deferred.
