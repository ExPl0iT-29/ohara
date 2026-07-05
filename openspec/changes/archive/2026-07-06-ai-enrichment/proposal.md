## Why

`processing-pipeline` extracts raw text but deliberately leaves `summary` and `topics` null — those require an LLM, not deterministic parsing. Per PRODUCT_VISION.md, AI is core to how Ohara helps you understand what you saved, but per ADR-011 it must sit behind a provider abstraction so no business logic ever calls a specific vendor SDK directly. Without this change, `ready` content has extracted text but nothing that actually helps someone decide what to read or recall what it was about.

## What Changes

- Add an `AIProvider` interface (domain layer) per ADR-011: a single method to enrich text into a summary + topic list.
- Add concrete providers for the two committed vendors in STACK.md: `OpenAIProvider` and `GeminiProvider`. `Ollama` stays a documented future provider, not implemented here (STACK.md marks it "future").
- Add a provider selection mechanism (config-driven, e.g. an env var naming the active provider) — the app runs with exactly one active AI provider at a time, swappable without code changes.
- Extend the worker (from `processing-pipeline`) so that after extraction succeeds and a row reaches `ready`, it is queued for enrichment: send `extractedText` to the active `AIProvider`, then write `summary` and `topics` back via `update_enrichment()`.
- If enrichment fails (provider error, empty text, etc.), the content stays `ready` with `summary`/`topics` still null — enrichment failure must never revert a successfully extracted item back to `failed`. Reading works with or without AI, per PRODUCT_VISION.md ("AI is invisible infrastructure").
- No new API endpoints — this is worker-only, same as `processing-pipeline`.

## Capabilities

### New Capabilities
- `ai-enrichment`: the AI provider abstraction, which vendors are supported, and the guarantee that AI enrichment is best-effort and never blocks or reverts extraction.

### Modified Capabilities
(none — `processing-pipeline`'s extraction behavior and `content-model`'s entity are unchanged; enrichment is purely additive on already-`ready` rows)

## Impact

- New backend module: `backend/src/content/domain/ai_provider.py` (the `AIProvider` protocol).
- New backend module: `backend/src/content/infrastructure/ai_providers/` (`openai_provider.py`, `gemini_provider.py`, provider selector).
- New dependencies: `openai` and `google-generativeai` (or equivalent Gemini SDK) client libraries.
- Modifies `backend/src/content/worker.py` to add an enrichment step after successful extraction — no changes to the extraction step itself.
- Requires API keys (`OPENAI_API_KEY` / `GEMINI_API_KEY`) as environment configuration; no secrets committed to the repo.
