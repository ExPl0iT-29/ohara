## Why

Content can be modeled and persisted (`content-model` change) but there is still no way to actually save something into Ohara. Every other capability — processing, reader, search — needs a real entry point that takes a URL and creates a `Content` row. ADR-008 requires capture to return immediately and defer extraction/enrichment to async processing; that contract has to be established at the API boundary before a processing pipeline can be built against it.

## What Changes

- Add a single `POST /content` REST endpoint that accepts a URL (and optional client-supplied hints like a guessed content type), creates a `Content` entity in `pending` status, persists it, and returns immediately (202-style semantics) without waiting on extraction.
- Add a thin FastAPI application layer: request/response Pydantic schemas, a route handler, and a use-case/service function that orchestrates entity creation + repository save — no business logic in the route itself, per DEVELOPMENT_PRINCIPLES.md layering.
- Add basic URL validation (well-formed URL) at the API boundary; anything beyond that (reachability, content-type sniffing) is processing-pipeline's job, not capture's.
- No authentication/authorization — this is a single-user, local-first app (per product scope), so no user/session model is introduced.
- No content-type detection, no extraction, no AI calls, no duplicate-URL detection — those are explicitly out of scope for this change.

## Capabilities

### New Capabilities
- `capture-endpoint`: the HTTP contract for saving a URL into Ohara — request/response shape, validation rules, and the guarantee that capture never blocks on processing.

### Modified Capabilities
(none — `content-model` is used as-is, no changes to its requirements)

## Impact

- New backend module: `backend/src/content/application/` (use case / service layer).
- New backend module: `backend/src/content/presentation/` (FastAPI router, Pydantic request/response schemas).
- New FastAPI app entrypoint (`backend/src/main.py` or similar) wiring the router, DB session, and repository together — first time the app becomes runnable as a server.
- Depends on `content-model`'s `Content` entity, `ContentRepository`, and `SqlAlchemyContentRepository` — no changes to those.
- Establishes the request/response contract that `processing-pipeline` will later pick up (it will read `pending` rows created here and enrich them).
